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

// Formatear fechas
function formatDate(dateValue) {
  if (!dateValue) return 'Sin registro';

  const date = new Date(dateValue);
  if (isNaN(date.getTime())) return 'Sin registro';

  return date.toLocaleString('es-MX', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
}

// Dashboard admin
router.get('/dashboard', requireAdmin, (req, res) => {
  const progressFilter = req.query.progress || 'all';

  const sql = `
    SELECT
      u.id,
      u.name,
      u.email,
      u.role,
      u.created_at,
      COUNT(a.id) AS answered,
      MAX(a.updated_at) AS last_activity
    FROM users u
    LEFT JOIN answers a ON a.user_id = u.id
    GROUP BY u.id
  `;

  db.all(sql, [], (err, rows) => {
    if (err) {
      console.error(err);
      return res.sendStatus(500);
    }

    const totalQuestions = questions.length;

    let users = rows.map((row) => {
      const answered = Number(row.answered) || 0;
      const completion = totalQuestions > 0
        ? Math.round((answered / totalQuestions) * 100)
        : 0;

      const completed = completion >= 100;
      const notStarted = answered === 0;
      const inProgress = answered > 0 && !completed;

      return {
        id: row.id,
        name: row.name,
        email: row.email,
        role: row.role,
        answered,
        completion,
        completed,
        notStarted,
        inProgress,
        createdAt: row.created_at || null,
        createdAtFormatted: formatDate(row.created_at),
        lastActivity: row.last_activity || null,
        lastActivityFormatted: formatDate(row.last_activity)
      };
    });

    if (progressFilter === 'completed') {
      users = users.filter((u) => u.completed);
    } else if (progressFilter === 'in-progress') {
      users = users.filter((u) => u.inProgress);
    } else if (progressFilter === 'not-started') {
      users = users.filter((u) => u.notStarted);
    }

    users.sort((a, b) => {
      if (a.completed !== b.completed) return a.completed ? -1 : 1;
      if (b.completion !== a.completion) return b.completion - a.completion;

      const aLast = a.lastActivity ? new Date(a.lastActivity).getTime() : 0;
      const bLast = b.lastActivity ? new Date(b.lastActivity).getTime() : 0;
      if (bLast !== aLast) return bLast - aLast;

      const aCreated = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const bCreated = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return bCreated - aCreated;
    });

    res.render('admin-dashboard', {
      users,
      totalQuestions,
      progressFilter
    });
  });
});

// Detalle individual de usuario
router.get('/user/:id', requireAdmin, (req, res) => {
  const userId = parseInt(req.params.id, 10);

  if (isNaN(userId)) {
    return res.redirect('/admin/dashboard');
  }

  const userSql = `
    SELECT
      u.id,
      u.name,
      u.email,
      u.role,
      u.created_at,
      COUNT(a.id) AS answered,
      MAX(a.updated_at) AS last_activity
    FROM users u
    LEFT JOIN answers a ON a.user_id = u.id
    WHERE u.id = ?
    GROUP BY u.id
  `;

  db.get(userSql, [userId], (err, userRow) => {
    if (err) {
      console.error(err);
      return res.sendStatus(500);
    }

    if (!userRow) {
      return res.status(404).send('Usuario no encontrado');
    }

    const answersSql = `
      SELECT question_number, answer_text, updated_at
      FROM answers
      WHERE user_id = ?
      ORDER BY question_number ASC
    `;

    db.all(answersSql, [userId], (answersErr, answerRows) => {
      if (answersErr) {
        console.error(answersErr);
        return res.sendStatus(500);
      }

      const totalQuestions = questions.length;
      const answered = Number(userRow.answered) || 0;
      const completion = totalQuestions > 0
        ? Math.round((answered / totalQuestions) * 100)
        : 0;

      const answersMap = {};
      answerRows.forEach((row) => {
        answersMap[row.question_number] = {
          answer: row.answer_text,
          updatedAt: row.updated_at,
          updatedAtFormatted: formatDate(row.updated_at)
        };
      });

      const detailedQuestions = questions.map((q, index) => {
        const number = index + 1;
        const saved = answersMap[number];

        return {
          number,
          text: q.text,
          type: q.type,
          image: q.image || null,
          answer: saved ? saved.answer : '',
          hasAnswer: !!saved,
          updatedAtFormatted: saved ? saved.updatedAtFormatted : 'Sin respuesta'
        };
      });

      const user = {
        id: userRow.id,
        name: userRow.name,
        email: userRow.email,
        role: userRow.role,
        answered,
        completion,
        completed: completion >= 100,
        createdAtFormatted: formatDate(userRow.created_at),
        lastActivityFormatted: formatDate(userRow.last_activity)
      };

      res.render('admin-user-detail', {
        user,
        detailedQuestions,
        totalQuestions
      });
    });
  });
});

// Exportar Excel
router.get('/export/excel', requireAdmin, (req, res) => {
  const sql = `
    SELECT
      u.id AS user_id,
      u.name,
      u.email,
      u.created_at,
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
      const questionObj = row.question_number ? questions[row.question_number - 1] : null;
      const questionText = questionObj ? questionObj.text : '';

      return {
        Usuario_ID: row.user_id,
        Nombre: row.name,
        Correo: row.email,
        Fecha_Registro: row.created_at || '',
        Pregunta_Numero: row.question_number || '',
        Pregunta_Texto: questionText,
        Respuesta: row.answer_text || '',
        Ultima_Actualizacion: row.updated_at || ''
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

// Exportar PDF
router.get('/export/pdf', requireAdmin, (req, res) => {
  const sql = `
    SELECT
      u.id AS user_id,
      u.name,
      u.email,
      u.created_at,
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
        doc.fontSize(10).text(`Fecha de registro: ${row.created_at || 'Sin registro'}`);
        doc.moveDown(0.2);
      }

      if (row.question_number) {
        const questionObj = questions[row.question_number - 1];
        const qText = questionObj ? questionObj.text : '';

        doc.fontSize(10).text(`P${row.question_number}: ${qText}`);
        doc.fontSize(10).text(`Respuesta: ${row.answer_text || ''}`);
        doc.fontSize(10).text(`Actualizado: ${row.updated_at || 'Sin registro'}`);
        doc.moveDown(0.25);
      }
    });

    doc.end();
  });
});

module.exports = router;