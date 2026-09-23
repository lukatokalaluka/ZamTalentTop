import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Button from '../../components/common/Button';
import { supabase } from '../../lib/supabase';

export default function LoginPage({ onShowToast }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSubmitting(true);
    const { error: authError } = await supabase.auth.signInWithPassword(form);
    setSubmitting(false);
    if (authError) {
      setError(authError.message);
      return;
    }
    onShowToast?.('Welcome back. Redirecting to your dashboard.');
    navigate(location.state?.from?.pathname || '/dashboard', { replace: true });
  };

  return (
    <div className="page-shell auth-shell">
      <div className="container auth-card auth-layout">
        <div className="auth-panel auth-panel--brand">
          <span className="eyebrow">Welcome back</span>
          <h1>Login to your dashboard</h1>
          <p>Access your profile, messages, bookings, and product listings without losing momentum.</p>

          <div className="auth-feature-list">
            <span>• Review inquiries</span>
            <span>• Update your portfolio</span>
            <span>• Track bookings and sales</span>
          </div>
        </div>

        <form className="auth-panel auth-form" onSubmit={handleSubmit}>
          <label>
            <span>Email</span>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
              required
            />
          </label>
          <label>
            <span>Password</span>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="••••••••"
              required
            />
          </label>

          <div className="auth-form__meta">
            <label className="checkbox-row">
              <input type="checkbox" defaultChecked />
              <span>Remember me</span>
            </label>
            <button type="button" className="link-text link-button" onClick={() => onShowToast?.('Password reset is coming soon.')}>Forgot password?</button>
          </div>

          {error ? <p role="alert" className="form-error">{error}</p> : null}
          <Button type="submit" className="full-width" disabled={submitting}>{submitting ? 'Logging in...' : 'Login'}</Button>
          <p className="muted-copy">
            No account yet? <Link to="/register" className="link-text">Create one</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
