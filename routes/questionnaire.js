const express = require('express');
const db = require('../db');
const questions = require('../questions');

const router = express.Router();
const TOTAL_QUESTIONS = questions.length;

// Middleware: solo usuarios logueados (no admin)
function requireUser(req, res, next) {
  if (!req.session.userId) {
    return res.redirect('/login');
  }

  if (req.session.role !== 'user') {
    return res.redirect('/admin/dashboard');
  }

  next();
}

// GET /questionnaire/instructions
router.get('/instructions', requireUser, (req, res) => {
  const userId = req.session.userId;

  const query = `
    SELECT MAX(question_number) AS last_question
    FROM answers
    WHERE user_id = ?
  `;

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
      totalQuestions: TOTAL_QUESTIONS
    });
  });
});

// POST /questionnaire/instructions/start
router.post('/instructions/start', requireUser, (req, res) => {
  const userId = req.session.userId;

  const query = `
    SELECT MAX(question_number) AS last_question
    FROM answers
    WHERE user_id = ?
  `;

  db.get(query, [userId], (err, row) => {
    if (err) {
      console.error(err);
      return res.sendStatus(500);
    }

    const lastQuestion = row && row.last_question ? row.last_question : 0;

    if (lastQuestion >= TOTAL_QUESTIONS) {
      return res.redirect('/questionnaire/edit-answers');
    }

    if (lastQuestion === 0) {
      return res.redirect('/questionnaire/question/1');
    }

    const nextQuestion = lastQuestion + 1;
    return res.redirect(`/questionnaire/question/${nextQuestion}`);
  });
});

// GET /questionnaire/edit-answers
router.get('/edit-answers', requireUser, (req, res) => {
  const userId = req.session.userId;

  const progressQuery = `
    SELECT MAX(question_number) AS last_question
    FROM answers
    WHERE user_id = ?
  `;

  db.get(progressQuery, [userId], (err, row) => {
    if (err) {
      console.error(err);
      return res.sendStatus(500);
    }

    const lastQuestion = row && row.last_question ? row.last_question : 0;

    if (lastQuestion < TOTAL_QUESTIONS) {
      return res.redirect('/questionnaire/instructions');
    }

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
        answersByQuestion
      });
    });
  });
});

// GET /questionnaire/question/:number
router.get('/question/:number', requireUser, (req, res) => {
  const userId = req.session.userId;
  const number = parseInt(req.params.number, 10);
  const mode = req.query.mode === 'edit' ? 'edit' : 'normal';

  if (isNaN(number) || number < 1 || number > TOTAL_QUESTIONS) {
    return res.redirect('/questionnaire/instructions');
  }

  const question = questions[number - 1];
  const progressPercent = ((number - 1) / TOTAL_QUESTIONS) * 100;

  const query = `
    SELECT answer_text
    FROM answers
    WHERE user_id = ? AND question_number = ?
  `;

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
      mode
    });
  });
});

// POST /questionnaire/question/:number
router.post('/question/:number', requireUser, (req, res) => {
  const userId = req.session.userId;
  const number = parseInt(req.params.number, 10);
  const { answer, mode } = req.body;

  if (isNaN(number) || number < 1 || number > TOTAL_QUESTIONS) {
    return res.redirect('/questionnaire/instructions');
  }

  const stmt = `
    INSERT INTO answers (user_id, question_number, answer_text)
    VALUES (?, ?, ?)
    ON CONFLICT(user_id, question_number)
    DO UPDATE SET
      answer_text = excluded.answer_text,
      updated_at = CURRENT_TIMESTAMP
  `;

  db.run(stmt, [userId, number, answer], function (err) {
    if (err) {
      console.error(err);
      return res.sendStatus(500);
    }

    if (mode === 'edit') {
      return res.redirect('/questionnaire/edit-answers');
    }

    const next = number + 1;

    if (next > TOTAL_QUESTIONS) {
      return res.redirect('/questionnaire/instructions');
    }

    return res.redirect(`/questionnaire/question/${next}`);
  });
});

// GET /questionnaire/completed
router.get('/completed', requireUser, (req, res) => {
  res.render('completed');
});

module.exports = router;