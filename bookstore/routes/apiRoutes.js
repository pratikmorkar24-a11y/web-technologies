const express = require('express');
const router = express.Router();
const bookModel = require('../models/bookModel');
const orderModel = require('../models/orderModel');
const { apiRequireAuth } = require('../middleware/auth');

router.get('/books/lookup', async (req, res, next) => {
  try {
    const ids = (req.query.ids || '').split(',').map(s => parseInt(s, 10)).filter(Boolean);
    const books = await bookModel.findByIds(ids);
    res.json({ books });
  } catch (err) { next(err); }
});

// POST /api/checkout  body: { items: [{bookId, quantity}], shippingAddress }
router.post('/checkout', apiRequireAuth, async (req, res, next) => {
  try {
    const { items, shippingAddress } = req.body;
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Your cart is empty.' });
    }
    const cleanItems = items
      .map(i => ({ bookId: parseInt(i.bookId, 10), quantity: parseInt(i.quantity, 10) }))
      .filter(i => i.bookId && i.quantity > 0);

    const result = await orderModel.placeOrder(req.session.user.id, cleanItems, shippingAddress);
    res.json({ success: true, orderId: result.orderId, total: result.total });
  } catch (err) {
    res.status(400).json({ error: err.message || 'Checkout failed.' });
  }
});

// GET /api/orders — current user's orders (JSON, used by dashboard refresh if needed)
router.get('/orders', apiRequireAuth, async (req, res, next) => {
  try {
    const orders = await orderModel.findByUser(req.session.user.id);
    res.json({ orders });
  } catch (err) { next(err); }
});

module.exports = router;
