# MAISON NOIR — Premium Men's Fashion (React + Vite)

A new, standalone storefront built from scratch. It is not connected to any previous project.

## Run it

```bash
cd maison-noir
npm install
npm run dev        # http://localhost:5173
```

Production build and preview:

```bash
npm run build
npm run preview
```

## What's included

| Section | Where | Notes |
|---|---|---|
| Navigation | `src/components/Navbar.jsx` | Transparent over hero, solid on scroll, working mobile menu, bag count |
| Scroll-controlled hero | `src/components/Hero.jsx`, `FrameSequence.jsx` | Reusable frame-sequence component. Scroll down = forward, up = reverse |
| Outfit customizer | `src/components/OutfitCustomizer.jsx` | Each outfit and colour loads its own image file |
| Campaign carousel | `src/components/CampaignCarousel.jsx` | Continuous right-to-left loop, centre slide scales up, pauses on hover |
| Collections | `src/components/Collections.jsx` | Mixed-size editorial grid, each tile sets the shop filter |
| New arrivals | `NewArrivals.jsx`, `ProductCard.jsx`, `QuickView.jsx` | Category filters, sorting, quick view with colour and size |
| Shopping bag | `src/components/ShoppingBag.jsx`, `src/context/ShopContext.jsx` | Add, quantity change, remove, subtotal |
| Brand story, banner, newsletter, footer | `BrandStory.jsx`, `EditorialBanner.jsx`, `Newsletter.jsx`, `Footer.jsx` | |

## Placeholder assets (replace before launch)

Every image currently in `public/` is a **placeholder** and is labelled as one inside the image.

* `public/frames/hero/frame-001.jpg … frame-259.jpg`: generated gold-light frames, not a model.
* `public/customizer/<outfit>-<colour>.jpg`: flat garment silhouettes, not a model. Each colour is its own file, so swapping garments and colours works, but the figure is not a real model yet.
* `public/products/<product>-<colour>.jpg`: silhouettes for the demo catalogue.
* `public/campaign/`, `public/collections/`, `public/story/`, `public/banner/`: placeholder panels.

Regenerate placeholders at any time with:

```bash
npm run placeholders          # 259 hero frames
python3 scripts/generate_placeholders.py --frames 269
```

### Swapping in real hero frames (no rebuild)

1. Copy your frames into `public/frames/hero/`.
2. Edit the `hero` block in `src/config/site.js`:

```js
hero: {
  basePath: '/frames/hero/',
  pattern: 'frame-{index}.jpg',   // e.g. 'ezgif-frame-{index}.jpg'
  count: 259,                     // or 269
  padding: 3,
  startIndex: 1,
},
```

Frames are drawn in numeric order and never blank: if a frame is still loading, the nearest loaded frame is shown.

### Swapping in real outfit images

Each outfit colour uses `public/customizer/<outfit-id>-<colour-id>.jpg`. Ids are defined in `src/data/outfits.json`. For a real same-model build, every colour needs a photograph of the same model in the same pose, camera angle, and background. Keep file names the same and the site picks them up.

### Products

Demo products live in `src/data/products.json`. The site labels them as demo data. Prices and stock are not real.

## Limits of this build

* **Checkout is not connected.** The Checkout button only shows a message. No payment, tax, shipping, or inventory logic exists.
* **Newsletter** validates the email address but sends nothing.
* **Bag contents** are kept in memory. They reset on page reload.
* **Brand name** `MAISON NOIR` is temporary. Change it in `src/config/site.js` and the logo in the header and footer.
* **Watermarks:** No image in this project was edited to hide or remove a mark. Only use frames you have rights to.

## Project layout

```
src/
  components/   UI sections and reusable FrameSequence
  config/       site.js — brand name, hero frame settings
  context/      ShopContext.jsx — bag, filters, quick view state
  data/         products.json, outfits.json, content.js
  lib/          catalog helpers, frame URL builder
  styles/       index.css — design tokens and responsive rules
scripts/        generate_placeholders.py
public/         placeholder images (replace these)
```
