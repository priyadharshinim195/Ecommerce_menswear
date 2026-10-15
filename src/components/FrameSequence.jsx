import { useEffect, useRef, useState } from 'react';

/**
 * Reusable scroll-driven frame sequence.
 * - Scrolling down advances frames; scrolling up reverses them (progress is derived from scroll position).
 * - Frames are preloaded with limited concurrency and drawn in order.
 * - If the frame for the current progress isn't loaded yet, the nearest loaded frame is drawn,
 *   so the canvas never goes blank.
 */
export default function FrameSequence({ id, urls, height = '380vh', className = '', ariaLabel, children }) {
  const wrapRef = useRef(null);
  const canvasRef = useRef(null);
  const framesRef = useRef([]);
  const progressRef = useRef(0);
  const rafRef = useRef(0);
  const [loaded, setLoaded] = useState(0);
  const [failed, setFailed] = useState(0);

  const draw = () => {
    const canvas = canvasRef.current;
    const frames = framesRef.current;
    if (!canvas || frames.length === 0) return;
    const target = Math.round(progressRef.current * (frames.length - 1));
    let img = null;
    for (let d = 0; d < frames.length && !img; d++) {
      img = frames[target - d] || frames[target + d] || null;
    }
    if (!img) return;
    const ctx = canvas.getContext('2d');
    const { width: cw, height: ch } = canvas;
    const scale = Math.max(cw / img.naturalWidth, ch / img.naturalHeight);
    const dw = img.naturalWidth * scale;
    const dh = img.naturalHeight * scale;
    ctx.drawImage(img, (cw - dw) / 2, (ch - dh) / 2, dw, dh);
  };

  // Preload every frame in order with limited concurrency.
  useEffect(() => {
    let cancelled = false;
    const frames = new Array(urls.length).fill(null);
    framesRef.current = frames;
    setLoaded(0);
    setFailed(0);

    let next = 0;
    let active = 0;
    const CONCURRENCY = 6;

    const pump = () => {
      while (!cancelled && active < CONCURRENCY && next < urls.length) {
        const i = next++;
        active++;
        const img = new Image();
        img.decoding = 'async';
        const settle = (ok) => {
          if (cancelled) return;
          active--;
          if (ok) {
            frames[i] = img;
            setLoaded((c) => c + 1);
          } else {
            setFailed((c) => c + 1);
          }
          draw();
          pump();
        };
        img.onload = () => settle(true);
        img.onerror = () => settle(false);
        img.src = urls[i];
      }
    };
    pump();

    return () => {
      cancelled = true;
    };
  }, [urls]);

  // Scroll → progress → frame. Progress is written as a CSS variable (--p) for overlays.
  useEffect(() => {
    const onScroll = () => {
      if (rafRef.current) return;
      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = 0;
        const el = wrapRef.current;
        if (!el) return;
        const range = el.offsetHeight - window.innerHeight;
        const rect = el.getBoundingClientRect();
        const p = range > 0 ? Math.min(1, Math.max(0, -rect.top / range)) : 0;
        progressRef.current = p;
        el.style.setProperty('--p', p.toFixed(4));
        draw();
      });
    };

    const resize = () => {
      const canvas = canvasRef.current;
      if (canvas) {
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        canvas.width = Math.round(canvas.clientWidth * dpr);
        canvas.height = Math.round(canvas.clientHeight * dpr);
      }
      onScroll();
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', resize);
    resize();
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(rafRef.current);
      rafRef.current = 0; // clear the stored id so a re-run (e.g. StrictMode) can schedule again
    };
  }, []);

  // Redraw when a frame finishes loading.
  useEffect(() => {
    draw();
  }, [loaded]);

  const total = urls.length;
  const settled = loaded + failed;
  const allFailed = total > 0 && loaded === 0 && settled === total;
  const showStatus = settled < total || allFailed;

  return (
    <section
      id={id}
      ref={wrapRef}
      className={`frame-sequence ${className}`}
      style={{ height }}
      aria-label={ariaLabel}
    >
      <div className="frame-sticky">
        <canvas ref={canvasRef} className="frame-canvas" role="img" aria-label={ariaLabel} />
        {children}
        {showStatus && (
          <div className="frame-status" role="status">
            {allFailed
              ? 'Frames not found. Check src/config/site.js and public/frames/hero/.'
              : `Loading frames ${loaded}/${total}`}
          </div>
        )}
      </div>
    </section>
  );
}
