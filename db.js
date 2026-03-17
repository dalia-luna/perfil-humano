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

  // =========================
  // TABLAS EXISTENTES
  // =========================
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

  // =========================
  // TABLAS NUEVAS PARA CASOS
  // =========================
  db.run(`
    CREATE TABLE IF NOT EXISTS cases (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      created_by_user_id INTEGER NOT NULL,
      case_code TEXT UNIQUE,
      person_name TEXT,
      alias TEXT,
      status TEXT NOT NULL DEFAULT 'captura_inicial',
      source_type TEXT NOT NULL DEFAULT 'familiar',
      report_date DATETIME,
      found_date DATETIME,
      country TEXT DEFAULT 'México',
      state TEXT,
      municipality TEXT,
      notes TEXT,
      is_active INTEGER NOT NULL DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(created_by_user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS case_answers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      case_id INTEGER NOT NULL,
      question_number INTEGER NOT NULL,
      answer_text TEXT,
      confidence_level TEXT DEFAULT 'medio',
      evidence_type TEXT DEFAULT 'familiar',
      is_confirmed INTEGER NOT NULL DEFAULT 0,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(case_id, question_number),
      FOREIGN KEY(case_id) REFERENCES cases(id) ON DELETE CASCADE
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS case_sources (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      case_id INTEGER NOT NULL,
      source_type TEXT NOT NULL,
      source_title TEXT,
      source_url TEXT,
      source_notes TEXT,
      captured_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(case_id) REFERENCES cases(id) ON DELETE CASCADE
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS case_events (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      case_id INTEGER NOT NULL,
      event_type TEXT NOT NULL,
      event_date DATETIME,
      description TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(case_id) REFERENCES cases(id) ON DELETE CASCADE
    )
  `);

  // =========================
  // ÍNDICES NUEVOS
  // =========================
  db.run(`
    CREATE INDEX IF NOT EXISTS idx_cases_created_by_user
    ON cases(created_by_user_id)
  `);

  db.run(`
    CREATE INDEX IF NOT EXISTS idx_cases_status
    ON cases(status)
  `);

  db.run(`
    CREATE INDEX IF NOT EXISTS idx_case_answers_case_id
    ON case_answers(case_id)
  `);

  db.run(`
    CREATE INDEX IF NOT EXISTS idx_case_answers_case_question
    ON case_answers(case_id, question_number)
  `);

  db.run(`
    CREATE INDEX IF NOT EXISTS idx_case_sources_case_id
    ON case_sources(case_id)
  `);

  db.run(`
    CREATE INDEX IF NOT EXISTS idx_case_events_case_id
    ON case_events(case_id)
  `);
});

module.exports = db;