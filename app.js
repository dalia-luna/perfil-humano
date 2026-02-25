const express = require('express');
const path = require('path');
const session = require('express-session');
const bcrypt = require('bcrypt');

// Temporal: SQLite hasta migrar a Postgres
const sqlite3 = require('sqlite3').verbose();

// Conexión a DB
const db = require('./db.js');

// Rutas reales
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const questionnaireRoutes = require('./routes/questionnaire');

const app = express();

// Configuración EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Parse body
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Sesiones
app.use(session({
  secret: process.env.SESSION_SECRET || 'tu-secreto-super-seguro-1234567890',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: process.env.NODE_ENV === 'production', maxAge: 24 * 60 * 60 * 1000 }
}));

// Pasar usuario a vistas
app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  next();
});

// Montar rutas
app.use('/', authRoutes);
app.use('/admin', adminRoutes);
app.use('/questionnaire', questionnaireRoutes);

// Ruta principal: FORMULARIO DE LOGIN
app.get('/', (req, res) => {
  // Si ya está logueado → redirigir a cuestionario (o donde prefieras)
  if (req.session.user) {
    return res.redirect('/questionnaire');
  }

  // Mostrar formulario de login
  res.render('login', {   // ← Cambia 'login' por el nombre REAL de tu archivo EJS (sin .ejs)
    title: 'Iniciar Sesión - Perfil Digital Humano',
    error: null,          // Para mostrar errores (ej. credenciales inválidas)
    message: null         // Mensaje opcional
  });
});

// Ruta health (para cron anti-sleep)
app.get('/health', (req, res) => {
  res.status(200).send('OK - App is alive');
});

// Middleware de autenticación (para proteger rutas)
function isAuthenticated(req, res, next) {
  if (req.session.user) {
    return next();
  }
  res.redirect('/');
}

// Ejemplo: proteger admin
// app.use('/admin', isAuthenticated, adminRoutes);

// 404
app.use((req, res) => {
  res.status(404).send('Página no encontrada. <a href="/">Ir al login</a>');
});

// Errores 500 con logging completo
app.use((err, req, res, next) => {
  console.error('=====================================');
  console.error('ERROR GRAVE EN LA APLICACIÓN');
  console.error('Ruta:', req.method, req.originalUrl);
  console.error('Mensaje:', err.message);
  console.error('Stack:', err.stack);
  console.error('=====================================');

  res.status(500).send('Error interno del servidor. Intenta más tarde.');
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Servidor corriendo en puerto ${port}`);
});

module.exports = app;