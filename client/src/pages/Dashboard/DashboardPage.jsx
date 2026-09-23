import { useEffect, useState } from 'react';
import Button from '../../components/common/Button';
import { useAuth } from '../../context/AuthContext';
import { getUserBookings, saveProfile } from '../../services/api';

function formatBookingDate(value) {
  if (!value) return 'Date to be confirmed';
  return new Intl.DateTimeFormat('en-ZM', { dateStyle: 'medium' }).format(new Date(value));
}

export default function DashboardPage({ onShowToast }) {
  const { user, profile } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [showProfileForm, setShowProfileForm] = useState(false);
  const [showServiceForm, setShowServiceForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [profileForm, setProfileForm] = useState({});
  const [serviceForm, setServiceForm] = useState({ name: '', price: '' });

  useEffect(() => {
    if (!user) return undefined;
    getUserBookings(user.id)
      .then(({ bookings: nextBookings }) => setBookings(nextBookings))
      .catch((requestError) => setError(requestError.message));
    return undefined;
  }, [user]);

  useEffect(() => {
    setProfileForm({
      name: profile?.name || '',
      title: profile?.title || '',
      category: profile?.category || '',
      location: profile?.location || '',
      bio: profile?.bio || '',
    });
  }, [profile]);

  const updateProfileField = (event) => {
    const { name, value } = event.target;
    setProfileForm((current) => ({ ...current, [name]: value }));
  };

  const handleProfileSave = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError('');
    try {
      await saveProfile(user.id, { ...profileForm, display_name: profileForm.name });
      setShowProfileForm(false);
      onShowToast?.('Profile updated successfully.');
      window.location.reload();
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSaving(false);
    }
  };

  const handleServiceSave = async (event) => {
    event.preventDefault();
    if (!serviceForm.name.trim()) return;
    setSaving(true);
    setError('');
    try {
      const services = [...(profile?.services || []), {
        name: serviceForm.name.trim(),
        price: serviceForm.price.trim() || 'Contact for pricing',
      }];
      await saveProfile(user.id, { services });
      setServiceForm({ name: '', price: '' });
      setShowServiceForm(false);
      onShowToast?.('Service added to your profile.');
      window.location.reload();
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSaving(false);
    }
  };

  const profileComplete = ['name', 'title', 'category', 'location', 'bio']
    .filter((field) => profile?.[field]).length;
  const stats = [
    { label: 'Profile status', value: profile?.status || 'DRAFT', detail: 'Synced with Supabase' },
    { label: 'Services', value: profile?.services?.length || 0, detail: 'Published on your profile' },
    { label: 'Bookings', value: bookings.length, detail: 'Requests linked to your account' },
    { label: 'Profile completeness', value: `${profileComplete}/5`, detail: 'Complete your public profile' },
  ];

  return (
    <div className="page-shell">
      <div className="container">
        <div className="page-header dashboard-header">
          <div>
            <span className="eyebrow">Dashboard</span>
            <h1>Welcome back, {profile?.name || 'there'}.</h1>
            <p className="muted-copy muted-copy--left">Your dashboard is connected to your Supabase profile.</p>
          </div>
          <div className="dashboard-actions">
            <Button variant="secondary" onClick={() => setShowProfileForm((visible) => !visible)}>Update profile</Button>
            <Button onClick={() => setShowServiceForm((visible) => !visible)}>Add service</Button>
          </div>
        </div>

        {error ? <p role="alert" className="form-error">{error}</p> : null}

        {showProfileForm ? (
          <form className="info-panel dashboard-editor" onSubmit={handleProfileSave}>
            <h2>Update profile</h2>
            <p className="muted-copy muted-copy--left">These fields are saved to public.profiles.</p>
            <div className="booking-form__grid">
              {['name', 'title', 'category', 'location'].map((field) => (
                <label key={field}>
                  <span>{field[0].toUpperCase() + field.slice(1)}</span>
                  <input name={field} value={profileForm[field] || ''} onChange={updateProfileField} required={field === 'name'} />
                </label>
              ))}
            </div>
            <label><span>Bio</span><textarea name="bio" rows="4" value={profileForm.bio || ''} onChange={updateProfileField} /></label>
            <Button type="submit" disabled={saving}>{saving ? 'Saving...' : 'Save profile'}</Button>
          </form>
        ) : null}

        {showServiceForm ? (
          <form className="info-panel dashboard-editor" onSubmit={handleServiceSave}>
            <h2>Add a service</h2>
            <div className="booking-form__grid">
              <label><span>Service name</span><input value={serviceForm.name} onChange={(event) => setServiceForm({ ...serviceForm, name: event.target.value })} placeholder="Brand photography" required /></label>
              <label><span>Starting price</span><input value={serviceForm.price} onChange={(event) => setServiceForm({ ...serviceForm, price: event.target.value })} placeholder="K2,500" /></label>
            </div>
            <Button type="submit" disabled={saving}>{saving ? 'Saving...' : 'Save service'}</Button>
          </form>
        ) : null}

        <div className="dashboard-grid">
          {stats.map((stat) => <div key={stat.label} className="overview-box"><span>{stat.label}</span><strong>{stat.value}</strong><small>{stat.detail}</small></div>)}
        </div>

        <div className="dashboard-panels">
          <section className="info-panel">
            <h2>Profile checklist</h2>
            <ul className="detail-list">
              <li>{profile?.name ? 'Profile name added' : 'Add your profile name'}</li>
              <li>{profile?.bio ? 'Bio added' : 'Write a short bio'}</li>
              <li>{profile?.services?.length ? `${profile.services.length} service(s) added` : 'Add your first service'}</li>
              <li>{profile?.status === 'ACTIVE' ? 'Profile is public' : 'Profile is currently a draft'}</li>
            </ul>
          </section>
          <section className="info-panel">
            <h2>Your services</h2>
            {profile?.services?.length ? <ul className="detail-list service-list">{profile.services.map((service) => <li key={service.name}><span>{service.name}</span><strong>{service.price}</strong></li>)}</ul> : <p className="muted-copy muted-copy--left">No services yet. Add one to make your profile useful to clients.</p>}
          </section>
        </div>

        <section className="info-panel bookings-panel">
          <div className="panel-headline"><h2>Bookings linked to your account</h2><span className="media-count">{bookings.length}</span></div>
          {bookings.length ? <div className="booking-list">{bookings.map((booking) => <div key={booking.id} className="booking-card"><div><h3>{booking.service_name || 'Service request'}</h3><p>{formatBookingDate(booking.date)} · {booking.status || 'PENDING'}</p></div><strong>{booking.total_minor ? `K${(booking.total_minor / 100).toLocaleString()}` : 'Quote pending'}</strong></div>)}</div> : <div className="empty-state"><p>No booking requests yet.</p></div>}
        </section>
      </div>
    </div>
  );
}
