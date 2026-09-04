const express = require('express');
const router = express.Router();
const bookModel = require('../models/bookModel');
const orderModel = require('../models/orderModel');
const { requireAuth } = require('../middleware/auth');

// ---- Home ----
router.get('/', async (req, res, next) => {
  try {
    const featured = await bookModel.findFeatured(6);
    const { rows: newArrivals } = await bookModel.findAll({ sort: 'newest', limit: 8, page: 1 });
    const genres = await bookModel.allGenres();
    res.render('home', { title: 'Inkwell — A Digital Library', featured, newArrivals, genres });
  } catch (err) { next(err); }
});

// ---- Catalogue ----
router.get('/catalogue', async (req, res, next) => {
  try {
    const { search = '', genre = '', author = '', minPrice = '', maxPrice = '', inStockOnly = '', sort = 'newest', page = 1 } = req.query;
    const result = await bookModel.findAll({ search, genre, author, minPrice, maxPrice, inStockOnly, sort, page, limit: 12 });
    const genres = await bookModel.allGenres();
    const authors = await bookModel.allAuthors();
    res.render('catalogue', {
      title: 'Catalogue — Inkwell',
      books: result.rows,
      pagination: { page: result.page, pages: result.pages, total: result.total },
      genres, authors,
      filters: { search, genre, author, minPrice, maxPrice, inStockOnly, sort }
    });
  } catch (err) { next(err); }
});

// ---- Book details ----
router.get('/books/:id', async (req, res, next) => {
  try {
    const book = await bookModel.findById(req.params.id);
    if (!book) {
      req.flash('error', 'That book could not be found.');
      return res.redirect('/catalogue');
    }
    const { rows: related } = await bookModel.findAll({
      genre: book.genres[0] ? book.genres[0].id : undefined,
      limit: 4,
      page: 1
    });
    res.render('book-details', {
      title: `${book.title} — Inkwell`,
      book,
      related: related.filter(b => b.id !== book.id).slice(0, 4)
    });
  } catch (err) { next(err); }
});

// ---- Cart page (client-driven via localStorage) ----
router.get('/cart', (req, res) => {
  res.render('cart', { title: 'Your Cart — Inkwell' });
});

// ---- Checkout page ----
router.get('/checkout', requireAuth, (req, res) => {
  res.render('checkout', { title: 'Checkout — Inkwell' });
});

// ---- Dashboard / order history ----
router.get('/dashboard', requireAuth, async (req, res, next) => {
  try {
    const orders = await orderModel.findByUser(req.session.user.id);
    res.render('dashboard', { title: 'My Dashboard — Inkwell', orders });
  } catch (err) { next(err); }
});

module.exports = router;
