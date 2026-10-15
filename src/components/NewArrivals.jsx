import { useMemo } from 'react';
import products from '../data/products.json';
import { CATEGORIES } from '../lib/catalog.js';
import { useShop } from '../context/ShopContext.jsx';
import ProductCard from './ProductCard.jsx';

const SORTS = [
  { value: 'featured', label: 'Featured' },
  { value: 'price-asc', label: 'Price: low to high' },
  { value: 'price-desc', label: 'Price: high to low' },
  { value: 'name', label: 'Name A–Z' },
];

export default function NewArrivals() {
  const { filter, setFilter, sort, setSort } = useShop();

  const visible = useMemo(() => {
    const list = filter === 'All' ? [...products] : products.filter((p) => p.category === filter);
    switch (sort) {
      case 'price-asc':
        return list.sort((a, b) => a.price - b.price);
      case 'price-desc':
        return list.sort((a, b) => b.price - a.price);
      case 'name':
        return list.sort((a, b) => a.name.localeCompare(b.name));
      default:
        return list;
    }
  }, [filter, sort]);

  const countFor = (cat) => (cat === 'All' ? products.length : products.filter((p) => p.category === cat).length);

  return (
    <section id="new-arrivals" className="section">
      <div className="container">
        <header className="section-head">
          <p className="eyebrow">New Arrivals</p>
          <h2>The new season</h2>
          <p className="demo-note">
            Demo catalogue: sample products for layout and interaction testing. Prices and stock are not real.
          </p>
        </header>

        <div className="filter-bar">
          <div className="pill-row" role="group" aria-label="Filter by category">
            {['All', ...CATEGORIES].map((cat) => (
              <button
                key={cat}
                className="pill"
                aria-pressed={filter === cat}
                onClick={() => setFilter(cat)}
              >
                {cat} <span className="pill-count">{countFor(cat)}</span>
              </button>
            ))}
          </div>
          <label className="sort-control">
            <span>Sort</span>
            <select value={sort} onChange={(e) => setSort(e.target.value)}>
              {SORTS.map((s) => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
          </label>
        </div>

        {visible.length > 0 ? (
          <div className="product-grid">
            {visible.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        ) : (
          <p className="empty">No products in this category yet.</p>
        )}
      </div>
    </section>
  );
}
