/**
 * Auth guard middleware.
 * Attaches req.user / res.locals.user when a session exists,
 * and provides guards for protected & admin-only routes.
 */

function attachUser(req, res, next) {
  res.locals.user = req.session.user || null;
  res.locals.cartCountPlaceholder = true; // cart count is computed client-side from localStorage
  next();
}

function requireAuth(req, res, next) {
  if (!req.session.user) {
    req.session.returnTo = req.originalUrl;
    req.flash('error', 'Please log in to continue.');
    return res.redirect('/login');
  }
  next();
}

function requireGuest(req, res, next) {
  if (req.session.user) {
    return res.redirect('/');
  }
  next();
}

function requireAdmin(req, res, next) {
  if (!req.session.user || req.session.user.role !== 'admin') {
    req.flash('error', 'Admin access only.');
    return res.redirect('/');
  }
  next();
}

// JSON API variant (returns 401/403 instead of redirecting)
function apiRequireAuth(req, res, next) {
  if (!req.session.user) {
    return res.status(401).json({ error: 'You must be logged in.' });
  }
  next();
}

function apiRequireAdmin(req, res, next) {
  if (!req.session.user || req.session.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required.' });
  }
  next();
}

module.exports = {
  attachUser,
  requireAuth,
  requireGuest,
  requireAdmin,
  apiRequireAuth,
  apiRequireAdmin
};
