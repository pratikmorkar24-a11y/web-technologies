import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import BookCard from '../components/BookCard';
import { fetchBooks, fetchGenres } from '../api/books';

export default function Catalogue() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [books, setBooks] = useState([]);
  const [genres, setGenres] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState(searchParams.get('search') || '');

  const filters = useMemo(() => ({
    search: searchParams.get('search') || '',
    genre: searchParams.get('genre') || '',
    sort: searchParams.get('sort') || 'newest',
    page: parseInt(searchParams.get('page') || '1', 10)
  }), [searchParams]);

  useEffect(() => {
    fetchGenres().then(setGenres).catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    fetchBooks({
      search: filters.search || undefined,
      genre: filters.genre || undefined,
      sort: filters.sort,
      page: filters.page,
      limit: 12
    }).then(res => {
      setBooks(res.items);
      setPagination({ page: res.page, pages: res.pages, total: res.total });
    }).finally(() => setLoading(false));
  }, [filters]);

  const updateParam = useCallback((key, value) => {
    const next = new URLSearchParams(searchParams);
    if (value === '' || value === null || value === undefined) next.delete(key);
    else next.set(key, value);
    if (key !== 'page') next.delete('page');
    setSearchParams(next);
  }, [searchParams, setSearchParams]);

  const onSearchSubmit = (e) => {
    e.preventDefault();
    updateParam('search', searchInput);
  };

  const setGenreFilter = (genreId) => {
    updateParam('genre', genreId);
  };

  // Hardcoded standard list of genres from Image 1 if backend genres list is loading or incomplete
  const standardGenresList = [
    { id: '', name: 'All genres' },
    { id: 'fantasy', name: 'Fantasy' },
    { id: 'fiction', name: 'Fiction' },
    { id: 'history', name: 'History' },
    { id: 'memoir', name: 'Memoir' },
    { id: 'non-fiction', name: 'Non-Fiction' },
    { id: 'science-fiction', name: 'Science Fiction' },
    { id: 'technology', name: 'Technology' },
    { id: 'thriller', name: 'Thriller' }
  ];

  // Map API genres to tag options
  const genreTags = genres.length > 0
    ? [{ id: '', name: 'All genres' }, ...genres.map(g => ({ id: String(g.id), name: g.name }))]
    : standardGenresList;

  return (
    <>
      <Header />

      <section className="catalogue-container">
        <div className="container">
          {/* Header Subtitle & Title (Image 1) */}
          <div className="catalogue-header">
            <span className="catalogue-subtitle">THE FULL CATALOGUE</span>
            <h1 className="catalogue-title">Search the shelves</h1>
          </div>

          {/* Search bar row (Image 1) */}
          <form onSubmit={onSearchSubmit} className="search-form-row">
            <input
              type="text"
              className="search-input-pill"
              placeholder="Search by title or author.."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
            <button type="submit" className="search-submit-btn">
              Search
            </button>
          </form>

          {/* Genre filter tags pill row (Image 1) */}
          <div className="genre-tags-bar">
            {genreTags.map(tag => {
              const isActive = (tag.id === '' && !filters.genre) || String(filters.genre) === String(tag.id);
              return (
                <button
                  key={tag.name}
                  type="button"
                  className={`genre-tag-btn ${isActive ? 'active' : ''}`}
                  onClick={() => setGenreFilter(tag.id)}
                >
                  {tag.name}
                </button>
              );
            })}
          </div>

          <hr className="catalogue-divider" />

          {/* Book Cards Grid (Image 1) */}
          {loading ? (
            <div style={{ textAlign: 'center', padding: '60px 0', fontFamily: 'var(--font-mono)', color: 'var(--royal-blue)' }}>
              Searching the shelves…
            </div>
          ) : books.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 0' }}>
              <h3 style={{ fontSize: '1.4rem' }}>No titles found</h3>
              <p>Try searching another title or author, or reset your genre filter.</p>
              <button className="btn btn-primary btn-sm" onClick={() => { setSearchInput(''); setSearchParams({}); }}>
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="book-grid-3col">
              {books.map(book => (
                <BookCard key={book.id} book={book} />
              ))}
            </div>
          )}

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '44px' }}>
              {Array.from({ length: pagination.pages }, (_, i) => i + 1).map(p => (
                <button
                  key={p}
                  onClick={() => updateParam('page', p)}
                  className={`genre-tag-btn ${p === pagination.page ? 'active' : ''}`}
                  style={{ minWidth: '40px', height: '40px', padding: '0' }}
                >
                  {p}
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </>
  );
}
