const pool = require('../config/db');

/**
 * Places an order transactionally:
 *  - validates stock for every item
 *  - creates the order + order_items
 *  - decrements book stock & logs an inventory transaction
 * Throws an Error with a user-friendly message on failure (transaction is rolled back).
 */
async function placeOrder(userId, items, shippingAddress) {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    let total = 0;
    const validated = [];

    for (const item of items) {
      const [[book]] = await connection.query('SELECT id, title, price, stock_quantity FROM books WHERE id = ? FOR UPDATE', [item.bookId]);
      if (!book) throw new Error(`Book with id ${item.bookId} no longer exists.`);
      if (book.stock_quantity < item.quantity) {
        throw new Error(`Not enough stock for "${book.title}" — only ${book.stock_quantity} left.`);
      }
      total += Number(book.price) * item.quantity;
      validated.push({ ...book, quantity: item.quantity });
    }

    const [orderResult] = await connection.query(
      'INSERT INTO orders (user_id, total_amount, status, shipping_address) VALUES (?, ?, ?, ?)',
      [userId, total.toFixed(2), 'confirmed', shippingAddress || null]
    );
    const orderId = orderResult.insertId;

    for (const item of validated) {
      await connection.query(
        'INSERT INTO order_items (order_id, book_id, quantity, unit_price) VALUES (?, ?, ?, ?)',
        [orderId, item.id, item.quantity, item.price]
      );
      await connection.query(
        'UPDATE books SET stock_quantity = stock_quantity - ? WHERE id = ?',
        [item.quantity, item.id]
      );
      await connection.query(
        `INSERT INTO inventory_transactions (book_id, change_qty, reason) VALUES (?, ?, 'sale')`,
        [item.id, -item.quantity]
      );
    }

    await connection.commit();
    return { orderId, total };
  } catch (err) {
    await connection.rollback();
    throw err;
  } finally {
    connection.release();
  }
}

async function findByUser(userId) {
  const [orders] = await pool.query(
    'SELECT * FROM orders WHERE user_id = ? ORDER BY order_date DESC',
    [userId]
  );
  for (const order of orders) {
    const [items] = await pool.query(
      `SELECT oi.*, b.title, b.cover_image FROM order_items oi
       JOIN books b ON b.id = oi.book_id WHERE oi.order_id = ?`,
      [order.id]
    );
    order.items = items;
  }
  return orders;
}

async function findAll() {
  const [orders] = await pool.query(
    `SELECT o.*, u.full_name, u.email FROM orders o
     JOIN users u ON u.id = o.user_id ORDER BY o.order_date DESC LIMIT 200`
  );
  return orders;
}

module.exports = { placeOrder, findByUser, findAll };
