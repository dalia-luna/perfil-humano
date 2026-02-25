const express = require('express');
const path = require('path');
const session = require('express-session');
const bcrypt = require('bcrypt'); // Para hashing de contraseñas

// Temporal: SQLite hasta migrar a Postgres
const sqlite3 = require('sqlite3').verbose();

// Conexión a la base de datos
const db = require('./db.js'); // Asegúrate de que db.js exporte funciones correctas

// Importar rutas reales de la carpeta routes/
const authRoutes = require('./routes/auth');             // Login, registro, etc.
const adminRoutes = require('./routes/admin');           // Rutas de admin
const questionnaireRoutes = require('./routes/questionnaire'); // Cuestionario y perfil

const app = express();

// Configuración de vistas EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Parseo de body para formularios y JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Archivos estáticos desde public/
app.use(express.static(path.join(__dirname, 'public')));

// Configuración de sesiones
app.use(session({
  secret: process.env.SESSION_SECRET || 'tu-secreto-muy-seguro-1234567890', // Usa variable de entorno en Render
  resave: false,
  saveUninitialized: false,
  cookie: { secure: process.env.NODE_ENV === 'production', maxAge: 24 * 60 * 60 * 1000 } // Secure en producción
}));

// Middleware para pasar usuario a vistas
app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  next();
});

// Montar rutas
app.use('/', authRoutes);
app.use('/admin', adminRoutes);
app.use('/questionnaire', questionnaireRoutes);

// Ruta health para cron job (evitar sleep)
app.get('/health', (req, res) => {
  res.status(200).send('OK - Perfil Digital Humano is alive');
});

// Ruta raíz si no está en auth.js
app.get('/', (req, res) => {
  res.render('index', {
    title: 'Perfil Digital Humano',
    message: req.session.user ? `Bienvenido, ${req.session.user.username || 'Usuario'}` : 'Inicia sesión'
  });
});

// Middleware de autenticación (protección formal)
function isAuthenticated(req, res, next) {
  if (req.session.user) {
    return next();
  }
  res.redirect('/login');
}

// Descomenta para proteger admin (ejemplo formal)
 // app.use('/admin', isAuthenticated, adminRoutes);

// Manejo de 404 (página no encontrada)
// Manejo de errores generales – MODO DIAGNÓSTICO
app.use((err, req, res, next) => {
  console.error('=====================================');
  console.error('ERROR GRAVE EN LA APLICACIÓN');
  console.error('Ruta solicitada:', req.method, req.originalUrl);
  console.error('Mensaje del error:', err.message);
  console.error('Stack trace completo:');
  console.error(err.stack);
  console.error('=====================================');

  // Mostrar detalles en el navegador SOLO para diagnóstico (luego lo quitamos)
  res.status(500).send(`
    <h1>Error interno del servidor</h1>
    <p>Mensaje: ${err.message || 'desconocido'}</p>
    <pre>${err.stack || 'No hay stack disponible'}</pre>
    <p>Revisa los logs de Render para más detalles.</p>
  `);
});

// Puerto dinámico para Render
const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Servidor corriendo en puerto ${port}`);
  console.log(`Accede en: http://localhost:${port} (local) o https://perfil-humano.onrender.com`);
});

module.exports = app;