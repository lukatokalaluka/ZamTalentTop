import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../../components/common/Button';
import { supabase } from '../../lib/supabase';

export default function RegisterPage({ onShowToast }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    legalName: '',
    email: '',
    phone: '',
    artistName: '',
    organisationName: '',
    displayPreference: 'legal_name',
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
      options: {
        emailRedirectTo: `${window.location.origin}/dashboard`,
        data: {
          name: form.legalName,
          legal_name: form.legalName,
          phone: form.phone,
          artist_name: form.artistName,
          organisation_name: form.organisationName,
          display_preference: form.displayPreference,
          category: form.category,
          role: 'SELLER',
        },
      },
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
                name="legalName"
                value={form.legalName}
              onChange={handleChange}
              placeholder="Your full name"
              required
            />
          </label>
          <label>
            <span>Phone number</span>
            <input type="tel" name="phone" value={form.phone} onChange={handleChange} placeholder="+260 97 123 4567" pattern="\+?[0-9 ()-]{7,20}" required />
          </label>
          <label>
            <span>Artist name (optional)</span>
            <input type="text" name="artistName" value={form.artistName} onChange={handleChange} placeholder="Your public artist name" />
          </label>
          <label>
            <span>Brand or organisation (optional)</span>
            <input type="text" name="organisationName" value={form.organisationName} onChange={handleChange} placeholder="Your company or organisation" />
          </label>
          <label>
            <span>Show my profile as</span>
            <select name="displayPreference" value={form.displayPreference} onChange={handleChange}>
              <option value="legal_name">Full legal name</option>
              <option value="artist_name">Artist name</option>
              <option value="organisation_name">Brand or organisation</option>
              <option value="both">Legal name and artist/brand name</option>
            </select>
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
