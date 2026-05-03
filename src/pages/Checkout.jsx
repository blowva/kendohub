import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Check, CreditCard, Lock, Banknote, Building2, Bitcoin,
  ShieldCheck, ArrowRight, CheckCircle2, Tag, Coins, FileText,
  Sparkles, X, ChevronDown, ChevronUp, BadgeCheck, RotateCcw
} from 'lucide-react'
import { useCart } from '../context/CartContext'
import { useLocation } from '../context/LocationContext'
import { isPayOnDeliveryAvailable } from '../data/nigerianCities'
import { getDeliveryFee, getDeliveryDateRange } from '../data/deliveryZones'
import { formatNaira } from '../utils/format'
import './Checkout.css'

// === LOCAL STORAGE ===
const POINTS_KEY = 'shoply_points'

// === DEMO COUPON CODES ===
const VALID_COUPONS = {
  'WELCOME10':   { type: 'percent', value: 10, label: '10% off' },
  'SHOPLY5':     { type: 'percent', value: 5,  label: '5% off' },
  'BENIN2K':     { type: 'fixed',   value: 2000, label: '₦2,000 off' },
  'NEWCUSTOMER': { type: 'percent', value: 15, label: '15% off' },
}

const POINTS_PER_NAIRA = 1 / 100
const POINT_VALUE = 1

function getStoredPoints() {
  if (typeof window === 'undefined') return 0
  const raw = localStorage.getItem(POINTS_KEY)
  return raw ? parseInt(raw, 10) || 0 : 0
}

function setStoredPoints(n) {
  if (typeof window === 'undefined') return
  localStorage.setItem(POINTS_KEY, String(Math.max(0, Math.floor(n))))
}

export default function Checkout() {
  const { items, subtotal, clear } = useCart()
  const { selectedState, selectedCity } = useLocation()
  const [placed, setPlaced] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState('transfer')
  const navigate = useNavigate()

  // Coupon state
  const [couponInput, setCouponInput] = useState('')
  const [appliedCoupon, setAppliedCoupon] = useState(null)
  const [couponError, setCouponError] = useState('')

  // Points state
  const [pointsBalance, setPointsBalance] = useState(0)
  const [pointsToRedeem, setPointsToRedeem] = useState(0)
  const [pointsInput, setPointsInput] = useState('')
  const [pointsError, setPointsError] = useState('')

  // Note state (still collapsible)
  const [orderNote, setOrderNote] = useState('')
  const [noteOpen, setNoteOpen] = useState(false)
  const NOTE_MAX = 500

  useEffect(() => {
    setPointsBalance(getStoredPoints())
  }, [])

  const podAvailable = isPayOnDeliveryAvailable(selectedState, selectedCity)

  const feeInfo = (selectedState && selectedCity)
    ? getDeliveryFee(selectedState, selectedCity, subtotal)
    : null
  const deliveryRange = (selectedState && selectedCity)
    ? getDeliveryDateRange(selectedState, selectedCity)
    : null
  const deliveryFee = feeInfo ? feeInfo.fee : (subtotal > 0 && subtotal < 100000 ? 1500 : 0)
  const isFreeDelivery = deliveryFee === 0 && subtotal > 0

  // Discount calculations
  const couponDiscount = appliedCoupon
    ? appliedCoupon.type === 'percent'
      ? Math.floor(subtotal * (appliedCoupon.value / 100))
      : Math.min(appliedCoupon.value, subtotal)
    : 0

  const pointsDiscount = pointsToRedeem * POINT_VALUE
  const totalDiscount = Math.min(couponDiscount + pointsDiscount, subtotal)
  const discountedSubtotal = subtotal - totalDiscount
  const total = discountedSubtotal + deliveryFee
  const pointsEarned = Math.floor(discountedSubtotal * POINTS_PER_NAIRA)

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

  // === COUPON HANDLERS ===
  const applyCoupon = () => {
    setCouponError('')
    const code = couponInput.trim().toUpperCase()
    if (!code) { setCouponError('Enter a coupon code'); return }
    const coupon = VALID_COUPONS[code]
    if (!coupon) { setCouponError('Invalid or expired coupon'); return }
    setAppliedCoupon({ code, ...coupon })
    setCouponInput('')
  }

  const removeCoupon = () => {
    setAppliedCoupon(null)
    setCouponError('')
  }

  // === POINTS HANDLERS ===
  const handlePointsInputChange = (val) => {
    setPointsError('')
    const cleaned = val.replace(/\D/g, '')
    setPointsInput(cleaned)
  }

  const applyPoints = () => {
    setPointsError('')
    const n = parseInt(pointsInput, 10) || 0
    if (n <= 0) { setPointsError('Enter a number greater than 0'); return }
    if (n > pointsBalance) { setPointsError(`You only have ${pointsBalance.toLocaleString()} points`); return }
    const maxRedeemable = Math.max(0, subtotal - couponDiscount)
    if (n * POINT_VALUE > maxRedeemable) { setPointsError(`Max redeemable: ${maxRedeemable.toLocaleString()} points`); return }
    setPointsToRedeem(n)
    setPointsInput('')
  }

  const useAllPoints = () => {
    const maxRedeemable = Math.max(0, subtotal - couponDiscount)
    const useAmount = Math.min(pointsBalance, maxRedeemable)
    setPointsToRedeem(useAmount)
    setPointsInput('')
    setPointsError('')
  }

  const removePoints = () => {
    setPointsToRedeem(0)
    setPointsError('')
  }

  const seedTestPoints = () => {
    const newBalance = pointsBalance + 5000
    setStoredPoints(newBalance)
    setPointsBalance(newBalance)
  }

  const placeOrder = (e) => {
    if (e) e.preventDefault()
    const newBalance = pointsBalance - pointsToRedeem + pointsEarned
    setStoredPoints(newBalance)
    setPointsBalance(newBalance)
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
          {pointsEarned > 0 && (
            <div className="checkv2-done-points">
              <Sparkles size={14} />
              <span>You'll earn <strong>{pointsEarned.toLocaleString()} points</strong> after delivery</span>
            </div>
          )}
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
  const isPOD = paymentMethod === 'pod'
  const ctaLabel = isPOD ? 'Place Order' : 'Pay Now'

  return (
    <div className="checkv2 page-enter">
      <div className="checkv2-container">

        {/* HEADER + STEPPER */}
        <header className="checkv2-head">
          <p className="checkv2-eyebrow">CHECKOUT</p>
          <h1 className="checkv2-title">Almost there.</h1>

          <div className="checkv2-steps">
            {['Details', 'Payment', 'Done'].map((label, i) => (
              <div className="checkv2-step is-active" key={label}>
                <span className="checkv2-step-num">{String(i + 1).padStart(2, '0')}</span>
                <span className="checkv2-step-label">{label}</span>
                {i < 2 && <span className="checkv2-step-line" />}
              </div>
            ))}
          </div>
        </header>

        {/* TRUST BADGES CARD */}
        <div className="checkv2-trust-card">
          <div className="checkv2-trust-item">
            <Lock size={14} />
            <span>SSL secured</span>
          </div>
          <div className="checkv2-trust-divider" />
          <div className="checkv2-trust-item">
            <BadgeCheck size={14} />
            <span>Verified merchant</span>
          </div>
          <div className="checkv2-trust-divider" />
          <div className="checkv2-trust-item">
            <RotateCcw size={14} />
            <span>48h returns</span>
          </div>
        </div>

        <div className="checkv2-grid">
          <form className="checkv2-form" onSubmit={placeOrder}>

            {/* === CUSTOMER DETAILS === */}
            <section className="checkv2-section">
              <h2 className="checkv2-section-title">
                <span className="checkv2-section-num">01</span>
                Customer Details
              </h2>
              <div className="checkv2-section-body">
                <div className="checkv2-row">
                  <Field label="Email" type="email" required />
                  <Field label="Phone" type="tel" required />
                </div>
                <Field label="Full name" required />
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
                <span className="checkv2-section-num">02</span>
                Payment
              </h2>
              <div className="checkv2-section-body">

                <div className="checkv2-pay-options">
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

                {isCard && (
                  <div className="checkv2-card-fields">
                    <Field label="Card number" placeholder="•••• •••• •••• ••••" required />
                    <div className="checkv2-row">
                      <Field label="Expiry" placeholder="MM / YY" required />
                      <Field label="CVC" placeholder="•••" required />
                    </div>
                  </div>
                )}

                {isPOD && (
                  <p className="checkv2-pay-reassurance">
                    ✓ No upfront payment · ✓ Inspect item before paying · ✓ Cash or transfer at delivery
                  </p>
                )}

                {paymentMethod === 'transfer' && (
                  <div className="checkv2-pay-info">
                    <p>You'll receive bank account details after placing your order. Send the exact amount and we'll ship within 24 hours of payment.</p>
                  </div>
                )}

                {paymentMethod === 'usdt' && (
                  <div className="checkv2-pay-info">
                    <p>You'll receive USDT wallet address after placing your order. We'll ship within 1 hour of confirmed transaction.</p>
                  </div>
                )}
              </div>
            </section>

          </form>

          {/* === ORDER SUMMARY (NAVY) === */}
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

            {/* === ALWAYS-VISIBLE COUPON === */}
            <div className="checkv2-discount-block">
              <div className="checkv2-discount-head">
                <Tag size={14} />
                <h3>Coupon code</h3>
              </div>
              {!appliedCoupon ? (
                <>
                  <div className="checkv2-input-row">
                    <input
                      type="text"
                      value={couponInput}
                      onChange={(e) => { setCouponInput(e.target.value); setCouponError('') }}
                      placeholder="Enter code"
                      className="checkv2-discount-input"
                      autoComplete="off"
                      onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); applyCoupon() } }}
                    />
                    <button
                      type="button"
                      onClick={applyCoupon}
                      className="checkv2-discount-apply"
                      disabled={!couponInput.trim()}
                    >
                      Apply
                    </button>
                  </div>
                  {couponError && <p className="checkv2-discount-error">{couponError}</p>}
                  <p className="checkv2-discount-hint">Try: <code>WELCOME10</code></p>
                </>
              ) : (
                <div className="checkv2-applied-pill">
                  <CheckCircle2 size={14} className="checkv2-applied-check" />
                  <Tag size={12} />
                  <strong>{appliedCoupon.code}</strong>
                  <span>· {appliedCoupon.label}</span>
                  <button
                    type="button"
                    onClick={removeCoupon}
                    className="checkv2-applied-remove"
                    aria-label="Remove coupon"
                  >
                    <X size={12} />
                  </button>
                </div>
              )}
            </div>

            {/* === ALWAYS-VISIBLE SHOPLY POINTS === */}
            <div className="checkv2-discount-block">
              <div className="checkv2-discount-head">
                <Coins size={14} />
                <h3>Shoply Points</h3>
                <span className="checkv2-points-balance">
                  {pointsBalance.toLocaleString()}
                </span>
              </div>
              {pointsToRedeem === 0 ? (
                pointsBalance === 0 ? (
                  <div className="checkv2-points-empty">
                    <p>Earn 1 point per ₦100 spent · 500 points per review</p>
                    <button
                      type="button"
                      onClick={seedTestPoints}
                      className="checkv2-dev-btn"
                    >
                      + Add 5,000 test points
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="checkv2-input-row">
                      <input
                        type="text"
                        inputMode="numeric"
                        value={pointsInput}
                        onChange={(e) => handlePointsInputChange(e.target.value)}
                        placeholder="How many points?"
                        className="checkv2-discount-input"
                        autoComplete="off"
                        onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); applyPoints() } }}
                      />
                      <button
                        type="button"
                        onClick={applyPoints}
                        className="checkv2-discount-apply"
                        disabled={!pointsInput}
                      >
                        Apply
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={useAllPoints}
                      className="checkv2-points-useall"
                    >
                      Use all {pointsBalance.toLocaleString()} points
                    </button>
                    {pointsError && <p className="checkv2-discount-error">{pointsError}</p>}
                    <p className="checkv2-discount-hint">1 point = ₦1</p>
                  </>
                )
              ) : (
                <div className="checkv2-applied-pill">
                  <CheckCircle2 size={14} className="checkv2-applied-check" />
                  <Coins size={12} />
                  <strong>{pointsToRedeem.toLocaleString()} points</strong>
                  <span>· -{formatNaira(pointsDiscount)}</span>
                  <button
                    type="button"
                    onClick={removePoints}
                    className="checkv2-applied-remove"
                    aria-label="Remove points"
                  >
                    <X size={12} />
                  </button>
                </div>
              )}
            </div>

            {/* === COLLAPSIBLE NOTE === */}
            <div className="checkv2-extra-item">
              <button
                type="button"
                className="checkv2-extra-toggle"
                onClick={() => setNoteOpen(!noteOpen)}
              >
                <FileText size={14} />
                <span>
                  Note to seller
                  {orderNote && (
                    <em className="checkv2-extra-badge-active">added</em>
                  )}
                </span>
                {noteOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </button>
              {noteOpen && (
                <div className="checkv2-extra-body">
                  <textarea
                    value={orderNote}
                    onChange={(e) => {
                      if (e.target.value.length <= NOTE_MAX) {
                        setOrderNote(e.target.value)
                      }
                    }}
                    placeholder="e.g., Please call before delivering. Leave at the gate..."
                    className="checkv2-note-input"
                    rows={3}
                    maxLength={NOTE_MAX}
                  />
                  <div className="checkv2-note-foot">
                    <span className="checkv2-note-hint">Special instructions for delivery</span>
                    <span className="checkv2-note-counter">{orderNote.length}/{NOTE_MAX}</span>
                  </div>
                </div>
              )}
            </div>

            {/* TOTALS */}
            <dl className="checkv2-totals">
              <div>
                <dt>Subtotal</dt>
                <dd>{formatNaira(subtotal)}</dd>
              </div>

              {appliedCoupon && (
                <div className="checkv2-totals-discount">
                  <dt><Tag size={11} /> {appliedCoupon.code}</dt>
                  <dd>-{formatNaira(couponDiscount)}</dd>
                </div>
              )}

              {pointsToRedeem > 0 && (
                <div className="checkv2-totals-discount">
                  <dt><Coins size={11} /> {pointsToRedeem.toLocaleString()} points</dt>
                  <dd>-{formatNaira(pointsDiscount)}</dd>
                </div>
              )}

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

            {pointsEarned > 0 && (
              <div className="checkv2-summary-earn">
                <Sparkles size={12} />
                <span>You'll earn <strong>{pointsEarned.toLocaleString()} points</strong></span>
              </div>
            )}

            <div className="checkv2-summary-trust">
              <ShieldCheck size={16} />
              <span>Secure checkout · 48-hour returns</span>
            </div>

            {/* CTA — inside summary, conditional color */}
            <button
              type="button"
              onClick={placeOrder}
              className={`checkv2-submit ${isPOD ? 'is-pod' : ''}`}
            >
              <Lock size={14} /> {ctaLabel} — {formatNaira(total)}
            </button>
            <p className="checkv2-secure">
              <Lock size={11} /> SSL encrypted · Your details are never stored
            </p>
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
