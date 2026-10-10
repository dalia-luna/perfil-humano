const express = require('express');
const crypto = require('crypto');
const router = express.Router();

const {
  getActiveNotice,
  hasValidConsent,
  saveConsent
} = require('../services/privacyService');

const {
  getNoticeData
} = require('../config/privacyNotice');

const {
  getSessionUserId
} = require('../middleware/requireConsent');

function requireLogin(req, res, next) {
  const userId = getSessionUserId(req);
  if (!userId) return res.redirect('/login');
  next();
}

router.get('/consent', requireLogin, async (req, res) => {
  try {
    const userId = getSessionUserId(req);

    if (await hasValidConsent(userId)) {
      return res.redirect(process.env.PRIVACY_AFTER_CONSENT_PATH || '/questionnaire/instructions');
    }

    const notice = await getActiveNotice();
    if (!notice) {
      return res.status(500).send('No existe un aviso de privacidad activo.');
    }

    // Token anti-CSRF específico para esta aceptación.
    const csrfToken = crypto.randomBytes(32).toString('hex');
    req.session.privacyCsrfToken = csrfToken;

    res.render('privacy-consent', {
      notice: getNoticeData(),
      csrfToken,
      error: null
    });
  } catch (err) {
    console.error('Error mostrando consentimiento:', err);
    res.status(500).send('No fue posible cargar el aviso de privacidad.');
  }
});

router.post('/consent', requireLogin, async (req, res) => {
  try {
    const userId = getSessionUserId(req);
    const noticeData = getNoticeData();

    if (
      !req.body.csrfToken ||
      !req.session.privacyCsrfToken ||
      req.body.csrfToken !== req.session.privacyCsrfToken
    ) {
      return res.status(403).send('Solicitud no válida. Recarga la página e inténtalo nuevamente.');
    }

    if (req.body.acceptConsent !== 'yes') {
      const csrfToken = crypto.randomBytes(32).toString('hex');
      req.session.privacyCsrfToken = csrfToken;

      return res.status(400).render('privacy-consent', {
        notice: noticeData,
        csrfToken,
        error: 'Debes otorgar tu consentimiento para continuar con el cuestionario.'
      });
    }

    await saveConsent(userId);

    // Token de un solo uso.
    delete req.session.privacyCsrfToken;

    res.redirect(process.env.PRIVACY_AFTER_CONSENT_PATH || '/questionnaire/instructions');
  } catch (err) {
    console.error('Error registrando consentimiento:', err);
    res.status(500).send('No fue posible registrar el consentimiento.');
  }
});

router.get('/notice', async (req, res) => {
  res.render('privacy-notice', {
    notice: getNoticeData()
  });
});

module.exports = router;
