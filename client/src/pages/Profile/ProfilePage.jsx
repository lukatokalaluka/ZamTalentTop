import { useParams } from 'react-router-dom';
import Button from '../../components/common/Button';
import { featuredTalent } from '../../data/mockData';

export default function ProfilePage() {
  const { slug } = useParams();
  const profile = featuredTalent.find((talent) => talent.slug === slug) || featuredTalent[0];

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
                <p>{profile.description}</p>
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
                  {[1, 2, 3, 4].map((item) => (
                    <img
                      key={item}
                      src={`https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=800&q=80`}
                      alt="Portfolio project"
                    />
                  ))}
                </div>
              </section>
            </div>

            <aside className="profile-sidebar">
              <section className="info-panel">
                <h2>Services</h2>
                <ul className="detail-list">
                  <li>Brand and portrait photography</li>
                  <li>Commercial sessions</li>
                  <li>Editing and retouching</li>
                </ul>
              </section>

              <section className="info-panel">
                <h2>Pricing</h2>
                <p className="price-panel">Starting at {profile.price}</p>
              </section>

              <section className="info-panel">
                <h2>Availability</h2>
                <p>{profile.availability}</p>
              </section>

              <section className="info-panel">
                <h2>Contact</h2>
                <ul className="detail-list">
                  <li>WhatsApp: +260 977 123 456</li>
                  <li>Email: hello@{profile.slug}.studio</li>
                  <li>Instagram: @{profile.slug}</li>
                </ul>
              </section>
            </aside>
          </div>
        </article>
      </div>
    </div>
  );
}
