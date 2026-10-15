import products from '../data/products.json';
import outfits from '../data/outfits.json';
import { site } from '../config/site.js';

export { products, outfits };

export const CATEGORIES = ['T-Shirts', 'Shirts', 'Formal Shirts', 'Trousers', 'Hoodies', 'Coats & Jackets'];
export const SIZES = ['S', 'M', 'L', 'XL'];

export const getProduct = (id) => products.find((p) => p.id === id);
export const productImage = (product, colorId) => `/products/${product.id}-${colorId}.jpg`;
export const customizerImage = (outfit, colorId) => `/customizer/${outfit.id}-${colorId}.jpg`;

const money = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: site.currency,
  maximumFractionDigits: 0,
});
export const formatPrice = (n) => money.format(n);
