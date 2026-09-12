import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';

export default function BookCard({ book }) {
  const { addToCart } = useCart();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [popping, setPopping] = useState(false);

  const stock = book.stockQuantity ?? 0;
  const primaryGenre = book.genreNames ? book.genreNames.split(',')[0].trim() : 'Fiction';

  // Compute call number (e.g. 813.0-HAI)
  const getCallNumber = () => {
    const genreCodeMap = {
      'fiction': '813.0',
      'science fiction': '813.54',
      'sci-fi': '813.54',
      'history': '821.0',
      'non-fiction': '158.1',
      'fantasy': '813.0',
      'technology': '600.0',
      'memoir': '821.0',
      'thriller': '813.64'
    };
    const code = genreCodeMap[primaryGenre.toLowerCase()] || `${(100 + (book.id * 13) % 850).toFixed(1)}`;
    const authorPrefix = book.authorNames
      ? book.authorNames.split(' ').pop().substring(0, 3).toUpperCase()
      : 'INK';
    return `${code}-${authorPrefix}`;
  };

  const handleCardClick = () => {
    navigate(`/books/${book.id}`);
  };

  const handleAdd = (e) => {
    e.stopPropagation();
    if (stock <= 0) return;
    addToCart(book.id, 1);
    showToast('Added to shelf cart 📚');
    setPopping(true);
    setTimeout(() => setPopping(false), 350);
  };

  return (
    <article className="index-book-card" onClick={handleCardClick} style={{ cursor: 'pointer' }}>
      {/* Signature Yellow Fold Corner */}
      <div className="index-card-yellow-fold"></div>

      {/* Top Header: Call Number & Shelf Stock */}
      <div className="card-top-meta">
        <span className="card-call-num">{getCallNumber()}</span>
        <span className="card-shelf-stock">
          {stock > 0 ? `${stock} on shelf` : 'Out of stock'}
        </span>
      </div>

      {/* Card Content with Visible Book Cover Image */}
      <div className="card-body-flex">
        <div className="card-cover-frame">
          <img
            src={book.coverImage}
            alt={`Cover of ${book.title}`}
            loading="lazy"
            onError={(e) => { e.target.src = '/images/covers/default.svg'; }}
          />
        </div>
        <div className="card-text-details">
          <h3 className="card-book-title">{book.title}</h3>
          {book.authorNames && <div className="card-book-author">{book.authorNames}</div>}
          <p className="card-book-snippet">
            {book.description || 'A timeless addition to the catalogue.'}
          </p>
        </div>
      </div>

      {/* Footer Row: Genre Tag Pill & Price */}
      <div className="card-bottom-row">
        <span className="card-genre-pill">{primaryGenre}</span>
        <div style={{ display: 'flex', items: 'center', gap: '10px' }}>
          <span className="card-price">₹{Number(book.price).toFixed(2)}</span>
          <button
            className={`btn btn-primary btn-sm ${popping ? 'pop' : ''}`}
            onClick={handleAdd}
            disabled={stock <= 0}
            style={{ borderRadius: '9999px', padding: '4px 12px', fontSize: '0.78rem', fontFamily: 'var(--font-mono)' }}
            title="Add to cart"
          >
            {stock <= 0 ? 'Out' : '+ Add'}
          </button>
        </div>
      </div>
    </article>
  );
}
