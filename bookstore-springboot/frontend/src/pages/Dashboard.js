import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import CountUp from '../components/CountUp';
import { useAuth } from '../context/AuthContext';
import { fetchMyOrders } from '../api/auth';

export default function Dashboard() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyOrders().then(setOrders).finally(() => setLoading(false));
  }, []);

  const totalSpent = orders.reduce((s, o) => s + Number(o.totalAmount), 0);
  const booksPurchased = orders.reduce((s, o) => s + o.items.reduce((a, i) => a + i.quantity, 0), 0);

  return (
    <>
      <Header />
      <div className="container dashboard-wrap" style={{ paddingTop: '30px' }}>
        <div className="dashboard-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '30px' }}>
          <div>
            <h1 style={{ fontSize: '1.8rem', fontWeight: 800, margin: '0 0 4px' }}>Welcome, {user?.fullName.split(' ')[0]} 👋</h1>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>
              Here is a summary of your library card account and order history.
            </p>
          </div>
          <Link to="/catalogue" className="btn btn-primary btn-sm">Browse Catalogue →</Link>
        </div>

        <div className="stat-cards">
          <div className="stat-card">
            <div className="num"><CountUp value={orders.length} /></div>
            <div className="label">Total Orders</div>
          </div>
          <div className="stat-card">
            <div className="num"><CountUp value={totalSpent} prefix="₹" decimals={2} /></div>
            <div className="label">Total Spent</div>
          </div>
          <div className="stat-card">
            <div className="num"><CountUp value={booksPurchased} /></div>
            <div className="label">Books Purchased</div>
          </div>
        </div>

        <div className="catalogue-header" style={{ marginTop: '40px', marginBottom: '20px' }}>
          <span className="catalogue-subtitle">RECORD</span>
          <h2 className="catalogue-title" style={{ fontSize: '1.6rem' }}>Order History</h2>
        </div>
        <hr className="catalogue-divider" style={{ margin: '8px 0 24px' }} />

        {loading ? (
          <p style={{ fontFamily: 'var(--font-mono)', color: 'var(--royal-blue)', padding: '20px 0' }}>Loading shelf history…</p>
        ) : orders.length === 0 ? (
          <div className="empty-state">
            <div className="icon" style={{ fontSize: '2.5rem', marginBottom: '10px' }}>📦</div>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '6px' }}>No orders yet</h3>
            <p style={{ fontSize: '0.88rem' }}>Your order history will show up here once you check out.</p>
            <Link to="/catalogue" className="btn btn-primary btn-sm" style={{ marginTop: 14 }}>Start Browsing</Link>
          </div>
        ) : (
          orders.map(order => (
            <div className="order-card" key={order.id}>
              <div className="order-card-head">
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.88rem' }}>
                  <b style={{ color: 'var(--text-dark)' }}>Order #{order.id}</b>
                  <span style={{ color: 'var(--text-muted)', marginLeft: 12 }}>
                    {new Date(order.orderDate).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })}
                  </span>
                </div>
                <span className={`order-status ${order.status.toLowerCase()}`}>{order.status}</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {order.items.map((item, idx) => (
                  <div className="order-item-row" key={idx}>
                    <img src={item.coverImage} alt={item.title} onError={(e) => { e.target.src = '/images/covers/default.svg'; }} />
                    <div style={{ flex: 1 }}>
                      <span className="name">{item.title}</span>
                    </div>
                    <span className="qty">₹{Number(item.unitPrice).toFixed(2)} × {item.quantity}</span>
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 16, paddingTop: 14, borderTop: '1px dashed #cbd5e1', flexWrap: 'wrap', gap: '10px' }}>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.82rem', fontFamily: 'var(--font-mono)' }}>
                  Shipping: {order.shippingAddress || 'Default Address'}
                </span>
                <b style={{ color: 'var(--royal-blue)', fontFamily: 'var(--font-mono)', fontSize: '1.15rem' }}>
                  ₹{Number(order.totalAmount).toFixed(2)}
                </b>
              </div>
            </div>
          ))
        )}
      </div>
      <Footer />
    </>
  );
}
