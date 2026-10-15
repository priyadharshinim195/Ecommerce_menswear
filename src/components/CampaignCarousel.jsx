import { useEffect, useRef } from 'react';
import { campaigns } from '../data/content.js';

const SPEED = 60; // px per second, right → left. Constant: hover/focus never changes it.
const GAP_RATIO = 0.025;
const ASPECT = 5 / 4; // slide height / slide width (4:5 portrait)
const NUDGE_EASE = 0.12; // fraction of a pending arrow-button step applied per frame (smooth glide)

/**
 * Continuous right-to-left campaign carousel.
 *
 * - The motion loop is driven only by requestAnimationFrame and elapsed time.
 *   Nothing in the hover, focus or pointer path touches it, so the carousel never pauses
 *   while the pointer moves across or rests on images.
 * - Slides sit on a wrapped ring so the loop is seamless (no gaps, no jumps).
 * - The slide nearest the centre scales up each frame.
 * - Arrow buttons add a pending step that is glided in over several frames on top of the
 *   constant base speed, so they never cause a sudden jump.
 * - prefers-reduced-motion users get no automatic movement; arrow buttons still work.
 */
export default function CampaignCarousel() {
  const viewportRef = useRef(null);
  const slideRefs = useRef([]);
  const offsetRef = useRef(0);
  const pendingRef = useRef(0);
  const layoutRef = useRef({ vw: 0, slideW: 0, slideH: 0, step: 0, span: 1 });

  useEffect(() => {
    const viewport = viewportRef.current;
    const n = campaigns.length;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const layout = () => {
      const vw = viewport.clientWidth;
      const vh = window.innerHeight;
      const maxH = vw < 700 ? vh * 0.6 : vh * 0.72;
      const slideW = Math.min(vw < 700 ? vw * 0.62 : maxH / ASPECT, maxH / ASPECT);
      const slideH = slideW * ASPECT;
      const gap = Math.round(vw * GAP_RATIO);
      const step = slideW + gap;
      layoutRef.current = { vw, slideW, slideH, step, span: step * n };
      viewport.style.height = `${Math.round(slideH * 1.18)}px`;
      slideRefs.current.forEach((el) => {
        if (!el) return;
        el.style.width = `${slideW}px`;
        el.style.height = `${slideH}px`;
      });
    };
    layout();
    window.addEventListener('resize', layout);

    let raf;
    let last = null;
    const render = (now) => {
      const { vw, slideW, step, span } = layoutRef.current;

      // Elapsed time since the previous frame, clamped so a backgrounded tab can't cause a jump.
      const elapsed = last === null ? 0 : Math.min(Math.max(now - last, 0), 64);
      last = now;
      const dt = elapsed / 1000;

      if (!reduceMotion) offsetRef.current += SPEED * dt;

      // Glide any arrow-button step in gradually.
      if (pendingRef.current !== 0) {
        const move = pendingRef.current * NUDGE_EASE;
        offsetRef.current += move;
        pendingRef.current -= move;
        if (Math.abs(pendingRef.current) < 0.5) pendingRef.current = 0;
      }

      const centre = vw / 2;
      slideRefs.current.forEach((el, k) => {
        if (!el) return;
        // Centre-x of this slide relative to the viewport centre, wrapped into [-span/2, span/2).
        let p = k * step - offsetRef.current;
        p = ((((p + span / 2) % span) + span) % span) - span / 2;
        const dist = Math.min(1, Math.abs(p) / (vw / 2));
        const scale = 1 + 0.08 * (1 - Math.min(1, dist * 1.6));
        const x = centre + p - slideW / 2;
        el.style.transform = `translate3d(${x}px, -50%, 0) scale(${scale})`;
        el.style.zIndex = String(Math.round((1 - dist) * 10));
        el.style.opacity = String(0.45 + 0.55 * (1 - Math.min(1, dist * 1.2)));
        el.classList.toggle('is-center', dist < 0.12);
      });
      raf = requestAnimationFrame(render);
    };
    raf = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', layout);
    };
  }, []);

  const nudge = (dir) => {
    pendingRef.current += dir * layoutRef.current.step;
  };

  return (
    <section id="campaign" className="section campaign">
      <div className="container section-head campaign-head">
        <div>
          <p className="eyebrow">Campaign</p>
          <h2>Quiet authority</h2>
        </div>
        <div className="campaign-controls">
          <button aria-label="Previous look" onClick={() => nudge(1)}>←</button>
          <button aria-label="Next look" onClick={() => nudge(-1)}>→</button>
        </div>
      </div>

      <div ref={viewportRef} className="campaign-viewport">
        {campaigns.map((c, k) => (
          <figure
            key={c.id}
            className="campaign-slide"
            ref={(el) => {
              slideRefs.current[k] = el;
            }}
          >
            <img src={c.image} alt={c.alt} draggable="false" />
            <figcaption>{c.title}</figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
