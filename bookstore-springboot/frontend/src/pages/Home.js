import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import BookCard from '../components/BookCard';
import { fetchFeatured, fetchBooks, fetchGenres } from '../api/books';

export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [genres, setGenres] = useState([]);

  useEffect(() => {
    fetchFeatured(6).then(setFeatured).catch(() => {});
    fetchBooks({ sort: 'newest', limit: 6, page: 1 }).then(res => setNewArrivals(res.items)).catch(() => {});
    fetchGenres().then(setGenres).catch(() => {});
  }, []);

  // Default drawer list matching Image 2, mapped to actual backend genres if available
  const defaultDrawers = [
    { name: 'Fiction', code: '813' },
    { name: 'Science Fiction', code: '813.5' },
    { name: 'History', code: '900' },
    { name: 'Non-Fiction', code: '158' },
    { name: 'Fantasy', code: '813.0' },
    { name: 'Technology', code: '600' }
  ];

  const drawerItems = defaultDrawers.map(d => {
    const found = genres.find(g => g.name.toLowerCase() === d.name.toLowerCase());
    return {
      name: d.name,
      code: d.code,
      genreId: found ? found.id : ''
    };
  });

  return (
    <>
      <Header />

      {/* Hero Section (Matching Image 2) */}
      <section className="hero-section">
        <div className="container hero-grid">
          <div>
            <span className="hero-eyebrow">A CARD CATALOGUE FOR THE INTERNET</span>
            <h1 className="hero-title">
              Every book here has been <span className="highlight-read">read</span>, not just listed.
            </h1>
            <p className="hero-description">
              Inkwell is a small independent bookstore that catalogues its shelves the old way — by hand, by genre, by call number — so you can actually browse instead of scroll.
            </p>
            <div className="hero-ctas">
              <Link to="/catalogue" className="btn btn-primary">Browse the catalogue</Link>
              <Link to="/register" className="btn btn-outline-dark">Get a library card</Link>
            </div>
          </div>

          <div>
            <div className="shelf-report-card">
              <div className="shelf-report-header">Today's shelf report</div>
              <div className="stat-item">
                <span className="stat-number">1,240+</span>
                <span className="stat-label">titles catalogued</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">38</span>
                <span className="stat-label">genres in stock</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">6★</span>
                <span className="stat-label">years in the neighbourhood</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pull a Drawer Section (Matching Image 2) */}
      <section className="drawer-section">
        <div className="container">
          <h2 className="section-title-large">Pull a drawer</h2>
          <div className="drawer-grid">
            {drawerItems.map(item => (
              <Link
                key={item.name}
                to={item.genreId ? `/catalogue?genre=${item.genreId}` : `/catalogue?search=${encodeURIComponent(item.name)}`}
                className="drawer-card"
              >
                <div className="drawer-left">
                  <div className="drawer-dot"></div>
                  <span className="drawer-name">{item.name}</span>
                </div>
                <span className="drawer-code">{item.code}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Catalogue Preview Grid */}
      <section className="catalogue-container" style={{ background: '#ffffff', paddingTop: '60px' }}>
        <div className="container">
          <div className="catalogue-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <span className="catalogue-subtitle">THE FULL CATALOGUE</span>
              <h2 className="catalogue-title">Featured on the shelves</h2>
            </div>
            <Link to="/catalogue" className="btn btn-outline-dark btn-sm">View full collection →</Link>
          </div>
          <hr className="catalogue-divider" />
          <div className="book-grid-3col">
            {(featured.length > 0 ? featured : newArrivals).slice(0, 6).map((book, i) => (
              <BookCard key={book.id} book={book} index={i} />
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
