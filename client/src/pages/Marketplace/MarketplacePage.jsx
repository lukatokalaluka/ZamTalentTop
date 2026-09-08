import { useState } from 'react';
import { marketplaceProducts } from '../../data/mockData';

export default function MarketplacePage() {
  const [selectedProduct, setSelectedProduct] = useState(marketplaceProducts[0]);

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

        <div className="marketplace-layout">
          <div className="marketplace-content">
            <div className="marketplace-toolbar">
              <span className="eyebrow">Popular collections</span>
              <div className="filter-pills">
                <span className="filter-pill active">All</span>
                <span className="filter-pill">Audio</span>
                <span className="filter-pill">Branding</span>
                <span className="filter-pill">Design</span>
              </div>
            </div>

            <div className="marketplace-grid">
              {marketplaceProducts.map((product) => (
                <article
                  key={product.id}
                  className={`product-card ${selectedProduct.id === product.id ? 'product-card--selected' : ''}`}
                  onClick={() => setSelectedProduct(product)}
                >
                  <div className="product-card__image-wrap">
                    <img src={product.image} alt={product.name} />
                  </div>
                  <div className="product-card__body">
                    <div className="product-card__head">
                      <span>{product.seller}</span>
                      <span>⭐ {product.rating}</span>
                    </div>
                    <span className="product-card__badge">{product.category}</span>
                    <h3>{product.name}</h3>
                    <div className="product-card__footer">
                      <strong>K{product.price}</strong>
                      <button type="button">Buy now</button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>

          <aside className="checkout-panel">
            <div className="checkout-panel__header">
              <span className="eyebrow">Quick checkout</span>
              <span className="status-pill">Instant download</span>
            </div>

            <h2>{selectedProduct.name}</h2>
            <p className="checkout-panel__meta">
              {selectedProduct.seller} · {selectedProduct.format}
            </p>
            <p className="checkout-panel__description">{selectedProduct.description}</p>

            <ul className="checkout-list">
              {selectedProduct.includes.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>

            <div className="checkout-panel__price">
              <span>Total</span>
              <strong>K{selectedProduct.price}</strong>
            </div>

            <button type="button" className="checkout-button">Proceed to checkout</button>
            <button type="button" className="secondary-button">Save for later</button>
          </aside>
        </div>
      </div>
    </div>
  );
}
