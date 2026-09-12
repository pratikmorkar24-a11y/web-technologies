# 📚 Inkwell — Spring Boot + React Edition

A full-stack online bookstore, rebuilt from the original Node/Express + EJS version onto a **Spring Boot REST API backend** and a **React single-page frontend**, while preserving every original feature, the full 27-book catalogue, cover art, and the Inkwell brand identity — now with a more premium, animated UI.

---

## Stack

| Layer    | Technology                                                                            |
| -------- | ------------------------------------------------------------------------------------- |
| Backend  | Java 17, Spring Boot 4.1.1, Spring Web, Spring Data JPA                               |
| Database | MySQL 8+ (unchanged normalized schema)                                                |
| Build    | Maven (packaged as an executable `.jar`)                                              |
| Frontend | React 18, React Router 6, Axios                                                       |
| Styling  | Hand-written CSS design system (glassmorphism, gradients, scroll/entrance animations) |
| Auth     | Server-side sessions (`HttpSession` + cookie), BCrypt password hashing (jBCrypt)      |

**Architecture:** `Controller → Service → Repository → JPA (Hibernate) → MySQL`, mirroring the original `routes → models → MySQL` layering from the Express version.

---

## Project Structure

```
Inkwell-SpringBoot-React/
├── backend/                        # Spring Boot REST API
│   ├── pom.xml
│   └── src/main/
│       ├── java/com/example/bookstore/
│       │   ├── BookstoreApplication.java
│       │   ├── config/              # CorsConfig, GlobalExceptionHandler
│       │   ├── entity/              # User, Book, Author, Genre, Order, OrderItem, InventoryTransaction
│       │   ├── repository/          # Spring Data JPA repositories (+ Specifications for search)
│       │   ├── service/             # BookService, UserService, OrderService, AdminService
│       │   ├── controller/          # Auth, Book, Genre, Author, Order, Admin REST controllers
│       │   ├── dto/                 # Request/response DTOs
│       │   └── util/                # SessionUtil (auth guards)
│       └── resources/application.properties
├── frontend/                        # React SPA
│   ├── package.json
│   ├── public/                      # index.html + /images/covers (unchanged cover art)
│   └── src/
│       ├── api/                     # axios client + endpoint wrappers
│       ├── context/                 # AuthContext, CartContext, ToastContext
│       ├── hooks/                   # useReveal (scroll animations)
│       ├── components/              # Header, Footer, BookCard, CountUp, route guards, etc.
│       ├── pages/                   # Home, Login, Register, Catalogue, BookDetails, Cart, Checkout, Dashboard, admin/*
│       ├── styles/index.css         # Full design system
│       ├── App.js                   # React Router routes
│       └── index.js
├── database/
│   ├── schema.sql                   # Unchanged normalized schema
│   └── seed.sql                     # Unchanged seed data (27 books, demo users, sample order)
├── .env.example
└── README.md
```

---

## Setup & Run

### 1. Database

```bash
mysql -u root -p
```

```sql
CREATE USER 'bookstore_user'@'localhost' IDENTIFIED WITH mysql_native_password BY 'bookstore_pass';
GRANT ALL PRIVILEGES ON inkwell_bookstore.* TO 'bookstore_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

```bash
mysql -u root -p < database/schema.sql
mysql -u root -p < database/seed.sql
```

### 2. Backend (Spring Boot)

```bash
cd backend
mvn spring-boot:run
$env:JAVA_HOME="C:\Users\Admin\.antigravity\extensions\redhat.java-1.54.0-win32-x64\jre\21.0.10-win32-x86_64"; $env:DB_PASSWORD="Pratik#sql20"; C:\Users\Admin\maven\apache-maven-3.9.6\bin\mvn.cmd spring-boot:run
```

Or build a runnable jar:

```bash
mvn clean package
java -jar target/bookstore.jar
```

The API starts on **http://localhost:8080**. Override DB credentials via environment variables (`DB_HOST`, `DB_USER`, `DB_PASSWORD`, etc. — see `.env.example`) or edit `application.properties` directly.

> **Note:** this project could not be `mvn`-compiled inside the sandbox used to generate it (no internet access to Maven Central), so the backend has been carefully hand-reviewed rather than build-verified. Run `mvn clean package` on your machine as your first step — standard Spring Boot/Java 17 code, so it should build cleanly with a normal internet connection.

### 3. Frontend (React)

```bash
cd frontend
npm install
npm start
```

Opens **http://localhost:3000**, calling the API at `http://localhost:8080/api` (configurable via `frontend/.env` → `REACT_APP_API_URL`). This was verified with `npm install && npm run build` — **compiles successfully with no errors**.

For production, `npm run build` outputs static files you can serve separately or drop into Spring Boot's `src/main/resources/static`.

---

## Demo Accounts

| Role     | Email             | Password    |
| -------- | ----------------- | ----------- |
| Admin    | admin@inkwell.com | admin123    |
| Customer | jane@example.com  | password123 |

---

## What Changed From the Express/EJS Version

- **Backend**: Express routes/models → Spring Boot Controllers/Services/Repositories with JPA entities mapped 1:1 onto the existing MySQL schema (no schema changes beyond what JPA needs).
- **Frontend**: EJS server-rendered views → a React SPA with React Router, calling the same logical endpoints via a JSON REST API instead of server-rendered HTML.
- **Auth**: express-session + bcryptjs → Spring `HttpSession` + jBCrypt (same session-cookie approach, CORS configured with credentials for the React dev server).
- **Cart**: still fully client-side via `localStorage`, now managed through a React Context instead of vanilla JS.
- **Preserved exactly**: all 27 books (including the 5 real-world titles added earlier), authors, genres, cover images/URLs, demo accounts, sample order, and the Inkwell navy/indigo/violet/cyan/amber branding.
- **UI upgrades**: glassmorphism on the header/cards/panels, animated gradient brand text, staggered book-card entrance animations, add-to-cart "pop" + cart-badge "bump" micro-interactions, animated count-up dashboard statistics, smoother mobile nav transitions, and an aurora-shifting CTA banner — all wrapped in a `prefers-reduced-motion` fallback.

---

## API Overview

| Method              | Endpoint                                                        | Description                                  |
| ------------------- | --------------------------------------------------------------- | -------------------------------------------- |
| POST                | `/api/auth/register`                                            | Create account, starts session               |
| POST                | `/api/auth/login`                                               | Login, starts session                        |
| POST                | `/api/auth/logout`                                              | Destroy session                              |
| GET                 | `/api/auth/me`                                                  | Current logged-in user                       |
| GET                 | `/api/books`                                                    | Search/filter/sort/paginate catalogue        |
| GET                 | `/api/books/featured`                                           | Featured books for the home page             |
| GET                 | `/api/books/lookup?ids=1,2,3`                                   | Batch lookup (used to hydrate the cart)      |
| GET                 | `/api/books/{id}`                                               | Book details                                 |
| GET                 | `/api/genres`, `/api/authors`                                   | Filter option lists                          |
| POST                | `/api/orders/checkout`                                          | Transactional checkout (auth required)       |
| GET                 | `/api/orders/my`                                                | Current user's order history (auth required) |
| GET/POST/PUT/DELETE | `/api/admin/books...`                                           | Admin book CRUD + inventory (admin only)     |
| GET                 | `/api/admin/stats`, `/api/admin/low-stock`, `/api/admin/orders` | Admin dashboard data                         |

---

## Notes for Evaluators

- This is a learning/demo project — checkout doesn't integrate a real payment gateway.
- `node_modules/`, `target/`, and `.env` are intentionally excluded from this package.
- The old Express/EJS project has been fully removed from this deliverable — this is a from-scratch Spring Boot + React implementation of the same product.

