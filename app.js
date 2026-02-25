const express = require('express');
const path = require('path');
const session = require('express-session');
const db = require('./db');

const authRoutes = require('./routes/auth');
const questionnaireRoutes = require('./routes/questionnaire');
const adminRoutes = require('./routes/admin');

const app = express();
const PORT = process.env.PORT || 3000;

// Configuración de vistas
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middlewares
app.use(express.urlencoded({ extended: true })); // para leer formularios
app.use(express.static(path.join(__dirname, 'public')));

// Sesiones (para login)
app.use(
  session({
    secret: 'cambia-este-secreto-por-uno-mas-largo',
    resave: false,
    saveUninitialized: false,
  })
);

// Hacer accesible el usuario a las vistas
app.use((req, res, next) => {
  res.locals.currentUserId = req.session.userId || null;
  next();
});

// Rutas
app.use('/', authRoutes);
app.use('/', questionnaireRoutes);
app.use('/admin', adminRoutes);

// Ruta raíz
app.get('/', (req, res) => {
  if (req.session.userId) {
    return res.redirect('/instructions');
  }
  res.redirect('/login');
});

app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
