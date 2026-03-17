const express = require('express');
const path = require('path');
const fs = require('fs');
const session = require('express-session');
const SQLiteStore = require('connect-sqlite3')(session);

// Conexión a DB
require('./db.js');

// Rutas
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const questionnaireRoutes = require('./routes/questionnaire');
const caseRoutes = require('./routes/cases');

const app = express();

// Importante en Railway / proxies
app.set('trust proxy', 1);

// Configuración EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Parse body
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Ruta del archivo de sesiones persistentes
const isProduction = process.env.NODE_ENV === 'production';
const sessionDbPath = process.env.SESSION_DB_PATH ||
  (isProduction
    ? '/data/sessions.sqlite'
    : path.join(__dirname, 'sessions.sqlite'));

const sessionDir = path.dirname(sessionDbPath);
if (!fs.existsSync(sessionDir)) {
  fs.mkdirSync(sessionDir, { recursive: true });
}

// Sesiones persistentes en SQLite
app.use(
  session({
    store: new SQLiteStore({
      db: path.basename(sessionDbPath),
      dir: path.dirname(sessionDbPath)
    }),
    secret: process.env.SESSION_SECRET || 'PerfilHumanoDigital_2026_Clave_Muy_Segura_#8472',
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 7,
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production'
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
app.use('/cases', caseRoutes);

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