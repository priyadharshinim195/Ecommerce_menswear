import { useMemo } from 'react';
import FrameSequence from './FrameSequence.jsx';
import { buildFrameUrls } from '../lib/frames.js';
import { site } from '../config/site.js';

export default function Hero() {
  const urls = useMemo(() => buildFrameUrls(site.hero), []);

  return (
    <FrameSequence id="top" urls={urls} height="380vh" ariaLabel="MAISON NOIR hero animation (placeholder frames)">
      <div className="hero-copy">
        {/* <p className="eyebrow">The Signature Edit</p>
        <h1>
          Quiet power, <em>tailored</em> to perfection.
        </h1>
        <p className="lede">
          Considered menswear cut in premium fabrics, designed to move from the boardroom to the late evening.
        </p>
        <a className="btn btn-gold" href="#collections">
          Explore Collection
        </a> */}
      </div>
      <span className="scroll-hint" aria-hidden="true">Scroll</span>
      {/* <p className="placeholder-note">Placeholder hero frames · replace in public/frames/hero/</p> */}
    </FrameSequence>
  );
}
