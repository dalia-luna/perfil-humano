const express = require('express');
const db = require('../db');
const questions = require('../questions');

const router = express.Router();
const TOTAL_QUESTIONS = questions.length;

// Middleware: exige estar logueado como usuario (no admin)
function requireUser(req, res, next) {
  if (!req.session.userId) {
    return res.redirect('/login');
  }
  if (req.session.role !== 'user') {
    return res.redirect('/admin/dashboard');
  }
  next();
}

// GET /instructions - página de indicaciones
router.get('/instructions', requireUser, (req, res) => {
  const userId = req.session.userId;

  const query = `SELECT MAX(question_number) AS last_question FROM answers WHERE user_id = ?`;
  db.get(query, [userId], (err, row) => {
    if (err) {
      console.error(err);
      return res.sendStatus(500);
    }

    const lastQuestion = row && row.last_question ? row.last_question : 0;

    let buttonLabel;
    if (lastQuestion === 0) {
      buttonLabel = 'Iniciar';
    } else if (lastQuestion < TOTAL_QUESTIONS) {
      buttonLabel = 'Continuar';
    } else {
      buttonLabel = 'Editar respuestas';
    }

    res.render('instructions', {
      lastQuestion,
      nextQuestion: lastQuestion + 1,
      buttonLabel,
      totalQuestions: TOTAL_QUESTIONS,
    });
  });
});

/* POST /instructions/start - botón Iniciar/Continuar/Editar
router.post('/instructions/start', requireUser, (req, res) => {
  const userId = req.session.userId;

  const query = `SELECT MAX(question_number) AS last_question FROM answers WHERE user_id = ?`;
  db.get(query, [userId], (err, row) => {
    if (err) {
      console.error(err);
      return res.sendStatus(500);
    }

    const lastQuestion = row && row.last_question ? row.last_question : 0;

    let nextQuestion;
    if (lastQuestion >= TOTAL_QUESTIONS) {
      // Ya contestó todo: permitir editar desde la 1
      nextQuestion = 1;
    } else {
      nextQuestion = lastQuestion + 1;
    }

    res.redirect(`/question/${nextQuestion}`);
  });
});*/

// POST /instructions/start - botón Iniciar/Continuar/Editar
router.post('/instructions/start', requireUser, (req, res) => {
  const userId = req.session.userId;

  const query = `SELECT MAX(question_number) AS last_question FROM answers WHERE user_id = ?`;
  db.get(query, [userId], (err, row) => {
    if (err) {
      console.error(err);
      return res.sendStatus(500);
    }

    const lastQuestion = row && row.last_question ? row.last_question : 0;

    // Si ya contestó todas, lo mandamos al panel de edición de respuestas
    if (lastQuestion >= TOTAL_QUESTIONS) {
      return res.redirect('/edit-answers');
    }

    // Si no ha comenzado, va a la 1
    if (lastQuestion === 0) {
      return res.redirect('/question/1');
    }

    // Si va a la mitad, continúa donde se quedó
    const nextQuestion = lastQuestion + 1;
    return res.redirect(`/question/${nextQuestion}`);
  });
});

// GET /edit-answers - panel para elegir qué pregunta editar
router.get('/edit-answers', requireUser, (req, res) => {
  const userId = req.session.userId;

  // Primero verificamos que realmente haya terminado todas las preguntas
  const progressQuery = `SELECT MAX(question_number) AS last_question FROM answers WHERE user_id = ?`;
  db.get(progressQuery, [userId], (err, row) => {
    if (err) {
      console.error(err);
      return res.sendStatus(500);
    }

    const lastQuestion = row && row.last_question ? row.last_question : 0;

    // Si no ha terminado, lo regresamos a instrucciones
    if (lastQuestion < TOTAL_QUESTIONS) {
      return res.redirect('/instructions');
    }

    // Obtener todas las respuestas del usuario
    const answersQuery = `
      SELECT question_number, answer_text
      FROM answers
      WHERE user_id = ?
    `;
    db.all(answersQuery, [userId], (err2, rows) => {
      if (err2) {
        console.error(err2);
        return res.sendStatus(500);
      }

      const answersByQuestion = {};
      rows.forEach((r) => {
        answersByQuestion[r.question_number] = r.answer_text;
      });

      res.render('edit-answers', {
        questions,
        totalQuestions: TOTAL_QUESTIONS,
        answersByQuestion,
      });
    });
  });
});

// GET /question/:number - mostrar una pregunta
/*router.get('/question/:number', requireUser, (req, res) => {
  const userId = req.session.userId;
  const number = parseInt(req.params.number, 10);

  if (isNaN(number) || number < 1 || number > TOTAL_QUESTIONS) {
    return res.redirect('/instructions');
  }

  const questionText = questions[number - 1];

  // Progreso basado en número de pregunta
  const progressPercent = ((number - 1) / TOTAL_QUESTIONS) * 100;

  const query = `SELECT answer_text FROM answers WHERE user_id = ? AND question_number = ?`;
  db.get(query, [userId, number], (err, row) => {
    if (err) {
      console.error(err);
      return res.sendStatus(500);
    }

    const existingAnswer = row ? row.answer_text : '';

    res.render('question', {
      number,
      questionText,
      totalQuestions: TOTAL_QUESTIONS,
      progressPercent,
      existingAnswer,
    });
  });
});*/

/* GET /question/:number - mostrar una pregunta
router.get('/question/:number', requireUser, (req, res) => {
  const userId = req.session.userId;
  const number = parseInt(req.params.number, 10);

  if (isNaN(number) || number < 1 || number > TOTAL_QUESTIONS) {
    return res.redirect('/instructions');
  }

  const question = questions[number - 1];

  // Progreso basado en número de pregunta
  const progressPercent = ((number - 1) / TOTAL_QUESTIONS) * 100;

  const query = `SELECT answer_text FROM answers WHERE user_id = ? AND question_number = ?`;
  db.get(query, [userId, number], (err, row) => {
    if (err) {
      console.error(err);
      return res.sendStatus(500);
    }

    const existingAnswer = row ? row.answer_text : '';

    res.render('question', {
      number,
      question,
      totalQuestions: TOTAL_QUESTIONS,
      progressPercent,
      existingAnswer,
    });
  });
});*/

// GET /question/:number - mostrar una pregunta
router.get('/question/:number', requireUser, (req, res) => {
  const userId = req.session.userId;
  const number = parseInt(req.params.number, 10);
  const mode = req.query.mode === 'edit' ? 'edit' : 'normal';

  if (isNaN(number) || number < 1 || number > TOTAL_QUESTIONS) {
    return res.redirect('/instructions');
  }

  const question = questions[number - 1];

  // Progreso basado en número de pregunta
  const progressPercent = ((number - 1) / TOTAL_QUESTIONS) * 100;

  const query = `SELECT answer_text FROM answers WHERE user_id = ? AND question_number = ?`;
  db.get(query, [userId, number], (err, row) => {
    if (err) {
      console.error(err);
      return res.sendStatus(500);
    }

    const existingAnswer = row ? row.answer_text : '';

    res.render('question', {
      number,
      question,
      totalQuestions: TOTAL_QUESTIONS,
      progressPercent,
      existingAnswer,
      mode,
    });
  });
});


/* POST /question/:number - guardar respuesta y avanzar
router.post('/question/:number', requireUser, (req, res) => {
  const userId = req.session.userId;
  const number = parseInt(req.params.number, 10);
  const { answer } = req.body;

  if (isNaN(number) || number < 1 || number > TOTAL_QUESTIONS) {
    return res.redirect('/instructions');
  }

  const stmt = `
    INSERT INTO answers (user_id, question_number, answer_text)
    VALUES (?, ?, ?)
    ON CONFLICT(user_id, question_number)
    DO UPDATE SET answer_text = excluded.answer_text,
                  updated_at = CURRENT_TIMESTAMP
  `;

  db.run(stmt, [userId, number, answer], function (err) {
    if (err) {
      console.error(err);
      return res.sendStatus(500);
    }

    const next = number + 1;
    if (next > TOTAL_QUESTIONS) {
      // Termina cuestionario → ir a instrucciones (donde puede editar)
      return res.redirect('/instructions');
    }

    res.redirect(`/question/${next}`);
  });
});*/

// POST /question/:number - guardar respuesta
router.post('/question/:number', requireUser, (req, res) => {
  const userId = req.session.userId;
  const number = parseInt(req.params.number, 10);
  const { answer, mode } = req.body;

  if (isNaN(number) || number < 1 || number > TOTAL_QUESTIONS) {
    return res.redirect('/instructions');
  }

  const stmt = `
    INSERT INTO answers (user_id, question_number, answer_text)
    VALUES (?, ?, ?)
    ON CONFLICT(user_id, question_number)
    DO UPDATE SET answer_text = excluded.answer_text,
                  updated_at = CURRENT_TIMESTAMP
  `;

  db.run(stmt, [userId, number, answer], function (err) {
    if (err) {
      console.error(err);
      return res.sendStatus(500);
    }

    // Si viene del modo edición, siempre regresamos al panel de edición
    if (mode === 'edit') {
      return res.redirect('/edit-answers');
    }

    // Modo normal (llenando el cuestionario de inicio a fin)
    const next = number + 1;
    if (next > TOTAL_QUESTIONS) {
      // Terminó el cuestionario por primera vez
      return res.redirect('/instructions');
    }

    res.redirect(`/question/${next}`);
  });
});


router.get('/completed', requireUser, (req, res) => {
  res.render('completed');
});

module.exports = router;

