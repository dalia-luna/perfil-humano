const express = require('express');
const path = require('path');
const session = require('express-session');
const bcrypt = require('bcrypt'); // Si lo usas directamente aquí o en rutas

// Temporal: SQLite hasta migrar a Postgres
const sqlite3 = require('sqlite3').verbose();

// Tu conexión a la base de datos
const db = require('./db.js'); // Asegúrate de que db.js exporte lo necesario

// Importar las rutas reales que tienes en la carpeta routes/
const authRoutes         = require('./routes/auth');
const adminRoutes        = require('./routes/admin');
const questionnaireRoutes = require('./routes/questionnaire');

const app = express();

// Configuración de vistas EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware para parsear body (formularios y JSON)
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Archivos estáticos (CSS, JS, imágenes en /public)
app.use(express.static(path.join(__dirname, 'public')));

// Sesiones con express-session
app.use(session({
  secret: process.env.SESSION_SECRET || 'tu-secreto-super-seguro-aqui-123456', // ¡Cambia esto o usa variable de entorno!
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false, maxAge: 24 * 60 * 60 * 1000 } // 1 día
}));

// Middleware para pasar el usuario a todas las vistas (opcional pero útil)
app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  next();
});

// Montar las rutas en los paths correspondientes
app.use('/',              authRoutes);           // login, registro, logout, posiblemente home
app.use('/admin',         adminRoutes);          // rutas de administración
app.use('/questionnaire', questionnaireRoutes);  // cuestionario, preguntas, perfil, etc.

// Ruta de health para mantener la app despierta (cron job)
app.get('/health', (req, res) => {
  res.status(200).send('OK - App is alive');
});

// Ruta raíz (home o landing) – si no está definida en auth.js
app.get('/', (req, res) => {
  res.render('index', {
    title: 'Perfil Digital Humano',
    message: req.session.user 
      ? `¡Bienvenido, ${req.session.user.username}!` 
      : 'Inicia sesión para continuar'
  });
});

// Middleware de autenticación (ejemplo simple – úsalo donde necesites proteger rutas)
function isAuthenticated(req, res, next) {
  if (req.session.user) {
    return next();
  }
  res.redirect('/login');
}

// Ejemplo: proteger rutas de admin (descomenta si lo necesitas)
// app.use('/admin', isAuthenticated, adminRoutes);

// Manejo de 404 – página no encontrada
app.use((req, res) => {
  res.status(404).render('404', { title: 'Página no encontrada' });
});

// Manejo de errores generales
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).render('500', { title: 'Error en el servidor' });
});

// Puerto dinámico para Render (muy importante)
const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Servidor corriendo en puerto ${port}`);
  console.log(`Accede en: http://localhost:${port} (local) o tu URL de Render`);
});

// Exporta la app (opcional, útil para tests)
module.exports = app;