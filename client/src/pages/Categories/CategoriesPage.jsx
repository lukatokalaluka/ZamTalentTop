import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getProfiles } from '../../services/api';

export default function CategoriesPage() {
  const [profiles, setProfiles] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    getProfiles().then(({ profiles: nextProfiles }) => setProfiles(nextProfiles)).catch((requestError) => setError(requestError.message));
  }, []);

  const categories = [...new Set(profiles.map((profile) => profile.category).filter(Boolean))];

  return (
    <div className="page-shell">
      <div className="container">
        <div className="page-header">
          <div><span className="eyebrow">Categories</span><h1>Explore talent by specialty.</h1></div>
          <p>Categories are created from active Supabase profiles.</p>
        </div>
        {error ? <div className="empty-state"><p>{error}</p></div> : categories.length === 0 ? <div className="empty-state"><h3>No categories yet</h3><p>Publish an active profile to make its category discoverable.</p></div> : (
          <div className="category-grid category-grid--large">
            {categories.map((category) => {
              const count = profiles.filter((profile) => profile.category === category).length;
              return <article key={category} className="category-card category-card--feature"><div><h3>{category}</h3><p>{count} {count === 1 ? 'profile' : 'profiles'}</p></div><Link to={`/discover?category=${encodeURIComponent(category)}`}>Browse talent</Link></article>;
            })}
          </div>
        )}
      </div>
    </div>
  );
}
