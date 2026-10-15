import { bannerImage } from '../data/content.js';
import { useShop } from '../context/ShopContext.jsx';

export default function EditorialBanner() {
  const { setFilter } = useShop();
  return (
    <section className="banner" aria-label="Editorial">
      <img src={bannerImage} alt="" loading="lazy" />
      <div className="banner-copy container">
        <p className="eyebrow">The Evening Edit</p>
        <h2>Dressed for the hour after dark.</h2>
        <a
          className="btn btn-gold"
          href="#new-arrivals"
          onClick={() => setFilter('Formal Shirts')}
        >
          Shop Formal Shirts
        </a>
      </div>
    </section>
  );
}
