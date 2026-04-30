import { createContext, useContext, useReducer, useEffect } from 'react'

const CartContext = createContext(null)
const initialState = { items: [] }

function reducer(state, action) {
  switch (action.type) {
    case 'HYDRATE':
      return action.payload || state

    case 'ADD': {
      const qtyToAdd = action.qty || 1
      const existing = state.items.find((i) => i.id === action.product.id)
      if (existing) {
        return {
          ...state,
          items: state.items.map((i) =>
            i.id === action.product.id ? { ...i, qty: i.qty + qtyToAdd } : i
          ),
        }
      }
      return {
        ...state,
        items: [...state.items, { ...action.product, qty: qtyToAdd }],
      }
    }

    case 'REMOVE':
      return { ...state, items: state.items.filter((i) => i.id !== action.id) }

    case 'SET_QTY':
      return {
        ...state,
        items: state.items
          .map((i) => (i.id === action.id ? { ...i, qty: Math.max(0, action.qty) } : i))
          .filter((i) => i.qty > 0),
      }

    case 'CLEAR':
      return { ...state, items: [] }

    default:
      return state
  }
}

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState)

  useEffect(() => {
    try {
      const raw = localStorage.getItem('shoply_cart')
      if (raw) dispatch({ type: 'HYDRATE', payload: JSON.parse(raw) })
    } catch (e) {
      /* localStorage unavailable */
    }
  }, [])

  useEffect(() => {
    try {
      localStorage.setItem('shoply_cart', JSON.stringify(state))
    } catch (e) {
      /* noop */
    }
  }, [state])

  const subtotal = state.items.reduce((sum, i) => sum + i.price * i.qty, 0)
  // Free delivery for orders >= ₦100,000 (matches deliveryZones threshold)
  const FREE_THRESHOLD = 100000
  const shipping = subtotal > 0 && subtotal < FREE_THRESHOLD ? 1500 : 0
  const total = subtotal + shipping
  const itemCount = state.items.reduce((n, i) => n + i.qty, 0)

  const addToCart = (product, qty = 1) =>
    dispatch({ type: 'ADD', product, qty })

  const value = {
    items: state.items,
    subtotal,
    shipping,
    total,
    itemCount,
    freeThreshold: FREE_THRESHOLD,

    // Both names work
    addToCart,
    add: (product) => addToCart(product, 1),

    remove: (id) => dispatch({ type: 'REMOVE', id }),
    setQty: (id, qty) => dispatch({ type: 'SET_QTY', id, qty }),
    clear: () => dispatch({ type: 'CLEAR' }),
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export const useCart = () => {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used inside CartProvider')
  return ctx
}
