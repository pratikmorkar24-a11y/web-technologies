import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import AdminTabs from '../../components/AdminTabs';
import { fetchAdminBooks, deleteBook, adjustStock } from '../../api/admin';

export default function AdminBooks() {
  const [books, setBooks] = useState([]);
  const [stockInputs, setStockInputs] = useState({});
  const [message, setMessage] = useState('');

  const load = () => fetchAdminBooks().then(setBooks).catch(() => {});

  useEffect(() => { load(); }, []);

  const onDelete = async (id) => {
    if (!window.confirm('Delete this book permanently?')) return;
    try {
      await deleteBook(id);
      setMessage('Book removed from catalogue.');
      load();
    } catch {
      setMessage('Could not delete book (it may have existing orders).');
    }
  };

  const onAdjust = async (id) => {
    const cfg = stockInputs[id] || { delta: '', reason: 'restock' };
    const delta = parseInt(cfg.delta, 10);
    if (!delta) { setMessage('Enter a non-zero quantity.'); return; }
    await adjustStock(id, delta, cfg.reason);
    setMessage('Inventory updated.');
    setStockInputs(prev => ({ ...prev, [id]: { delta: '', reason: cfg.reason } }));
    load();
  };

  return (
    <>
      <Header />
      <div className="container admin-wrap">
        <div className="dashboard-header">
          <div><h1>Manage Books</h1><p>Add new titles, edit details, and adjust stock levels.</p></div>
          <Link to="/admin/books/new" className="btn btn-primary">+ Add New Book</Link>
        </div>

        <AdminTabs />

        {message && <div className="flash flash-success" style={{ position: 'static', marginBottom: 20, display: 'inline-block' }}>{message}</div>}

        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr><th>Title</th><th>Price</th><th>Stock</th><th>Featured</th><th>Restock / Adjust</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {books.map(b => {
                const stockClass = b.stockQuantity === 0 ? 'out' : (b.stockQuantity <= 10 ? 'low' : 'healthy');
                const cfg = stockInputs[b.id] || { delta: '', reason: 'restock' };
                return (
                  <tr key={b.id}>
                    <td>{b.title}</td>
                    <td>₹{Number(b.price).toFixed(2)}</td>
                    <td><span className={`stock-num ${stockClass}`}>{b.stockQuantity}</span></td>
                    <td>{b.featured ? '⭐' : '—'}</td>
                    <td>
                      <div className="inline-stock-form">
                        <input type="number" placeholder="±qty" value={cfg.delta}
                               onChange={(e) => setStockInputs(prev => ({ ...prev, [b.id]: { ...cfg, delta: e.target.value } }))} />
                        <select value={cfg.reason}
                                onChange={(e) => setStockInputs(prev => ({ ...prev, [b.id]: { ...cfg, reason: e.target.value } }))}>
                          <option value="restock">Restock</option>
                          <option value="adjustment">Adjustment</option>
                        </select>
                        <button className="btn btn-ghost btn-sm" onClick={() => onAdjust(b.id)}>Apply</button>
                      </div>
                    </td>
                    <td style={{ whiteSpace: 'nowrap' }}>
                      <Link to={`/admin/books/${b.id}/edit`} className="btn btn-outline btn-sm">Edit</Link>{' '}
                      <button className="btn btn-danger btn-sm" onClick={() => onDelete(b.id)}>Delete</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      <Footer />
    </>
  );
}
