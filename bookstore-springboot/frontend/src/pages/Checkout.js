import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { fetchBooksLookup } from '../api/books';
import { checkout as checkoutApi } from '../api/auth';

export default function Checkout() {
  const { cart, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);
  const [address, setAddress] = useState(user?.address || '');
  const [error, setError] = useState('');
  const [placing, setPlacing] = useState(false);

  useEffect(() => {
    if (cart.length === 0) return;
    fetchBooksLookup(cart.map(i => i.bookId)).then(setBooks).catch(() => {});
  }, [cart]);

  let subtotal = 0;
  const lines = cart.map(item => {
    const book = books.find(b => b.id === item.bookId);
    if (!book) return null;
    const lineTotal = book.price * item.quantity;
    subtotal += lineTotal;
    return { book, quantity: item.quantity, lineTotal };
  }).filter(Boolean);
  const shipping = subtotal > 999 || subtotal === 0 ? 0 : 49;
  const total = subtotal + shipping;

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!address.trim()) {
      setError('Please enter a shipping address.');
      return;
    }
    if (cart.length === 0) return;
    setPlacing(true);
    try {
      const res = await checkoutApi({
        items: cart.map(i => ({ bookId: i.bookId, quantity: i.quantity })),
        shippingAddress: address
      });
      clearCart();
      navigate(`/dashboard?ordered=${res.orderId}`);
    } catch (err) {
      setError(err.response?.data?.error || 'Checkout failed.');
      setPlacing(false);
    }
  };

  return (
    <>
      <Header />
      <div className="container">
        <div className="page-hero-simple"><h1>Checkout</h1><p>One last step before your books are on their way.</p></div>
      </div>
      <div className="container cart-layout">
        <div className="auth-card" style={{ maxWidth: '100%' }}>
          <h3 style={{ marginBottom: 20 }}>Shipping Details</h3>
          <form onSubmit={onSubmit}>
            <div className="form-group">
              <label htmlFor="shippingAddress">Shipping Address</label>
              <textarea id="shippingAddress" rows="4" placeholder="Street, City, State, PIN code"
                        value={address} onChange={(e) => setAddress(e.target.value)} required></textarea>
            </div>
            {error && <div className="flash flash-error" style={{ marginBottom: 16, position: 'static' }}>{error}</div>}
            <button type="submit" className="btn btn-primary btn-block" disabled={placing || cart.length === 0}>
              {placing ? 'Placing order…' : 'Place Order'}
            </button>
            <p style={{ textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: 14 }}>This is a demo checkout — no real payment is processed.</p>
          </form>
        </div>

        <div className="summary-card">
          <h3 style={{ marginBottom: 20 }}>Order Summary</h3>
          {cart.length === 0 ? (
            <p className="muted">Your cart is empty. <a href="/catalogue" style={{ color: 'var(--cyan-400)' }}>Browse the catalogue</a>.</p>
          ) : (
            <>
              {lines.map(({ book, quantity, lineTotal }) => (
                <div className="summary-row" key={book.id}><span>{quantity} × {book.title}</span><span>₹{lineTotal.toFixed(2)}</span></div>
              ))}
              <div className="summary-row"><span>Shipping</span><span>{shipping === 0 ? 'Free' : `₹${shipping.toFixed(2)}`}</span></div>
              <div className="summary-row total"><span>Total</span><span className="amt">₹{total.toFixed(2)}</span></div>
            </>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}
