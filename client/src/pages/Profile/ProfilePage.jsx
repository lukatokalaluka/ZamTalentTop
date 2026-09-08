import { useParams } from 'react-router-dom';
import Button from '../../components/common/Button';
import { discoverTalent } from '../../data/mockData';

export default function ProfilePage() {
  const { slug } = useParams();
  const profile = discoverTalent.find((talent) => talent.slug === slug) || discoverTalent[0];
  const portfolioImages = profile.portfolioImages || [
    'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=800&q=80',
  ];

  const services = profile.services || [
    { name: 'Custom Project', price: profile.price },
    { name: 'Consultation', price: 'K1,200' },
    { name: 'Ongoing Support', price: 'K2,800' },
  ];

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
                <Button>Contact</Button>
                <Button variant="secondary">Request service</Button>
                <Button variant="ghost">Book now</Button>
              </div>
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
                <h2>Portfolio</h2>
                <div className="portfolio-grid">
                  {portfolioImages.map((image, index) => (
                    <img key={`${image}-${index}`} src={image} alt={`Portfolio work ${index + 1}`} />
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
                  <li>WhatsApp: {profile.socialLinks?.whatsapp || '+260 977 123 456'}</li>
                  <li>Email: {profile.socialLinks?.email || `hello@${profile.slug}.studio`}</li>
                  <li>Instagram: {profile.socialLinks?.instagram || `@${profile.slug}`}</li>
                </ul>
              </section>
            </aside>
          </div>
        </article>
      </div>
    </div>
  );
}
