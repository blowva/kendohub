import { Link, useNavigate } from 'react-router-dom'
import {
  Minus, Plus, X, ArrowRight, ShoppingBag,
  MapPin, Truck, Zap, ShieldCheck, RotateCcw, Award, CheckCircle2
} from 'lucide-react'
import { useCart } from '../context/CartContext'
import { useLocation } from '../context/LocationContext'
import { getDeliveryDateRange, getDeliveryFee } from '../data/deliveryZones'
import ProductVisual from '../components/ProductVisual'
import { formatNaira } from '../utils/format'
import './Cart.css'

export default function Cart() {
  const { items, subtotal, freeThreshold, setQty, remove } = useCart()
  const { selectedState, selectedCity } = useLocation()
  const navigate = useNavigate()

  const feeInfo = (selectedState && selectedCity)
    ? getDeliveryFee(selectedState, selectedCity, subtotal)
    : null
  const deliveryRange = (selectedState && selectedCity)
    ? getDeliveryDateRange(selectedState, selectedCity)
    : null

  const threshold = freeThreshold || 100000
  const deliveryFee = feeInfo
    ? feeInfo.fee
    : (subtotal > 0 && subtotal < threshold ? 1500 : 0)
  const isFreeDelivery = deliveryFee === 0 && subtotal > 0
  const total = subtotal + deliveryFee

  const amountForFree = Math.max(0, threshold - subtotal)
  const progressPct = Math.min(100, (subtotal / threshold) * 100)
  const qualifiesForFree = subtotal >= threshold

  const getSeed = (id) => {
    if (id === null || id === undefined) return 0
    if (typeof id === 'number') return id
    if (typeof id === 'string') {
      const digits = id.replace(/\D/g, '')
      return parseInt(digits, 10) || 0
    }
    return 0
  }

  if (items.length === 0) {
    return (
      <div className="cartv2-empty page-enter">
        <div className="cartv2-empty-inner">
          <div className="cartv2-empty-icon">
            <ShoppingBag size={36} strokeWidth={1.5} />
          </div>
          <h1 className="cartv2-empty-title">Your bag is empty</h1>
          <p className="cartv2-empty-sub">
            Add a few things to get started.
          </p>
          <Link to="/shop" className="cartv2-empty-cta">
            Browse the shop <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="cartv2 page-enter">
      <div className="cartv2-container">

        <header className="cartv2-head">
          <p className="cartv2-eyebrow">YOUR BAG · {items.length} {items.length === 1 ? 'ITEM' : 'ITEMS'}</p>
          <h1 className="cartv2-title">Your bag</h1>
        </header>

        {selectedState && selectedCity ? (
          <div className="cartv2-delivery">
            <div className="cartv2-delivery-row">
              <MapPin size={16} className="cartv2-delivery-icon" />
              <div className="cartv2-delivery-text">
                <span className="cartv2-delivery-label">Delivering to</span>
                <strong>{selectedCity}, {selectedState}</strong>
              </div>
              <Link to="/shop" className="cartv2-delivery-change">Change</Link>
            </div>
            {deliveryRange && (
              <div className="cartv2-delivery-meta">
                <Truck size={13} />
                <span>Get it by <strong>{deliveryRange.label}</strong></span>
                {deliveryRange.fastLane && (
                  <span className="cartv2-express-badge">
                    <Zap size={11} /> Express
                  </span>
                )}
              </div>
            )}
          </div>
        ) : (
          <div className="cartv2-delivery cartv2-delivery-prompt">
            <MapPin size={16} className="cartv2-delivery-icon" />
            <span>Visit a product page to set your delivery location</span>
          </div>
        )}

        <div className={`cartv2-progress ${qualifiesForFree ? 'is-qualified' : ''}`}>
          {qualifiesForFree ? (
            <div className="cartv2-progress-success">
              <CheckCircle2 size={16} />
              <span>You unlocked <strong>FREE delivery</strong> 🎉</span>
            </div>
          ) : (
            <>
              <div className="cartv2-progress-text">
                Add <strong>{formatNaira(amountForFree)}</strong> more for FREE delivery
              </div>
              <div className="cartv2-progress-bar">
                <div className="cartv2-progress-fill" style={{ width: `${progressPct}%` }} />
              </div>
            </>
          )}
        </div>

        <div className="cartv2-grid">
          <div className="cartv2-lines">
            {items.map((item) => (
              <div className="cartv2-line" key={item.id}>
                <div className="cartv2-line-image">
                  <ProductVisual
                    product={item}
                    category={item.category}
                    seed={getSeed(item.id)}
                  />
                </div>
                <div className="cartv2-line-body">
                  <p className="cartv2-line-cat">{item.category?.toUpperCase()}</p>
                  <Link to={`/product/${item.slug}`} className="cartv2-line-name">
                    {item.name}
                  </Link>
                  {item.tagline && (
                    <p className="cartv2-line-tag">{item.tagline}</p>
                  )}
                  <div className="cartv2-line-foot">
                    <div className="cartv2-qty">
                      <button
                        onClick={() => setQty(item.id, item.qty - 1)}
                        disabled={item.qty <= 1}
                        aria-label="Decrease"
                      >
                        <Minus size={14} />
                      </button>
                      <span>{item.qty}</span>
                      <button
                        onClick={() => setQty(item.id, item.qty + 1)}
                        aria-label="Increase"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                    <span className="cartv2-line-price">
                      {formatNaira(item.price * item.qty)}
                    </span>
                  </div>
                </div>
                <button
                  className="cartv2-line-remove"
                  onClick={() => remove(item.id)}
                  aria-label={`Remove ${item.name}`}
                >
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>

          <aside className="cartv2-summary">
            <h2 className="cartv2-summary-title">Order summary</h2>
            <dl className="cartv2-summary-list">
              <div>
                <dt>Subtotal</dt>
                <dd>{formatNaira(subtotal)}</dd>
              </div>
              <div>
                <dt>
                  Delivery
                  {selectedCity && (
                    <span className="cartv2-summary-sub"> · {selectedCity}</span>
                  )}
                </dt>
                <dd>
                  {isFreeDelivery ? (
                    <span className="cartv2-summary-free">FREE</span>
                  ) : (
                    formatNaira(deliveryFee)
                  )}
                </dd>
              </div>
            </dl>
            <div className="cartv2-summary-divider" />
            <div className="cartv2-summary-total">
              <span>Total</span>
              <strong>{formatNaira(total)}</strong>
            </div>

            <button className="cartv2-checkout-btn" onClick={() => navigate('/checkout')}>
              Proceed to Checkout <ArrowRight size={16} />
            </button>
            <Link to="/shop" className="cartv2-continue">← Continue shopping</Link>

            <div className="cartv2-trust">
              <div className="cartv2-trust-item">
                <ShieldCheck size={18} />
                <span>Secure<br/>checkout</span>
              </div>
              <div className="cartv2-trust-item">
                <RotateCcw size={18} />
                <span>30-day<br/>returns</span>
              </div>
              <div className="cartv2-trust-item">
                <Award size={18} />
                <span>1-year<br/>warranty</span>
              </div>
            </div>
          </aside>
        </div>
      </div>

      <div className="cartv2-sticky-bottom">
        <div className="cartv2-sticky-info">
          <span className="cartv2-sticky-label">Total</span>
          <strong className="cartv2-sticky-total">{formatNaira(total)}</strong>
        </div>
        <button className="cartv2-sticky-btn" onClick={() => navigate('/checkout')}>
          Checkout <ArrowRight size={16} />
        </button>
      </div>
    </div>
  )
}
