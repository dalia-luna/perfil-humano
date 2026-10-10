const crypto = require('crypto');
const db = require('../db');
const {
  NOTICE_VERSION,
  EFFECTIVE_DATE,
  getNoticeData,
  noticeAsPlainText
} = require('../config/privacyNotice');

function sha256(value) {
  return crypto.createHash('sha256').update(value, 'utf8').digest('hex');
}

function run(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) return reject(err);
      resolve({ id: this.lastID, changes: this.changes });
    });
  });
}

function get(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) return reject(err);
      resolve(row);
    });
  });
}

async function initializePrivacyTables() {
  await run(`
    CREATE TABLE IF NOT EXISTS privacy_notice_versions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      version TEXT NOT NULL UNIQUE,
      effective_date TEXT NOT NULL,
      content TEXT NOT NULL,
      content_hash TEXT NOT NULL,
      active INTEGER NOT NULL DEFAULT 0 CHECK (active IN (0,1)),
      created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await run(`
    CREATE TABLE IF NOT EXISTS user_consents (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      notice_version_id INTEGER NOT NULL,
      accepted INTEGER NOT NULL DEFAULT 1 CHECK (accepted IN (0,1)),
      accepted_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      consent_text_hash TEXT NOT NULL,
      revoked_at DATETIME NULL,
      UNIQUE(user_id, notice_version_id),
      FOREIGN KEY(user_id) REFERENCES users(id),
      FOREIGN KEY(notice_version_id) REFERENCES privacy_notice_versions(id)
    )
  `);

  await run(`
    CREATE INDEX IF NOT EXISTS idx_user_consents_user
    ON user_consents(user_id)
  `);

  await run(`
    CREATE INDEX IF NOT EXISTS idx_privacy_notice_active
    ON privacy_notice_versions(active)
  `);

  const noticeData = getNoticeData();
  const content = noticeAsPlainText(noticeData);
  const contentHash = sha256(content);

  await run('BEGIN TRANSACTION');
  try {
    // Una sola versión debe quedar activa.
    await run('UPDATE privacy_notice_versions SET active = 0');

    await run(`
      INSERT INTO privacy_notice_versions
        (version, effective_date, content, content_hash, active)
      VALUES (?, ?, ?, ?, 1)
      ON CONFLICT(version) DO UPDATE SET
        effective_date = excluded.effective_date,
        content = excluded.content,
        content_hash = excluded.content_hash,
        active = 1
    `, [NOTICE_VERSION, EFFECTIVE_DATE, content, contentHash]);

    await run('COMMIT');
  } catch (err) {
    await run('ROLLBACK');
    throw err;
  }
}

async function getActiveNotice() {
  return get(`
    SELECT id, version, effective_date, content, content_hash
    FROM privacy_notice_versions
    WHERE active = 1
    ORDER BY id DESC
    LIMIT 1
  `);
}

async function hasValidConsent(userId) {
  if (!userId) return false;

  const row = await get(`
    SELECT uc.id
    FROM user_consents uc
    INNER JOIN privacy_notice_versions pnv
      ON pnv.id = uc.notice_version_id
    WHERE uc.user_id = ?
      AND uc.accepted = 1
      AND uc.revoked_at IS NULL
      AND pnv.active = 1
    LIMIT 1
  `, [userId]);

  return Boolean(row);
}

async function saveConsent(userId) {
  const notice = await getActiveNotice();
  if (!notice) {
    throw new Error('No existe una versión activa del aviso de privacidad.');
  }

  // El hash vincula la aceptación con el texto exacto almacenado.
  const consentHash = sha256(`${notice.content_hash}:${userId}:${notice.version}`);

  await run(`
    INSERT INTO user_consents
      (user_id, notice_version_id, accepted, accepted_at, consent_text_hash, revoked_at)
    VALUES (?, ?, 1, CURRENT_TIMESTAMP, ?, NULL)
    ON CONFLICT(user_id, notice_version_id) DO UPDATE SET
      accepted = 1,
      accepted_at = CURRENT_TIMESTAMP,
      consent_text_hash = excluded.consent_text_hash,
      revoked_at = NULL
  `, [userId, notice.id, consentHash]);

  return notice;
}

module.exports = {
  initializePrivacyTables,
  getActiveNotice,
  hasValidConsent,
  saveConsent
};
