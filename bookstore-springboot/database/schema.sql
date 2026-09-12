-- ===================================================================
-- Inkwell Digital Bookstore — Normalized MySQL Schema
-- ===================================================================
DROP DATABASE IF EXISTS inkwell_bookstore;
CREATE DATABASE inkwell_bookstore CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE inkwell_bookstore;

-- ---------------------------------------------------------------
-- USERS
-- ---------------------------------------------------------------
CREATE TABLE users (
    id              INT AUTO_INCREMENT PRIMARY KEY,
    full_name       VARCHAR(120)  NOT NULL,
    email           VARCHAR(150)  NOT NULL UNIQUE,
    password_hash   VARCHAR(255)  NOT NULL,
    role            ENUM('customer', 'admin') NOT NULL DEFAULT 'customer',
    address         VARCHAR(255)  DEFAULT NULL,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ---------------------------------------------------------------
-- AUTHORS
-- ---------------------------------------------------------------
CREATE TABLE authors (
    id          INT AUTO_INCREMENT PRIMARY KEY,
    name        VARCHAR(150) NOT NULL,
    bio         TEXT DEFAULT NULL
) ENGINE=InnoDB;

-- ---------------------------------------------------------------
-- GENRES
-- ---------------------------------------------------------------
CREATE TABLE genres (
    id          INT AUTO_INCREMENT PRIMARY KEY,
    name        VARCHAR(80) NOT NULL UNIQUE,
    description VARCHAR(255) DEFAULT NULL
) ENGINE=InnoDB;

-- ---------------------------------------------------------------
-- BOOKS  (stock_quantity acts as the live inventory count)
-- ---------------------------------------------------------------
CREATE TABLE books (
    id                INT AUTO_INCREMENT PRIMARY KEY,
    title             VARCHAR(255) NOT NULL,
    isbn              VARCHAR(20)  UNIQUE,
    description       TEXT,
    price             DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    cover_image       VARCHAR(255) DEFAULT '/images/covers/default.svg',
    publisher         VARCHAR(150) DEFAULT NULL,
    publication_year  INT DEFAULT NULL, -- supports negative years (BCE) for ancient works
    pages             INT DEFAULT NULL,
    language          VARCHAR(40) DEFAULT 'English',
    stock_quantity    INT NOT NULL DEFAULT 0,
    rating            DECIMAL(2,1) DEFAULT 4.0,
    featured          TINYINT(1) NOT NULL DEFAULT 0,
    created_at        TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FULLTEXT KEY ft_title_desc (title, description)
) ENGINE=InnoDB;

-- ---------------------------------------------------------------
-- BOOK <-> AUTHORS  (many-to-many)
-- ---------------------------------------------------------------
CREATE TABLE book_authors (
    book_id     INT NOT NULL,
    author_id   INT NOT NULL,
    PRIMARY KEY (book_id, author_id),
    FOREIGN KEY (book_id)   REFERENCES books(id)   ON DELETE CASCADE,
    FOREIGN KEY (author_id) REFERENCES authors(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ---------------------------------------------------------------
-- BOOK <-> GENRES  (many-to-many)
-- ---------------------------------------------------------------
CREATE TABLE book_genres (
    book_id     INT NOT NULL,
    genre_id    INT NOT NULL,
    PRIMARY KEY (book_id, genre_id),
    FOREIGN KEY (book_id)  REFERENCES books(id)  ON DELETE CASCADE,
    FOREIGN KEY (genre_id) REFERENCES genres(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ---------------------------------------------------------------
-- INVENTORY TRANSACTIONS  (audit trail of stock movements)
-- ---------------------------------------------------------------
CREATE TABLE inventory_transactions (
    id            INT AUTO_INCREMENT PRIMARY KEY,
    book_id       INT NOT NULL,
    change_qty    INT NOT NULL,                     -- negative = sold/removed, positive = restocked
    reason        ENUM('restock', 'sale', 'adjustment', 'initial') NOT NULL DEFAULT 'adjustment',
    created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ---------------------------------------------------------------
-- ORDERS
-- ---------------------------------------------------------------
CREATE TABLE orders (
    id              INT AUTO_INCREMENT PRIMARY KEY,
    user_id         INT NOT NULL,
    order_date      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    total_amount    DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    status          ENUM('pending','confirmed','shipped','delivered','cancelled') NOT NULL DEFAULT 'confirmed',
    shipping_address VARCHAR(255) DEFAULT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ---------------------------------------------------------------
-- ORDER ITEMS
-- ---------------------------------------------------------------
CREATE TABLE order_items (
    id            INT AUTO_INCREMENT PRIMARY KEY,
    order_id      INT NOT NULL,
    book_id       INT NOT NULL,
    quantity      INT NOT NULL DEFAULT 1,
    unit_price    DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (book_id)  REFERENCES books(id)  ON DELETE RESTRICT
) ENGINE=InnoDB;

-- ---------------------------------------------------------------
-- Helpful indexes for search / filter / sort
-- ---------------------------------------------------------------
CREATE INDEX idx_books_price ON books(price);
CREATE INDEX idx_books_year ON books(publication_year);
CREATE INDEX idx_books_stock ON books(stock_quantity);
CREATE INDEX idx_orders_user ON orders(user_id);
