import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { featuredTalent, provinceOptions } from '../../data/mockData';

export default function DiscoverPage({ onShowToast }) {
  const [query, setQuery] = useState('');
  const [selectedProvince, setSelectedProvince] = useState('All locations');
  const [sortBy, setSortBy] = useState('top-rated');
  const [showOnlyAvailable, setShowOnlyAvailable] = useState(false);

  const filteredTalent = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    const results = featuredTalent.filter((talent) => {
      const matchesQuery =
        !normalizedQuery ||
        talent.name.toLowerCase().includes(normalizedQuery) ||
        talent.title.toLowerCase().includes(normalizedQuery) ||
        talent.category.toLowerCase().includes(normalizedQuery);

      const matchesLocation =
        selectedProvince === 'All locations' || talent.location === selectedProvince;

      const matchesAvailability = !showOnlyAvailable || talent.availability.includes('Available');

      return matchesQuery && matchesLocation && matchesAvailability;
    });

    switch (sortBy) {
      case 'top-rated':
        return [...results].sort((a, b) => b.rating - a.rating);
      case 'lowest-price':
        return [...results].sort((a, b) => Number.parseInt(a.price.replace(/[^\d]/g, '')) - Number.parseInt(b.price.replace(/[^\d]/g, '')));
      case 'most-reviewed':
        return [...results].sort((a, b) => b.reviews - a.reviews);
      default:
        return results;
    }
  }, [query, selectedProvince, sortBy, showOnlyAvailable]);

  return (
    <div className="page-shell">
      <div className="container">
        <div className="page-header page-header--stacked">
          <div>
            <span className="eyebrow">Discover talent</span>
            <h1>Find the right professional in Zambia.</h1>
          </div>
          <p>Search by skill, category, location and availability.</p>
        </div>

        <section className="filter-panel">
          <div className="filter-row">
            <label className="filter-field filter-field--wide">
              <span>Search</span>
              <input
                type="text"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search by name, skill or category"
              />
            </label>

            <label className="filter-field">
              <span>Location</span>
              <select value={selectedProvince} onChange={(event) => setSelectedProvince(event.target.value)}>
                <option>All locations</option>
                {provinceOptions.map((province) => (
                  <option key={province} value={province}>
                    {province}
                  </option>
                ))}
              </select>
            </label>

            <label className="filter-field">
              <span>Sort by</span>
              <select value={sortBy} onChange={(event) => setSortBy(event.target.value)}>
                <option value="top-rated">Top rated</option>
                <option value="lowest-price">Lowest price</option>
                <option value="most-reviewed">Most reviewed</option>
              </select>
            </label>
          </div>

          <div className="filter-toggle-row">
            <label className="checkbox-row">
              <input
                type="checkbox"
                checked={showOnlyAvailable}
                onChange={(event) => setShowOnlyAvailable(event.target.checked)}
              />
              <span>Only available now</span>
            </label>
            <span className="result-count">{filteredTalent.length} profiles</span>
          </div>
        </section>

        {filteredTalent.length === 0 ? (
          <div className="empty-state">
            <h3>No matches found</h3>
            <p>Try another keyword, location or availability filter.</p>
          </div>
        ) : (
          <div className="discover-grid">
            {filteredTalent.map((talent) => (
              <article key={talent.id} className="profile-card profile-card--compact">
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

                  <div className="profile-card__details">
                    <span>{talent.reviews} reviews</span>
                    <span>{talent.availability}</span>
                  </div>

                  <div className="profile-card__footer profile-card__footer--stacked">
                    <strong>{talent.price}</strong>
                    <div className="profile-card__actions">
                      <Link to={`/talent/${talent.slug}`}>View profile</Link>
                      <button type="button" onClick={() => onShowToast?.(`Starting contact with ${talent.name}`)}>Contact</button>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
