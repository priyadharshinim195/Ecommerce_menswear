import Navbar from './components/Navbar.jsx';
import Hero from './components/Hero.jsx';
import OutfitCustomizer from './components/OutfitCustomizer.jsx';
import CampaignCarousel from './components/CampaignCarousel.jsx';
import Collections from './components/Collections.jsx';
import NewArrivals from './components/NewArrivals.jsx';
import BrandStory from './components/BrandStory.jsx';
import EditorialBanner from './components/EditorialBanner.jsx';
import Newsletter from './components/Newsletter.jsx';
import Footer from './components/Footer.jsx';
import ShoppingBag from './components/ShoppingBag.jsx';
import QuickView from './components/QuickView.jsx';

export default function App() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <OutfitCustomizer />
        <CampaignCarousel />
        <Collections />
        <NewArrivals />
        <BrandStory />
        <EditorialBanner />
        <Newsletter />
      </main>
      <Footer />
      <ShoppingBag />
      <QuickView />
    </>
  );
}
