const { hasValidConsent } = require('../services/privacyService');

function getSessionUserId(req) {
  return req.session?.userId || req.session?.user?.id || null;
}

async function requireConsent(req, res, next) {
  try {
    const userId = getSessionUserId(req);

    if (!userId) {
      return res.redirect('/login');
    }

    const valid = await hasValidConsent(userId);

    if (!valid) {
      return res.redirect('/privacy/consent');
    }

    next();
  } catch (err) {
    console.error('Error verificando consentimiento:', err);
    res.status(500).send('No fue posible verificar el consentimiento.');
  }
}

module.exports = { requireConsent, getSessionUserId };
