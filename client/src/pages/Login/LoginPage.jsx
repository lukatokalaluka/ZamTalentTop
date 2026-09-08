import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/common/Button';

export default function LoginPage({ onShowToast }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onShowToast?.('Welcome back. Redirecting to your dashboard.');
    navigate('/dashboard');
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
            <a href="#" className="link-text">Forgot password?</a>
          </div>

          <Button type="submit" className="full-width">Login</Button>
          <p className="muted-copy">
            No account yet? <a href="/register" className="link-text">Create one</a>
          </p>
        </form>
      </div>
    </div>
  );
}
