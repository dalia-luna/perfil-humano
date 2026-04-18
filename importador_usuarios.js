#!/usr/bin/env node
/*
  Importa usuarios y respuestas desde el Excel exportado por /admin/export/excel
  al SQLite de Perfil Humano Digital.

  Uso:
    node importar_usuarios_desde_excel.js /ruta/al/archivo.xlsx /ruta/a/database.sqlite

  Si no mandas la ruta de la BD, intentará usar:
    1) process.env.DB_PATH
    2) ./database.sqlite (en el directorio actual)

  El script:
    - inserta/actualiza usuarios en la tabla users
    - inserta/actualiza respuestas en la tabla answers
    - deja los registros visibles en /admin/dashboard y /admin/export/excel

  Requisitos:
    npm i sqlite3 bcrypt xlsx
*/

const fs = require('fs');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');
const XLSX = require('xlsx');

const SALT_ROUNDS = 10;
const DEFAULT_PASSWORD = process.env.IMPORT_DEFAULT_PASSWORD || 'Perfil2026!';
const EXCEL_PATH = process.argv[2];
const DB_PATH = process.argv[3] || process.env.DB_PATH || path.join(process.cwd(), 'database.sqlite');

if (!EXCEL_PATH) {
  console.error('Uso: node importar_usuarios_desde_excel.js /ruta/al/archivo.xlsx [/ruta/a/database.sqlite]');
  process.exit(1);
}

if (!fs.existsSync(EXCEL_PATH)) {
  console.error(`No existe el archivo Excel: ${EXCEL_PATH}`);
  process.exit(1);
}

if (!fs.existsSync(DB_PATH)) {
  console.error(`No existe la base SQLite: ${DB_PATH}`);
  process.exit(1);
}

function normalizeString(value) {
  if (value === undefined || value === null) return '';
  return String(value).trim();
}

function normalizeEmail(value) {
  return normalizeString(value).toLowerCase();
}

function pickFirst(row, keys) {
  for (const key of keys) {
    if (Object.prototype.hasOwnProperty.call(row, key)) {
      const value = row[key];
      if (value !== undefined && value !== null && String(value).trim() !== '') {
        return value;
      }
    }
  }
  return '';
}

function isQuestionColumn(key) {
  return /^P\d+$/i.test(String(key).trim());
}

function toSqlDateTime(value) {
  const raw = normalizeString(value);
  if (!raw) return null;

  // Si ya viene como texto legible, se guarda tal cual.
  // SQLite aceptará formatos comunes tipo YYYY-MM-DD HH:mm:ss.
  return raw;
}

function openDb(dbPath) {
  return new sqlite3.Database(dbPath);
}

function run(db, sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) return reject(err);
      resolve(this);
    });
  });
}

function get(db, sql, params = []) {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) return reject(err);
      resolve(row);
    });
  });
}

function closeDb(db) {
  return new Promise((resolve, reject) => {
    db.close((err) => {
      if (err) return reject(err);
      resolve();
    });
  });
}

async function ensureSchema(db) {
  await run(db, 'PRAGMA foreign_keys = ON');
  await run(db, 'PRAGMA busy_timeout = 5000');

  await run(
    db,
    `CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'user',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`
  );

  await run(
    db,
    `CREATE TABLE IF NOT EXISTS answers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      question_number INTEGER NOT NULL,
      answer_text TEXT,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(user_id, question_number),
      FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
    )`
  );
}

function readRowsFromWorkbook(filePath) {
  const workbook = XLSX.readFile(filePath, { cellDates: false });
  const preferredSheet = workbook.SheetNames.includes('Respuestas')
    ? 'Respuestas'
    : workbook.SheetNames[0];

  const sheet = workbook.Sheets[preferredSheet];
  if (!sheet) {
    throw new Error('No se encontró una hoja válida para importar.');
  }

  const rows = XLSX.utils.sheet_to_json(sheet, { defval: '' });
  return { sheetName: preferredSheet, rows };
}

async function upsertUser(db, row, defaultPassword) {
  const name = normalizeString(
    pickFirst(row, ['Nombre', 'name', 'Name', 'NOMBRE'])
  );
  const email = normalizeEmail(
    pickFirst(row, ['Correo', 'email', 'Email', 'CORREO'])
  );
  const requestedRole = normalizeString(
    pickFirst(row, ['Rol', 'role', 'Role', 'ROL'])
  ).toLowerCase();
  const role = requestedRole === 'admin' ? 'admin' : 'user';
  const createdAt = toSqlDateTime(
    pickFirst(row, ['Fecha_Registro', 'created_at', 'FechaRegistro'])
  );

  if (!name || !email) {
    return { skipped: true, reason: 'Fila sin nombre o correo', userId: null, isNew: false };
  }

  const existing = await get(db, 'SELECT id, email FROM users WHERE lower(email) = lower(?)', [email]);

  if (existing) {
    await run(
      db,
      `UPDATE users
       SET name = ?, role = ?
       WHERE id = ?`,
      [name, role, existing.id]
    );

    if (createdAt) {
      await run(db, 'UPDATE users SET created_at = ? WHERE id = ?', [createdAt, existing.id]);
    }

    return { skipped: false, userId: existing.id, isNew: false, email, name };
  }

  const hash = await bcrypt.hash(defaultPassword, SALT_ROUNDS);

  const result = await run(
    db,
    `INSERT INTO users (name, email, password_hash, role, created_at)
     VALUES (?, ?, ?, ?, COALESCE(?, CURRENT_TIMESTAMP))`,
    [name, email, hash, role, createdAt]
  );

  return { skipped: false, userId: result.lastID, isNew: true, email, name };
}

async function upsertAnswers(db, userId, row) {
  let answersInsertedOrUpdated = 0;

  const updatedAt = toSqlDateTime(
    pickFirst(row, ['Ultima_Actividad', 'updated_at', 'UltimaActividad'])
  );

  const keys = Object.keys(row).filter(isQuestionColumn).sort((a, b) => {
    const na = Number(String(a).replace(/\D/g, ''));
    const nb = Number(String(b).replace(/\D/g, ''));
    return na - nb;
  });

  for (const key of keys) {
    const questionNumber = Number(String(key).replace(/\D/g, ''));
    const answerText = normalizeString(row[key]);

    if (!questionNumber || !answerText) continue;

    await run(
      db,
      `INSERT INTO answers (user_id, question_number, answer_text, updated_at)
       VALUES (?, ?, ?, COALESCE(?, CURRENT_TIMESTAMP))
       ON CONFLICT(user_id, question_number)
       DO UPDATE SET
         answer_text = excluded.answer_text,
         updated_at = excluded.updated_at`,
      [userId, questionNumber, answerText, updatedAt]
    );

    answersInsertedOrUpdated += 1;
  }

  return answersInsertedOrUpdated;
}

async function main() {
  const { sheetName, rows } = readRowsFromWorkbook(EXCEL_PATH);
  const db = openDb(DB_PATH);

  let usersCreated = 0;
  let usersUpdated = 0;
  let usersSkipped = 0;
  let answersUpserted = 0;

  try {
    await ensureSchema(db);
    await run(db, 'BEGIN TRANSACTION');

    for (const row of rows) {
      const userResult = await upsertUser(db, row, DEFAULT_PASSWORD);

      if (userResult.skipped || !userResult.userId) {
        usersSkipped += 1;
        continue;
      }

      if (userResult.isNew) {
        usersCreated += 1;
      } else {
        usersUpdated += 1;
      }

      const count = await upsertAnswers(db, userResult.userId, row);
      answersUpserted += count;
    }

    await run(db, 'COMMIT');

    console.log('Importación completada.');
    console.log(`Hoja usada: ${sheetName}`);
    console.log(`Base destino: ${DB_PATH}`);
    console.log(`Usuarios nuevos: ${usersCreated}`);
    console.log(`Usuarios actualizados/reutilizados: ${usersUpdated}`);
    console.log(`Filas omitidas: ${usersSkipped}`);
    console.log(`Respuestas insertadas/actualizadas: ${answersUpserted}`);
    console.log(`Contraseña por defecto para usuarios nuevos: ${DEFAULT_PASSWORD}`);
  } catch (error) {
    try {
      await run(db, 'ROLLBACK');
    } catch (_) {}
    console.error('Error durante la importación:', error.message);
    process.exitCode = 1;
  } finally {
    await closeDb(db);
  }
}

main();
