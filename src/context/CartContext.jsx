import { createContext, useContext, useReducer, useEffect } from 'react';

const CartContext = createContext(null);

const initialState = { items: [] };

function reducer(state, action) {
  switch (action.type) {
    case 'HYDRATE':
      return action.payload || state;
    case 'ADD': {
      const existing = state.items.find((i) => i.id === action.product.id);
      if (existing) {
        return {
          ...state,
          items: state.items.map((i) =>
            i.id === action.product.id ? { ...i, qty: i.qty + 1 } : i,
          ),
        };
      }
      return { ...state, items: [...state.items, { ...action.product, qty: 1 }] };
    }
    case 'REMOVE':
      return { ...state, items: state.items.filter((i) => i.id !== action.id) };
    case 'SET_QTY':
      return {
        ...state,
        items: state.items
          .map((i) => (i.id === action.id ? { ...i, qty: Math.max(0, action.qty) } : i))
          .filter((i) => i.qty > 0),
      };
    case 'CLEAR':
      return { ...state, items: [] };
    default:
      return state;
  }
}

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  // Hydrate once on mount (in-memory fallback if localStorage blocked)
  useEffect(() => {
    try {
      const raw = localStorage.getItem('shoply_cart');
      if (raw) dispatch({ type: 'HYDRATE', payload: JSON.parse(raw) });
    } catch (e) {
      // localStorage unavailable — fine, stay in memory
    }
  }, []);

  // Persist on change
  useEffect(() => {
    try {
      localStorage.setItem('shoply_cart', JSON.stringify(state));
    } catch (e) {
      /* noop */
    }
  }, [state]);

  const subtotal = state.items.reduce((sum, i) => sum + i.price * i.qty, 0);
  const shipping = subtotal > 0 && subtotal < 200 ? 12 : 0;
  const total = subtotal + shipping;
  const itemCount = state.items.reduce((n, i) => n + i.qty, 0);

  const value = {
    items: state.items,
    subtotal,
    shipping,
    total,
    itemCount,
    add: (product) => dispatch({ type: 'ADD', product }),
    remove: (id) => dispatch({ type: 'REMOVE', id }),
    setQty: (id, qty) => dispatch({ type: 'SET_QTY', id, qty }),
    clear: () => dispatch({ type: 'CLEAR' }),
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside CartProvider');
  return ctx;
};
