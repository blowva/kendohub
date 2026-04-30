import { useState, useEffect, useRef } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import {
  ArrowLeft, ShoppingBag, Heart, Star, Package, Truck, Store,
  ChevronRight, Play, Image as ImageIcon, Minus, Plus,
  Flame, ShieldCheck, RotateCcw, Award, Share2, GitCompare,
  Banknote, Building2, Bitcoin, X as XIcon, ChevronLeft,
  CheckCircle2, ThumbsUp, Zap, LogIn
} from 'lucide-react'
import { products } from '../data/products'
import { useCart } from '../context/CartContext'
import { useLocation } from '../context/LocationContext'
import ProductVisual from '../components/ProductVisual'
import ProductCard from '../components/ProductCard'
import LocationPicker from '../components/LocationPicker'
import { formatNaira } from '../utils/format'
import { addRecentlyViewed, getRecentlyViewed } from '../utils/recentlyViewed'
import { getReviewsForProduct, getRatingBreakdown } from '../data/reviews'
import { FREE_DELIVERY_THRESHOLD_NGN, getDeliveryFee } from '../data/deliveryZones'
import { isPayOnDeliveryAvailable } from '../data/nigerianCities'
import './ProductDetail.css'

export default function ProductDetail() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const product = products.find(p => p.slug === slug)
  const { addToCart } = useCart()
  const { selectedState, selectedCity } = useLocation()

  const [activeImage, setActiveImage] = useState(0)
  const [selectedVariant, setSelectedVariant] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const [wishlisted, setWishlisted] = useState(false)
  const [compared, setCompared] = useState(false)
  const [shareToast, setShareToast] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState('transfer')
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxIdx, setLightboxIdx] = useState(0)
  const [reviewFilter, setReviewFilter] = useState('all')
  const [reviewsToShow, setReviewsToShow] = useState(4)
  const [stickyVisible, setStickyVisible] = useState(false)

  // NEW: Quantity input modal state
  const [qtyModalOpen, setQtyModalOpen] = useState(false)
  const [qtyInputValue, setQtyInputValue] = useState('1')

  // NEW: Sign-in placeholder modal for write-a-review
  const [signinModalOpen, setSigninModalOpen] = useState(false)

  const heroRef = useRef(null)

  const podAvailable = isPayOnDeliveryAvailable(selectedState, selectedCity)

  useEffect(() => {
    if (paymentMethod === 'pod' && !podAvailable) setPaymentMethod('transfer')
  }, [podAvailable, paymentMethod])

  useEffect(() => {
    if (podAvailable && paymentMethod === 'transfer') setPaymentMethod('pod')
  }, [podAvailable])

  useEffect(() => {
    if (product) addRecentlyViewed(product.id)
  }, [product?.id])

  useEffect(() => {
    const handleScroll = () => {
      if (!heroRef.current) return
      const rect = heroRef.current.getBoundingClientRect()
      setStickyVisible(rect.bottom < 80)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = (lightboxOpen || qtyModalOpen || signinModalOpen) ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [lightboxOpen, qtyModalOpen, signinModalOpen])

  if (!product) {
    return (
      <div className="pdp-notfound">
        <h1>Product not found</h1>
        <Link to="/shop" className="pdp-back-link">← Back to shop</Link>
      </div>
    )
  }

  const variants = product.variants || []
  const hasDiscount = product.oldPrice && product.oldPrice > product.price
  const discountPercent = hasDiscount
    ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
    : 0

  let boxItems = []
  if (product.boxItems && product.boxItems.length > 0) {
    boxItems = product.boxItems
  } else if (product.boxContents && product.boxContents.length > 0) {
    boxItems = product.boxContents.map(label => ({ name: label, image: null }))
  } else {
    boxItems = [
      { name: product.name, image: null },
      { name: 'User manual', image: null },
      { name: 'Charging cable', image: null },
    ]
  }

  const stockLow = product.stock > 0 && product.stock <= 10

  const bulkTiers = [
    { qty: 2, percent: 5 },
    { qty: 3, percent: 10 },
    { qty: 5, percent: 15 },
  ]
  const activeBulkTier = [...bulkTiers].reverse().find(t => quantity >= t.qty)
  const baseTotal = product.price * quantity
  const bulkSavings = activeBulkTier ? (baseTotal * activeBulkTier.percent / 100) : 0
  const subtotalAfterDiscount = baseTotal - bulkSavings

  // Delivery fee calculation
  const feeInfo = (selectedState && selectedCity)
    ? getDeliveryFee(selectedState, selectedCity, subtotalAfterDiscount)
    : null
  const deliveryFee = feeInfo ? feeInfo.fee : 0
  const grandTotal = subtotalAfterDiscount + deliveryFee

  const freeDeliveryThreshold = FREE_DELIVERY_THRESHOLD_NGN
  const amountNeeded = Math.max(0, freeDeliveryThreshold - subtotalAfterDiscount)
  const freeDeliveryProgress = Math.min(100, (subtotalAfterDiscount / freeDeliveryThreshold) * 100)
  const qualifiesForFreeDelivery = subtotalAfterDiscount >= freeDeliveryThreshold

  const reviews = getReviewsForProduct(product, 8)
  const breakdown = getRatingBreakdown(reviews)
  const filteredReviews = reviewFilter === 'all'
    ? reviews
    : reviewFilter === 'verified'
    ? reviews.filter(r => r.verified)
    : reviews.filter(r => r.stars === parseInt(reviewFilter, 10))
  const visibleReviews = filteredReviews.slice(0, reviewsToShow)

  const recentlyViewedIds = getRecentlyViewed().filter(id => id !== product.id)
  const recentlyViewedProducts = recentlyViewedIds
    .map(id => products.find(p => p.id === id))
    .filter(Boolean)
    .slice(0, 6)

  const relatedProducts = products
    .filter(p => p.id !== product.id && p.category === product.category)
    .slice(0, 6)

  const handleQtyDecrease = () => quantity > 1 && setQuantity(quantity - 1)
  const handleQtyIncrease = () => quantity < (product.stock || 99) && setQuantity(quantity + 1)

  // NEW: Open quantity modal
  const openQtyModal = () => {
    setQtyInputValue(String(quantity))
    setQtyModalOpen(true)
  }
  const confirmQtyInput = () => {
    const parsed = parseInt(qtyInputValue, 10)
    if (!isNaN(parsed) && parsed >= 1) {
      const max = product.stock || 99
      setQuantity(Math.min(parsed, max))
    }
    setQtyModalOpen(false)
  }

  const handleAddToCart = () => addToCart(product, quantity)
  const handleBuyNow = () => {
    addToCart(product, quantity)
    navigate('/cart')
  }
  const handleShare = async () => {
    const url = window.location.href
    if (navigator.share) {
      try { await navigator.share({ title: product.name, text: product.tagline, url }) }
      catch (e) { /* cancelled */ }
    } else if (navigator.clipboard) {
      await navigator.clipboard.writeText(url)
      setShareToast(true)
      setTimeout(() => setShareToast(false), 2000)
    }
  }

  // NEW: Open sign-in placeholder
  const handleWriteReviewClick = () => {
    setSigninModalOpen(true)
  }

  const lightboxImages = [0, 1, 2]
  const handleLightboxNext = () => setLightboxIdx((lightboxIdx + 1) % lightboxImages.length)
  const handleLightboxPrev = () => setLightboxIdx((lightboxIdx - 1 + lightboxImages.length) % lightboxImages.length)

  return (
    <div className="pdp">
      {/* STICKY MINI BAR */}
      <div className={`pdp-sticky-mini ${stickyVisible ? 'is-visible' : ''}`}>
        <div className="pdp-sticky-mini-inner">
          <div className="pdp-sticky-mini-thumb">
            <ProductVisual product={product} />
          </div>
          <div className="pdp-sticky-mini-info">
            <p className="pdp-sticky-mini-name">{product.name}</p>
            <p className="pdp-sticky-mini-price">{formatNaira(product.price)}</p>
          </div>
          <button className="pdp-sticky-mini-btn" onClick={handleAddToCart}>Add</button>
        </div>
      </div>

      {/* TOP BAR */}
      <div className="pdp-topbar">
        <Link to="/shop" className="pdp-icon-btn" aria-label="Back">
          <ArrowLeft size={20} />
        </Link>
        <Link to="/cart" className="pdp-icon-btn" aria-label="Cart">
          <ShoppingBag size={20} />
        </Link>
      </div>

      {/* IMAGE GALLERY */}
      <div className="pdp-gallery" ref={heroRef}>
        <button
          className="pdp-image-main pdp-image-clickable"
          onClick={() => { setLightboxIdx(activeImage); setLightboxOpen(true) }}
          aria-label="Open image gallery"
        >
          <ProductVisual product={product} />
          <span className="pdp-image-zoom-hint"><span>🔍 Tap to zoom</span></span>
        </button>
        <div className="pdp-image-dots">
          {[0, 1, 2].map(i => (
            <button
              key={i}
              className={`pdp-dot ${activeImage === i ? 'is-active' : ''}`}
              onClick={() => setActiveImage(i)}
              aria-label={`Image ${i + 1}`}
            />
          ))}
        </div>
      </div>

      {/* LIGHTBOX */}
      {lightboxOpen && (
        <div className="pdp-lightbox" onClick={() => setLightboxOpen(false)}>
          <button className="pdp-lightbox-close" onClick={() => setLightboxOpen(false)} aria-label="Close gallery">
            <XIcon size={24} />
          </button>
          <button
            className="pdp-lightbox-nav pdp-lightbox-nav-prev"
            onClick={(e) => { e.stopPropagation(); handleLightboxPrev() }}
            aria-label="Previous"
          >
            <ChevronLeft size={28} />
          </button>
          <div className="pdp-lightbox-content" onClick={(e) => e.stopPropagation()}>
            <div className="pdp-lightbox-image">
              <ProductVisual product={product} />
            </div>
          </div>
          <button
            className="pdp-lightbox-nav pdp-lightbox-nav-next"
            onClick={(e) => { e.stopPropagation(); handleLightboxNext() }}
            aria-label="Next"
          >
            <ChevronRight size={28} />
          </button>
          <div className="pdp-lightbox-dots">
            {lightboxImages.map(i => (
              <button
                key={i}
                className={`pdp-dot pdp-dot-light ${lightboxIdx === i ? 'is-active' : ''}`}
                onClick={(e) => { e.stopPropagation(); setLightboxIdx(i) }}
              />
            ))}
          </div>
          <p className="pdp-lightbox-counter">{lightboxIdx + 1} / {lightboxImages.length}</p>
        </div>
      )}

      {/* INFO BLOCK */}
      <div className="pdp-info">
        <p className="pdp-brand">SHOPLY</p>
        <h1 className="pdp-name">{product.name}</h1>

        {/* CHANGE 4a: Replaced rating row with short tagline */}
        {product.tagline && (
          <p className="pdp-quick-tagline">{product.tagline}</p>
        )}

        <div className="pdp-price-row">
          <span className="pdp-price">{formatNaira(product.price)}</span>
          {hasDiscount && (
            <>
              <span className="pdp-old-price">{formatNaira(product.oldPrice)}</span>
              <span className="pdp-discount">-{discountPercent}%</span>
            </>
          )}
        </div>

        {/* FREE DELIVERY PROGRESS */}
        <div className={`pdp-free-prog ${qualifiesForFreeDelivery ? 'is-qualified' : ''}`}>
          {qualifiesForFreeDelivery ? (
            <div className="pdp-free-prog-success">
              <CheckCircle2 size={16} />
              <span>You qualify for <strong>FREE delivery</strong> 🎉</span>
            </div>
          ) : (
            <>
              <div className="pdp-free-prog-text">
                Add <strong>{formatNaira(amountNeeded)}</strong> more for FREE delivery
              </div>
              <div className="pdp-free-prog-bar">
                <div className="pdp-free-prog-fill" style={{ width: `${freeDeliveryProgress}%` }} />
              </div>
            </>
          )}
        </div>

        {/* VARIANTS */}
        {variants.length > 0 && (
          <div className="pdp-variants">
            <p className="pdp-variants-label">
              {product.variantType === 'color' ? 'Color' : 'Size'}
            </p>
            <div className="pdp-variants-list">
              {variants.map((v) => (
                <button
                  key={v}
                  className={`pdp-variant ${selectedVariant === v ? 'is-active' : ''}`}
                  onClick={() => setSelectedVariant(v)}
                >
                  {v}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* WISHLIST · SHARE · COMPARE */}
        <div className="pdp-action-row">
          <button
            className={`pdp-action-btn ${wishlisted ? 'is-active' : ''}`}
            onClick={() => setWishlisted(!wishlisted)}
          >
            <Heart size={16} fill={wishlisted ? '#FF3B5C' : 'none'} stroke={wishlisted ? '#FF3B5C' : '#0A1628'} />
            <span>{wishlisted ? 'Saved' : 'Wishlist'}</span>
          </button>
          <button className="pdp-action-btn" onClick={handleShare}>
            <Share2 size={16} />
            <span>Share</span>
          </button>
          <button
            className={`pdp-action-btn ${compared ? 'is-active' : ''}`}
            onClick={() => setCompared(!compared)}
          >
            <GitCompare size={16} />
            <span>{compared ? 'Added' : 'Compare'}</span>
          </button>
        </div>
        {shareToast && <div className="pdp-toast">Link copied to clipboard ✓</div>}

        {/* CHANGE 6: Quantity number is now tappable */}
        <div className="pdp-qty-row">
          <span className="pdp-qty-label">Quantity</span>
          <div className="pdp-qty-control">
            <button className="pdp-qty-btn" onClick={handleQtyDecrease} disabled={quantity <= 1} aria-label="Decrease">
              <Minus size={16} />
            </button>
            <button className="pdp-qty-num pdp-qty-num-tappable" onClick={openQtyModal} aria-label="Type quantity">
              {quantity}
            </button>
            <button className="pdp-qty-btn" onClick={handleQtyIncrease} disabled={quantity >= (product.stock || 99)} aria-label="Increase">
              <Plus size={16} />
            </button>
          </div>
        </div>

        {/* STOCK URGENCY */}
        {stockLow && (
          <div className="pdp-urgency">
            <Flame size={16} className="pdp-urgency-icon" />
            <span>Only <strong>{product.stock} left</strong> in stock — order soon</span>
          </div>
        )}

        {/* DELIVERY (state + city) */}
        <LocationPicker cartSubtotal={subtotalAfterDiscount} />

        {/* PAYMENT */}
        <div className="pdp-payment">
          <p className="pdp-payment-title">Payment method</p>
          <div className="pdp-payment-options">
            {podAvailable && (
              <button
                className={`pdp-payment-option ${paymentMethod === 'pod' ? 'is-active' : ''}`}
                onClick={() => setPaymentMethod('pod')}
              >
                <Banknote size={20} className="pdp-payment-icon" />
                <div className="pdp-payment-text">
                  <span className="pdp-payment-label">Pay on Delivery</span>
                  <span className="pdp-payment-sub">Available in Benin City · Inspect before paying</span>
                </div>
                {paymentMethod === 'pod' && <CheckCircle2 size={18} className="pdp-payment-check" />}
              </button>
            )}
            <button
              className={`pdp-payment-option ${paymentMethod === 'transfer' ? 'is-active' : ''}`}
              onClick={() => setPaymentMethod('transfer')}
            >
              <Building2 size={20} className="pdp-payment-icon" />
              <div className="pdp-payment-text">
                <span className="pdp-payment-label">Bank Transfer</span>
                <span className="pdp-payment-sub">Pay before shipping · Available everywhere</span>
              </div>
              {paymentMethod === 'transfer' && <CheckCircle2 size={18} className="pdp-payment-check" />}
            </button>
            <button
              className={`pdp-payment-option ${paymentMethod === 'usdt' ? 'is-active' : ''}`}
              onClick={() => setPaymentMethod('usdt')}
            >
              <Bitcoin size={20} className="pdp-payment-icon" />
              <div className="pdp-payment-text">
                <span className="pdp-payment-label">USDT (Crypto)</span>
                <span className="pdp-payment-sub">TRC-20 / BEP-20</span>
              </div>
              {paymentMethod === 'usdt' && <CheckCircle2 size={18} className="pdp-payment-check" />}
            </button>
          </div>
          {paymentMethod === 'pod' && podAvailable && (
            <p className="pdp-payment-reassurance">
              ✓ No upfront payment · ✓ Inspect item before paying · ✓ Cash or transfer at delivery
            </p>
          )}
          {!podAvailable && selectedCity && (
            <p className="pdp-payment-note">
              💡 Pay on Delivery is only available in Benin City right now.
            </p>
          )}
        </div>

        {/* BULK */}
        <div className="pdp-bulk">
          <p className="pdp-bulk-title">Save more when you buy more</p>
          <div className="pdp-bulk-tiers">
            {bulkTiers.map((tier) => {
              const active = quantity >= tier.qty
              return (
                <div key={tier.qty} className={`pdp-bulk-tier ${active ? 'is-active' : ''}`}>
                  <span className="pdp-bulk-qty">Buy {tier.qty}+</span>
                  <span className="pdp-bulk-save">Save {tier.percent}%</span>
                </div>
              )
            })}
          </div>
          {activeBulkTier && (
            <p className="pdp-bulk-savings-now">
              You save <strong>{formatNaira(bulkSavings)}</strong> · Total: <strong>{formatNaira(subtotalAfterDiscount)}</strong>
            </p>
          )}
        </div>

        {/* CHANGE 1+2: ORDER SUMMARY + INLINE BUY NOW */}
        <div className="pdp-order-summary">
          <p className="pdp-order-title">Order summary</p>
          <div className="pdp-order-row">
            <span>Subtotal ({quantity} item{quantity > 1 ? 's' : ''})</span>
            <strong>{formatNaira(baseTotal)}</strong>
          </div>
          {bulkSavings > 0 && (
            <div className="pdp-order-row pdp-order-row-discount">
              <span>Bulk discount ({activeBulkTier.percent}%)</span>
              <strong>-{formatNaira(bulkSavings)}</strong>
            </div>
          )}
          {selectedState && selectedCity && feeInfo && (
            <div className="pdp-order-row">
              <span>Delivery to {selectedCity}</span>
              {feeInfo.free ? (
                <strong className="pdp-order-free">FREE</strong>
              ) : (
                <strong>{formatNaira(deliveryFee)}</strong>
              )}
            </div>
          )}
          <div className="pdp-order-divider" />
          <div className="pdp-order-row pdp-order-row-total">
            <span>Total</span>
            <strong>{formatNaira(grandTotal)}</strong>
          </div>
          <button className="pdp-order-buy-now" onClick={handleBuyNow}>
            <Zap size={18} /> Buy Now
          </button>
        </div>

        {/* META LIST */}
        <div className="pdp-meta-list">
          <div className="pdp-meta-item">
            <Package size={16} className="pdp-meta-icon" />
            <span className={product.stock > 0 ? 'pdp-stock-in' : 'pdp-stock-out'}>
              {product.stock > 0 ? 'In stock' : 'Out of stock'}
            </span>
          </div>
          <div className="pdp-meta-item">
            <Truck size={16} className="pdp-meta-icon" />
            <span>Free delivery on orders over {formatNaira(freeDeliveryThreshold)}</span>
          </div>
          <div className="pdp-meta-item">
            <Store size={16} className="pdp-meta-icon" />
            <span>Available in nearest store</span>
          </div>
        </div>

        {/* TRUST BADGES */}
        <div className="pdp-trust">
          <div className="pdp-trust-item">
            <ShieldCheck size={20} className="pdp-trust-icon" />
            <span className="pdp-trust-text">Secure<br/>checkout</span>
          </div>
          <div className="pdp-trust-item">
            <RotateCcw size={20} className="pdp-trust-icon" />
            <span className="pdp-trust-text">30-day<br/>returns</span>
          </div>
          <div className="pdp-trust-item">
            <Award size={20} className="pdp-trust-icon" />
            <span className="pdp-trust-text">1-year<br/>warranty</span>
          </div>
        </div>

        <p className="pdp-tagline">{product.tagline || product.description}</p>

        {/* DESCRIPTION */}
        <div className="pdp-static-section">
          <h2 className="pdp-static-title">Description</h2>
          <p className="pdp-static-body">{product.description}</p>
        </div>

        {/* SPECIFICATIONS */}
        <div className="pdp-static-section">
          <h2 className="pdp-static-title">Specifications</h2>
          {product.specs && Object.keys(product.specs).length > 0 ? (
            <ul className="pdp-specs-list">
              {Object.entries(product.specs).map(([key, value]) => (
                <li key={key}>
                  <span className="pdp-spec-key">{key}</span>
                  <span className="pdp-spec-val">{value}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="pdp-empty">Specifications coming soon</p>
          )}
        </div>

        {/* VIDEO */}
        <div className="pdp-static-section">
          <h2 className="pdp-static-title">Video</h2>
          <div className="pdp-video-placeholder">
            <Play size={32} fill="#FFFFFF" stroke="none" />
            <p className="pdp-video-text">Product video coming soon</p>
            <p className="pdp-video-hint">YouTube embed will appear here</p>
          </div>
        </div>

        {/* WHAT'S IN THE BOX */}
        <div className="pdp-static-section">
          <h2 className="pdp-static-title">What's in the box</h2>
          <div className="pdp-box-grid">
            {boxItems.map((item, i) => (
              <div key={i} className="pdp-box-item">
                <div className="pdp-box-photo">
                  {item.image ? (
                    <img src={item.image} alt={item.name} />
                  ) : (
                    <div className="pdp-box-photo-placeholder">
                      <ImageIcon size={28} strokeWidth={1.5} />
                    </div>
                  )}
                </div>
                <p className="pdp-box-label">{item.name}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CHANGE 4b: CUSTOMER REVIEWS */}
        <div className="pdp-static-section">
          <h2 className="pdp-static-title">Customer Reviews</h2>

          {breakdown && (
            <div className="pdp-rev-summary">
              <div className="pdp-rev-score">
                <span className="pdp-rev-score-num">{product.rating}</span>
                <div className="pdp-rev-score-stars">
                  {[1, 2, 3, 4, 5].map(i => (
                    <Star
                      key={i}
                      size={14}
                      fill={i <= Math.round(product.rating) ? '#FFB800' : 'none'}
                      stroke={i <= Math.round(product.rating) ? '#FFB800' : '#C0C7D0'}
                    />
                  ))}
                </div>
                <span className="pdp-rev-score-count">{product.reviewCount} reviews</span>
              </div>
              <div className="pdp-rev-bars">
                {[5, 4, 3, 2, 1].map(stars => (
                  <div key={stars} className="pdp-rev-bar-row">
                    <span className="pdp-rev-bar-label">{stars}★</span>
                    <div className="pdp-rev-bar-track">
                      <div className="pdp-rev-bar-fill" style={{ width: `${breakdown[stars]?.pct || 0}%` }} />
                    </div>
                    <span className="pdp-rev-bar-pct">{breakdown[stars]?.pct || 0}%</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="pdp-rev-filters">
            {[
              { key: 'all', label: 'All' },
              { key: '5', label: '5★' },
              { key: '4', label: '4★' },
              { key: '3', label: '3★' },
              { key: 'verified', label: 'Verified' },
            ].map(f => (
              <button
                key={f.key}
                className={`pdp-rev-filter ${reviewFilter === f.key ? 'is-active' : ''}`}
                onClick={() => { setReviewFilter(f.key); setReviewsToShow(4) }}
              >
                {f.label}
              </button>
            ))}
          </div>

          {visibleReviews.length === 0 ? (
            <p className="pdp-empty">No reviews match this filter yet.</p>
          ) : (
            <div className="pdp-rev-list">
              {visibleReviews.map(rev => (
                <div key={rev.id} className="pdp-rev-card">
                  <div className="pdp-rev-card-head">
                    <div className="pdp-rev-avatar">{rev.name.charAt(0)}</div>
                    <div className="pdp-rev-meta">
                      <div className="pdp-rev-name-row">
                        <span className="pdp-rev-name">{rev.name}</span>
                        {rev.verified && (
                          <span className="pdp-rev-verified">
                            <CheckCircle2 size={11} /> Verified
                          </span>
                        )}
                      </div>
                      <div className="pdp-rev-stars-row">
                        <div className="pdp-rev-stars">
                          {[1,2,3,4,5].map(i => (
                            <Star
                              key={i}
                              size={11}
                              fill={i <= rev.stars ? '#FFB800' : 'none'}
                              stroke={i <= rev.stars ? '#FFB800' : '#C0C7D0'}
                            />
                          ))}
                        </div>
                        <span className="pdp-rev-time">· {rev.time}</span>
                      </div>
                    </div>
                  </div>
                  <p className="pdp-rev-body">{rev.body}</p>
                  <button className="pdp-rev-helpful">
                    <ThumbsUp size={12} /> Helpful ({rev.helpful})
                  </button>
                </div>
              ))}
            </div>
          )}

          {filteredReviews.length > reviewsToShow && (
            <button className="pdp-rev-loadmore" onClick={() => setReviewsToShow(reviewsToShow + 4)}>
              Show more reviews
            </button>
          )}

          {/* CHANGE 4b: Write a review now opens sign-in placeholder */}
          <button className="pdp-rev-write" onClick={handleWriteReviewClick}>
            Write a review
          </button>
        </div>

        {/* RELATED */}
        {relatedProducts.length > 0 && (
          <div className="pdp-related">
            <div className="pdp-related-head">
              <h2 className="pdp-related-title">You may also like</h2>
              <Link to="/shop" className="pdp-related-link">
                See all <ChevronRight size={14} />
              </Link>
            </div>
            <div className="pdp-related-scroller">
              {relatedProducts.map(p => (
                <div key={p.id} className="pdp-related-card">
                  <ProductCard product={p} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* RECENTLY VIEWED */}
        {recentlyViewedProducts.length > 0 && (
          <div className="pdp-related">
            <div className="pdp-related-head">
              <h2 className="pdp-related-title">Recently viewed</h2>
            </div>
            <div className="pdp-related-scroller">
              {recentlyViewedProducts.map(p => (
                <div key={p.id} className="pdp-related-card">
                  <ProductCard product={p} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* CHANGE 1: Buy Now removed from sticky bar — only ♥ + Add to Cart now */}
      <div className="pdp-bottombar">
        <button
          className={`pdp-wishlist-btn ${wishlisted ? 'is-active' : ''}`}
          onClick={() => setWishlisted(!wishlisted)}
          aria-label="Wishlist"
        >
          <Heart size={20} fill={wishlisted ? '#FF3B5C' : 'none'} stroke={wishlisted ? '#FF3B5C' : '#0A1628'} />
        </button>
        <button className="pdp-add-btn" onClick={handleAddToCart}>
          Add to Cart {quantity > 1 && `· ${quantity}`}
        </button>
      </div>

      {/* CHANGE 6: QUANTITY INPUT MODAL */}
      {qtyModalOpen && (
        <div className="pdp-modal-overlay" onClick={() => setQtyModalOpen(false)}>
          <div className="pdp-modal pdp-modal-qty" onClick={(e) => e.stopPropagation()}>
            <button
              className="pdp-modal-close"
              onClick={() => setQtyModalOpen(false)}
              aria-label="Close"
            >
              <XIcon size={20} />
            </button>
            <h3 className="pdp-modal-title">Enter quantity</h3>
            <p className="pdp-modal-sub">
              Max {product.stock || 99} available
            </p>
            <input
              type="number"
              min="1"
              max={product.stock || 99}
              value={qtyInputValue}
              onChange={(e) => setQtyInputValue(e.target.value)}
              className="pdp-modal-qty-input"
              autoFocus
              onKeyDown={(e) => { if (e.key === 'Enter') confirmQtyInput() }}
            />
            <div className="pdp-modal-qty-quick">
              {[1, 2, 5, 10, 20, 50].map(n => (
                <button
                  key={n}
                  className="pdp-modal-qty-quick-btn"
                  onClick={() => setQtyInputValue(String(n))}
                  disabled={n > (product.stock || 99)}
                >
                  {n}
                </button>
              ))}
            </div>
            <div className="pdp-modal-actions">
              <button className="pdp-modal-cancel" onClick={() => setQtyModalOpen(false)}>
                Cancel
              </button>
              <button className="pdp-modal-confirm" onClick={confirmQtyInput}>
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CHANGE 4b: SIGN-IN PLACEHOLDER MODAL */}
      {signinModalOpen && (
        <div className="pdp-modal-overlay" onClick={() => setSigninModalOpen(false)}>
          <div className="pdp-modal pdp-modal-signin" onClick={(e) => e.stopPropagation()}>
            <button
              className="pdp-modal-close"
              onClick={() => setSigninModalOpen(false)}
              aria-label="Close"
            >
              <XIcon size={20} />
            </button>
            <div className="pdp-modal-icon">
              <LogIn size={32} />
            </div>
            <h3 className="pdp-modal-title">Sign in to leave a review</h3>
            <p className="pdp-modal-sub">
              Only customers who have signed in can post reviews. We're working on the sign-in feature now.
            </p>
            <div className="pdp-modal-soon">
              <Zap size={14} /> Coming soon
            </div>
            <button className="pdp-modal-confirm pdp-modal-confirm-full" onClick={() => setSigninModalOpen(false)}>
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
