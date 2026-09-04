const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const bookModel = require('../models/bookModel');
const orderModel = require('../models/orderModel');
const { requireAdmin } = require('../middleware/auth');

router.use(requireAdmin);

// ---- Admin dashboard ----
router.get('/', async (req, res, next) => {
  try {
    const [[{ totalBooks }]] = await pool.query('SELECT COUNT(*) AS totalBooks FROM books');
    const [[{ totalUsers }]] = await pool.query("SELECT COUNT(*) AS totalUsers FROM users WHERE role = 'customer'");
    const [[{ totalOrders }]] = await pool.query('SELECT COUNT(*) AS totalOrders FROM orders');
    const [[{ revenue }]] = await pool.query("SELECT COALESCE(SUM(total_amount),0) AS revenue FROM orders WHERE status != 'cancelled'");
    const [lowStock] = await pool.query('SELECT id, title, stock_quantity FROM books WHERE stock_quantity <= 10 ORDER BY stock_quantity ASC LIMIT 8');
    const { rows: books } = await bookModel.findAll({ sort: 'newest', limit: 10, page: 1 });
    const recentOrders = (await orderModel.findAll()).slice(0, 8);

    res.render('admin/dashboard', {
      title: 'Admin — Inkwell',
      stats: { totalBooks, totalUsers, totalOrders, revenue },
      lowStock, books, recentOrders
    });
  } catch (err) { next(err); }
});

// ---- Manage books (list) ----
router.get('/books', async (req, res, next) => {
  try {
    const { rows: books } = await bookModel.findAll({ sort: 'title_asc', limit: 100, page: 1 });
    res.render('admin/books', { title: 'Manage Books — Admin', books });
  } catch (err) { next(err); }
});

// ---- New book form ----
router.get('/books/new', async (req, res, next) => {
  try {
    const genres = await bookModel.allGenres();
    const authors = await bookModel.allAuthors();
    res.render('admin/book-form', { title: 'Add Book — Admin', book: null, genres, authors });
  } catch (err) { next(err); }
});

router.post('/books/new', async (req, res, next) => {
  try {
    const b = req.body;
    await bookModel.create({
      title: b.title,
      isbn: b.isbn,
      description: b.description,
      price: parseFloat(b.price) || 0,
      cover_image: b.cover_image || undefined,
      publisher: b.publisher,
      publication_year: b.publication_year ? parseInt(b.publication_year, 10) : null,
      pages: b.pages ? parseInt(b.pages, 10) : null,
      language: b.language || 'English',
      stock_quantity: parseInt(b.stock_quantity, 10) || 0,
      rating: parseFloat(b.rating) || 4.0,
      featured: b.featured === 'on',
      authorIds: [].concat(b.authorIds || []).map(Number),
      genreIds: [].concat(b.genreIds || []).map(Number)
    });
    req.flash('success', 'Book added to the catalogue.');
    res.redirect('/admin/books');
  } catch (err) {
    console.error(err);
    req.flash('error', 'Could not add book: ' + err.message);
    res.redirect('/admin/books/new');
  }
});

// ---- Edit book form ----
router.get('/books/:id/edit', async (req, res, next) => {
  try {
    const book = await bookModel.findById(req.params.id);
    if (!book) return res.redirect('/admin/books');
    const genres = await bookModel.allGenres();
    const authors = await bookModel.allAuthors();
    res.render('admin/book-form', { title: 'Edit Book — Admin', book, genres, authors });
  } catch (err) { next(err); }
});

router.post('/books/:id/edit', async (req, res, next) => {
  try {
    const b = req.body;
    await bookModel.update(req.params.id, {
      title: b.title,
      isbn: b.isbn,
      description: b.description,
      price: parseFloat(b.price) || 0,
      cover_image: b.cover_image || '/images/covers/default.svg',
      publisher: b.publisher,
      publication_year: b.publication_year ? parseInt(b.publication_year, 10) : null,
      pages: b.pages ? parseInt(b.pages, 10) : null,
      language: b.language || 'English',
      rating: parseFloat(b.rating) || 4.0,
      featured: b.featured === 'on',
      authorIds: [].concat(b.authorIds || []).map(Number),
      genreIds: [].concat(b.genreIds || []).map(Number)
    });
    req.flash('success', 'Book updated.');
    res.redirect('/admin/books');
  } catch (err) {
    console.error(err);
    req.flash('error', 'Could not update book: ' + err.message);
    res.redirect(`/admin/books/${req.params.id}/edit`);
  }
});

// ---- Delete book ----
router.post('/books/:id/delete', async (req, res, next) => {
  try {
    await bookModel.remove(req.params.id);
    req.flash('success', 'Book removed from catalogue.');
    res.redirect('/admin/books');
  } catch (err) {
    req.flash('error', 'Could not delete book (it may have existing orders).');
    res.redirect('/admin/books');
  }
});

// ---- Adjust stock (restock / correction) ----
router.post('/books/:id/stock', async (req, res, next) => {
  try {
    const delta = parseInt(req.body.delta, 10);
    const reason = req.body.reason === 'restock' ? 'restock' : 'adjustment';
    if (!delta) {
      req.flash('error', 'Enter a non-zero quantity.');
      return res.redirect('/admin/books');
    }
    await bookModel.adjustStock(req.params.id, delta, reason);
    req.flash('success', 'Inventory updated.');
    res.redirect('/admin/books');
  } catch (err) { next(err); }
});

// ---- Orders overview ----
router.get('/orders', async (req, res, next) => {
  try {
    const orders = await orderModel.findAll();
    res.render('admin/orders', { title: 'Orders — Admin', orders });
  } catch (err) { next(err); }
});

// ---- Authors management ----
router.get('/authors', async (req, res, next) => {
  try {
    const authors = await bookModel.allAuthorsWithCount();
    res.render('admin/authors', { title: 'Manage Authors — Admin', authors });
  } catch (err) { next(err); }
});

router.post('/authors/new', async (req, res, next) => {
  try {
    const { name, bio } = req.body;
    if (!name || !name.trim()) {
      req.flash('error', 'Author name is required.');
      return res.redirect('/admin/authors');
    }
    await bookModel.createAuthor({ name, bio });
    req.flash('success', `Author "${name.trim()}" added successfully.`);
    res.redirect('/admin/authors');
  } catch (err) {
    console.error(err);
    req.flash('error', 'Could not add author: ' + err.message);
    res.redirect('/admin/authors');
  }
});

router.post('/authors/api-create', async (req, res, next) => {
  try {
    const { name, bio } = req.body;
    if (!name || !name.trim()) {
      return res.status(400).json({ error: 'Author name is required.' });
    }
    const id = await bookModel.createAuthor({ name, bio });
    res.json({ success: true, author: { id, name: name.trim() } });
  } catch (err) {
    res.status(400).json({ error: err.message || 'Could not add author.' });
  }
});

router.post('/authors/:id/delete', async (req, res, next) => {
  try {
    await bookModel.removeAuthor(req.params.id);
    req.flash('success', 'Author removed.');
    res.redirect('/admin/authors');
  } catch (err) {
    console.error(err);
    req.flash('error', 'Could not remove author (it may be assigned to existing books).');
    res.redirect('/admin/authors');
  }
});

// ---- Genres management ----
router.get('/genres', async (req, res, next) => {
  try {
    const genres = await bookModel.allGenresWithCount();
    res.render('admin/genres', { title: 'Manage Genres — Admin', genres });
  } catch (err) { next(err); }
});

router.post('/genres/new', async (req, res, next) => {
  try {
    const { name, description } = req.body;
    if (!name || !name.trim()) {
      req.flash('error', 'Genre name is required.');
      return res.redirect('/admin/genres');
    }
    await bookModel.createGenre({ name, description });
    req.flash('success', `Genre "${name.trim()}" added successfully.`);
    res.redirect('/admin/genres');
  } catch (err) {
    console.error(err);
    req.flash('error', 'Could not add genre: ' + err.message);
    res.redirect('/admin/genres');
  }
});

router.post('/genres/:id/delete', async (req, res, next) => {
  try {
    await bookModel.removeGenre(req.params.id);
    req.flash('success', 'Genre removed.');
    res.redirect('/admin/genres');
  } catch (err) {
    console.error(err);
    req.flash('error', 'Could not remove genre (it may be assigned to existing books).');
    res.redirect('/admin/genres');
  }
});

module.exports = router;
