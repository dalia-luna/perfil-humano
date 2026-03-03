const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const isProduction = process.env.NODE_ENV === 'production';
const configuredDbPath = process.env.DB_PATH;

// En producción, obligamos a usar DB_PATH (la base del volumen)
if (isProduction && !configuredDbPath) {
  throw new Error('Falta DB_PATH en producción. Configura DB_PATH=/data/database.sqlite en Railway.');
}

// En local puedes seguir usando database.sqlite
const dbPath = configuredDbPath || path.join(__dirname, 'database.sqlite');

// Crear directorio si no existe
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

db.serialize(() => {
  db.run('PRAGMA foreign_keys = ON');
  db.run('PRAGMA journal_mode = WAL');
  db.run('PRAGMA busy_timeout = 5000');
  db.run('PRAGMA synchronous = NORMAL');

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

  db.run(`
    CREATE INDEX IF NOT EXISTS idx_answers_user_id
    ON answers(user_id)
  `);

  db.run(`
    CREATE INDEX IF NOT EXISTS idx_answers_user_question
    ON answers(user_id, question_number)
  `);

  db.run(`
    CREATE INDEX IF NOT EXISTS idx_answers_updated_at
    ON answers(updated_at)
  `);
});

module.exports = db;