import { useEffect, useState } from 'react';
import { MapContainer, Marker, TileLayer, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import Button from '../../components/common/Button';
import { useAuth } from '../../context/AuthContext';
import { createMarketplaceProduct, getUserBookings, saveProfile, uploadAvatar, uploadMedia } from '../../services/api';

const defaultCenter = [-13.9626, 28.3228];
const provinces = [
  'Central',
  'Copperbelt',
  'Eastern',
  'Luapula',
  'Lusaka',
  'Muchinga',
  'Northern',
  'North-Western',
  'Southern',
  'Western',
];

function LocationPicker({ position, onChange }) {
  useMapEvents({ click: (event) => onChange([event.latlng.lat, event.latlng.lng]) });
  return position ? <Marker position={position} /> : null;
}

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
  const [mediaForm, setMediaForm] = useState({ title: '', description: '', file: null });
  const [packForm, setPackForm] = useState({ name: '', description: '', price: '', file: null });

  useEffect(() => {
    if (!user) return undefined;
    getUserBookings(user.id).then(({ bookings: nextBookings }) => setBookings(nextBookings)).catch((requestError) => setError(requestError.message));
    return undefined;
  }, [user]);

  useEffect(() => {
    setProfileForm({
      legal_name: profile?.legal_name || '', phone: profile?.phone || '', artist_name: profile?.artist_name || '',
      organisation_name: profile?.organisation_name || '', display_preference: profile?.display_preference || 'legal_name',
      title: profile?.title || '', category: profile?.category || '', province: profile?.province || '', town: profile?.town || '',
      bio: profile?.bio || '', latitude: profile?.latitude || defaultCenter[0], longitude: profile?.longitude || defaultCenter[1],
      avatar_url: profile?.avatar_url || profile?.image_url || '',
    });
  }, [profile]);

  const updateProfileField = (event) => {
    const { name, value } = event.target;
    setProfileForm((current) => ({ ...current, [name]: value }));
  };

  const handleAvatarChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setSaving(true);
    setError('');
    try {
      const avatarUrl = await uploadAvatar(user.id, file);
      setProfileForm((current) => ({ ...current, avatar_url: avatarUrl }));
      onShowToast?.('Avatar uploaded. Save your profile to publish it.');
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSaving(false);
    }
  };

  const handleProfileSave = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError('');
    const displayName = profileForm.display_preference === 'artist_name' ? profileForm.artist_name
      : profileForm.display_preference === 'organisation_name' ? profileForm.organisation_name
        : profileForm.display_preference === 'both' ? [profileForm.legal_name, profileForm.artist_name || profileForm.organisation_name].filter(Boolean).join(' · ')
          : profileForm.legal_name;
    try {
      await saveProfile(user.id, { ...profileForm, name: displayName || profileForm.legal_name, display_name: displayName || profileForm.legal_name, image_url: profileForm.avatar_url || '', location: [profileForm.town, profileForm.province].filter(Boolean).join(', ') });
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
      await saveProfile(user.id, { services: [...(profile?.services || []), { name: serviceForm.name.trim(), price: serviceForm.price.trim() || 'Contact for pricing' }] });
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

  const handlePortfolioUpload = async (event) => {
    event.preventDefault();
    if (!mediaForm.file) return;
    setSaving(true);
    setError('');
    try {
      const url = await uploadMedia(user.id, mediaForm.file);
      const type = mediaForm.file.type.startsWith('image/') ? 'image' : mediaForm.file.type.startsWith('audio/') ? 'audio' : 'video';
      await saveProfile(user.id, { portfolio_media: [...(profile?.portfolio_media || profile?.portfolioMedia || []), { id: crypto.randomUUID(), type, url, title: mediaForm.title || mediaForm.file.name, description: mediaForm.description, access: 'public' }] });
      setMediaForm({ title: '', description: '', file: null });
      onShowToast?.('Gallery media uploaded.');
      window.location.reload();
    } catch (requestError) { setError(requestError.message); } finally { setSaving(false); }
  };

  const handlePackUpload = async (event) => {
    event.preventDefault();
    if (!packForm.file || !packForm.name.trim()) return;
    setSaving(true);
    setError('');
    try {
      const previewUrl = await uploadMedia(user.id, packForm.file, 'previews');
      await createMarketplaceProduct({ seller_id: user.id, name: packForm.name.trim(), description: packForm.description, category: 'Sample pack / beat', price_minor: Math.round(Number(packForm.price || 0) * 100), preview_url: previewUrl, media_type: packForm.file.type.startsWith('audio/') ? 'audio' : 'video', status: 'PUBLISHED' });
      setPackForm({ name: '', description: '', price: '', file: null });
      onShowToast?.('Sample pack or beat published with a preview.');
    } catch (requestError) { setError(requestError.message); } finally { setSaving(false); }
  };

  const profileComplete = ['legal_name', 'phone', 'province', 'town', 'bio'].filter((field) => profile?.[field]).length;
  const stats = [
    { label: 'Profile status', value: profile?.status || 'DRAFT', detail: 'Synced with Supabase' },
    { label: 'Services', value: profile?.services?.length || 0, detail: 'Published on your profile' },
    { label: 'Bookings', value: bookings.length, detail: 'Requests linked to your account' },
    { label: 'Profile completeness', value: `${profileComplete}/5`, detail: 'Complete your public profile' },
  ];
  const position = [Number(profileForm.latitude), Number(profileForm.longitude)];

  return (
    <div className="page-shell"><div className="container">
      <div className="page-header dashboard-header"><div><span className="eyebrow">Dashboard</span><h1>Welcome back, {profile?.name || 'there'}.</h1><p className="muted-copy muted-copy--left">Your profile is connected to Supabase.</p></div><div className="dashboard-actions"><Button variant="secondary" onClick={() => setShowProfileForm((visible) => !visible)}>Update profile</Button><Button onClick={() => setShowServiceForm((visible) => !visible)}>Add service</Button></div></div>
      {error ? <p role="alert" className="form-error">{error}</p> : null}
      {showProfileForm ? <form className="info-panel dashboard-editor" onSubmit={handleProfileSave}>
        <h2>Update profile</h2><p className="muted-copy muted-copy--left">Your legal name stays private to your account. Choose what clients see publicly.</p>
        <div className="avatar-editor">{profileForm.avatar_url ? <img src={profileForm.avatar_url} alt="Profile avatar preview" /> : <div className="avatar-placeholder" aria-hidden="true">{(profileForm.legal_name || '?').slice(0, 1).toUpperCase()}</div>}<label className="btn btn--secondary btn--md">Choose avatar<input type="file" accept="image/png,image/jpeg,image/webp" onChange={handleAvatarChange} hidden /></label></div>
        <div className="booking-form__grid"><label><span>Full legal name</span><input name="legal_name" value={profileForm.legal_name || ''} onChange={updateProfileField} required /></label><label><span>Valid phone number</span><input type="tel" name="phone" value={profileForm.phone || ''} onChange={updateProfileField} required placeholder="+260 97 123 4567" /></label><label><span>Artist name (optional)</span><input name="artist_name" value={profileForm.artist_name || ''} onChange={updateProfileField} /></label><label><span>Brand / organisation (optional)</span><input name="organisation_name" value={profileForm.organisation_name || ''} onChange={updateProfileField} /></label><label><span>Public display name</span><select name="display_preference" value={profileForm.display_preference || 'legal_name'} onChange={updateProfileField}><option value="legal_name">Full legal name</option><option value="artist_name" disabled={!profileForm.artist_name}>Artist name</option><option value="organisation_name" disabled={!profileForm.organisation_name}>Brand or organisation</option><option value="both" disabled={!profileForm.artist_name && !profileForm.organisation_name}>Both</option></select></label><label><span>Professional title</span><input name="title" value={profileForm.title || ''} onChange={updateProfileField} /></label><label><span>Category</span><input name="category" value={profileForm.category || ''} onChange={updateProfileField} /></label><label><span>Province</span><select name="province" value={profileForm.province || ''} onChange={updateProfileField} required><option value="">Select your province</option>{provinces.map((province) => <option key={province} value={province}>{province}</option>)}</select></label><label><span>Town / city</span><input name="town" value={profileForm.town || ''} onChange={updateProfileField} required placeholder="Enter your town or city" /></label></div>
        <label><span>Bio</span><textarea name="bio" rows="4" value={profileForm.bio || ''} onChange={updateProfileField} /></label>
        <div><span className="field-label">Pin your location on the map</span><MapContainer center={position[0] && position[1] ? position : defaultCenter} zoom={position[0] && position[1] ? 12 : 6} className="profile-map"><TileLayer attribution="&copy; OpenStreetMap contributors" url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" /><LocationPicker position={position[0] && position[1] ? position : null} onChange={([latitude, longitude]) => setProfileForm((current) => ({ ...current, latitude, longitude }))} /></MapContainer></div>
        <Button type="submit" disabled={saving}>{saving ? 'Saving...' : 'Save profile'}</Button>
      </form> : null}
      {showServiceForm ? <form className="info-panel dashboard-editor" onSubmit={handleServiceSave}><h2>Add a service</h2><div className="booking-form__grid"><label><span>Service name</span><input value={serviceForm.name} onChange={(event) => setServiceForm({ ...serviceForm, name: event.target.value })} required /></label><label><span>Starting price</span><input value={serviceForm.price} onChange={(event) => setServiceForm({ ...serviceForm, price: event.target.value })} placeholder="K2,500" /></label></div><Button type="submit" disabled={saving}>{saving ? 'Saving...' : 'Save service'}</Button></form> : null}
      <div className="dashboard-panels media-upload-panels"><form className="info-panel dashboard-editor" onSubmit={handlePortfolioUpload}><h2>Creator gallery</h2><p className="muted-copy muted-copy--left">Upload images, audio, or video for your public advertising gallery.</p><input type="text" placeholder="Media title" value={mediaForm.title} onChange={(event) => setMediaForm({ ...mediaForm, title: event.target.value })} /><textarea rows="3" placeholder="Short description" value={mediaForm.description} onChange={(event) => setMediaForm({ ...mediaForm, description: event.target.value })} /><input type="file" accept="image/*,audio/*,video/*" onChange={(event) => setMediaForm({ ...mediaForm, file: event.target.files?.[0] || null })} required /><Button type="submit" disabled={saving}>{saving ? 'Uploading...' : 'Add to gallery'}</Button></form><form className="info-panel dashboard-editor" onSubmit={handlePackUpload}><h2>Sample packs and beats</h2><p className="muted-copy muted-copy--left">Publish an audio preview so clients can listen before buying.</p><input type="text" placeholder="Pack or beat name" value={packForm.name} onChange={(event) => setPackForm({ ...packForm, name: event.target.value })} required /><textarea rows="3" placeholder="Description" value={packForm.description} onChange={(event) => setPackForm({ ...packForm, description: event.target.value })} /><input type="number" min="0" step="0.01" placeholder="Price in K" value={packForm.price} onChange={(event) => setPackForm({ ...packForm, price: event.target.value })} /><input type="file" accept="audio/*,video/*" onChange={(event) => setPackForm({ ...packForm, file: event.target.files?.[0] || null })} required /><Button type="submit" disabled={saving}>{saving ? 'Publishing...' : 'Publish preview'}</Button></form></div>
      <div className="dashboard-grid">{stats.map((stat) => <div key={stat.label} className="overview-box"><span>{stat.label}</span><strong>{stat.value}</strong><small>{stat.detail}</small></div>)}</div>
      <div className="dashboard-panels"><section className="info-panel"><h2>Profile checklist</h2><ul className="detail-list"><li>{profile?.legal_name ? 'Legal name added' : 'Add your legal name'}</li><li>{profile?.phone ? 'Phone number added' : 'Add a valid phone number'}</li><li>{profile?.province && profile?.town ? 'Location added' : 'Add province and town'}</li><li>{profile?.avatar_url || profile?.image_url ? 'Avatar added' : 'Add an avatar'}</li></ul></section><section className="info-panel"><h2>Your services</h2>{profile?.services?.length ? <ul className="detail-list service-list">{profile.services.map((service) => <li key={service.name}><span>{service.name}</span><strong>{service.price}</strong></li>)}</ul> : <p className="muted-copy muted-copy--left">No services yet. Add one to make your profile useful to clients.</p>}</section></div>
      <section className="info-panel bookings-panel"><div className="panel-headline"><h2>Bookings linked to your account</h2><span className="media-count">{bookings.length}</span></div>{bookings.length ? <div className="booking-list">{bookings.map((booking) => <div key={booking.id} className="booking-card"><div><h3>{booking.service_name || 'Service request'}</h3><p>{formatBookingDate(booking.date)} · {booking.status || 'PENDING'}</p></div><strong>{booking.total_minor ? `K${(booking.total_minor / 100).toLocaleString()}` : 'Quote pending'}</strong></div>)}</div> : <div className="empty-state"><p>No booking requests yet.</p></div>}</section>
    </div></div>
  );
}
