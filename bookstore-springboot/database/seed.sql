-- ===================================================================
-- Inkwell Digital Bookstore — Sample / Seed Data
-- Run AFTER schema.sql
-- ===================================================================
USE inkwell_bookstore;

-- ---------------------------------------------------------------
-- USERS  (passwords are bcrypt-hashed)
--   admin@inkwell.com   / admin123
--   jane@example.com    / password123
-- ---------------------------------------------------------------
INSERT INTO users (full_name, email, password_hash, role, address) VALUES
('Inkwell Admin', 'admin@inkwell.com', '$2a$10$43Z691oQu.3wGxmP7GQ9k.0cOLPZ480U1BO3pGAY8j.8PQFCBnRFa', 'admin', '1 Library Lane, Booktown'),
('Jane Reader', 'jane@example.com', '$2a$10$Sn0hm.xZYJV240ztUovWDO5tjs/xRpxb1uqtRzqXOXXqb.SxCtSQS', 'customer', '42 Maple Street, Pune');

-- ---------------------------------------------------------------
-- AUTHORS
-- ---------------------------------------------------------------
INSERT INTO authors (name, bio) VALUES
('Jane Austen', 'English novelist known for romantic fiction set among the landed gentry.'),
('George Orwell', 'English novelist and essayist, known for dystopian and political works.'),
('Mary Shelley', 'English novelist, best known for her Gothic novel Frankenstein.'),
('Arthur Conan Doyle', 'British writer, creator of the detective Sherlock Holmes.'),
('Agatha Christie', 'English writer known for detective novels, especially Poirot and Marple.'),
('F. Scott Fitzgerald', 'American novelist widely regarded as a leading figure of the Jazz Age.'),
('Herman Melville', 'American novelist and poet of the American Renaissance period.'),
('Leo Tolstoy', 'Russian writer regarded as one of the greatest authors of all time.'),
('H. G. Wells', 'English writer, prolific in the science fiction genre.'),
('Jules Verne', 'French novelist, a pioneer of the science fiction genre.'),
('Bram Stoker', 'Irish author, best known for the Gothic novel Dracula.'),
('Charlotte Bronte', 'English novelist and poet, best known for Jane Eyre.'),
('Mark Twain', 'American writer, humorist, and lecturer.'),
('Oscar Wilde', 'Irish poet and playwright, known for his wit and epigrams.'),
('Emily Dickinson', 'American poet noted for her unconventional, introspective verse.'),
('Sun Tzu', 'Ancient Chinese military strategist and philosopher.'),
('Marcus Aurelius', 'Roman emperor and Stoic philosopher.'),
('Napoleon Hill', 'American self-help author known for works on personal success.'),
('Dale Carnegie', 'American writer and lecturer, developer of courses in self-improvement.'),
('Rina Kapoor', 'Contemporary novelist writing on modern relationships and identity.'),
('Devika Rao', 'Bestselling contemporary author of literary fiction and essays.');

-- ---------------------------------------------------------------
-- GENRES
-- ---------------------------------------------------------------
INSERT INTO genres (name, description) VALUES
('Classic Fiction', 'Timeless novels that have stood the test of time.'),
('Science Fiction', 'Speculative fiction exploring futuristic concepts and technology.'),
('Mystery & Thriller', 'Suspenseful stories of crime, detection, and intrigue.'),
('Romance', 'Stories centered on relationships and love.'),
('Gothic & Horror', 'Dark, atmospheric fiction meant to thrill and unsettle.'),
('Adventure', 'Stories of daring journeys and exploration.'),
('Philosophy', 'Works examining fundamental questions of existence and ethics.'),
('Self-Help', 'Books aimed at personal growth and self-improvement.'),
('Poetry', 'Collections of verse and lyrical writing.'),
('Contemporary Fiction', 'Modern literary fiction reflecting present-day life.'),
('Strategy & Business', 'Works on strategy, leadership, and business acumen.'),
('History', 'Non-fiction works chronicling historical events and eras.');

-- ---------------------------------------------------------------
-- BOOKS
-- ---------------------------------------------------------------
INSERT INTO books (title, isbn, description, price, cover_image, publisher, publication_year, pages, language, stock_quantity, rating, featured) VALUES
('Pride and Prejudice', '9780141439518', 'A witty exploration of manners, marriage, and morality in Regency England, following the spirited Elizabeth Bennet.', 399.00, '/images/covers/pride-and-prejudice.svg', 'Penguin Classics', 1813, 432, 'English', 24, 4.7, 1),
('1984', '9780451524935', 'A chilling vision of a totalitarian future where truth is manufactured and independent thought is a crime.', 349.00, '/images/covers/1984.svg', 'Signet Classics', 1949, 328, 'English', 30, 4.8, 1),
('Frankenstein', '9780486282114', 'A young scientist creates a sapient creature, unleashing a haunting meditation on ambition and responsibility.', 299.00, '/images/covers/frankenstein.svg', 'Dover Publications', 1818, 280, 'English', 18, 4.4, 0),
('The Adventures of Sherlock Holmes', '9781420951156', 'Twelve classic mysteries featuring the legendary detective and his unmatched powers of deduction.', 329.00, '/images/covers/sherlock-holmes.svg', 'Doubleday', 1892, 307, 'English', 22, 4.6, 1),
('Murder on the Orient Express', '9780062693662', 'Detective Hercule Poirot must solve a murder aboard a snowbound luxury train full of suspects.', 379.00, '/images/covers/orient-express.svg', 'William Morrow', 1934, 256, 'English', 15, 4.6, 0),
('The Great Gatsby', '9780743273565', 'A tragic tale of wealth, obsession, and the elusive American Dream in the Jazz Age.', 349.00, '/images/covers/great-gatsby.svg', 'Scribner', 1925, 180, 'English', 27, 4.5, 1),
('Moby-Dick', '9781503280786', 'Captain Ahab pursues a monstrous white whale in this sprawling meditation on obsession and fate.', 449.00, '/images/covers/moby-dick.svg', 'Harper & Brothers', 1851, 635, 'English', 9, 4.1, 0),
('War and Peace', '9781400079988', 'An epic chronicle of Russian society during the Napoleonic era, following five aristocratic families.', 599.00, '/images/covers/war-and-peace.svg', 'Vintage Classics', 1869, 1225, 'English', 6, 4.5, 0),
('The Time Machine', '9780451530707', 'An inventor travels far into the future, discovering the strange fate awaiting humanity.', 279.00, '/images/covers/time-machine.svg', 'Heinemann', 1895, 118, 'English', 20, 4.3, 0),
('Twenty Thousand Leagues Under the Sea', '9780553213093', 'Captain Nemo pilots the submarine Nautilus on a fantastic voyage through the world''s oceans.', 359.00, '/images/covers/20000-leagues.svg', 'Pierre-Jules Hetzel', 1870, 384, 'English', 14, 4.4, 0),
('Dracula', '9780141439846', 'Jonathan Harker''s visit to a Transylvanian castle unleashes an ancient and bloodthirsty evil.', 329.00, '/images/covers/dracula.svg', 'Archibald Constable', 1897, 418, 'English', 17, 4.5, 1),
('Jane Eyre', '9780142437209', 'An orphaned governess finds love and independence while confronting dark secrets at Thornfield Hall.', 369.00, '/images/covers/jane-eyre.svg', 'Smith, Elder & Co.', 1847, 500, 'English', 21, 4.6, 0),
('Adventures of Huckleberry Finn', '9780486280615', 'A boy and an escaped slave raft down the Mississippi in this landmark American adventure.', 299.00, '/images/covers/huckleberry-finn.svg', 'Chatto & Windus', 1884, 366, 'English', 12, 4.3, 0),
('The Picture of Dorian Gray', '9780141439570', 'A man''s portrait ages and corrodes with his sins while he himself remains eternally youthful.', 319.00, '/images/covers/dorian-gray.svg', 'Lippincott''s', 1890, 254, 'English', 19, 4.5, 0),
('Selected Poems', '9780451527510', 'A curated collection of introspective, boundary-breaking verse exploring nature, death, and the mind.', 259.00, '/images/covers/dickinson-poems.svg', 'Signet Classics', 1890, 210, 'English', 11, 4.2, 0),
('The Art of War', '9781590309638', 'Ancient treatise on strategy, tactics, and leadership that remains essential reading today.', 249.00, '/images/covers/art-of-war.svg', 'Shambhala', -500, 112, 'English', 33, 4.6, 1),
('Meditations', '9780486298238', 'Personal reflections of a Roman emperor on virtue, duty, and the nature of the self.', 269.00, '/images/covers/meditations.svg', 'Dover Publications', 180, 256, 'English', 16, 4.7, 0),
('Think and Grow Rich', '9781585424337', 'A landmark study of achievement, distilling the habits and mindset of history''s most successful people.', 399.00, '/images/covers/think-grow-rich.svg', 'The Ralston Society', 1937, 320, 'English', 25, 4.4, 0),
('How to Win Friends and Influence People', '9780671027032', 'Timeless, practical advice on communication, leadership, and building lasting relationships.', 349.00, '/images/covers/win-friends.svg', 'Simon & Schuster', 1936, 291, 'English', 28, 4.6, 1),
('The Paper Garden', '9789351775046', 'A luminous contemporary novel about a woman rebuilding her life one small act of courage at a time.', 449.00, '/images/covers/paper-garden.svg', 'Aleph Book Company', 2022, 312, 'English', 13, 4.3, 0),
('Monsoon Letters', '9789389648217', 'An evocative collection of interlinked stories set across a rain-soaked Indian coastal town.', 399.00, '/images/covers/monsoon-letters.svg', 'HarperCollins India', 2021, 288, 'English', 10, 4.2, 0),
('Midnight in Manhattan', '9780593135204', 'A fast-paced contemporary thriller unraveling a decades-old secret hidden beneath New York''s skyline.', 429.00, '/images/covers/midnight-manhattan.svg', 'Riverhead Books', 2023, 342, 'English', 8, 4.1, 0),
('The Quiet Ledger', '9780241991234', 'A sharp, character-driven novel about ambition and ethics inside a modern investment bank.', 459.00, '/images/covers/quiet-ledger.svg', 'Fourth Estate', 2020, 298, 'English', 7, 4.0, 0),
('Letters to a Young Reader', '9780143453256', 'Warm, funny, and generous essays on the joy of reading, written for book-lovers of all ages.', 289.00, '/images/covers/letters-young-reader.svg', 'Penguin India', 2019, 176, 'English', 20, 4.5, 0);

-- ---------------------------------------------------------------
-- BOOK <-> AUTHORS
-- ---------------------------------------------------------------
INSERT INTO book_authors (book_id, author_id) VALUES
(1,1),(2,2),(3,3),(4,4),(5,5),(6,6),(7,7),(8,8),(9,9),(10,10),
(11,11),(12,12),(13,13),(14,14),(15,15),(16,16),(17,17),(18,18),(19,19),
(20,20),(21,20),(22,21),(23,21),(24,20);

-- ---------------------------------------------------------------
-- BOOK <-> GENRES
-- ---------------------------------------------------------------
INSERT INTO book_genres (book_id, genre_id) VALUES
(1,1),(1,4),
(2,1),(2,2),
(3,1),(3,5),
(4,3),
(5,3),
(6,1),(6,10),
(7,1),(7,6),
(8,1),(8,12),
(9,2),(9,6),
(10,2),(10,6),
(11,5),
(12,1),(12,4),
(13,1),(13,6),
(14,1),(14,5),
(15,9),
(16,7),(16,11),
(17,7),
(18,8),(18,11),
(19,8),
(20,10),(20,4),
(21,10),
(22,10),(22,3),
(23,10),(23,11),
(24,10);

-- ---------------------------------------------------------------
-- INITIAL INVENTORY LOG (mirrors the starting stock of every book)
-- ---------------------------------------------------------------
INSERT INTO inventory_transactions (book_id, change_qty, reason)
SELECT id, stock_quantity, 'initial' FROM books;

-- ---------------------------------------------------------------
-- SAMPLE ORDER for the demo customer (Jane Reader, user_id = 2)
-- ---------------------------------------------------------------
INSERT INTO orders (user_id, total_amount, status, shipping_address) VALUES
(2, 748.00, 'delivered', '42 Maple Street, Pune');

INSERT INTO order_items (order_id, book_id, quantity, unit_price) VALUES
(1, 2, 1, 349.00),
(1, 6, 1, 349.00),
(1, 16, 1, 249.00);
-- (rounded total kept simple for demo purposes)

UPDATE orders SET total_amount = 947.00 WHERE id = 1;

-- ---------------------------------------------------------------
-- REAL COVER ART for titles already in the catalogue
-- ---------------------------------------------------------------
UPDATE books SET cover_image = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTLwPs1PFO9-tNbJ9RL8dHhm4-ZTfg5vgJtfZdM_6tCUf9w_ctS4lecOXv--sVCQHK4Esc1PWKBHr3ZzR9gbpi5etQX6AMcN3dPqS_brul3kA&s=10' WHERE title = 'How to Win Friends and Influence People';
UPDATE books SET cover_image = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQDshivXATxcghyccpd9Tus55IJ9PIY2QtIQnKb4neseNTLDR4rmkX8DVb88iDToVgZCExaQlz0FET8MPGo5oSMpYr-IJCpaQDmcaBkARUGcQ&s=10' WHERE title = 'Think and Grow Rich';

-- ---------------------------------------------------------------
-- NEW AUTHORS for the added bestsellers
-- ---------------------------------------------------------------
INSERT INTO authors (name, bio) VALUES
('David Goggins', 'Retired Navy SEAL, ultra-endurance athlete, and author known for his mental toughness philosophy.'),
('Peter Thiel', 'Entrepreneur and investor, co-founder of PayPal and Palantir, and partner at Founders Fund.'),
('Blake Masters', 'Entrepreneur and co-founder of Judicata; co-author of Zero to One based on his Stanford class notes.'),
('James Clear', 'Writer and speaker focused on habits, decision-making, and continuous improvement.');

-- ---------------------------------------------------------------
-- NEW BOOKS
-- ---------------------------------------------------------------
INSERT INTO books (title, isbn, description, price, cover_image, publisher, publication_year, pages, language, stock_quantity, rating, featured) VALUES
('Can''t Hurt Me: Master Your Mind and Defy the Odds', '9781544512273', 'David Goggins overcame poverty, abuse, and self-doubt to become a Navy SEAL and elite endurance athlete, revealing his "40% Rule" for unlocking untapped human potential.', 549.00, 'https://covers.openlibrary.org/b/isbn/9781544512273-L.jpg', 'Lioncrest Publishing', 2018, 364, 'English', 22, 4.8, 1),
('Zero to One: Notes on Startups, or How to Build the Future', '9780804139298', 'Peter Thiel, co-founder of PayPal, distills his Stanford lectures on entrepreneurship into a contrarian playbook for building the innovative monopolies that move the world forward.', 499.00, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSeZxj9vvuVAmpAslghzIAlFBUkk8XN9S0B8ln_Ui_KgUe419ryTICyp2mVyys0P4cuTmK5nUVq1MS_FPRW79c1p8W-RnQEIf_vcb_EzaRUHw&s=10', 'Crown Business', 2014, 224, 'English', 17, 4.6, 1),
('Atomic Habits', '9780735211292', 'James Clear presents a proven framework for building good habits and breaking bad ones, showing how tiny, consistent changes compound into remarkable results.', 479.00, 'https://m.media-amazon.com/images/I/817HaeblezL.jpg', 'Avery', 2018, 320, 'English', 35, 4.8, 1);

-- Link new books to their authors
INSERT INTO book_authors (book_id, author_id)
SELECT b.id, a.id FROM books b, authors a WHERE b.title = 'Can''t Hurt Me: Master Your Mind and Defy the Odds' AND a.name = 'David Goggins';
INSERT INTO book_authors (book_id, author_id)
SELECT b.id, a.id FROM books b, authors a WHERE b.title = 'Zero to One: Notes on Startups, or How to Build the Future' AND a.name = 'Peter Thiel';
INSERT INTO book_authors (book_id, author_id)
SELECT b.id, a.id FROM books b, authors a WHERE b.title = 'Zero to One: Notes on Startups, or How to Build the Future' AND a.name = 'Blake Masters';
INSERT INTO book_authors (book_id, author_id)
SELECT b.id, a.id FROM books b, authors a WHERE b.title = 'Atomic Habits' AND a.name = 'James Clear';

-- Link new books to genres (Self-Help + Strategy & Business already exist)
INSERT INTO book_genres (book_id, genre_id)
SELECT b.id, g.id FROM books b, genres g WHERE b.title = 'Can''t Hurt Me: Master Your Mind and Defy the Odds' AND g.name = 'Self-Help';
INSERT INTO book_genres (book_id, genre_id)
SELECT b.id, g.id FROM books b, genres g WHERE b.title = 'Zero to One: Notes on Startups, or How to Build the Future' AND g.name = 'Strategy & Business';
INSERT INTO book_genres (book_id, genre_id)
SELECT b.id, g.id FROM books b, genres g WHERE b.title = 'Atomic Habits' AND g.name = 'Self-Help';

-- Initial inventory log entries for the new titles
INSERT INTO inventory_transactions (book_id, change_qty, reason)
SELECT id, stock_quantity, 'initial' FROM books
WHERE title IN ('Can''t Hurt Me: Master Your Mind and Defy the Odds', 'Zero to One: Notes on Startups, or How to Build the Future', 'Atomic Habits');
