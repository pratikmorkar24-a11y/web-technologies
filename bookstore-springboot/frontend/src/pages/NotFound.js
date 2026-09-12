import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function NotFound() {
  return (
    <>
      <Header />
      <div className="notfound-wrap">
        <div className="code">404</div>
        <h2>This page has slipped off the shelf.</h2>
        <p>The page you're looking for doesn't exist or may have moved.</p>
        <Link to="/" className="btn btn-primary">← Back to Home</Link>
      </div>
      <Footer />
    </>
  );
}
