import { useEffect, useState } from 'react';
import { getProduct, productImage, formatPrice, SIZES } from '../lib/catalog.js';
import { useShop } from '../context/ShopContext.jsx';

export default function QuickView() {
  const { quickViewId, closeQuickView, addToBag } = useShop();
  const product = quickViewId ? getProduct(quickViewId) : null;
  const productId = product?.id;

  const [colorId, setColorId] = useState(null);
  const [size, setSize] = useState('M');
  const [qty, setQty] = useState(1);

  useEffect(() => {
    setColorId(null);
    setSize('M');
    setQty(1);
  }, [productId]);

  useEffect(() => {
    if (!productId) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') closeQuickView();
    };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [productId, closeQuickView]);

  if (!product) return null;

  const color = product.colors.find((c) => c.id === colorId) ?? product.colors[0];

  return (
    <div className="modal-overlay" onClick={closeQuickView}>
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="quickview-title"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="modal-close" onClick={closeQuickView} aria-label="Close quick view">×</button>
        <div className="modal-media">
          <img src={productImage(product, color.id)} alt={`${product.name} in ${color.name} (placeholder)`} />
        </div>
        <div className="modal-body">
          <p className="product-cat">{product.category}</p>
          <h3 id="quickview-title">{product.name}</h3>
          <p className="product-price">{formatPrice(product.price)}</p>
          <p className="modal-desc">{product.description}</p>

          <p className="panel-label">Colour <span className="panel-value">{color.name}</span></p>
          <div className="swatch-row" role="group" aria-label="Colour">
            {product.colors.map((c) => (
              <button
                key={c.id}
                className="swatch"
                style={{ background: c.hex }}
                aria-label={c.name}
                title={c.name}
                aria-pressed={c.id === color.id}
                onClick={() => setColorId(c.id)}
              />
            ))}
          </div>

          <p className="panel-label">Size</p>
          <div className="size-row" role="group" aria-label="Size">
            {SIZES.map((s) => (
              <button key={s} className="size-chip" aria-pressed={size === s} onClick={() => setSize(s)}>
                {s}
              </button>
            ))}
          </div>

          <div className="modal-actions">
            <div className="qty">
              <button aria-label="Decrease quantity" onClick={() => setQty((q) => Math.max(1, q - 1))}>−</button>
              <span aria-live="polite">{qty}</span>
              <button aria-label="Increase quantity" onClick={() => setQty((q) => Math.min(10, q + 1))}>+</button>
            </div>
            <button
              className="btn btn-gold"
              onClick={() => {
                addToBag(product.id, color.id, size, qty);
                closeQuickView();
              }}
            >
              Add to bag
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
