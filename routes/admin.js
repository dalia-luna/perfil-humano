const express = require('express');
const db = require('../db');
const questions = require('../questions');
const XLSX = require('xlsx');
const PDFDocument = require('pdfkit');

const router = express.Router();

// Middleware: solo admin
function requireAdmin(req, res, next) {
  if (!req.session.userId || req.session.role !== 'admin') {
    return res.redirect('/login');
  }
  next();
}

// GET /admin/dashboard - ver todos los perfiles
router.get('/dashboard', requireAdmin, (req, res) => {
  const sql = `
    SELECT 
      u.id,
      u.name,
      u.email,
      u.role,
      COUNT(a.id) AS answered
    FROM users u
    LEFT JOIN answers a ON a.user_id = u.id
    GROUP BY u.id
    ORDER BY u.created_at ASC
  `;

  db.all(sql, [], (err, rows) => {
    if (err) {
      console.error(err);
      return res.sendStatus(500);
    }

    const totalQuestions = questions.length;

    const users = rows.map((row) => {
      const completion = totalQuestions > 0
        ? Math.round((row.answered / totalQuestions) * 100)
        : 0;

      return {
        id: row.id,
        name: row.name,
        email: row.email,
        role: row.role,
        answered: row.answered,
        completion,
        completed: completion >= 100,
      };
    });

    res.render('admin-dashboard', { users, totalQuestions });
  });
});

// GET /admin/export/excel - exportar todas las respuestas a Excel
router.get('/export/excel', requireAdmin, (req, res) => {
  const sql = `
    SELECT 
      u.id AS user_id,
      u.name,
      u.email,
      a.question_number,
      a.answer_text,
      a.updated_at
    FROM users u
    LEFT JOIN answers a ON a.user_id = u.id
    ORDER BY u.id ASC, a.question_number ASC
  `;

  db.all(sql, [], (err, rows) => {
    if (err) {
      console.error(err);
      return res.sendStatus(500);
    }

    const data = rows.map((row) => {
      const questionObj = row.question_number
        ? questions[row.question_number - 1]
        : null;
      const questionText = questionObj ? questionObj.text : '';

      return {
        Usuario_ID: row.user_id,
        Nombre: row.name,
        Correo: row.email,
        Pregunta_Numero: row.question_number || '',
        Pregunta_Texto: questionText,
        Respuesta: row.answer_text || '',
        Actualizado: row.updated_at || '',
      };
    });

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Respuestas');

    const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

    res.setHeader(
      'Content-Disposition',
      'attachment; filename="perfiles_humano_digital.xlsx"'
    );
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );
    res.send(buffer);
  });
});

// GET /admin/export/pdf - exportar todas las respuestas a PDF
router.get('/export/pdf', requireAdmin, (req, res) => {
  const sql = `
    SELECT 
      u.id AS user_id,
      u.name,
      u.email,
      a.question_number,
      a.answer_text
    FROM users u
    LEFT JOIN answers a ON a.user_id = u.id
    ORDER BY u.id ASC, a.question_number ASC
  `;

  db.all(sql, [], (err, rows) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error generando PDF');
      return;
    }

    res.setHeader(
      'Content-Disposition',
      'attachment; filename="perfiles_humano_digital.pdf"'
    );
    res.setHeader('Content-Type', 'application/pdf');

    const doc = new PDFDocument({ margin: 40 });
    doc.pipe(res);

    doc.fontSize(16).text('Perfiles Humano Digital', { align: 'center' });
    doc.moveDown();

    let currentUserId = null;

    rows.forEach((row) => {
      if (row.user_id !== currentUserId) {
        currentUserId = row.user_id;
        doc.moveDown(0.5);
        doc.fontSize(13).text(`Usuario #${row.user_id}: ${row.name} <${row.email}>`);
        doc.moveDown(0.2);
      }

      if (row.question_number) {
        const questionObj = questions[row.question_number - 1];
        const qText = questionObj ? questionObj.text : '';
        doc.fontSize(10).text(`P${row.question_number}: ${qText}`);
        doc.fontSize(10).text(`Respuesta: ${row.answer_text || ''}`);
        doc.moveDown(0.25);
      }
    });

    doc.end();
  });
});

module.exports = router;
