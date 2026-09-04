const express = require('express');
const router = express.Router();
const userModel = require('../models/userModel');
const { requireGuest } = require('../middleware/auth');

// ---- Login ----
router.get('/login', requireGuest, (req, res) => {
  res.render('login', { title: 'Login' });
});

router.post('/login', requireGuest, async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      req.flash('error', 'Please enter both email and password.');
      return res.redirect('/login');
    }
    const user = await userModel.findByEmail(email.trim().toLowerCase());
    if (!user) {
      req.flash('error', 'Invalid email or password.');
      return res.redirect('/login');
    }
    const ok = await userModel.verifyPassword(password, user.password_hash);
    if (!ok) {
      req.flash('error', 'Invalid email or password.');
      return res.redirect('/login');
    }
    req.session.user = { id: user.id, full_name: user.full_name, email: user.email, role: user.role };
    const dest = req.session.returnTo || (user.role === 'admin' ? '/admin' : '/dashboard');
    delete req.session.returnTo;
    req.flash('success', `Welcome back, ${user.full_name.split(' ')[0]}!`);
    res.redirect(dest);
  } catch (err) {
    console.error(err);
    req.flash('error', 'Something went wrong. Please try again.');
    res.redirect('/login');
  }
});

// ---- Register ----
router.get('/register', requireGuest, (req, res) => {
  res.render('register', { title: 'Create Account' });
});

router.post('/register', requireGuest, async (req, res) => {
  const { full_name, email, password, confirm_password, address } = req.body;
  try {
    if (!full_name || !email || !password) {
      req.flash('error', 'Name, email and password are required.');
      return res.redirect('/register');
    }
    if (password.length < 6) {
      req.flash('error', 'Password must be at least 6 characters.');
      return res.redirect('/register');
    }
    if (password !== confirm_password) {
      req.flash('error', 'Passwords do not match.');
      return res.redirect('/register');
    }
    const existing = await userModel.findByEmail(email.trim().toLowerCase());
    if (existing) {
      req.flash('error', 'An account with that email already exists.');
      return res.redirect('/register');
    }
    const userId = await userModel.create({
      full_name: full_name.trim(),
      email: email.trim().toLowerCase(),
      password,
      address
    });
    req.session.user = { id: userId, full_name: full_name.trim(), email: email.trim().toLowerCase(), role: 'customer' };
    req.flash('success', 'Account created! Welcome to Inkwell.');
    res.redirect('/dashboard');
  } catch (err) {
    console.error(err);
    req.flash('error', 'Could not create account. Please try again.');
    res.redirect('/register');
  }
});

// ---- Logout ----
router.post('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/');
  });
});

module.exports = router;
