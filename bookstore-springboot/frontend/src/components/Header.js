import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function Header() {
  const { user, logout } = useAuth();
  const { count, bump } = useCart();
  const location = useLocation();
  const navigate = useNavigate();
  const [navOpen, setNavOpen] = useState(false);
  const [badgeBump, setBadgeBump] = useState(false);

  useEffect(() => {
    if (bump === 0) return;
    setBadgeBump(true);
    const t = setTimeout(() => setBadgeBump(false), 420);
    return () => clearTimeout(t);
  }, [bump]);

  useEffect(() => { setNavOpen(false); }, [location.pathname]);

  const isActive = (path) => location.pathname === path;

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <header className="site-header">
      <div className="container header-inner">
        <Link to="/" className="brand">
          <div className="brand-icon-box">I</div>
          <span className="brand-name">Inkwell</span>
        </Link>

        <nav className={`main-nav ${navOpen ? 'open' : ''}`}>
          <Link to="/" className={isActive('/') ? 'active' : ''}>Home</Link>
          <Link to="/catalogue" className={isActive('/catalogue') ? 'active' : ''}>Catalogue</Link>
          {user && (
            <Link to="/dashboard" className={isActive('/dashboard') ? 'active' : ''}>Dashboard</Link>
          )}
          {user && user.role === 'admin' && (
            <Link to="/admin" className={location.pathname.startsWith('/admin') ? 'active' : ''}>Admin</Link>
          )}
        </nav>

        <div className="header-actions">
          <Link to="/cart" className="cart-icon-link" aria-label="Cart">
            <span>Cart</span>
            <span className={`cart-badge ${badgeBump ? 'bump' : ''}`}>{count}</span>
          </Link>
          {user ? (
            <>
              <span className="user-greeting">Hi, {user.fullName.split(' ')[0]}</span>
              <button className="btn btn-ghost btn-sm" onClick={handleLogout} style={{ color: '#ffffff', borderColor: 'rgba(255,255,255,0.4)' }}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" style={{ color: '#ffffff', fontWeight: 600, fontSize: '0.95rem' }}>Sign in</Link>
              <Link to="/register" className="btn btn-yellow">Get a card</Link>
            </>
          )}
          <button className={`hamburger ${navOpen ? 'open' : ''}`} aria-label="Menu" onClick={() => setNavOpen(o => !o)}>
            <span></span><span></span><span></span>
          </button>
        </div>
      </div>
    </header>
  );
}
