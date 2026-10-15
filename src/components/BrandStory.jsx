import { storyImage } from '../data/content.js';

export default function BrandStory() {
  return (
    <section id="story" className="section">
      <div className="container story-grid">
        <figure className="story-media">
          <img src={storyImage} alt="Placeholder brand story image" loading="lazy" />
        </figure>
        <div className="story-copy">
          <p className="eyebrow">Our Story</p>
          <h2>Built on restraint</h2>
          <p>
            MAISON NOIR is a placeholder brand. The copy here describes the intended positioning: fewer pieces, cut with care,
            finished in materials that improve with wear.
          </p>
          <p>
            Each silhouette starts from a simple question: what does a man need to feel composed without looking like he
            tried too hard? The answer shapes the cut, the fabric and the colour palette of every collection.
          </p>
          <a className="btn btn-ghost" href="#collections">Discover the collections</a>
        </div>
      </div>
    </section>
  );
}
