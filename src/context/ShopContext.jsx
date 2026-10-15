import { createContext, useContext, useMemo, useReducer } from 'react';
import { getProduct, productImage, formatPrice } from '../lib/catalog.js';

const MAX_QTY = 10;
const ShopContext = createContext(null);

const initialState = {
  bag: [], // { key, productId, colorId, size, qty }
  bagOpen: false,
  quickViewId: null,
  filter: 'All',
  sort: 'featured',
};

const clampQty = (q) => Math.max(1, Math.min(MAX_QTY, q));

function reducer(state, action) {
  switch (action.type) {
    case 'add': {
      const { productId, colorId, size, qty } = action;
      const key = `${productId}|${colorId}|${size}`;
      const exists = state.bag.some((l) => l.key === key);
      const bag = exists
        ? state.bag.map((l) => (l.key === key ? { ...l, qty: clampQty(l.qty + qty) } : l))
        : [...state.bag, { key, productId, colorId, size, qty: clampQty(qty) }];
      return { ...state, bag, bagOpen: true };
    }
    case 'setQty':
      return {
        ...state,
        bag: state.bag.map((l) => (l.key === action.key ? { ...l, qty: clampQty(action.qty) } : l)),
      };
    case 'remove':
      return { ...state, bag: state.bag.filter((l) => l.key !== action.key) };
    case 'openBag':
      return { ...state, bagOpen: true };
    case 'closeBag':
      return { ...state, bagOpen: false };
    case 'quickView':
      return { ...state, quickViewId: action.id };
    case 'closeQuickView':
      return { ...state, quickViewId: null };
    case 'filter':
      return { ...state, filter: action.value };
    case 'sort':
      return { ...state, sort: action.value };
    default:
      return state;
  }
}

function lineView(line) {
  const product = getProduct(line.productId);
  if (!product) return null;
  const color = product.colors.find((c) => c.id === line.colorId) ?? product.colors[0];
  return {
    ...line,
    product,
    color,
    image: productImage(product, color.id),
    unitPrice: product.price,
    lineTotal: product.price * line.qty,
    priceLabel: formatPrice(product.price * line.qty),
  };
}

export function ShopProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const lines = useMemo(() => state.bag.map(lineView).filter(Boolean), [state.bag]);
  const bagCount = lines.reduce((n, l) => n + l.qty, 0);
  const bagTotal = lines.reduce((n, l) => n + l.lineTotal, 0);

  const actions = useMemo(
    () => ({
      addToBag: (productId, colorId, size, qty = 1) =>
        dispatch({ type: 'add', productId, colorId, size, qty }),
      setQty: (key, qty) => dispatch({ type: 'setQty', key, qty }),
      removeLine: (key) => dispatch({ type: 'remove', key }),
      openBag: () => dispatch({ type: 'openBag' }),
      closeBag: () => dispatch({ type: 'closeBag' }),
      openQuickView: (id) => dispatch({ type: 'quickView', id }),
      closeQuickView: () => dispatch({ type: 'closeQuickView' }),
      setFilter: (value) => dispatch({ type: 'filter', value }),
      setSort: (value) => dispatch({ type: 'sort', value }),
    }),
    []
  );

  const value = useMemo(
    () => ({ ...state, ...actions, lines, bagCount, bagTotal }),
    [state, actions, lines, bagCount, bagTotal]
  );

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
}

export function useShop() {
  const ctx = useContext(ShopContext);
  if (!ctx) throw new Error('useShop must be used inside <ShopProvider>');
  return ctx;
}
