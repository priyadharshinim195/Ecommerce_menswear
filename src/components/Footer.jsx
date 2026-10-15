import { site } from '../config/site.js';
import { CATEGORIES } from '../lib/catalog.js';
import { useShop } from '../context/ShopContext.jsx';

export default function Footer() {
  const { setFilter } = useShop();
  const year = new Date().getFullYear();

  return (
    <footer id="contact" className="footer">
      <div className="container footer-grid">
        <div>
          <p className="logo">{site.brandName}</p>
          <p className="muted small">Placeholder brand identity. Replace the name and logo in src/config/site.js and the header.</p>
        </div>
        <div>
          <h4>Shop</h4>
          <ul>
            {CATEGORIES.map((c) => (
              <li key={c}>
                <a href="#new-arrivals" onClick={() => setFilter(c)}>{c}</a>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4>Contact</h4>
          <ul>
            <li><a href="mailto:hello@example.com">hello@example.com</a></li>
            <li className="muted small">Placeholder contact details</li>
          </ul>
        </div>
      </div>
      <div className="container footer-bottom">
        <span>© {year} {site.brandName}. Demo site.</span>
        <span className="muted small">Built with React and Vite</span>
      </div>
    </footer>
  );
}
