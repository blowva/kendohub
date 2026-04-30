import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Minus, Plus, X, ArrowRight, ShoppingBag,
  MapPin, Truck, Zap, ShieldCheck, RotateCcw, Award, CheckCircle2,
  ChevronDown, Check
} from 'lucide-react'
import { useCart } from '../context/CartContext'
import { useLocation } from '../context/LocationContext'
import { nigerianStates } from '../data/nigerianCities'
import { getDeliveryDateRange, getDeliveryFee } from '../data/deliveryZones'
import ProductVisual from '../components/ProductVisual'
import { formatNaira } from '../utils/format'
import './Cart.css'

export default function Cart() {
  const { items, subtotal, freeThreshold, setQty, remove } = useCart()
  const {
    selectedState,
    selectedCity,
    setSelectedState,
    setSelectedCity,
  } = useLocation()
  const navigate = useNavigate()

  // ---- inline location picker state ----
  const [pickerOpen, setPickerOpen] = useState(false)
  const [draftState, setDraftState] = useState(selectedState || '')
  const [draftCity, setDraftCity] = useState(selectedCity || '')

  const stateData = nigerianStates.find((s) => s.name === draftState)
  const cityList = stateData?.cities || []

  const openPicker = () => {
    setDraftState(selectedState || '')
    setDraftCity(selectedCity || '')
    setPickerOpen(true)
  }
  const closePicker = () => setPickerOpen(false)

  const handleStateChange = (e) => {
    setDraftState(e.target.value)
    setDraftCity('') // reset city when state changes
  }

  const handleSave = () => {
    if (!draftState || !draftCity) return
    setSelectedState(draftState)
    setSelectedCity(draftCity)
    setPickerOpen(false)
  }
  // --------------------------------------

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

  // ---- shared picker panel ----
  const pickerPanel = (
    <AnimatePresence initial={false}>
      {pickerOpen && (
        <motion.div
          key="picker"
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          className="cartv2-picker"
        >
          <div className="cartv2-picker-inner">
            <label className="cartv2-picker-field">
              <span className="cartv2-picker-label">State</span>
              <div className="cartv2-picker-select-wrap">
                <select
                  value={draftState}
                  onChange={handleStateChange}
                  className="cartv2-picker-select"
                >
                  <option value="">Select state…</option>
                  {nigerianStates.map((s) => (
                    <option key={s.name} value={s.name}>{s.name}</option>
                  ))}
                </select>
                <ChevronDown size={16} className="cartv2-picker-chev" />
              </div>
            </label>

            <label className="cartv2-picker-field">
              <span className="cartv2-picker-label">City</span>
              <div className="cartv2-picker-select-wrap">
                <select
                  value={draftCity}
                  onChange={(e) => setDraftCity(e.target.value)}
                  disabled={!draftState}
                  className="cartv2-picker-select"
                >
                  <option value="">
                    {draftState ? 'Select city…' : 'Pick a state first'}
                  </option>
                  {cityList.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
                <ChevronDown size={16} className="cartv2-picker-chev" />
              </div>
            </label>

            <div className="cartv2-picker-actions">
              <button
                type="button"
                className="cartv2-picker-cancel"
                onClick={closePicker}
              >
                Cancel
              </button>
              <button
                type="button"
                className="cartv2-picker-save"
                onClick={handleSave}
                disabled={!draftState || !draftCity}
              >
                <Check size={14} /> Save
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )

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
              <button
                type="button"
                className="cartv2-delivery-change"
                onClick={() => (pickerOpen ? closePicker() : openPicker())}
                aria-expanded={pickerOpen}
              >
                {pickerOpen ? 'Close' : 'Change'}
              </button>
            </div>
            {deliveryRange && !pickerOpen && (
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
            {pickerPanel}
          </div>
        ) : (
          <div className="cartv2-delivery">
            <button
              type="button"
              className="cartv2-delivery-prompt-btn"
              onClick={() => (pickerOpen ? closePicker() : openPicker())}
              aria-expanded={pickerOpen}
            >
              <MapPin size={16} className="cartv2-delivery-icon" />
              <span>Set your delivery location</span>
              <ChevronDown
                size={16}
                style={{
                  marginLeft: 'auto',
                  transform: pickerOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'transform 0.2s ease',
                }}
              />
            </button>
            {pickerPanel}
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
