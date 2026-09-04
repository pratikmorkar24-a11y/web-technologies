# 📚 Inkwell — A Premium Digital Bookstore

A full-stack online bookstore built with **Node.js, Express, MySQL, EJS, and vanilla JavaScript**. Inkwell features an animated modern home page, a curated "digital bookshelf" catalogue (not a generic e-commerce grid), full authentication, a client-side shopping cart backed by a transactional checkout, order history, and an admin panel for managing books and inventory.

---

## ✨ Features

- **Animated home page** — hero with floating books, scroll-reveal sections, gradient typography
- **Login & Registration** — connected to MySQL, passwords hashed with bcrypt
- **Custom catalogue page** — editorial "shelf" layout grouped by genre in default browse mode, collapsing to a precise flat list the moment you search or pick a specific sort
- **Book details page** — quantity selector, related titles, full metadata
- **Search, filter & sort** — by title/description/author text, genre, author, price range, in-stock only, and 8 sort modes
- **Live inventory display** — every book shows an "In Stock / Only N left / Out of Stock" badge everywhere it appears
- **Shopping cart** — persisted in `localStorage`, hydrated live from the database on the cart & checkout pages
- **Transactional checkout** — validates stock, creates the order + order items, and decrements inventory atomically (no overselling, even under concurrent requests)
- **User dashboard** — order history, lifetime spend, books purchased
- **Admin panel** — dashboard stats, low-stock alerts, add/edit/delete books, restock/adjust inventory with an audit log, cover image URL with live preview, orders overview
- **Secure auth** — bcrypt password hashing, server-side sessions, role-based route guards
- **Fully responsive** — desktop, tablet, and mobile breakpoints throughout

---

## 🛠️ Tech Stack

| Layer      | Technology                                   |
|------------|-----------------------------------------------|
| Backend    | Node.js, Express 4                            |
| Database   | MySQL 8 (`mysql2` driver, connection pooling) |
| Views      | EJS (server-rendered)                         |
| Frontend   | Vanilla HTML/CSS/JavaScript (no build step)   |
| Auth       | express-session + bcryptjs                    |
| Styling    | Hand-written CSS design system (no framework) |

No React/webpack/build tooling is required — just Node and MySQL.

---

## 📁 Project Structure

```
bookstore/
├── server.js                 # App entry point
├── package.json
├── .env.example               # Copy to .env and fill in your values
├── config/
│   └── db.js                  # MySQL connection pool
├── middleware/
│   └── auth.js                # Session guards (requireAuth, requireAdmin, ...)
├── models/                    # Data-access layer (raw SQL via mysql2)
│   ├── bookModel.js
│   ├── userModel.js
│   └── orderModel.js
├── routes/
│   ├── pageRoutes.js          # Home, catalogue, book details, cart, dashboard
│   ├── authRoutes.js          # Login / register / logout
│   ├── apiRoutes.js           # JSON API: book lookup, checkout, orders
│   └── adminRoutes.js         # Admin panel (books CRUD, inventory, orders)
├── views/                      # EJS templates
│   ├── partials/               # head, header, footer, flash, book-card, admin-tabs
│   └── admin/                  # Admin dashboard, books list, book form, orders
├── public/
│   ├── css/style.css           # Full design system (deep navy / indigo / cyan / amber)
│   ├── js/                     # main.js, cart.js, cart-page.js, checkout-page.js
│   └── images/covers/          # Generated + hotlinked book cover art
└── db/
    ├── schema.sql              # Normalized schema (Users, Books, Authors, Genres, ...)
    └── seed.sql                # Realistic sample data (27 books, 25 authors, orders)
```

---

## 🗄️ Database Schema

Normalized to 3NF across 9 tables:

- **users** — customers & admins (role enum), bcrypt password hashes
- **authors**, **genres** — lookup tables
- **books** — title, price, `stock_quantity` (live inventory), rating, etc.
- **book_authors**, **book_genres** — many-to-many join tables
- **inventory_transactions** — audit log of every stock change (initial load, sale, restock, manual adjustment)
- **orders**, **order_items** — one order → many line items, each tied to the book price at time of purchase

See [`db/schema.sql`](db/schema.sql) for full DDL with foreign keys and indexes.

---

## 🚀 Setup & Run Instructions

### 1. Prerequisites

- **Node.js** v18+ ([nodejs.org](https://nodejs.org))
- **MySQL** 8.x server running locally (or reachable remotely)

### 2. Install dependencies

```bash
cd bookstore
npm install
```

### 3. Create the database

Log into MySQL and create an application user (or reuse an existing one):

```bash
mysql -u root -p
```

```sql
CREATE USER 'bookstore_user'@'localhost' IDENTIFIED WITH mysql_native_password BY 'bookstore_pass';
GRANT ALL PRIVILEGES ON inkwell_bookstore.* TO 'bookstore_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

Then load the schema and seed data (the schema script creates the `inkwell_bookstore` database itself):

```bash
mysql -u root -p < db/schema.sql
mysql -u root -p < db/seed.sql
```

### 4. Configure environment variables

```bash
cp .env.example .env
```

Edit `.env` with your MySQL credentials:

```ini
PORT=3000
NODE_ENV=development
SESSION_SECRET=change-this-to-a-long-random-string

DB_HOST=localhost
DB_PORT=3306
DB_USER=bookstore_user
DB_PASSWORD=bookstore_pass
DB_NAME=inkwell_bookstore
```

### 5. Run the app

```bash
npm start
```

You should see:

```
✔ Connected to MySQL database.
📚 Inkwell Bookstore running at http://localhost:3000
```

Open **http://localhost:3000** in your browser.

> For development with auto-restart on file changes: `npm run dev` (uses Node's built-in `--watch`).

---

## 🔑 Demo Accounts

| Role     | Email                | Password    |
|----------|-----------------------|-------------|
| Admin    | admin@inkwell.com      | admin123    |
| Customer | jane@example.com       | password123 |

Admin accounts can access **`/admin`** to manage the catalogue and inventory. New users who register through `/register` are created as `customer` role by default.

---

## 🧪 Trying It Out

1. Browse the catalogue at `/catalogue`, try searching, filtering by genre/author/price, and sorting.
2. Add a few books to your cart (works even when logged out — cart is stored in `localStorage`).
3. Log in (or register) and go to `/checkout` to place a real order — this decrements stock in MySQL.
4. Visit `/dashboard` to see your order history.
5. Log in as the admin account and visit `/admin` to add a new book, restock an existing one, or delete a title.

---

## 🎨 Design Notes

- **Palette**: deep navy background (`#05070f`–`#10182c`) with indigo/violet gradients, cyan and amber accents.
- **Catalogue layout**: in the default browse view, books are grouped into editorial "shelves" by genre (with dividers) instead of one flat grid. The moment you search or choose an explicit sort order, the layout switches to a precise, correctly-ordered list so sorting behaves exactly as expected.
- **Animations**: hero elements fade/float in on load; sections reveal on scroll via `IntersectionObserver`; buttons and cards have hover/lift micro-interactions.
- **Book covers**: classic public-domain titles use generated SVG placeholder covers (`/public/images/covers/*.svg`); a handful of modern bestsellers use real hotlinked cover art. Admins can paste **any image URL** into the "Cover Image URL" field on the Add/Edit Book form, with a live preview shown as they type.

---

## 🔒 Security Notes

- Passwords are hashed with **bcryptjs** (10 salt rounds) — never stored in plain text.
- Sessions are server-side (`express-session`) with an HTTP-only cookie.
- All SQL queries use parameterized statements (`mysql2` placeholders) — no string concatenation, no SQL injection surface.
- Checkout runs inside a **MySQL transaction** with row locking (`FOR UPDATE`) so stock can never go negative, even under concurrent checkouts.
- Admin routes are protected by role-based middleware (`requireAdmin` / `apiRequireAdmin`).

---

## 📌 Notes for Evaluators

- This is a learning/demo project: checkout does not integrate a real payment gateway.
- The `.env` file is intentionally excluded from the ZIP (see `.env.example`) — you must create your own with your local MySQL credentials before running.
- `node_modules/` is excluded — run `npm install` after extracting.
