require('dotenv').config();
const express = require('express');
const path = require('path');
const session = require('express-session');
const flash = require('connect-flash');
const morgan = require('morgan');
const methodOverride = require('method-override');

const pool = require('./config/db');
const { attachUser } = require('./middleware/auth');

const pageRoutes = require('./routes/pageRoutes');
const authRoutes = require('./routes/authRoutes');
const apiRoutes = require('./routes/apiRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// ---- View engine ----
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// ---- Core middleware ----
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: process.env.SESSION_SECRET || 'inkwell-fallback-secret',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 1000 * 60 * 60 * 24 * 7 } // 7 days
}));
app.use(flash());
app.use(attachUser);

// Make flash messages available to every view
app.use((req, res, next) => {
  res.locals.successMsg = req.flash('success');
  res.locals.errorMsg = req.flash('error');
  res.locals.currentPath = req.path;
  next();
});

// ---- Routes ----
app.use('/', pageRoutes);
app.use('/', authRoutes);
app.use('/api', apiRoutes);
app.use('/admin', adminRoutes);

// ---- 404 ----
app.use((req, res) => {
  res.status(404).render('404', { title: 'Page Not Found' });
});

// ---- Error handler ----
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send(`
    <div style="font-family:sans-serif;background:#05070f;color:#eef0fb;min-height:100vh;
      display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:40px;">
      <h1 style="font-size:2rem;margin-bottom:10px;">Something went wrong</h1>
      <p style="color:#9aa3c0;max-width:480px;">${err.message || 'An unexpected error occurred.'}</p>
      <a href="/" style="margin-top:20px;color:#22d3ee;">← Back to Home</a>
    </div>
  `);
});

async function start() {
  try {
    await pool.query('SELECT 1');
    console.log('✔ Connected to MySQL database.');
  } catch (err) {
    console.error('✘ Could not connect to MySQL:', err.message);
    console.error('  Check your .env credentials and that MySQL is running.');
  }
  app.listen(PORT, () => {
    console.log(`📚 Inkwell Bookstore running at http://localhost:${PORT}`);
  });
}

start();

module.exports = app;
