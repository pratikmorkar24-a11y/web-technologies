import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function AdminTabs() {
  const location = useLocation();
  const is = (p) => location.pathname === p ? 'active' : '';
  const startsWith = (p) => location.pathname.startsWith(p) ? 'active' : '';

  return (
    <div className="admin-tabs">
      <Link to="/admin" className={is('/admin')}>📊 Overview</Link>
      <Link to="/admin/books" className={startsWith('/admin/books')}>📚 Manage Books</Link>
      <Link to="/admin/orders" className={is('/admin/orders')}>🧾 Orders</Link>
      <Link to="/catalogue" className="btn-ghost" style={{ marginLeft: 'auto' }}>← Back to store</Link>
    </div>
  );
}
