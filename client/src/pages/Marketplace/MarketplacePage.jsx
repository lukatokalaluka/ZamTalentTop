import { useEffect, useState } from 'react';
import { getMarketplaceProducts } from '../../services/api';

export default function MarketplacePage() {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    getMarketplaceProducts().then(({ products: nextProducts }) => setProducts(nextProducts)).catch((requestError) => setError(requestError.message));
  }, []);

  return (
    <div className="page-shell"><div className="container">
      <div className="page-header"><div><span className="eyebrow">Marketplace</span><h1>Digital products from Zambia&apos;s creators.</h1></div><p>Products are loaded from the published Supabase marketplace.</p></div>
      {error ? <div className="empty-state"><p>{error}</p></div> : products.length === 0 ? <div className="empty-state"><h3>Marketplace is empty</h3><p>Published products will appear here when sellers add them.</p></div> : <div className="marketplace-grid">{products.map((product) => <article key={product.id} className="product-card"><div className="product-card__image-wrap">{product.image_url ? <img src={product.image_url} alt={product.name} /> : null}</div><div className="product-card__body"><div className="product-card__head"><span>{product.category}</span><span>{product.rating ? `Rating ${product.rating}` : ''}</span></div><h3>{product.name}</h3><p>{product.description}</p><div className="product-card__footer"><strong>{product.price_minor ? `K${product.price_minor / 100}` : 'Price unavailable'}</strong><button type="button" disabled>Purchase unavailable</button></div></div></article>)}</div>}
    </div></div>
  );
}
