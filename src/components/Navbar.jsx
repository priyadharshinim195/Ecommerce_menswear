import { useEffect, useState } from 'react';
import { site } from '../config/site.js';
import { useShop } from '../context/ShopContext.jsx';

const links = [
  { href: '#top', label: 'Home' },
  { href: '#collections', label: 'Collections' },
  { href: '#campaign', label: 'Campaign' },
  { href: '#new-arrivals', label: 'New Arrivals' },
  { href: '#contact', label: 'Contact' },
];

function BagIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true">
      <path d="M5 8h14l-1 12H6L5 8z" />
      <path d="M9 8V6a3 3 0 0 1 6 0v2" />
    </svg>
  );
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { bagCount, openBag } = useShop();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const close = () => setOpen(false);

  return (
    <header className={`nav ${scrolled ? 'scrolled' : ''}`}>
      <div className="nav-inner">
        <a href="#top" className="logo" onClick={close} aria-label={`${site.brandName} home`}>
          {site.brandName}
        </a>

        <nav aria-label="Primary">
          <ul className={`nav-links ${open ? 'open' : ''}`}>
            {links.map((l) => (
              <li key={l.href}>
                <a href={l.href} onClick={close}>{l.label}</a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="nav-actions">
          <button
            className="bag-btn"
            aria-label={`Shopping bag, ${bagCount} item${bagCount === 1 ? '' : 's'}`}
            onClick={() => {
              close();
              openBag();
            }}
          >
            <BagIcon />
            {bagCount > 0 && <span className="bag-count">{bagCount}</span>}
          </button>
          <button
            className={`menu-toggle ${open ? 'is-open' : ''}`}
            aria-expanded={open}
            aria-label={open ? 'Close menu' : 'Open menu'}
            onClick={() => setOpen((o) => !o)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>
    </header>
  );
}
