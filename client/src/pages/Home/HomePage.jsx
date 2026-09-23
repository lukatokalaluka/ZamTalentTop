import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '../../components/common/Button';
import SectionHeader from '../../components/common/SectionHeader';
import { getProfiles } from '../../services/api';

export default function HomePage({ onShowToast }) {
  const [profiles, setProfiles] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    getProfiles().then(({ profiles: nextProfiles }) => setProfiles(nextProfiles)).catch((requestError) => setError(requestError.message));
  }, []);

  const categories = [...new Set(profiles.map((profile) => profile.category).filter(Boolean))];

  return <>
    <section className="hero-section"><div className="container hero-grid"><div className="hero-copy"><span className="eyebrow">Zambia&apos;s professional network</span><h1>Find the right talent for your next project.</h1><p className="hero-text">Discover active profiles, compare specialties, and connect with professionals whose work fits your needs.</p><div className="hero-actions"><Button to="/discover">Explore talent</Button><Button to="/register" variant="secondary" onClick={() => onShowToast?.('Create your profile')}>Create a profile</Button></div><div className="hero-meta"><span>{profiles.length} active profiles</span><span>{categories.length} specialties</span><span>Supabase-powered discovery</span></div></div><div className="hero-visual" aria-label="Talent discovery"><div className="hero-card hero-card--stat"><span className="hero-badge">Live directory</span><h3>{profiles.length}</h3><p>active profiles from Supabase</p></div><div className="hero-card hero-card--floating"><div className="chip-list">{categories.slice(0, 3).map((category) => <span key={category}>{category}</span>)}</div></div></div></div></section>
    <section className="section"><div className="container"><SectionHeader eyebrow="Browse specialties" title="Explore the categories your community is publishing" description="These categories are derived from active Supabase profiles." />{error ? <div className="empty-state"><p>{error}</p></div> : categories.length === 0 ? <div className="empty-state"><h3>No profiles published yet</h3><p>Once professionals publish active profiles, their specialties will appear here.</p></div> : <div className="category-grid">{categories.slice(0, 6).map((category) => <article key={category} className="category-card"><div><h3>{category}</h3><p>{profiles.filter((profile) => profile.category === category).length} profiles</p></div><Link to={`/discover?category=${encodeURIComponent(category)}`}>Browse</Link></article>)}</div>}</div></section>
    <section className="section section--soft"><div className="container"><SectionHeader eyebrow="Recently published" title="Professionals ready to be discovered" /><div className="talent-grid">{profiles.slice(0, 6).map((profile) => <article key={profile.id} className="profile-card"><div className="profile-card__image-wrap">{profile.image_url ? <img src={profile.image_url} alt={profile.display_name} /> : null}</div><div className="profile-card__body"><div className="profile-card__meta"><span>{profile.category}</span><span>{profile.rating ? `Rating ${profile.rating}` : 'New profile'}</span></div><h3>{profile.display_name}</h3><p className="profile-card__location">{profile.location}</p><p className="profile-card__text">{profile.bio}</p><div className="profile-card__footer"><Link to={`/talent/${profile.slug}`}>View profile</Link></div></div></article>)}</div>{!profiles.length && !error ? <div className="empty-state"><p>Loading profiles...</p></div> : null}</div></section>
    <section className="section cta-panel"><div className="container cta-panel__inner"><div><span className="eyebrow">For professionals</span><h2>Publish your profile and become discoverable.</h2></div><div className="cta-panel__actions"><Button to="/register">Create your profile</Button><Button to="/discover" variant="secondary">Browse talent</Button></div></div></section>
  </>;
}
