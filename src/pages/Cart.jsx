import { Link, useNavigate } from 'react-router-dom';
import { Minus, Plus, X, ArrowRight, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import ProductVisual from '../components/ProductVisual';
import './Cart.css';

export default function Cart() {
  const { items, subtotal, shipping, total, setQty, remove } = useCart();
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <div className="container page-enter cart-empty">
        <div className="cart-empty-inner">
          <ShoppingBag size={40} strokeWidth={1} />
          <p className="eyebrow">Cart</p>
          <h1 className="display">Your cart is empty.</h1>
          <p className="cart-empty-sub">A good object is a long conversation. Start one.</p>
          <Link to="/shop" className="btn btn-accent">Browse the shop →</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page-enter cart">
      <div className="container">
        <header className="cart-head">
          <p className="eyebrow">Bag · {items.length} {items.length === 1 ? 'item' : 'items'}</p>
          <h1 className="display cart-title">Your cart.</h1>
        </header>

        <div className="cart-grid">
          <div className="cart-lines">
            {items.map((item) => (
              <div className="cart-line" key={item.id}>
                <div className="cart-line-visual">
                  <ProductVisual
                    category={item.category}
                    seed={parseInt(item.id.replace('p', ''), 10)}
                  />
                </div>
                <div className="cart-line-body">
                  <div className="cart-line-top">
                    <div>
                      <p className="mono cart-line-cat">{item.category}</p>
                      <Link to={`/product/${item.slug}`} className="cart-line-name display">
                        {item.name}
                      </Link>
                      <p className="cart-line-tag">{item.tagline}</p>
                    </div>
                    <button
                      className="cart-line-remove"
                      onClick={() => remove(item.id)}
                      aria-label={`Remove ${item.name}`}
                    >
                      <X size={16} />
                    </button>
                  </div>
                  <div className="cart-line-foot">
                    <div className="pd-qty">
                      <button onClick={() => setQty(item.id, item.qty - 1)} aria-label="Decrease">
                        <Minus size={14} />
                      </button>
                      <span>{item.qty}</span>
                      <button onClick={() => setQty(item.id, item.qty + 1)} aria-label="Increase">
                        <Plus size={14} />
                      </button>
                    </div>
                    <span className="cart-line-price display">
                      ${(item.price * item.qty).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <aside className="cart-summary">
            <h2 className="eyebrow">Summary</h2>
            <dl className="cart-totals">
              <div>
                <dt>Subtotal</dt>
                <dd>${subtotal.toFixed(2)}</dd>
              </div>
              <div>
                <dt>Shipping</dt>
                <dd>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</dd>
              </div>
              {shipping > 0 && (
                <p className="cart-shipping-note">
                  Add ${(200 - subtotal).toFixed(2)} more for free shipping.
                </p>
              )}
              <div className="cart-total-row">
                <dt>Total</dt>
                <dd className="display cart-total">${total.toFixed(2)}</dd>
              </div>
            </dl>

            <button className="btn btn-accent cart-checkout" onClick={() => navigate('/checkout')}>
              Checkout <ArrowRight size={14} />
            </button>
            <Link to="/shop" className="cart-continue">← Continue shopping</Link>

            <div className="cart-trust">
              <p className="mono">Secure checkout. 30-day returns. 2-year warranty.</p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
