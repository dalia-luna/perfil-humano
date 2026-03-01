const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const localDbPath = path.join(__dirname, 'database.sqlite');
const configuredDbPath = process.env.DB_PATH;

// En producción, obliga a usar la base persistente
if (process.env.NODE_ENV === 'production' && !configuredDbPath) {
  console.error('ERROR: Falta DB_PATH en producción.');
  process.exit(1);
}

const dbPath = configuredDbPath || localDbPath;

// Crear directorio destino si no existe
const dbDir = path.dirname(dbPath);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error al abrir la base de datos principal:', err.message);
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

// Si estamos usando volumen y existe una base vieja local, migrar/mezclar datos
if (dbPath !== localDbPath && fs.existsSync(localDbPath)) {
  migrateLegacyDatabase();
}

function migrateLegacyDatabase() {
  const legacyDb = new sqlite3.Database(localDbPath, sqlite3.OPEN_READONLY, (err) => {
    if (err) {
      console.error('No se pudo abrir la base local antigua:', err.message);
      return;
    }

    console.log('Base local antigua detectada, iniciando migración...');
  });

  // Verifica que la base antigua tenga tabla users
  legacyDb.get(
    `SELECT name FROM sqlite_master WHERE type='table' AND name='users'`,
    (checkErr, row) => {
      if (checkErr || !row) {
        if (checkErr) console.error('Error verificando base antigua:', checkErr.message);
        legacyDb.close();
        return;
      }

      legacyDb.all(
        `SELECT id, name, email, password_hash, role, created_at FROM users ORDER BY id ASC`,
        (usersErr, legacyUsers) => {
          if (usersErr) {
            console.error('Error leyendo usuarios antiguos:', usersErr.message);
            legacyDb.close();
            return;
          }

          const userIdMap = {};
          migrateUsersSequentially(legacyUsers, 0, userIdMap, legacyDb);
        }
      );
    }
  );
}

function migrateUsersSequentially(legacyUsers, index, userIdMap, legacyDb) {
  if (index >= legacyUsers.length) {
    return migrateAnswers(userIdMap, legacyDb);
  }

  const legacyUser = legacyUsers[index];

  db.get(
    `SELECT id FROM users WHERE email = ?`,
    [legacyUser.email],
    (findErr, existingUser) => {
      if (findErr) {
        console.error('Error buscando usuario existente:', findErr.message);
        return migrateUsersSequentially(legacyUsers, index + 1, userIdMap, legacyDb);
      }

      if (existingUser) {
        userIdMap[legacyUser.id] = existingUser.id;
        return migrateUsersSequentially(legacyUsers, index + 1, userIdMap, legacyDb);
      }

      db.run(
        `
          INSERT INTO users (name, email, password_hash, role, created_at)
          VALUES (?, ?, ?, ?, ?)
        `,
        [
          legacyUser.name,
          legacyUser.email,
          legacyUser.password_hash,
          legacyUser.role || 'user',
          legacyUser.created_at || null
        ],
        function (insertErr) {
          if (insertErr) {
            console.error('Error insertando usuario migrado:', insertErr.message);
          } else {
            userIdMap[legacyUser.id] = this.lastID;
          }

          migrateUsersSequentially(legacyUsers, index + 1, userIdMap, legacyDb);
        }
      );
    }
  );
}

function migrateAnswers(userIdMap, legacyDb) {
  legacyDb.all(
    `SELECT user_id, question_number, answer_text, updated_at FROM answers ORDER BY user_id, question_number`,
    (answersErr, legacyAnswers) => {
      if (answersErr) {
        console.error('Error leyendo respuestas antiguas:', answersErr.message);
        legacyDb.close();
        return;
      }

      migrateAnswersSequentially(legacyAnswers, 0, userIdMap, legacyDb);
    }
  );
}

function migrateAnswersSequentially(legacyAnswers, index, userIdMap, legacyDb) {
  if (index >= legacyAnswers.length) {
    console.log('Migración de usuarios y respuestas completada.');
    legacyDb.close();
    return;
  }

  const legacyAnswer = legacyAnswers[index];
  const newUserId = userIdMap[legacyAnswer.user_id];

  if (!newUserId) {
    return migrateAnswersSequentially(legacyAnswers, index + 1, userIdMap, legacyDb);
  }

  db.run(
    `
      INSERT INTO answers (user_id, question_number, answer_text, updated_at)
      VALUES (?, ?, ?, ?)
      ON CONFLICT(user_id, question_number)
      DO UPDATE SET
        answer_text = excluded.answer_text,
        updated_at = excluded.updated_at
    `,
    [
      newUserId,
      legacyAnswer.question_number,
      legacyAnswer.answer_text,
      legacyAnswer.updated_at || null
    ],
    (insertErr) => {
      if (insertErr) {
        console.error('Error migrando respuesta:', insertErr.message);
      }

      migrateAnswersSequentially(legacyAnswers, index + 1, userIdMap, legacyDb);
    }
  );
}

module.exports = db;
