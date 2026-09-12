import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const { register, user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ fullName: '', email: '', password: '', confirmPassword: '', address: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (user) {
    navigate(user.role === 'admin' ? '/admin' : '/dashboard');
  }

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.fullName || !form.email || !form.password) {
      setError('Name, email and password are required.');
      return;
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    setLoading(true);
    try {
      await register(form);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Could not create account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <div className="auth-wrap">
        <div className="auth-card">
          <div className="icon-crest">M</div>
          <h1>Get a library card</h1>
          <p className="sub" style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem' }}>Issue your card to start browsing and checking out books.</p>

          {error && <div className="form-error">{error}</div>}

          <form onSubmit={onSubmit} noValidate>
            <div className="form-group">
              <label htmlFor="fullName">Full name</label>
              <input type="text" id="fullName" name="fullName" placeholder="Jane Reader"
                     value={form.fullName} onChange={onChange} required autoFocus />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email address</label>
              <input type="email" id="email" name="email" placeholder="you@example.com"
                     value={form.email} onChange={onChange} required />
            </div>
            <div className="form-row-2">
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input type="password" id="password" name="password" placeholder="Min. 6 characters" minLength={6}
                       value={form.password} onChange={onChange} required />
              </div>
              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm password</label>
                <input type="password" id="confirmPassword" name="confirmPassword" placeholder="Repeat password" minLength={6}
                       value={form.confirmPassword} onChange={onChange} required />
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="address">Address <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>(optional)</span></label>
              <input type="text" id="address" name="address" placeholder="Street, City, State"
                     value={form.address} onChange={onChange} />
            </div>
            <button type="submit" className="btn btn-primary btn-block" disabled={loading} style={{ width: '100%', marginTop: '10px' }}>
              {loading ? 'Issuing card…' : 'Issue Library Card'}
            </button>
          </form>

          <div className="auth-footer-link">
            Already have a library card? <Link to="/login">Sign in</Link>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
