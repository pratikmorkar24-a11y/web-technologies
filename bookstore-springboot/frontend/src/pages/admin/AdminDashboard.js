import React, { useEffect, useState } from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import AdminTabs from '../../components/AdminTabs';
import CountUp from '../../components/CountUp';
import { fetchAdminStats, fetchLowStock, fetchAdminOrders } from '../../api/admin';
import { Link } from 'react-router-dom';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [lowStock, setLowStock] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);

  useEffect(() => {
    fetchAdminStats().then(setStats).catch(() => {});
    fetchLowStock().then(setLowStock).catch(() => {});
    fetchAdminOrders().then(orders => setRecentOrders(orders.slice(0, 8))).catch(() => {});
  }, []);

  return (
    <>
      <Header />
      <div className="container admin-wrap">
        <div className="dashboard-header">
          <div><h1>Admin Overview</h1><p>Store performance and inventory at a glance.</p></div>
        </div>

        <AdminTabs />

        <div className="stat-cards">
          <div className="stat-card"><div className="num"><CountUp value={stats?.totalBooks || 0} /></div><div className="label">Total Titles</div></div>
          <div className="stat-card"><div className="num"><CountUp value={stats?.totalUsers || 0} /></div><div className="label">Registered Customers</div></div>
          <div className="stat-card"><div className="num"><CountUp value={stats?.totalOrders || 0} /></div><div className="label">Orders Placed</div></div>
          <div className="stat-card"><div className="num"><CountUp value={stats?.revenue || 0} prefix="₹" decimals={2} /></div><div className="label">Total Revenue</div></div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 30, alignItems: 'flex-start' }}>
          <div>
            <h2 style={{ fontSize: '1.2rem', marginBottom: 16 }}>⚠️ Low Stock Alerts</h2>
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead><tr><th>Book</th><th>Stock Left</th><th></th></tr></thead>
                <tbody>
                  {lowStock.length === 0 && <tr><td colSpan={3} style={{ color: 'var(--text-muted)' }}>All titles are well stocked 🎉</td></tr>}
                  {lowStock.map(b => (
                    <tr key={b.id}>
                      <td>{b.title}</td>
                      <td><span className={`stock-num ${b.stockQuantity === 0 ? 'out' : 'low'}`}>{b.stockQuantity}</span></td>
                      <td><Link to={`/admin/books/${b.id}/edit`} className="btn btn-ghost btn-sm">Manage</Link></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div>
            <h2 style={{ fontSize: '1.2rem', marginBottom: 16 }}>🧾 Recent Orders</h2>
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead><tr><th>#</th><th>Customer</th><th>Total</th><th>Status</th></tr></thead>
                <tbody>
                  {recentOrders.map(o => (
                    <tr key={o.id}>
                      <td>#{o.id}</td>
                      <td>{o.customerName}</td>
                      <td>₹{Number(o.totalAmount).toFixed(2)}</td>
                      <td><span className={`order-status ${o.status}`}>{o.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
