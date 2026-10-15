import { collections } from '../data/content.js';
import { useShop } from '../context/ShopContext.jsx';

export default function Collections() {
  const { setFilter } = useShop();

  return (
    <section id="collections" className="section">
      <div className="container">
        <header className="section-head">
          <p className="eyebrow">Collections</p>
          <h2>Shop by category</h2>
        </header>

        <div className="collection-grid">
          {collections.map((c) => (
            <a
              key={c.id}
              href="#new-arrivals"
              className={`collection-tile tile-${c.size}`}
              onClick={() => setFilter(c.category)}
              aria-label={`Shop ${c.title}`}
            >
              <img src={c.image} alt="" loading="lazy" />
              <div className="tile-copy">
                <span className="tile-blurb">{c.blurb}</span>
                <h3>{c.title}</h3>
                <span className="tile-cta">Shop →</span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
