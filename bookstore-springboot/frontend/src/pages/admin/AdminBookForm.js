import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import AdminTabs from '../../components/AdminTabs';
import { fetchGenres, fetchAuthors, fetchBookById } from '../../api/books';
import { createBook, updateBook } from '../../api/admin';

const emptyForm = {
  title: '', isbn: '', description: '', price: '', coverImage: '/images/covers/default.svg',
  publisher: '', publicationYear: '', pages: '', language: 'English',
  stockQuantity: 0, rating: '4.0', featured: false, authorIds: [], genreIds: []
};

export default function AdminBookForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const [genres, setGenres] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchGenres().then(setGenres).catch(() => {});
    fetchAuthors().then(setAuthors).catch(() => {});
    if (isEdit) {
      fetchBookById(id).then(b => {
        setForm({
          title: b.title, isbn: b.isbn || '', description: b.description || '',
          price: b.price, coverImage: b.coverImage, publisher: b.publisher || '',
          publicationYear: b.publicationYear || '', pages: b.pages || '', language: b.language,
          stockQuantity: b.stockQuantity, rating: b.rating, featured: b.featured,
          authorIds: b.authors.map(a => a.id), genreIds: b.genres.map(g => g.id)
        });
      });
    }
  }, [id, isEdit]);

  const toggleId = (key, val) => {
    setForm(prev => {
      const list = prev[key].includes(val) ? prev[key].filter(x => x !== val) : [...prev[key], val];
      return { ...prev, [key]: list };
    });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.title || !form.price) {
      setError('Title and price are required.');
      return;
    }
    setSaving(true);
    const payload = {
      ...form,
      price: parseFloat(form.price),
      publicationYear: form.publicationYear ? parseInt(form.publicationYear, 10) : null,
      pages: form.pages ? parseInt(form.pages, 10) : null,
      stockQuantity: parseInt(form.stockQuantity, 10) || 0,
      rating: parseFloat(form.rating) || 4.0
    };
    try {
      if (isEdit) await updateBook(id, payload);
      else await createBook(payload);
      navigate('/admin/books');
    } catch (err) {
      setError(err.response?.data?.error || 'Could not save book.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <Header />
      <div className="container admin-wrap">
        <div className="dashboard-header">
          <div>
            <h1>{isEdit ? 'Edit Book' : 'Add New Book'}</h1>
            <p>{isEdit ? `Update the details for ${form.title}` : 'Add a new title to the Inkwell catalogue.'}</p>
          </div>
        </div>

        <AdminTabs />

        <div className="admin-form-card">
          {error && <div className="flash flash-error" style={{ position: 'static', marginBottom: 18 }}>{error}</div>}
          <form onSubmit={onSubmit}>
            <div className="form-row-2">
              <div className="form-group">
                <label>Title</label>
                <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>ISBN</label>
                <input type="text" value={form.isbn} onChange={(e) => setForm({ ...form, isbn: e.target.value })} />
              </div>
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea rows="4" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}></textarea>
            </div>

            <div className="form-row-2">
              <div className="form-group">
                <label>Price (₹)</label>
                <input type="number" step="0.01" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>Cover Image URL</label>
                <input type="text" value={form.coverImage} onChange={(e) => setForm({ ...form, coverImage: e.target.value })}
                       placeholder="Paste any image URL (Amazon, Google Books, Open Library…) or a local /images/covers/… path" />
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Paste a direct link to a cover image from anywhere on the web, or use one of the bundled placeholders.</span>
              </div>
            </div>

            <div className="form-group">
              <label>Cover Preview</label>
              <div style={{ width: 110, height: 165, borderRadius: 8, overflow: 'hidden', border: '1px solid var(--border-soft-2)', background: 'var(--navy-800)' }}>
                <img src={form.coverImage || '/images/covers/default.svg'} alt="Cover preview"
                     style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                     onError={(e) => { e.target.src = '/images/covers/default.svg'; }} />
              </div>
            </div>

            <div className="form-row-2">
              <div className="form-group">
                <label>Publisher</label>
                <input type="text" value={form.publisher} onChange={(e) => setForm({ ...form, publisher: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Publication Year</label>
                <input type="number" value={form.publicationYear} onChange={(e) => setForm({ ...form, publicationYear: e.target.value })} />
              </div>
            </div>

            <div className="form-row-2">
              <div className="form-group">
                <label>Pages</label>
                <input type="number" value={form.pages} onChange={(e) => setForm({ ...form, pages: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Language</label>
                <input type="text" value={form.language} onChange={(e) => setForm({ ...form, language: e.target.value })} />
              </div>
            </div>

            <div className="form-row-2">
              {!isEdit && (
                <div className="form-group">
                  <label>Initial Stock Quantity</label>
                  <input type="number" value={form.stockQuantity} onChange={(e) => setForm({ ...form, stockQuantity: e.target.value })} required />
                </div>
              )}
              <div className="form-group">
                <label>Rating (0–5)</label>
                <input type="number" step="0.1" min="0" max="5" value={form.rating} onChange={(e) => setForm({ ...form, rating: e.target.value })} />
              </div>
            </div>

            <div className="form-group">
              <label className="opt" style={{ fontWeight: 600 }}>
                <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} />
                Feature this book on the home page
              </label>
            </div>

            <div className="form-group">
              <label>Authors</label>
              <div className="checkbox-grid">
                {authors.map(a => (
                  <label key={a.id}><input type="checkbox" checked={form.authorIds.includes(a.id)} onChange={() => toggleId('authorIds', a.id)} /> {a.name}</label>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label>Genres</label>
              <div className="checkbox-grid">
                {genres.map(g => (
                  <label key={g.id}><input type="checkbox" checked={form.genreIds.includes(g.id)} onChange={() => toggleId('genreIds', g.id)} /> {g.name}</label>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', gap: 14, marginTop: 26 }}>
              <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Saving…' : (isEdit ? 'Save Changes' : 'Add Book')}</button>
              <button type="button" className="btn btn-ghost" onClick={() => navigate('/admin/books')}>Cancel</button>
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
}
