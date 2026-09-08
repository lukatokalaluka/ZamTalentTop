import { Link } from 'react-router-dom';
import Button from '../../components/common/Button';
import SectionHeader from '../../components/common/SectionHeader';
import {
  categories,
  featuredServices,
  featuredTalent,
  successStories,
  trendingProfessionals,
} from '../../data/mockData';

const stats = [
  { label: 'Verified professionals', value: '3,200+' },
  { label: 'Businesses connected', value: '1,800+' },
  { label: 'Profiles viewed', value: '120K+' },
  { label: 'Projects booked', value: '8,400+' },
];

const processSteps = [
  { title: 'Create your profile', text: 'Set up your bio, services, skills and portfolio in minutes.' },
  { title: 'Showcase your skills', text: 'Highlight your craft with projects, pricing and availability.' },
  { title: 'Get discovered', text: 'Appear in search and category results for clients across Zambia.' },
  { title: 'Connect with customers', text: 'Message, book and grow a loyal client base from one place.' },
];

export default function HomePage({ onShowToast }) {
  return (
    <>
      <section className="hero-section">
        <div className="container hero-grid">
          <div className="hero-copy">
            <span className="eyebrow">Built for Zambia&apos;s creative economy</span>
            <h1>Discover Zambia&apos;s Talent.</h1>
            <p className="hero-text">
              Find talented people, creative professionals and skilled businesses across Zambia.
            </p>

            <div className="hero-actions">
              <Button to="/discover" onClick={() => onShowToast?.('Explore Zambia&apos;s top creatives')}>Explore Talent</Button>
              <Button to="/register" variant="secondary" onClick={() => onShowToast?.('Start building your talent profile')}>Join Zam Talent Top</Button>
            </div>

            <div className="search-ui">
              <div className="search-ui__field width-strong">
                <label htmlFor="hero-search">What are you looking for?</label>
                <input id="hero-search" type="text" placeholder="Photographer, DJ, Web Developer..." />
              </div>
              <div className="search-ui__field">
                <label htmlFor="location-search">Location</label>
                <select id="location-search" defaultValue="Lusaka">
                  <option>Lusaka</option>
                  <option>Copperbelt</option>
                  <option>Central</option>
                  <option>Eastern</option>
                  <option>Luapula</option>
                  <option>Muchinga</option>
                  <option>Northern</option>
                  <option>North-Western</option>
                  <option>Southern</option>
                  <option>Western</option>
                </select>
              </div>
              <Button to="/discover" className="search-button" onClick={() => onShowToast?.('Search is ready for local talent discovery')}>
                Search
              </Button>
            </div>

            <div className="hero-meta">
              <span>Trusted by 1,800+ businesses</span>
              <span>Fast, local discovery</span>
              <span>Mobile-first experience</span>
            </div>
          </div>

          <div className="hero-visual" aria-label="Featured talent preview">
            <div className="hero-card hero-card--primary">
              <div className="mini-avatar-row">
                <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80" alt="Featured professional" />
                <div>
                  <strong>John Doe</strong>
                  <span>Photographer</span>
                </div>
              </div>
              <div className="mini-meter">
                <span>4.9 rating</span>
                <div className="meter-bar"><span /></div>
              </div>
            </div>

            <div className="hero-card hero-card--stat">
              <span className="hero-badge">Verified</span>
              <h3>2,400+</h3>
              <p>Profiles ready to connect</p>
            </div>

            <div className="hero-card hero-card--floating">
              <div className="chip-list">
                <span>Photographer</span>
                <span>DJ</span>
                <span>Developer</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <SectionHeader
            eyebrow="Popular categories"
            title="Explore Zambia's active talent sectors"
            description="From creative studios to skilled trades, discover the professionals businesses trust most."
          />

          <div className="category-grid">
            {categories.slice(0, 6).map((category) => (
              <article key={category.name} className="category-card">
                <span className="category-card__icon">{category.icon}</span>
                <div>
                  <h3>{category.name}</h3>
                  <p>{category.count} profiles</p>
                </div>
                <small>{category.description}</small>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--soft">
        <div className="container">
          <SectionHeader
            eyebrow="Featured talent"
            title="Top professionals ready to work"
            description="Browse standout creatives and skilled specialists from across Zambia."
          />

          <div className="talent-grid">
            {featuredTalent.map((talent) => (
              <article key={talent.id} className="profile-card">
                <div className="profile-card__image-wrap">
                  <img src={talent.image} alt={talent.name} />
                  {talent.verified ? <span className="verify-badge">Verified</span> : null}
                </div>

                <div className="profile-card__body">
                  <div className="profile-card__meta">
                    <span>{talent.category}</span>
                    <span>⭐ {talent.rating}</span>
                  </div>
                  <h3>{talent.name}</h3>
                  <p className="profile-card__title">{talent.title}</p>
                  <p className="profile-card__location">📍 {talent.location}</p>
                  <p className="profile-card__text">{talent.description}</p>

                  <div className="profile-card__footer">
                    <div>
                      <strong>{talent.price}</strong>
                      <span>Starting price</span>
                    </div>
                    <div className="profile-card__actions">
                      <Link to={`/talent/${talent.slug}`}>View profile</Link>
                      <button type="button" onClick={() => onShowToast?.(`Contacting ${talent.name}`)}>Contact</button>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <SectionHeader
            eyebrow="Trending professionals"
            title="What people are discovering right now"
            description="The most in-demand and highly engaged profiles across the platform."
          />

          <div className="trending-grid">
            {trendingProfessionals.map((person) => (
              <article key={person.name} className="mini-profile-card">
                <div className="mini-profile-card__avatar">
                  {person.name.split(' ').map((part) => part[0]).slice(0, 2).join('')}
                </div>
                <div>
                  <h3>{person.name}</h3>
                  <p>{person.title}</p>
                  <small>{person.location}</small>
                </div>
                <span className="trend-score">{person.score}%</span>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--soft">
        <div className="container">
          <SectionHeader
            eyebrow="How it works"
            title="Go from profile to booked client in four simple steps"
          />

          <div className="steps-grid">
            {processSteps.map((step, index) => (
              <article key={step.title} className="step-card">
                <span className="step-number">0{index + 1}</span>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <SectionHeader
            eyebrow="Featured services"
            title="Popular service packages businesses book"
          />
          <div className="service-grid">
            {featuredServices.map((service) => (
              <article key={service.name} className="service-card">
                <img src={service.image} alt={service.name} />
                <div className="service-card__body">
                  <span>{service.category}</span>
                  <h3>{service.name}</h3>
                  <div className="service-card__footer">
                    <strong>{service.price}</strong>
                    <button type="button" onClick={() => onShowToast?.('Service inquiry sent')}>Get quote</button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--soft">
        <div className="container">
          <SectionHeader
            eyebrow="Success stories"
            title="Trusted by local businesses and creatives"
          />
          <div className="stories-grid">
            {successStories.map((story) => (
              <article key={story.name} className="story-card">
                <p>“{story.quote}”</p>
                <div>
                  <strong>{story.name}</strong>
                  <span>{story.business}</span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="stats-row">
            {stats.map((stat) => (
              <div key={stat.label} className="stat-box">
                <strong>{stat.value}</strong>
                <span>{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section cta-panel">
        <div className="container cta-panel__inner">
          <div>
            <span className="eyebrow">Why Zam Talent Top?</span>
            <h2>Build visibility. Get booked. Grow your network.</h2>
          </div>
          <div className="cta-panel__actions">
            <Button to="/register" onClick={() => onShowToast?.('Your profile launch starts here')}>Create your profile</Button>
            <Button to="/discover" variant="secondary" onClick={() => onShowToast?.('Discover talented professionals now')}>Browse talent</Button>
          </div>
        </div>
      </section>
    </>
  );
}
