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

module.exports = router;