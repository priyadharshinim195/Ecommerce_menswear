import { useEffect, useState } from 'react';
import { outfits, customizerImage } from '../lib/catalog.js';
import { useShop } from '../context/ShopContext.jsx';

/**
 * Outfit customizer.
 * Each outfit + colour maps to its own image file (customizer/<outfit>-<colour>.jpg).
 * Selecting an outfit or swatch loads that exact file before showing it, so the visible
 * garment changes for real. Nothing is simulated with CSS filters or overlays.
 * Currently the files are silhouette placeholders; swap them for same-model photos.
 */
export default function OutfitCustomizer() {
  const { setFilter } = useShop();
  const [outfitId, setOutfitId] = useState(outfits[0].id);
  const [colorId, setColorId] = useState(outfits[0].defaultColor);

  const outfit = outfits.find((o) => o.id === outfitId);
  const color = outfit.colors.find((c) => c.id === colorId) ?? outfit.colors[0];
  const src = customizerImage(outfit, color.id);

  const [shown, setShown] = useState(src);
  const [status, setStatus] = useState('ready'); // ready | loading | error
  const [errorSrc, setErrorSrc] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setStatus('loading');
    const img = new Image();
    img.onload = () => {
      if (cancelled) return;
      setShown(src);
      setErrorSrc(null);
      setStatus('ready');
    };
    img.onerror = () => {
      if (cancelled) return;
      setErrorSrc(src);
      setStatus('error');
    };
    img.src = src;
    return () => {
      cancelled = true;
    };
  }, [src]);

  const selectOutfit = (o) => {
    setOutfitId(o.id);
    setColorId(o.defaultColor); // reset to the outfit's default colour
  };

  return (
    <section id="customizer" className="section customizer">
      <div className="container">
        <header className="section-head">
          <p className="eyebrow">Interactive Customizer</p>
          <h2>Build the look</h2>
          <p className="section-sub">Choose a garment and colour to see the same figure in each outfit.</p>
        </header>

        <div className="customizer-grid">
          <figure className={`model-stage ${status === 'loading' ? 'is-loading' : ''}`}>
            <img
              src={shown}
              alt={`${outfit.name} in ${color.name} (placeholder)`}
              key={shown}
            />
            {status === 'loading' && <div className="model-status">Loading {color.name.toLowerCase()}…</div>}
            {status === 'error' && (
              <div className="model-status model-status--error">
                Image missing: {errorSrc}. Showing previous image.
              </div>
            )}
          </figure>

          <div className="customizer-panel">
            <p className="panel-label">Garment</p>
            <div className="thumb-row" role="group" aria-label="Outfit">
              {outfits.map((o) => (
                <button
                  key={o.id}
                  className="thumb"
                  aria-pressed={o.id === outfitId}
                  onClick={() => selectOutfit(o)}
                >
                  <img src={customizerImage(o, o.defaultColor)} alt="" />
                  <span>{o.name}</span>
                </button>
              ))}
            </div>

            <p className="panel-label">
              Colour <span className="panel-value">{color.name}</span>
            </p>
            <div className="swatch-row" role="group" aria-label={`${outfit.name} colours`}>
              {outfit.colors.map((c) => (
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

            <div className="customizer-summary">
              <p>
                <span className="muted">Selected</span> {outfit.name} · {color.name}
              </p>
              <a
                className="btn btn-ghost"
                href="#new-arrivals"
                onClick={() => setFilter(outfit.category)}
              >
                Shop {outfit.category}
              </a>
            </div>

            <p className="fine-print">
              Preview images are placeholders. Final builds need matching photos of the same model for every colour.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
