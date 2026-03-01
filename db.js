const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

// Ruta configurable para Railway / producción
const dbPath = process.env.DB_PATH || path.join(__dirname, 'database.sqlite');

// Si el directorio no existe, lo crea
const dbDir = path.dirname(dbPath);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error al abrir la base de datos:', err.message);
    return;
  }

  console.log('Base de datos conectada en:', dbPath);
});

// Configuración robusta
db.serialize(() => {
  // Claves foráneas activas
  db.run('PRAGMA foreign_keys = ON');

  // Mejor concurrencia de lectura/escritura
  db.run('PRAGMA journal_mode = WAL');

  // Espera si la BD está ocupada
  db.run('PRAGMA busy_timeout = 5000');

  // Balance razonable entre seguridad y rendimiento
  db.run('PRAGMA synchronous = NORMAL');

  // Tablas principales
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'user',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS answers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      question_number INTEGER NOT NULL,
      answer_text TEXT,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(user_id, question_number),
      FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  // Índices útiles
  db.run(`
    CREATE INDEX IF NOT EXISTS idx_answers_user_id
    ON answers(user_id)
  `);

  db.run(`
    CREATE INDEX IF NOT EXISTS idx_answers_question_number
    ON answers(question_number)
  `);

  db.run(`
    CREATE INDEX IF NOT EXISTS idx_answers_user_question
    ON answers(user_id, question_number)
  `);
});

module.exports = db;