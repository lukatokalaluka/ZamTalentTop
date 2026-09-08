import { Link } from 'react-router-dom';
import { categories } from '../../data/mockData';

export default function CategoriesPage() {
  return (
    <div className="page-shell">
      <div className="container">
        <div className="page-header">
          <div>
            <span className="eyebrow">Categories</span>
            <h1>Explore talent by specialty.</h1>
          </div>
          <p>Discover professionals across design, media, development, skilled trades and more.</p>
        </div>

        <div className="category-grid category-grid--large">
          {categories.map((category) => (
            <article key={category.name} className="category-card category-card--feature">
              <span className="category-card__icon">{category.icon}</span>
              <div>
                <h3>{category.name}</h3>
                <p>{category.count} people</p>
              </div>
              <small>{category.description}</small>
              <Link to="/discover">Browse talent</Link>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
