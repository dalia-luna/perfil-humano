const express = require('express');
const router = express.Router();
const db = require('../db');

// Middleware: verificar sesión
function requireAuth(req, res, next) {
  if (!req.session.userId) {
    return res.redirect('/login');
  }
  next();
}

// Middleware: verificar admin
function requireAdmin(req, res, next) {
  if (!req.session.userId || req.session.role !== 'admin') {
    return res.status(403).send('Acceso denegado');
  }
  next();
}

// LISTADO DE CASOS
router.get('/', requireAuth, requireAdmin, (req, res) => {
  const sql = `
    SELECT 
      c.*,
      u.name AS created_by_name
    FROM cases c
    LEFT JOIN users u ON c.created_by_user_id = u.id
    WHERE c.is_active = 1
    ORDER BY c.created_at DESC
  `;

  db.all(sql, [], (err, cases) => {
    if (err) {
      console.error('Error al cargar casos:', err.message);
      return res.status(500).send('Error al cargar los casos.');
    }

    res.render('cases-list', {
      title: 'Listado de casos',
      cases
    });
  });
});

// FORMULARIO: nuevo caso
router.get('/new', requireAuth, requireAdmin, (req, res) => {
  res.render('new-case', {
    title: 'Nuevo Caso',
    error: null,
    success: null
  });
});

// GUARDAR nuevo caso
router.post('/new', requireAuth, requireAdmin, (req, res) => {
  const {
    case_code,
    person_name,
    alias,
    status,
    source_type,
    report_date,
    found_date,
    country,
    state,
    municipality,
    notes
  } = req.body;

  const createdByUserId = req.session.userId;

  const sql = `
    INSERT INTO cases (
      created_by_user_id,
      case_code,
      person_name,
      alias,
      status,
      source_type,
      report_date,
      found_date,
      country,
      state,
      municipality,
      notes
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const params = [
    createdByUserId,
    case_code || null,
    person_name || null,
    alias || null,
    status || 'captura_inicial',
    source_type || 'familiar',
    report_date || null,
    found_date || null,
    country || 'México',
    state || null,
    municipality || null,
    notes || null
  ];

  db.run(sql, params, function (err) {
    if (err) {
      console.error('Error al guardar caso:', err.message);

      let errorMessage = 'No se pudo guardar el caso.';
      if (err.message.includes('UNIQUE constraint failed: cases.case_code')) {
        errorMessage = 'El código del caso ya existe. Usa otro diferente.';
      }

      return res.render('new-case', {
        title: 'Nuevo Caso',
        error: errorMessage,
        success: null
      });
    }

    return res.redirect('/cases');
  });
});

// VER DETALLE DE UN CASO
router.get('/:id', requireAuth, requireAdmin, (req, res) => {
  const caseId = req.params.id;

  const sql = `
    SELECT 
      c.*,
      u.name AS created_by_name
    FROM cases c
    LEFT JOIN users u ON c.created_by_user_id = u.id
    WHERE c.id = ? AND c.is_active = 1
    LIMIT 1
  `;

  db.get(sql, [caseId], (err, caso) => {
    if (err) {
      console.error('Error al cargar el caso:', err.message);
      return res.status(500).send('Error al cargar el caso.');
    }

    if (!caso) {
      return res.status(404).send('Caso no encontrado.');
    }

    res.render('case-detail', {
      title: `Caso #${caso.id}`,
      caso,
      error: null,
      success: null
    });
  });
});

// ACTUALIZAR UN CASO
router.post('/:id/edit', requireAuth, requireAdmin, (req, res) => {
  const caseId = req.params.id;

  const {
    case_code,
    person_name,
    alias,
    status,
    source_type,
    report_date,
    found_date,
    country,
    state,
    municipality,
    notes
  } = req.body;

  const updateSql = `
    UPDATE cases
    SET
      case_code = ?,
      person_name = ?,
      alias = ?,
      status = ?,
      source_type = ?,
      report_date = ?,
      found_date = ?,
      country = ?,
      state = ?,
      municipality = ?,
      notes = ?,
      updated_at = CURRENT_TIMESTAMP
    WHERE id = ? AND is_active = 1
  `;

  const params = [
    case_code || null,
    person_name || null,
    alias || null,
    status || 'captura_inicial',
    source_type || 'familiar',
    report_date || null,
    found_date || null,
    country || 'México',
    state || null,
    municipality || null,
    notes || null,
    caseId
  ];

  db.run(updateSql, params, function (err) {
    if (err) {
      console.error('Error al actualizar caso:', err.message);

      const selectSql = `
        SELECT 
          c.*,
          u.name AS created_by_name
        FROM cases c
        LEFT JOIN users u ON c.created_by_user_id = u.id
        WHERE c.id = ? AND c.is_active = 1
        LIMIT 1
      `;

      return db.get(selectSql, [caseId], (selectErr, caso) => {
        if (selectErr || !caso) {
          return res.status(500).send('Error al actualizar el caso.');
        }

        let errorMessage = 'No se pudo actualizar el caso.';
        if (err.message.includes('UNIQUE constraint failed: cases.case_code')) {
          errorMessage = 'El código del caso ya existe. Usa otro diferente.';
        }

        return res.render('case-detail', {
          title: `Caso #${caso.id}`,
          caso,
          error: errorMessage,
          success: null
        });
      });
    }

    const selectSql = `
      SELECT 
        c.*,
        u.name AS created_by_name
      FROM cases c
      LEFT JOIN users u ON c.created_by_user_id = u.id
      WHERE c.id = ? AND c.is_active = 1
      LIMIT 1
    `;

    db.get(selectSql, [caseId], (selectErr, caso) => {
      if (selectErr || !caso) {
        return res.status(500).send('El caso se actualizó, pero no se pudo recargar.');
      }

      return res.render('case-detail', {
        title: `Caso #${caso.id}`,
        caso,
        error: null,
        success: 'Caso actualizado correctamente.'
      });
    });
  });
});

module.exports = router;