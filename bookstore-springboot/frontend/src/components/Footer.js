import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-inner">
        <div className="footer-brand">
          <div className="brand" style={{ marginBottom: '12px' }}>
            <div className="brand-icon-box" style={{ width: '28px', height: '28px', fontSize: '0.9rem' }}>I</div>
            <span className="brand-name" style={{ color: 'var(--text-dark)' }}>Inkwell</span>
          </div>
          <p>A digital bookstore and card catalogue that organizes its shelves by hand, by genre, and by call number.</p>
        </div>
        <div className="footer-cols">
          <div>
            <h4>Explore</h4>
            <Link to="/catalogue">Catalogue</Link>
            <Link to="/catalogue?sort=newest">New Arrivals</Link>
          </div>
          <div>
            <h4>Account</h4>
            <Link to="/login">Sign in</Link>
            <Link to="/register">Get a card</Link>
            <Link to="/dashboard">Dashboard</Link>
          </div>
          <div>
            <h4>Info</h4>
            <span>React + Spring Boot Edition</span>
            <span>Digital Library Card Catalogue</span>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} Inkwell Digital Bookstore. All rights reserved.</p>
      </div>
    </footer>
  );
}
