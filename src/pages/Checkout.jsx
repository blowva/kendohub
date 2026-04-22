import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Check, CreditCard, Lock } from 'lucide-react';
import { useCart } from '../context/CartContext';
import './Checkout.css';

export default function Checkout() {
  const { items, subtotal, shipping, total, clear } = useCart();
  const [step, setStep] = useState(1);
  const [placed, setPlaced] = useState(false);
  const navigate = useNavigate();

  if (items.length === 0 && !placed) {
    return (
      <div className="container page-enter checkout-empty">
        <h1 className="display">Nothing to check out.</h1>
        <Link to="/shop" className="btn btn-accent">Browse the shop →</Link>
      </div>
    );
  }

  const placeOrder = (e) => {
    e.preventDefault();
    setPlaced(true);
    clear();
  };

  if (placed) {
    return (
      <div className="container page-enter checkout-done">
        <div className="checkout-done-inner">
          <div className="checkout-done-tick"><Check size={32} strokeWidth={1.5} /></div>
          <p className="eyebrow">Order placed</p>
          <h1 className="display">Thank you.</h1>
          <p className="checkout-done-sub">
            Your order is confirmed. We've sent a receipt to your email with tracking details.
          </p>
          <p className="mono checkout-order-num">Order № SHO-{Math.floor(Math.random() * 90000 + 10000)}</p>
          <div className="checkout-done-cta">
            <Link to="/shop" className="btn btn-accent">Keep shopping</Link>
            <button className="btn btn-ghost" onClick={() => navigate('/account')}>Track order</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-enter checkout">
      <div className="container">
        <header className="checkout-head">
          <p className="eyebrow">Checkout</p>
          <h1 className="display checkout-title">Almost there.</h1>
        </header>

        <div className="checkout-steps">
          {['Contact', 'Shipping', 'Payment'].map((label, i) => (
            <div className={`checkout-step ${step >= i + 1 ? 'is-active' : ''}`} key={label}>
              <span className="mono">{String(i + 1).padStart(2, '0')}</span>
              <span>{label}</span>
            </div>
          ))}
        </div>

        <div className="checkout-grid">
          <form className="checkout-form" onSubmit={placeOrder}>
            <section className="checkout-section">
              <h2 className="checkout-section-title">
                <span className="mono">01</span> Contact
              </h2>
              <div className="field-row">
                <Field label="Email" type="email" required />
                <Field label="Phone" type="tel" />
              </div>
            </section>

            <section className="checkout-section">
              <h2 className="checkout-section-title">
                <span className="mono">02</span> Shipping
              </h2>
              <div className="field-row">
                <Field label="First name" required />
                <Field label="Last name" required />
              </div>
              <Field label="Address" required />
              <div className="field-row">
                <Field label="City" required />
                <Field label="Country" defaultValue="Nigeria" required />
                <Field label="Postal code" required />
              </div>
            </section>

            <section className="checkout-section">
              <h2 className="checkout-section-title">
                <span className="mono">03</span> Payment
              </h2>
              <div className="pay-methods">
                <label className="pay-option is-selected">
                  <input type="radio" name="pay" defaultChecked />
                  <CreditCard size={16} />
                  <span>Card</span>
                </label>
                <label className="pay-option">
                  <input type="radio" name="pay" />
                  <span>Bank transfer</span>
                </label>
                <label className="pay-option">
                  <input type="radio" name="pay" />
                  <span>USDT</span>
                </label>
              </div>
              <Field label="Card number" placeholder="•••• •••• •••• ••••" required />
              <div className="field-row">
                <Field label="Expiry" placeholder="MM / YY" required />
                <Field label="CVC" placeholder="•••" required />
              </div>
            </section>

            <button type="submit" className="btn btn-accent checkout-submit">
              <Lock size={14} /> Place order — ${total.toFixed(2)}
            </button>
            <p className="checkout-secure mono">
              <Lock size={10} /> SSL encrypted. Your details are never stored.
            </p>
          </form>

          <aside className="checkout-summary">
            <h2 className="eyebrow">Your order</h2>
            <ul className="checkout-items">
              {items.map((item) => (
                <li key={item.id} className="checkout-item">
                  <div>
                    <p className="checkout-item-name">{item.name}</p>
                    <p className="checkout-item-qty mono">Qty {item.qty}</p>
                  </div>
                  <span className="checkout-item-price">${(item.price * item.qty).toFixed(2)}</span>
                </li>
              ))}
            </ul>
            <dl className="checkout-totals">
              <div><dt>Subtotal</dt><dd>${subtotal.toFixed(2)}</dd></div>
              <div><dt>Shipping</dt><dd>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</dd></div>
              <div className="checkout-total-row">
                <dt>Total</dt>
                <dd className="display">${total.toFixed(2)}</dd>
              </div>
            </dl>
          </aside>
        </div>
      </div>
    </div>
  );
}

function Field({ label, type = 'text', ...rest }) {
  return (
    <label className="field">
      <span className="field-label mono">{label}</span>
      <input type={type} {...rest} />
    </label>
  );
}
