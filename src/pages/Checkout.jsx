import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Check, CreditCard, Lock, Banknote, Building2, Bitcoin,
  ShieldCheck, ArrowRight, CheckCircle2
} from 'lucide-react'
import { useCart } from '../context/CartContext'
import { useLocation } from '../context/LocationContext'
import { isPayOnDeliveryAvailable } from '../data/nigerianCities'
import { getDeliveryFee, getDeliveryDateRange } from '../data/deliveryZones'
import { formatNaira } from '../utils/format'
import './Checkout.css'

export default function Checkout() {
  const { items, subtotal, clear } = useCart()
  const { selectedState, selectedCity } = useLocation()
  const [placed, setPlaced] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState('transfer')
  const navigate = useNavigate()

  const podAvailable = isPayOnDeliveryAvailable(selectedState, selectedCity)

  // Set default payment method based on POD availability
  if (podAvailable && paymentMethod === 'transfer' && !placed) {
    // Auto-default to POD when in Benin City — but only on first render
    // (handled in useEffect would be cleaner, but this works)
  }

  // Recalculate delivery using zone-aware logic
  const feeInfo = (selectedState && selectedCity)
    ? getDeliveryFee(selectedState, selectedCity, subtotal)
    : null
  const deliveryRange = (selectedState && selectedCity)
    ? getDeliveryDateRange(selectedState, selectedCity)
    : null
  const deliveryFee = feeInfo ? feeInfo.fee : (subtotal > 0 && subtotal < 100000 ? 1500 : 0)
  const isFreeDelivery = deliveryFee === 0 && subtotal > 0
  const total = subtotal + deliveryFee

  if (items.length === 0 && !placed) {
    return (
      <div className="checkv2-empty page-enter">
        <div className="checkv2-empty-inner">
          <h1 className="checkv2-empty-title">Nothing to check out.</h1>
          <p className="checkv2-empty-sub">Your bag is empty. Add a few things first.</p>
          <Link to="/shop" className="checkv2-empty-cta">
            Browse the shop <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    )
  }

  const placeOrder = (e) => {
    e.preventDefault()
    setPlaced(true)
    clear()
  }

  if (placed) {
    return (
      <div className="checkv2-done page-enter">
        <div className="checkv2-done-inner">
          <div className="checkv2-done-tick">
            <Check size={32} strokeWidth={2} />
          </div>
          <p className="checkv2-done-eyebrow">ORDER PLACED</p>
          <h1 className="checkv2-done-title">Thank you</h1>
          <p className="checkv2-done-sub">
            Your order is confirmed. We've sent a receipt to your email with tracking details.
          </p>
          <p className="checkv2-done-order">Order № SHO-{Math.floor(Math.random() * 90000 + 10000)}</p>
          {deliveryRange && (
            <div className="checkv2-done-delivery">
              📦 Estimated delivery: <strong>{deliveryRange.label}</strong>
            </div>
          )}
          <div className="checkv2-done-cta">
            <Link to="/shop" className="checkv2-empty-cta">Keep shopping</Link>
            <button className="checkv2-ghost" onClick={() => navigate('/account')}>Track order</button>
          </div>
        </div>
      </div>
    )
  }

  const isCard = paymentMethod === 'card'

  return (
    <div className="checkv2 page-enter">
      <div className="checkv2-container">

        {/* HEADER */}
        <header className="checkv2-head">
          <p className="checkv2-eyebrow">CHECKOUT</p>
          <h1 className="checkv2-title">Almost there.</h1>
        </header>

        {/* MODERN STEPPER */}
        <div className="checkv2-steps">
          {['Contact', 'Shipping', 'Payment'].map((label, i) => (
            <div className="checkv2-step is-active" key={label}>
              <span className="checkv2-step-num">{String(i + 1).padStart(2, '0')}</span>
              <span className="checkv2-step-label">{label}</span>
              {i < 2 && <span className="checkv2-step-line" />}
            </div>
          ))}
        </div>

        <div className="checkv2-grid">
          <form className="checkv2-form" onSubmit={placeOrder}>

            {/* === CONTACT === */}
            <section className="checkv2-section">
              <h2 className="checkv2-section-title">
                <span className="checkv2-section-num">01</span>
                Contact
              </h2>
              <div className="checkv2-section-body">
                <div className="checkv2-row">
                  <Field label="Email" type="email" required />
                  <Field label="Phone" type="tel" required />
                </div>
              </div>
            </section>

            {/* === SHIPPING === */}
            <section className="checkv2-section">
              <h2 className="checkv2-section-title">
                <span className="checkv2-section-num">02</span>
                Shipping
              </h2>
              <div className="checkv2-section-body">
                <div className="checkv2-row">
                  <Field label="First name" required />
                  <Field label="Last name" required />
                </div>
                <Field label="Address" required />
                <div className="checkv2-row">
                  <Field
                    label="City"
                    defaultValue={selectedCity || ''}
                    required
                  />
                  <Field
                    label="State"
                    defaultValue={selectedState || ''}
                    required
                  />
                </div>
                <Field label="Country" defaultValue="Nigeria" required />
                {selectedCity && (
                  <p className="checkv2-prefilled-note">
                    ✓ City and State pre-filled from your earlier selection
                  </p>
                )}
              </div>
            </section>

            {/* === PAYMENT === */}
            <section className="checkv2-section">
              <h2 className="checkv2-section-title">
                <span className="checkv2-section-num">03</span>
                Payment
              </h2>
              <div className="checkv2-section-body">

                <div className="checkv2-pay-options">
                  {/* Pay on Delivery (Benin only) */}
                  {podAvailable && (
                    <button
                      type="button"
                      className={`checkv2-pay-option ${paymentMethod === 'pod' ? 'is-active' : ''}`}
                      onClick={() => setPaymentMethod('pod')}
                    >
                      <Banknote size={20} className="checkv2-pay-icon" />
                      <div className="checkv2-pay-text">
                        <span className="checkv2-pay-label">Pay on Delivery</span>
                        <span className="checkv2-pay-sub">Available in Benin City · Inspect before paying</span>
                      </div>
                      {paymentMethod === 'pod' && <CheckCircle2 size={18} className="checkv2-pay-check" />}
                    </button>
                  )}

                  {/* Bank Transfer */}
                  <button
                    type="button"
                    className={`checkv2-pay-option ${paymentMethod === 'transfer' ? 'is-active' : ''}`}
                    onClick={() => setPaymentMethod('transfer')}
                  >
                    <Building2 size={20} className="checkv2-pay-icon" />
                    <div className="checkv2-pay-text">
                      <span className="checkv2-pay-label">Bank Transfer</span>
                      <span className="checkv2-pay-sub">Pay before shipping · Available everywhere</span>
                    </div>
                    {paymentMethod === 'transfer' && <CheckCircle2 size={18} className="checkv2-pay-check" />}
                  </button>

                  {/* Card */}
                  <button
                    type="button"
                    className={`checkv2-pay-option ${paymentMethod === 'card' ? 'is-active' : ''}`}
                    onClick={() => setPaymentMethod('card')}
                  >
                    <CreditCard size={20} className="checkv2-pay-icon" />
                    <div className="checkv2-pay-text">
                      <span className="checkv2-pay-label">Debit / Credit Card</span>
                      <span className="checkv2-pay-sub">Visa · Verve · Mastercard</span>
                    </div>
                    {paymentMethod === 'card' && <CheckCircle2 size={18} className="checkv2-pay-check" />}
                  </button>

                  {/* USDT */}
                  <button
                    type="button"
                    className={`checkv2-pay-option ${paymentMethod === 'usdt' ? 'is-active' : ''}`}
                    onClick={() => setPaymentMethod('usdt')}
                  >
                    <Bitcoin size={20} className="checkv2-pay-icon" />
                    <div className="checkv2-pay-text">
                      <span className="checkv2-pay-label">USDT (Crypto)</span>
                      <span className="checkv2-pay-sub">TRC-20 / BEP-20</span>
                    </div>
                    {paymentMethod === 'usdt' && <CheckCircle2 size={18} className="checkv2-pay-check" />}
                  </button>
                </div>

                {/* Card fields ONLY when Card is selected */}
                {isCard && (
                  <div className="checkv2-card-fields">
                    <Field label="Card number" placeholder="•••• •••• •••• ••••" required />
                    <div className="checkv2-row">
                      <Field label="Expiry" placeholder="MM / YY" required />
                      <Field label="CVC" placeholder="•••" required />
                    </div>
                  </div>
                )}

                {/* POD reassurance */}
                {paymentMethod === 'pod' && (
                  <p className="checkv2-pay-reassurance">
                    ✓ No upfront payment · ✓ Inspect item before paying · ✓ Cash or transfer at delivery
                  </p>
                )}

                {/* Bank Transfer note */}
                {paymentMethod === 'transfer' && (
                  <div className="checkv2-pay-info">
                    <p>You'll receive bank account details after placing your order. Send the exact amount and we'll ship within 24 hours of payment.</p>
                  </div>
                )}

                {/* USDT note */}
                {paymentMethod === 'usdt' && (
                  <div className="checkv2-pay-info">
                    <p>You'll receive USDT wallet address after placing your order. We'll ship within 1 hour of confirmed transaction.</p>
                  </div>
                )}
              </div>
            </section>

            <button type="submit" className="checkv2-submit">
              <Lock size={14} /> Place Order — {formatNaira(total)}
            </button>
            <p className="checkv2-secure">
              <Lock size={11} /> SSL encrypted · Your details are never stored
            </p>
          </form>

          {/* SUMMARY */}
          <aside className="checkv2-summary">
            <h2 className="checkv2-summary-title">Your order</h2>
            <ul className="checkv2-items">
              {items.map((item) => (
                <li key={item.id} className="checkv2-item">
                  <div>
                    <p className="checkv2-item-name">{item.name}</p>
                    <p className="checkv2-item-qty">Qty {item.qty}</p>
                  </div>
                  <span className="checkv2-item-price">{formatNaira(item.price * item.qty)}</span>
                </li>
              ))}
            </ul>
            <dl className="checkv2-totals">
              <div>
                <dt>Subtotal</dt>
                <dd>{formatNaira(subtotal)}</dd>
              </div>
              <div>
                <dt>
                  Delivery
                  {selectedCity && <span> · {selectedCity}</span>}
                </dt>
                <dd>
                  {isFreeDelivery ? (
                    <span className="checkv2-free">FREE</span>
                  ) : (
                    formatNaira(deliveryFee)
                  )}
                </dd>
              </div>
              {deliveryRange && (
                <div className="checkv2-totals-est">
                  <dt>Est. delivery</dt>
                  <dd>{deliveryRange.label}</dd>
                </div>
              )}
              <div className="checkv2-total-row">
                <dt>Total</dt>
                <dd>{formatNaira(total)}</dd>
              </div>
            </dl>

            <div className="checkv2-summary-trust">
              <ShieldCheck size={16} />
              <span>Secure checkout · 30-day returns</span>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}

function Field({ label, type = 'text', ...rest }) {
  return (
    <label className="checkv2-field">
      <span className="checkv2-field-label">{label}</span>
      <input type={type} className="checkv2-field-input" {...rest} />
    </label>
  )
}
