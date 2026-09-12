import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { fetchBooksLookup } from '../api/books';

export default function Cart() {
  const { cart, setQuantity, removeFromCart } = useCart();
  const { user } = useAuth();
  const [books, setBooks] = useState([]);

  useEffect(() => {
    if (cart.length === 0) { setBooks([]); return; }
    fetchBooksLookup(cart.map(i => i.bookId)).then(setBooks).catch(() => {});
  }, [cart]);

  if (cart.length === 0) {
    return (
      <>
        <Header />
        <div className="container">
          <div className="page-hero-simple"><h1>Your Cart</h1><p>Review your picks before you check out.</p></div>
        </div>
        <div className="container">
          <div className="empty-state">
            <div className="icon">🛍️</div>
            <h3>Your cart is empty</h3>
            <p>Looks like you haven't added anything yet.</p>
            <Link to="/catalogue" className="btn btn-primary" style={{ marginTop: 16 }}>Browse the Catalogue</Link>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  let subtotal = 0;
  const lines = cart.map(item => {
    const book = books.find(b => b.id === item.bookId);
    if (!book) return null;
    const qty = Math.min(item.quantity, book.stockQuantity || item.quantity);
    const lineTotal = book.price * qty;
    subtotal += lineTotal;
    return { book, qty, lineTotal };
  }).filter(Boolean);

  const shipping = subtotal > 999 || subtotal === 0 ? 0 : 49;
  const total = subtotal + shipping;

  return (
    <>
      <Header />
      <div className="container">
        <div className="page-hero-simple"><h1>Your Cart</h1><p>Review your picks before you check out.</p></div>
      </div>
      <div className="container cart-layout">
        <div>
          {lines.map(({ book, qty, lineTotal }) => (
            <div className="cart-item" key={book.id}>
              <img src={book.coverImage} alt={book.title} onError={(e) => { e.target.src = '/images/covers/default.svg'; }} />
              <div>
                <h4><Link to={`/books/${book.id}`}>{book.title}</Link></h4>
                <div className="muted">₹{Number(book.price).toFixed(2)} each · {book.stockQuantity} in stock</div>
                <div className="qty-selector" style={{ marginTop: 8 }}>
                  <button type="button" onClick={() => setQuantity(book.id, qty - 1)}>−</button>
                  <input type="text" value={qty} readOnly />
                  <button type="button" onClick={() => setQuantity(book.id, qty + 1)}>+</button>
                </div>
              </div>
              <div className="line-price">₹{lineTotal.toFixed(2)}</div>
              <button className="remove-link" onClick={() => removeFromCart(book.id)}>Remove</button>
            </div>
          ))}
        </div>

        <div className="summary-card">
          <h3 style={{ marginBottom: 20 }}>Order Summary</h3>
          <div className="summary-row"><span>Subtotal</span><span>₹{subtotal.toFixed(2)}</span></div>
          <div className="summary-row"><span>Shipping</span><span>{shipping === 0 ? 'Free' : `₹${shipping.toFixed(2)}`}</span></div>
          <div className="summary-row total"><span>Total</span><span className="amt">₹{total.toFixed(2)}</span></div>
          {user ? (
            <Link to="/checkout" className="btn btn-primary btn-block" style={{ marginTop: 20 }}>Proceed to Checkout →</Link>
          ) : (
            <>
              <Link to="/login" className="btn btn-primary btn-block" style={{ marginTop: 20 }}>Log in to Checkout →</Link>
              <p style={{ textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: 10 }}>You'll need an account to place an order.</p>
            </>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}
