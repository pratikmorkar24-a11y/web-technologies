import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import BookCard from '../components/BookCard';
import { fetchBookById, fetchBooks } from '../api/books';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';

export default function BookDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [related, setRelated] = useState([]);
  const [qty, setQty] = useState(1);
  const { addToCart } = useCart();
  const { showToast } = useToast();

  useEffect(() => {
    setBook(null);
    fetchBookById(id).then(b => {
      setBook(b);
      setQty(1);
      const primaryGenre = b.genres?.[0]?.id;
      fetchBooks({ genre: primaryGenre, limit: 5, page: 1 }).then(res => {
        setRelated(res.items.filter(x => x.id !== b.id).slice(0, 3));
      }).catch(() => {});
    }).catch(() => navigate('/catalogue'));
  }, [id, navigate]);

  if (!book) {
    return (
      <>
        <Header />
        <div className="container" style={{ padding: '60px 0', textAlign: 'center', fontFamily: 'var(--font-mono)', color: 'var(--royal-blue)' }}>Loading book catalogue card…</div>
        <Footer />
      </>
    );
  }

  const stock = book.stockQuantity;

  const handleAdd = () => {
    if (stock <= 0) return;
    addToCart(book.id, qty);
    showToast('Added to shelf cart 📚');
  };

  return (
    <>
      <Header />
      <div className="container book-details" style={{ paddingTop: '30px' }}>
        <p className="breadcrumb" style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', marginBottom: '20px' }}>
          <Link to="/">Home</Link> / <Link to="/catalogue">Catalogue</Link> / {book.title}
        </p>

        <div className="details-grid">
          <div className="details-cover">
            <div className="cover-frame">
              <img src={book.coverImage} alt={`Cover of ${book.title}`}
                   onError={(e) => { e.target.src = '/images/covers/default.svg'; }} />
            </div>
          </div>

          <div>
            <div className="details-genres">
              {book.genres.map(g => <span key={g.id} className="card-genre-pill">{g.name}</span>)}
            </div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800, margin: '6px 0 8px' }}>{book.title}</h1>
            <div className="details-meta-row" style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', margin: '8px 0 18px' }}>
              <span>by <b style={{ color: 'var(--text-dark)' }}>{book.authors.map(a => a.name).join(', ')}</b></span>
              <span>★ {Number(book.rating).toFixed(1)}</span>
              <span>{stock > 0 ? `${stock} in stock` : 'Out of stock'}</span>
            </div>

            <div className="details-price-row">
              <span className="details-price" style={{ fontFamily: 'var(--font-mono)', color: 'var(--royal-blue)', fontSize: '1.5rem' }}>
                ₹{Number(book.price).toFixed(2)}
              </span>

              <div className="qty-selector">
                <button type="button" onClick={() => setQty(q => Math.max(1, q - 1))}>−</button>
                <input type="text" value={qty} readOnly />
                <button type="button" onClick={() => setQty(q => Math.min(stock || 99, q + 1))}>+</button>
              </div>

              <button className="btn btn-primary btn-sm" onClick={handleAdd} disabled={stock <= 0}>
                {stock <= 0 ? 'Out of Stock' : '+ Add to Cart'}
              </button>
            </div>

            <div className="details-actions">
              <Link to="/cart" className="btn btn-yellow btn-sm">View Cart →</Link>
              <Link to="/catalogue" className="btn btn-outline-dark btn-sm">← Back to Catalogue</Link>
            </div>

            <div className="description-block">
              <h3 style={{ fontSize: '1rem', marginBottom: '8px' }}>About this book</h3>
              <p style={{ fontSize: '0.9rem', lineHeight: '1.55', margin: 0 }}>{book.description}</p>
            </div>

            <div className="info-table" style={{ fontFamily: 'var(--font-mono)', fontSize: '0.82rem' }}>
              <div><span>Publisher</span><b>{book.publisher || '—'}</b></div>
              <div><span>Publication Year</span><b>{book.publicationYear ?? '—'}</b></div>
              <div><span>Pages</span><b>{book.pages ?? '—'}</b></div>
              <div><span>Language</span><b>{book.language}</b></div>
              <div><span>ISBN</span><b>{book.isbn || '—'}</b></div>
              <div><span>Genres</span><b>{book.genres.map(g => g.name).join(', ')}</b></div>
            </div>
          </div>
        </div>

        {related.length > 0 && (
          <section style={{ marginTop: 60 }}>
            <div className="catalogue-header">
              <span className="catalogue-subtitle">RECOMMENDED</span>
              <h2 className="catalogue-title" style={{ fontSize: '1.6rem' }}>More from this drawer</h2>
            </div>
            <hr className="catalogue-divider" />
            <div className="book-grid-3col">
              {related.map(b => <BookCard key={b.id} book={b} />)}
            </div>
          </section>
        )}
      </div>
      <Footer />
    </>
  );
}
