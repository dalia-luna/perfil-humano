const express = require('express');
const bcrypt = require('bcrypt');
const db = require('../db');

const router = express.Router();
const SALT_ROUNDS = 10;

// GET /register
router.get('/register', (req, res) => {
  res.render('register', { error: null });
});

// POST /register
router.post('/register', (req, res) => {
  const { name, email, password, passwordConfirm } = req.body;

  if (!name || !email || !password || !passwordConfirm) {
    return res.render('register', { error: 'Todos los campos son obligatorios.' });
  }

  if (password !== passwordConfirm) {
    return res.render('register', { error: 'Las contraseñas no coinciden.' });
  }

  const countQuery = 'SELECT COUNT(*) AS total FROM users';
  db.get(countQuery, (countErr, row) => {
    if (countErr) {
      console.error(countErr);
      return res.render('register', { error: 'Error al registrar. Intenta de nuevo.' });
    }

    const isFirstUser = row.total === 0;
    const role = isFirstUser ? 'admin' : 'user';

    bcrypt.hash(password, SALT_ROUNDS, (err, hash) => {
      if (err) {
        console.error(err);
        return res.render('register', { error: 'Error al registrar. Intenta de nuevo.' });
      }

      const stmt = `
        INSERT INTO users (name, email, password_hash, role)
        VALUES (?, ?, ?, ?)
      `;

      db.run(stmt, [name, email, hash, role], function (dbErr) {
        if (dbErr) {
          console.error(dbErr);
          let msg = 'Error al registrar.';
          if (dbErr.message.includes('UNIQUE')) {
            msg = 'Este correo ya está registrado.';
          }
          return res.render('register', { error: msg });
        }

        req.session.userId = this.lastID;
        req.session.role = role;

        if (role === 'admin') {
          return res.redirect('/admin/dashboard');
        }

        return res.redirect('/questionnaire/instructions');
      });
    });
  });
});

// GET /login
router.get('/login', (req, res) => {
  res.render('login', { error: null });
});

// POST /login
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.render('login', { error: 'Ingresa tu correo y contraseña.' });
  }

  const query = `
    SELECT id, password_hash, role
    FROM users
    WHERE email = ?
  `;

  db.get(query, [email], (err, user) => {
    if (err) {
      console.error(err);
      return res.render('login', { error: 'Error interno. Intenta de nuevo.' });
    }

    if (!user) {
      return res.render('login', { error: 'Usuario o contraseña incorrectos.' });
    }

    bcrypt.compare(password, user.password_hash, (compareErr, same) => {
      if (compareErr) {
        console.error(compareErr);
        return res.render('login', { error: 'Error interno. Intenta de nuevo.' });
      }

      if (!same) {
        return res.render('login', { error: 'Usuario o contraseña incorrectos.' });
      }

      req.session.userId = user.id;
      req.session.role = user.role;

      if (user.role === 'admin') {
        return res.redirect('/admin/dashboard');
      }

      return res.redirect('/questionnaire/instructions');
    });
  });
});

// GET /logout
router.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/login');
  });
});

module.exports = router;