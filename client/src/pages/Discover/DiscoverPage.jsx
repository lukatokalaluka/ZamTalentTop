import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { categories, discoverTalent, provinceOptions } from '../../data/mockData';

const pageSize = 6;

export default function DiscoverPage({ onShowToast }) {
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All categories');
  const [selectedProvince, setSelectedProvince] = useState('All locations');
  const [minRating, setMinRating] = useState('0');
  const [sortBy, setSortBy] = useState('top-rated');
  const [showOnlyAvailable, setShowOnlyAvailable] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const categoryOptions = ['All categories', ...categories.map((category) => category.name)];

  const handleSearchChange = (value) => {
    setQuery(value);
    setCurrentPage(1);
  };

  const handleCategoryChange = (value) => {
    setSelectedCategory(value);
    setCurrentPage(1);
  };

  const handleProvinceChange = (value) => {
    setSelectedProvince(value);
    setCurrentPage(1);
  };

  const handleRatingChange = (value) => {
    setMinRating(value);
    setCurrentPage(1);
  };

  const handleSortChange = (value) => {
    setSortBy(value);
    setCurrentPage(1);
  };

  const filteredTalent = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    const results = discoverTalent.filter((talent) => {
      const matchesQuery =
        !normalizedQuery ||
        talent.name.toLowerCase().includes(normalizedQuery) ||
        talent.title.toLowerCase().includes(normalizedQuery) ||
        talent.category.toLowerCase().includes(normalizedQuery) ||
        talent.skills.some((skill) => skill.toLowerCase().includes(normalizedQuery));

      const matchesCategory =
        selectedCategory === 'All categories' || talent.category === selectedCategory;

      const matchesLocation =
        selectedProvince === 'All locations' || talent.location === selectedProvince;

      const matchesRating = Number(talent.rating) >= Number(minRating);

      const matchesAvailability =
        !showOnlyAvailable || talent.availability.toLowerCase().includes('available');

      return matchesQuery && matchesCategory && matchesLocation && matchesRating && matchesAvailability;
    });

    switch (sortBy) {
      case 'top-rated':
        return [...results].sort((a, b) => b.rating - a.rating);
      case 'low-price':
        return [...results].sort((a, b) => Number.parseInt(a.price.replace(/[^\d]/g, '')) - Number.parseInt(b.price.replace(/[^\d]/g, '')));
      case 'most-reviewed':
        return [...results].sort((a, b) => b.reviews - a.reviews);
      default:
        return results;
    }
  }, [query, selectedCategory, selectedProvince, minRating, sortBy, showOnlyAvailable]);

  const totalPages = Math.max(1, Math.ceil(filteredTalent.length / pageSize));
  const paginatedTalent = filteredTalent.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  return (
    <div className="page-shell">
      <div className="container">
        <div className="page-header page-header--stacked">
          <div>
            <span className="eyebrow">Discover talent</span>
            <h1>Find the right professional in Zambia.</h1>
          </div>
          <p>Search by skill, category, location, rating and availability.</p>
        </div>

        <section className="filter-panel">
          <div className="discover-summary">
            <div className="summary-pill">
              <strong>{discoverTalent.length}</strong>
              <span>Profiles</span>
            </div>
            <div className="summary-pill">
              <strong>{new Set(discoverTalent.map((talent) => talent.location)).size}</strong>
              <span>Locations</span>
            </div>
            <div className="summary-pill">
              <strong>4.8</strong>
              <span>Average rating</span>
            </div>
          </div>

          <div className="filter-row">
            <label className="filter-field filter-field--wide">
              <span>Search</span>
              <input
                type="text"
                value={query}
                onChange={(event) => handleSearchChange(event.target.value)}
                placeholder="Search talent, skills or category"
              />
            </label>

            <label className="filter-field">
              <span>Category</span>
              <select value={selectedCategory} onChange={(event) => handleCategoryChange(event.target.value)}>
                {categoryOptions.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </label>

            <label className="filter-field">
              <span>Location</span>
              <select value={selectedProvince} onChange={(event) => handleProvinceChange(event.target.value)}>
                <option>All locations</option>
                {provinceOptions.map((province) => (
                  <option key={province} value={province}>
                    {province}
                  </option>
                ))}
              </select>
            </label>

            <label className="filter-field">
              <span>Rating</span>
              <select value={minRating} onChange={(event) => handleRatingChange(event.target.value)}>
                <option value="0">Any rating</option>
                <option value="4.5">4.5+</option>
                <option value="4.7">4.7+</option>
                <option value="4.9">4.9+</option>
              </select>
            </label>

            <label className="filter-field">
              <span>Sort by</span>
              <select value={sortBy} onChange={(event) => handleSortChange(event.target.value)}>
                <option value="top-rated">Top rated</option>
                <option value="low-price">Lowest price</option>
                <option value="most-reviewed">Most reviewed</option>
              </select>
            </label>
          </div>

          <div className="filter-toggle-row">
            <label className="checkbox-row">
              <input
                type="checkbox"
                checked={showOnlyAvailable}
                onChange={(event) => {
                  setShowOnlyAvailable(event.target.checked);
                  setCurrentPage(1);
                }}
              />
              <span>Only available now</span>
            </label>
            <span className="result-count">
              {filteredTalent.length} profiles · Page {currentPage} of {totalPages}
            </span>
          </div>
        </section>

        <div className="category-filters">
          {categoryOptions.map((category) => (
            <button
              key={category}
              type="button"
              className={selectedCategory === category ? 'filter-chip filter-chip--active' : 'filter-chip'}
              onClick={() => handleCategoryChange(category)}
            >
              {category}
            </button>
          ))}
        </div>

        {filteredTalent.length === 0 ? (
          <div className="empty-state">
            <h3>No matches found</h3>
            <p>Try another keyword, location or availability filter.</p>
          </div>
        ) : (
          <>
            <div className="discover-grid">
              {paginatedTalent.map((talent) => (
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

            <div className="pagination" aria-label="Pagination navigation">
              <button
                type="button"
                onClick={() => setCurrentPage((previous) => Math.max(previous - 1, 1))}
                disabled={currentPage === 1}
              >
                Previous
              </button>
              <span>{currentPage} / {totalPages}</span>
              <button
                type="button"
                onClick={() => setCurrentPage((previous) => Math.min(previous + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
