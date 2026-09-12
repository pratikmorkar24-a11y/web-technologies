import React, { useEffect, useState } from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import AdminTabs from '../../components/AdminTabs';
import { fetchAdminOrders } from '../../api/admin';

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => { fetchAdminOrders().then(setOrders).catch(() => {}); }, []);

  return (
    <>
      <Header />
      <div className="container admin-wrap">
        <div className="dashboard-header">
          <div><h1>All Orders</h1><p>Every order placed across the store.</p></div>
        </div>

        <AdminTabs />

        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr><th>Order #</th><th>Customer</th><th>Email</th><th>Date</th><th>Total</th><th>Status</th></tr>
            </thead>
            <tbody>
              {orders.length === 0 && <tr><td colSpan={6} style={{ color: 'var(--text-muted)' }}>No orders have been placed yet.</td></tr>}
              {orders.map(o => (
                <tr key={o.id}>
                  <td>#{o.id}</td>
                  <td>{o.customerName}</td>
                  <td>{o.customerEmail}</td>
                  <td>{new Date(o.orderDate).toLocaleDateString('en-IN')}</td>
                  <td>₹{Number(o.totalAmount).toFixed(2)}</td>
                  <td><span className={`order-status ${o.status}`}>{o.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <Footer />
    </>
  );
}
