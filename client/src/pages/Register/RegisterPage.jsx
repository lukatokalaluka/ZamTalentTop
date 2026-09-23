import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../../components/common/Button';
import { supabase } from '../../lib/supabase';

export default function RegisterPage({ onShowToast }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    email: '',
    category: 'Photographer',
    password: '',
  });
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
    const { error: authError } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: { data: { name: form.name, category: form.category, role: 'SELLER' } },
    });
    setSubmitting(false);
    if (authError) {
      setError(authError.message);
      return;
    }
    onShowToast?.('Your profile is ready. Welcome to ZAM TALENT TOP.');
    navigate('/dashboard');
  };

  return (
    <div className="page-shell auth-shell">
      <div className="container auth-card auth-layout">
        <div className="auth-panel auth-panel--brand">
          <span className="eyebrow">Join ZAM TALENT TOP</span>
          <h1>Create a professional profile.</h1>
          <p>Showcase your work, get discovered and grow your freelance or business presence with a stronger digital footprint.</p>

          <div className="auth-feature-list">
            <span>• Launch your portfolio</span>
            <span>• Connect with clients</span>
            <span>• Publish services and pricing</span>
          </div>
        </div>

        <form className="auth-panel auth-form" onSubmit={handleSubmit}>
          <label>
            <span>Full name</span>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Your full name"
              required
            />
          </label>
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
              placeholder="Create a strong password"
              required
            />
          </label>
          <label>
            <span>Professional category</span>
            <select name="category" value={form.category} onChange={handleChange}>
              <option>Photographer</option>
              <option>Music Producer</option>
              <option>Web Developer</option>
              <option>Graphic Designer</option>
              <option>Event Planner</option>
              <option>Fashion Designer</option>
              <option>Video Editor</option>
            </select>
          </label>

          <label className="checkbox-row checkbox-row--stacked">
            <input type="checkbox" defaultChecked />
            <span>I agree to the terms and consent to receiving account updates.</span>
          </label>

          {error ? <p role="alert" className="form-error">{error}</p> : null}
          <Button type="submit" className="full-width" disabled={submitting}>{submitting ? 'Creating account...' : 'Create account'}</Button>
          <p className="muted-copy">
            Already have an account? <Link to="/login" className="link-text">Login</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
