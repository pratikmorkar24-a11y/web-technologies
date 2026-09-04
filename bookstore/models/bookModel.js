const pool = require('../config/db');

/**
 * Build a WHERE clause + params array from catalogue query options.
 */
function buildFilters({ search, genre, author, minPrice, maxPrice, inStockOnly }) {
  const clauses = [];
  const params = [];

  if (search) {
    clauses.push('(b.title LIKE ? OR b.description LIKE ? OR a.name LIKE ?)');
    const like = `%${search}%`;
    params.push(like, like, like);
  }
  if (genre) {
    clauses.push('g.id = ?');
    params.push(genre);
  }
  if (author) {
    clauses.push('a.id = ?');
    params.push(author);
  }
  if (minPrice) {
    clauses.push('b.price >= ?');
    params.push(minPrice);
  }
  if (maxPrice) {
    clauses.push('b.price <= ?');
    params.push(maxPrice);
  }
  if (inStockOnly === 'true' || inStockOnly === true) {
    clauses.push('b.stock_quantity > 0');
  }

  return {
    where: clauses.length ? `WHERE ${clauses.join(' AND ')}` : '',
    params
  };
}

const SORT_MAP = {
  newest: 'b.created_at DESC',
  price_asc: 'b.price ASC',
  price_desc: 'b.price DESC',
  title_asc: 'b.title ASC',
  title_desc: 'b.title DESC',
  rating: 'b.rating DESC',
  year_new: 'b.publication_year DESC',
  year_old: 'b.publication_year ASC'
};

async function findAll(options = {}) {
  const { page = 1, limit = 12, sort = 'newest' } = options;
  const offset = (Math.max(1, page) - 1) * limit;
  const { where, params } = buildFilters(options);
  const orderBy = SORT_MAP[sort] || SORT_MAP.newest;

  const query = `
    SELECT DISTINCT b.*,
      (SELECT GROUP_CONCAT(a2.name SEPARATOR ', ')
         FROM book_authors ba2 JOIN authors a2 ON a2.id = ba2.author_id
         WHERE ba2.book_id = b.id) AS authors,
      (SELECT GROUP_CONCAT(g2.name SEPARATOR ', ')
         FROM book_genres bg2 JOIN genres g2 ON g2.id = bg2.genre_id
         WHERE bg2.book_id = b.id) AS genres
    FROM books b
    LEFT JOIN book_authors ba ON ba.book_id = b.id
    LEFT JOIN authors a ON a.id = ba.author_id
    LEFT JOIN book_genres bg ON bg.book_id = b.id
    LEFT JOIN genres g ON g.id = bg.genre_id
    ${where}
    ORDER BY ${orderBy}
    LIMIT ? OFFSET ?
  `;
  const [rows] = await pool.query(query, [...params, Number(limit), Number(offset)]);

  const countQuery = `
    SELECT COUNT(DISTINCT b.id) AS total
    FROM books b
    LEFT JOIN book_authors ba ON ba.book_id = b.id
    LEFT JOIN authors a ON a.id = ba.author_id
    LEFT JOIN book_genres bg ON bg.book_id = b.id
    LEFT JOIN genres g ON g.id = bg.genre_id
    ${where}
  `;
  const [[{ total }]] = await pool.query(countQuery, params);

  return { rows, total, page: Number(page), limit: Number(limit), pages: Math.ceil(total / limit) || 1 };
}

async function findById(id) {
  const [[book]] = await pool.query(
    `SELECT b.* FROM books b WHERE b.id = ?`,
    [id]
  );
  if (!book) return null;

  const [authors] = await pool.query(
    `SELECT a.id, a.name, a.bio FROM authors a
     JOIN book_authors ba ON ba.author_id = a.id WHERE ba.book_id = ?`,
    [id]
  );
  const [genres] = await pool.query(
    `SELECT g.id, g.name FROM genres g
     JOIN book_genres bg ON bg.genre_id = g.id WHERE bg.book_id = ?`,
    [id]
  );
  return { ...book, authors, genres };
}

async function findFeatured(limit = 6) {
  const [rows] = await pool.query(
    `SELECT b.*,
      (SELECT GROUP_CONCAT(a2.name SEPARATOR ', ')
         FROM book_authors ba2 JOIN authors a2 ON a2.id = ba2.author_id
         WHERE ba2.book_id = b.id) AS authors
     FROM books b WHERE b.featured = 1 ORDER BY b.created_at DESC LIMIT ?`,
    [Number(limit)]
  );
  return rows;
}

async function findByIds(ids) {
  if (!ids.length) return [];
  const [rows] = await pool.query(
    `SELECT * FROM books WHERE id IN (${ids.map(() => '?').join(',')})`,
    ids
  );
  return rows;
}

async function decrementStock(bookId, quantity, connection = pool) {
  await connection.query(
    'UPDATE books SET stock_quantity = stock_quantity - ? WHERE id = ? AND stock_quantity >= ?',
    [quantity, bookId, quantity]
  );
  await connection.query(
    `INSERT INTO inventory_transactions (book_id, change_qty, reason) VALUES (?, ?, 'sale')`,
    [bookId, -quantity]
  );
}

async function allGenres() {
  const [rows] = await pool.query('SELECT * FROM genres ORDER BY name ASC');
  return rows;
}

async function allGenresWithCount() {
  const [rows] = await pool.query(
    `SELECT g.*, COUNT(bg.book_id) AS book_count
     FROM genres g
     LEFT JOIN book_genres bg ON bg.genre_id = g.id
     GROUP BY g.id
     ORDER BY g.name ASC`
  );
  return rows;
}

async function createGenre(data) {
  const [result] = await pool.query(
    'INSERT INTO genres (name, description) VALUES (?, ?)',
    [data.name.trim(), data.description ? data.description.trim() : null]
  );
  return result.insertId;
}

async function removeGenre(id) {
  await pool.query('DELETE FROM genres WHERE id = ?', [id]);
}

async function allAuthors() {
  const [rows] = await pool.query('SELECT * FROM authors ORDER BY name ASC');
  return rows;
}

async function allAuthorsWithCount() {
  const [rows] = await pool.query(
    `SELECT a.*, COUNT(ba.book_id) AS book_count
     FROM authors a
     LEFT JOIN book_authors ba ON ba.author_id = a.id
     GROUP BY a.id
     ORDER BY a.name ASC`
  );
  return rows;
}

async function createAuthor(data) {
  const [result] = await pool.query(
    'INSERT INTO authors (name, bio) VALUES (?, ?)',
    [data.name.trim(), data.bio ? data.bio.trim() : null]
  );
  return result.insertId;
}

async function removeAuthor(id) {
  await pool.query('DELETE FROM authors WHERE id = ?', [id]);
}

// ---- Admin CRUD ----
async function create(data) {
  const [result] = await pool.query(
    `INSERT INTO books (title, isbn, description, price, cover_image, publisher, publication_year, pages, language, stock_quantity, rating, featured)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [data.title, data.isbn || null, data.description || null, data.price, data.cover_image || '/images/covers/default.svg',
     data.publisher || null, data.publication_year || null, data.pages || null, data.language || 'English',
     data.stock_quantity || 0, data.rating || 4.0, data.featured ? 1 : 0]
  );
  const bookId = result.insertId;
  if (data.stock_quantity > 0) {
    await pool.query(`INSERT INTO inventory_transactions (book_id, change_qty, reason) VALUES (?, ?, 'initial')`, [bookId, data.stock_quantity]);
  }
  if (Array.isArray(data.authorIds)) {
    for (const aid of data.authorIds) {
      await pool.query('INSERT IGNORE INTO book_authors (book_id, author_id) VALUES (?, ?)', [bookId, aid]);
    }
  }
  if (Array.isArray(data.genreIds)) {
    for (const gid of data.genreIds) {
      await pool.query('INSERT IGNORE INTO book_genres (book_id, genre_id) VALUES (?, ?)', [bookId, gid]);
    }
  }
  return bookId;
}

async function update(id, data) {
  await pool.query(
    `UPDATE books SET title=?, isbn=?, description=?, price=?, cover_image=?, publisher=?, publication_year=?, pages=?, language=?, rating=?, featured=?
     WHERE id=?`,
    [data.title, data.isbn || null, data.description || null, data.price, data.cover_image,
     data.publisher || null, data.publication_year || null, data.pages || null, data.language || 'English',
     data.rating || 4.0, data.featured ? 1 : 0, id]
  );
  if (Array.isArray(data.authorIds)) {
    await pool.query('DELETE FROM book_authors WHERE book_id = ?', [id]);
    for (const aid of data.authorIds) {
      await pool.query('INSERT IGNORE INTO book_authors (book_id, author_id) VALUES (?, ?)', [id, aid]);
    }
  }
  if (Array.isArray(data.genreIds)) {
    await pool.query('DELETE FROM book_genres WHERE book_id = ?', [id]);
    for (const gid of data.genreIds) {
      await pool.query('INSERT IGNORE INTO book_genres (book_id, genre_id) VALUES (?, ?)', [id, gid]);
    }
  }
}

async function adjustStock(id, delta, reason = 'adjustment') {
  await pool.query('UPDATE books SET stock_quantity = GREATEST(0, stock_quantity + ?) WHERE id = ?', [delta, id]);
  await pool.query('INSERT INTO inventory_transactions (book_id, change_qty, reason) VALUES (?, ?, ?)', [id, delta, reason]);
}

async function remove(id) {
  await pool.query('DELETE FROM books WHERE id = ?', [id]);
}

module.exports = {
  findAll, findById, findFeatured, findByIds, decrementStock,
  allGenres, allGenresWithCount, createGenre, removeGenre,
  allAuthors, allAuthorsWithCount, createAuthor, removeAuthor,
  create, update, adjustStock, remove
};
