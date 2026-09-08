import { marketplaceProducts } from '../../data/mockData';

export default function MarketplacePage() {
  return (
    <div className="page-shell">
      <div className="container">
        <div className="page-header">
          <div>
            <span className="eyebrow">Marketplace</span>
            <h1>Digital products built for creative growth.</h1>
          </div>
          <p>Discover tools, templates, packs and educational resources from Zambia&apos;s creators.</p>
        </div>

        <div className="marketplace-grid">
          {marketplaceProducts.map((product) => (
            <article key={product.id} className="product-card">
              <img src={product.image} alt={product.name} />
              <div className="product-card__body">
                <div className="product-card__head">
                  <span>{product.seller}</span>
                  <span>⭐ {product.rating}</span>
                </div>
                <h3>{product.name}</h3>
                <div className="product-card__footer">
                  <strong>K{product.price}</strong>
                  <button type="button">Purchase</button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
