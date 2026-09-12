import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (user) {
    navigate(user.role === 'admin' ? '/admin' : '/dashboard');
  }

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.email || !form.password) {
      setError('Please enter both email and password.');
      return;
    }
    setLoading(true);
    try {
      const u = await login(form.email, form.password);
      const dest = location.state?.from || (u.role === 'admin' ? '/admin' : '/dashboard');
      navigate(dest);
    } catch (err) {
      setError(err.response?.data?.error || 'Invalid email or password.');
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
          <h1>Welcome back</h1>
          <p className="sub" style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem' }}>Sign in to pull your drawer and view your shelf.</p>

          {error && <div className="form-error">{error}</div>}

          <form onSubmit={onSubmit} noValidate>
            <div className="form-group">
              <label htmlFor="email">Email address</label>
              <input type="email" id="email" name="email" placeholder="you@example.com"
                     value={form.email} onChange={onChange} required autoFocus />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input type="password" id="password" name="password" placeholder="••••••••"
                     value={form.password} onChange={onChange} required />
            </div>
            <button type="submit" className="btn btn-primary btn-block" disabled={loading} style={{ width: '100%', marginTop: '10px' }}>
              {loading ? 'Signing in…' : 'Sign In'}
            </button>
          </form>

          <div className="demo-hint">
            Demo accounts — Admin: <b>admin@inkwell.com</b> / admin123 &nbsp;|&nbsp; Customer: <b>jane@example.com</b> / password123
          </div>

          <div className="auth-footer-link">
            Need a library card? <Link to="/register">Get a card</Link>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
