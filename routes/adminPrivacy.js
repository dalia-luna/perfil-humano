const express = require('express');
const db = require('../db');

const router = express.Router();

function dbGet(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) return reject(err);
      resolve(row);
    });
  });
}

function dbAll(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) return reject(err);
      resolve(rows || []);
    });
  });
}

function getSessionUserId(req) {
  return req.session?.userId || req.session?.user?.id || null;
}

async function requireAdmin(req, res, next) {
  try {
    const userId = getSessionUserId(req);

    if (!userId) {
      return res.redirect('/login');
    }

    const user = await dbGet(
      'SELECT id, role FROM users WHERE id = ? LIMIT 1',
      [userId]
    );

    if (!user || String(user.role).toLowerCase() !== 'admin') {
      return res.status(403).send('Acceso restringido a administradores.');
    }

    next();
  } catch (err) {
    console.error('Error verificando administrador:', err);
    res.status(500).send('No fue posible verificar los permisos.');
  }
}

async function getConsentRows() {
  const activeNotice = await dbGet(`
    SELECT id, version, effective_date
    FROM privacy_notice_versions
    WHERE active = 1
    ORDER BY id DESC
    LIMIT 1
  `);

  const rows = await dbAll(`
    WITH latest_consent AS (
      SELECT uc.*
      FROM user_consents uc
      INNER JOIN (
        SELECT user_id, MAX(id) AS max_id
        FROM user_consents
        GROUP BY user_id
      ) latest
        ON latest.max_id = uc.id
    )
    SELECT
      u.id AS user_id,
      u.name,
      u.email,
      u.created_at AS user_created_at,
      lc.accepted,
      lc.accepted_at,
      lc.revoked_at,
      pnv.version AS accepted_version,
      pnv.effective_date AS accepted_version_date,
      CASE
        WHEN lc.id IS NULL THEN 'pending'
        WHEN lc.revoked_at IS NOT NULL OR lc.accepted <> 1 THEN 'revoked'
        WHEN pnv.active = 1 THEN 'current'
        ELSE 'outdated'
      END AS consent_status
    FROM users u
    LEFT JOIN latest_consent lc
      ON lc.user_id = u.id
    LEFT JOIN privacy_notice_versions pnv
      ON pnv.id = lc.notice_version_id
    WHERE LOWER(COALESCE(u.role, 'user')) <> 'admin'
    ORDER BY
      CASE
        WHEN lc.id IS NULL THEN 1
        WHEN lc.revoked_at IS NOT NULL OR lc.accepted <> 1 THEN 2
        WHEN pnv.active = 1 THEN 4
        ELSE 3
      END ASC,
      u.name COLLATE NOCASE ASC
  `);

  return { rows, activeNotice };
}

function applyFilters(rows, query) {
  const search = String(query.search || '').trim().toLowerCase();
  const status = String(query.status || 'all').trim().toLowerCase();

  return rows.filter(row => {
    const matchesSearch =
      !search ||
      String(row.name || '').toLowerCase().includes(search) ||
      String(row.email || '').toLowerCase().includes(search) ||
      String(row.user_id).includes(search);

    const matchesStatus =
      status === 'all' ||
      row.consent_status === status;

    return matchesSearch && matchesStatus;
  });
}

function calculateSummary(rows) {
  return rows.reduce(
    (acc, row) => {
      acc.total += 1;
      if (row.consent_status === 'current') acc.current += 1;
      if (row.consent_status === 'pending') acc.pending += 1;
      if (row.consent_status === 'outdated') acc.outdated += 1;
      if (row.consent_status === 'revoked') acc.revoked += 1;
      return acc;
    },
    { total: 0, current: 0, pending: 0, outdated: 0, revoked: 0 }
  );
}

function csvEscape(value) {
  const text = value === null || value === undefined ? '' : String(value);
  return `"${text.replace(/"/g, '""')}"`;
}

router.get('/consents', requireAdmin, async (req, res) => {
  try {
    const { rows, activeNotice } = await getConsentRows();
    const filteredRows = applyFilters(rows, req.query);
    const summary = calculateSummary(rows);

    res.render('admin-privacy-consents', {
      users: filteredRows,
      summary,
      activeNotice,
      filters: {
        search: String(req.query.search || ''),
        status: String(req.query.status || 'all')
      }
    });
  } catch (err) {
    console.error('Error cargando consentimientos:', err);
    res.status(500).send('No fue posible cargar el registro de consentimientos.');
  }
});

router.get('/consents.csv', requireAdmin, async (req, res) => {
  try {
    const { rows, activeNotice } = await getConsentRows();
    const filteredRows = applyFilters(rows, req.query);

    const statusLabels = {
      current: 'Vigente',
      pending: 'Pendiente',
      outdated: 'Pendiente nueva versión',
      revoked: 'Revocado'
    };

    const header = [
      'ID usuario',
      'Nombre',
      'Correo',
      'Estado consentimiento',
      'Versión aceptada',
      'Fecha aceptación',
      'Fecha revocación',
      'Versión vigente'
    ];

    const csvRows = [
      header.map(csvEscape).join(','),
      ...filteredRows.map(row => [
        row.user_id,
        row.name,
        row.email,
        statusLabels[row.consent_status] || row.consent_status,
        row.accepted_version || '',
        row.accepted_at || '',
        row.revoked_at || '',
        activeNotice?.version || ''
      ].map(csvEscape).join(','))
    ];

    // BOM para que Excel abra correctamente acentos en UTF-8.
    const csv = '\uFEFF' + csvRows.join('\n');

    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader(
      'Content-Disposition',
      'attachment; filename="consentimientos_pHD.csv"'
    );
    res.send(csv);
  } catch (err) {
    console.error('Error exportando consentimientos:', err);
    res.status(500).send('No fue posible exportar los consentimientos.');
  }
});

module.exports = router;
