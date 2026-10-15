import { useState } from 'react';
import { productImage, formatPrice } from '../lib/catalog.js';
import { useShop } from '../context/ShopContext.jsx';

export default function ProductCard({ product }) {
  const { openQuickView, addToBag } = useShop();
  const [colorId, setColorId] = useState(product.colors[0].id);
  const color = product.colors.find((c) => c.id === colorId) ?? product.colors[0];

  return (
    <article className="product-card">
      <button
        className="product-media"
        onClick={() => openQuickView(product.id)}
        aria-label={`Quick view ${product.name}`}
      >
        <img src={productImage(product, color.id)} alt={`${product.name} in ${color.name} (placeholder)`} loading="lazy" />
      </button>

      <div className="product-meta">
        <p className="product-cat">{product.category}</p>
        <h3>{product.name}</h3>
        <p className="product-price">{formatPrice(product.price)}</p>
      </div>

      <div className="swatch-row swatch-row--small" role="group" aria-label={`${product.name} colours`}>
        {product.colors.map((c) => (
          <button
            key={c.id}
            className="swatch"
            style={{ background: c.hex }}
            aria-label={c.name}
            title={c.name}
            aria-pressed={c.id === colorId}
            onClick={() => setColorId(c.id)}
          />
        ))}
      </div>

      <div className="product-actions">
        <button className="btn btn-ghost" onClick={() => openQuickView(product.id)}>
          Quick view
        </button>
        <button className="btn btn-gold" onClick={() => addToBag(product.id, color.id, 'M', 1)}>
          Add to bag
        </button>
      </div>
    </article>
  );
}
