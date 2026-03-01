const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const localDbPath = path.join(__dirname, 'database.sqlite');
const dbPath = process.env.DB_PATH || localDbPath;

// Crear directorio del destino si no existe
const dbDir = path.dirname(dbPath);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

// Si estamos usando un volumen y aún no existe la base del volumen,
// copiar una sola vez la base local del proyecto al volumen.
if (dbPath !== localDbPath && !fs.existsSync(dbPath) && fs.existsSync(localDbPath)) {
  try {
    fs.copyFileSync(localDbPath, dbPath);
    console.log(`Base inicial copiada al volumen: ${localDbPath} -> ${dbPath}`);
  } catch (err) {
    console.error('No se pudo copiar la base inicial al volumen:', err.message);
  }
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
});

module.exports = db;