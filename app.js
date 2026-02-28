const express = require('express');
const path = require('path');
const session = require('express-session');

// Inicializa la base de datos
require('./db.js');

// Rutas
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const questionnaireRoutes = require('./routes/questionnaire');

const app = express();

// Importante en Railway
app.set('trust proxy', 1);

// Configuración de vistas
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Sesiones
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'tu-secreto-super-seguro-1234567890',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60 * 1000
    }
  })
);

// Variables globales para vistas
app.use((req, res, next) => {
  res.locals.user = req.session.userId || null;
  res.locals.role = req.session.role || null;
  next();
});

// Montar rutas
app.use('/', authRoutes);
app.use('/admin', adminRoutes);
app.use('/questionnaire', questionnaireRoutes);

// Ruta principal
app.get('/', (req, res) => {
  if (req.session.userId) {
    if (req.session.role === 'admin') {
      return res.redirect('/admin/dashboard');
    }
    return res.redirect('/questionnaire/instructions');
  }

  res.render('login', {
    title: 'Iniciar Sesión - Perfil Humano Digital',
    error: null,
    message: null
  });
});

// Healthcheck
app.get('/health', (req, res) => {
  res.status(200).send('OK - App is alive');
});

// 404
app.use((req, res) => {
  res.status(404).send('Página no encontrada. <a href="/login">Ir al login</a>');
});

// Manejo de errores
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