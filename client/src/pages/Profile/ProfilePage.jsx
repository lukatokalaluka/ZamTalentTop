import { useEffect, useMemo, useState } from 'react';
import Button from '../../components/common/Button';
import { useParams } from 'react-router-dom';
import { isSafeExternalUrl } from '../../utils/media';
import { getProfile } from '../../services/api';

const allowedMediaTypes = new Set(['image', 'audio', 'video', 'external']);

function normalizeMedia(item, index) {
  const media = typeof item === 'string' ? { type: 'image', url: item } : item;
  const type = allowedMediaTypes.has(media.type) ? media.type : 'external';

  return {
    id: media.id || `${media.url}-${index}`,
    type,
    url: media.url,
    title: media.title || `Portfolio work ${index + 1}`,
    description: media.description || '',
    access: media.access || 'public',
  };
}

function MediaPreview({ media, onClose }) {
  if (!media || !isSafeExternalUrl(media.url)) return null;

  return (
    <div className="media-modal-backdrop" role="presentation" onClick={onClose}>
      <section
        className="media-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="media-preview-title"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="media-modal__header">
          <div>
            <span className="eyebrow">Media preview</span>
            <h2 id="media-preview-title">{media.title}</h2>
          </div>
          <button type="button" className="modal-close" aria-label="Close media preview" onClick={onClose}>×</button>
        </div>
        <div className="media-modal__content">
          {media.type === 'image' ? <img src={media.url} alt={media.title} /> : null}
          {media.type === 'audio' ? <audio controls preload="metadata" src={media.url}>Your browser does not support audio playback.</audio> : null}
          {media.type === 'video' ? <video controls preload="metadata" src={media.url}>Your browser does not support video playback.</video> : null}
          {media.type === 'external' ? (
            <div className="media-external-preview">
              <p>This file is hosted externally to keep downloads fast and storage costs sensible.</p>
              <a className="btn btn--primary btn--md" href={media.url} target="_blank" rel="noreferrer">
                Open external file
              </a>
            </div>
          ) : null}
        </div>
        {media.description ? <p className="media-modal__description">{media.description}</p> : null}
      </section>
    </div>
  );
}

export default function ProfilePage() {
  const { slug } = useParams();
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState('');
  useEffect(() => {
    getProfile(slug).then(({ profile: nextProfile }) => setProfile(nextProfile)).catch((requestError) => setError(requestError.message));
  }, [slug]);
  const portfolioMedia = useMemo(() => (profile?.portfolioMedia || profile?.portfolioImages || []).map(normalizeMedia).filter((media) => isSafeExternalUrl(media.url)), [profile]);
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [shareMessage, setShareMessage] = useState('');

  const services = profile?.services || [
    { name: 'Custom Project', price: profile?.price || 'Contact for pricing' },
    { name: 'Consultation', price: 'K1,200' },
    { name: 'Ongoing Support', price: 'K2,800' },
  ];

  const profileUrl = `${window.location.origin}/talent/${profile?.slug || slug}`;

  useEffect(() => {
    if (!profile) return undefined;
    const description = profile.bio || profile.description;
    document.title = `${profile.name} | ${profile.title} | Zam Talent Top`;

    const metadata = [
      ['description', description],
      ['og:title', `${profile.name} - ${profile.title}`],
      ['og:description', description],
      ['og:type', 'profile'],
      ['og:image', profile.image],
      ['og:url', profileUrl],
      ['twitter:card', 'summary_large_image'],
    ];

    const createdTags = [];
    metadata.forEach(([name, content]) => {
      const attribute = name.startsWith('og:') ? 'property' : 'name';
      let tag = document.head.querySelector(`meta[${attribute}="${name}"]`);
      if (!tag) {
        tag = document.createElement('meta');
        tag.setAttribute(attribute, name);
        document.head.appendChild(tag);
        createdTags.push(tag);
      }
      tag.setAttribute('content', content);
    });

    return () => {
      document.title = 'Zam Talent Top';
      createdTags.forEach((tag) => tag.remove());
    };
  }, [profile, profileUrl]);

  if (error) return <div className="page-shell"><div className="container empty-state"><h1>Profile unavailable</h1><p>{error}</p></div></div>;
  if (!profile) return <div className="page-shell"><div className="container empty-state"><p>Loading profile...</p></div></div>;

  const handleShare = async () => {
    const shareData = {
      title: `${profile.name} on Zam Talent Top`,
      text: `View ${profile.name}, ${profile.title}, on Zam Talent Top.`,
      url: profileUrl,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
        return;
      }
      await navigator.clipboard?.writeText(profileUrl);
      setShareMessage('Profile link copied. You can paste it anywhere.');
    } catch {
      setShareMessage('Sharing was cancelled. You can copy the page URL from your browser.');
    }
  };

  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(`View ${profile.name} on Zam Talent Top: ${profileUrl}`)}`;

  return (
    <div className="page-shell">
      <div className="container">
        <article className="profile-shell">
          <div className="profile-cover" style={{ backgroundImage: `url(${profile.cover})` }} />

          <div className="profile-header">
            <img src={profile.image} alt={profile.name} className="profile-avatar" />
            <div className="profile-header__content">
              <div className="profile-header__topline">
                <div>
                  <span className="eyebrow">{profile.category}</span>
                  <h1>{profile.name}</h1>
                </div>
                {profile.verified ? <span className="verify-badge">Verified profile</span> : null}
              </div>
              <p className="profile-title">{profile.title}</p>
              <p className="profile-location">📍 {profile.location}</p>
              <div className="profile-actions">
                <Button to={`/booking/${profile.slug}`}>Contact</Button>
                <Button variant="secondary" to={`/booking/${profile.slug}`}>Request service</Button>
                <Button variant="ghost" to={`/booking/${profile.slug}`}>Book now</Button>
                <button type="button" className="share-button" onClick={handleShare}>Share profile</button>
                <a className="share-button" href={whatsappUrl} target="_blank" rel="noreferrer">Share on WhatsApp</a>
              </div>
              {shareMessage ? <p className="share-message" role="status">{shareMessage}</p> : null}
            </div>
          </div>

          <div className="profile-layout">
            <div className="profile-main">
              <section className="info-panel">
                <h2>About</h2>
                <p>{profile.bio || profile.description}</p>
              </section>

              <section className="info-panel">
                <h2>Skills</h2>
                <div className="tag-list">
                  {profile.skills.map((skill) => (
                    <span key={skill} className="tag-item">{skill}</span>
                  ))}
                </div>
              </section>

              <section className="info-panel">
                <div className="section-heading-row">
                  <div>
                    <h2>Portfolio and media</h2>
                    <p className="muted-copy muted-copy--left">Preview images, audio and video here. Larger files can stay on approved external storage.</p>
                  </div>
                  <span className="media-count">{portfolioMedia.length} items</span>
                </div>
                <div className="portfolio-grid">
                  {portfolioMedia.map((media) => (
                    <button key={media.id} type="button" className="portfolio-item" onClick={() => setSelectedMedia(media)}>
                      {media.type === 'image' ? <img src={media.url} alt={media.title} /> : null}
                      {media.type === 'audio' ? <span className="media-type-label">Audio: {media.title}</span> : null}
                      {media.type === 'video' ? <span className="media-type-label">Video: {media.title}</span> : null}
                      {media.type === 'external' ? <span className="media-type-label">External file: {media.title}</span> : null}
                      <span className="media-access-label">{media.access === 'purchase' ? 'Available after purchase' : 'Public preview'}</span>
                    </button>
                  ))}
                </div>
              </section>

              <section className="info-panel">
                <h2>Reviews</h2>
                <div className="reviews-grid">
                  {(profile.testimonials || profile.reviewList || [
                    { author: 'Client', text: 'Very professional and easy to work with.' },
                    { author: 'Client', text: 'High-quality work and excellent communication.' },
                  ]).map((review) => (
                    <blockquote key={review.author} className="review-card">
                      <p>“{review.text}”</p>
                      <footer>{review.author}</footer>
                    </blockquote>
                  ))}
                </div>
              </section>
            </div>

            <aside className="profile-sidebar">
              <section className="info-panel profile-summary">
                <div className="summary-stat-grid">
                  <div>
                    <strong>{profile.rating}</strong>
                    <span>Rating</span>
                  </div>
                  <div>
                    <strong>{profile.reviews}</strong>
                    <span>Reviews</span>
                  </div>
                  <div>
                    <strong>{profile.stats?.projects || '200+'}</strong>
                    <span>Projects</span>
                  </div>
                  <div>
                    <strong>{profile.stats?.response || '1h'}</strong>
                    <span>Response</span>
                  </div>
                </div>
              </section>

              <section className="info-panel">
                <h2>Services</h2>
                <ul className="detail-list service-list">
                  {services.map((service) => (
                    <li key={service.name}>
                      <span>{service.name}</span>
                      <strong>{service.price}</strong>
                    </li>
                  ))}
                </ul>
              </section>

              <section className="info-panel">
                <h2>Pricing</h2>
                <p className="price-panel">{profile.pricing || `Starting at ${profile.price}`}</p>
              </section>

              <section className="info-panel">
                <h2>Availability</h2>
                <p>{profile.availability}</p>
              </section>

              <section className="info-panel">
                <h2>Contact</h2>
                <ul className="detail-list">
                  <li>WhatsApp: {profile.socialLinks?.whatsapp || '+260 763 464 067'}</li>
                  <li>Call: {profile.socialLinks?.phone || '+260 972 941 849'}</li>
                  <li>Email: {profile.socialLinks?.email || 'lukatokalaluka@gmail.com'}</li>
                  <li>Instagram: {profile.socialLinks?.instagram || `@${profile.slug}`}</li>
                </ul>
              </section>
            </aside>
          </div>
        </article>
      </div>
      <MediaPreview media={selectedMedia} onClose={() => setSelectedMedia(null)} />
    </div>
  );
}
