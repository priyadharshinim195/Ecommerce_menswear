import { useEffect, useState } from 'react';
import { useShop } from '../context/ShopContext.jsx';
import { formatPrice } from '../lib/catalog.js';

export default function ShoppingBag() {
  const { bagOpen, closeBag, lines, bagCount, bagTotal, setQty, removeLine } = useShop();
  const [note, setNote] = useState('');

  useEffect(() => {
    if (!bagOpen) return undefined;
    const onKey = (e) => e.key === 'Escape' && closeBag();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [bagOpen, closeBag]);

  return (
    <>
      <div className={`bag-overlay ${bagOpen ? 'open' : ''}`} onClick={closeBag} aria-hidden="true" />
      <aside
        className={`bag-drawer ${bagOpen ? 'open' : ''}`}
        aria-label="Shopping bag"
        aria-hidden={!bagOpen}
      >
        <header className="bag-head">
          <h3>Bag <span className="muted">({bagCount})</span></h3>
          <button className="modal-close static" onClick={closeBag} aria-label="Close bag">×</button>
        </header>

        <div className="bag-body">
          {lines.length === 0 && <p className="empty">Your bag is empty.</p>}
          {lines.map((l) => (
            <div className="bag-line" key={l.key}>
              <img src={l.image} alt="" />
              <div className="bag-line-info">
                <p className="bag-name">{l.product.name}</p>
                <p className="muted small">{l.color.name} · Size {l.size}</p>
                <div className="qty small">
                  <button aria-label={`Decrease ${l.product.name}`} onClick={() => setQty(l.key, l.qty - 1)}>−</button>
                  <span aria-live="polite">{l.qty}</span>
                  <button aria-label={`Increase ${l.product.name}`} onClick={() => setQty(l.key, l.qty + 1)}>+</button>
                </div>
                <button className="link-btn" onClick={() => removeLine(l.key)}>Remove</button>
              </div>
              <p className="bag-line-price">{l.priceLabel}</p>
            </div>
          ))}
        </div>

        {lines.length > 0 && (
          <footer className="bag-foot">
            <div className="bag-subtotal">
              <span>Subtotal</span>
              <span>{formatPrice(bagTotal)}</span>
            </div>
            <p className="fine-print">Demo only. Payment and inventory are not connected. Taxes and shipping are not calculated.</p>
            <button className="btn btn-gold full" onClick={() => setNote('Checkout is not configured in this demo.')}>
              Checkout
            </button>
            {note && <p className="fine-print" role="status">{note}</p>}
          </footer>
        )}
      </aside>
    </>
  );
}
