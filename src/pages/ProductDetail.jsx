import { useState, useEffect, useRef } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import {
  ArrowLeft, ShoppingBag, Heart, Star, Package, Truck, Store,
  ChevronRight, Play, Image as ImageIcon, Minus, Plus,
  Flame, ShieldCheck, RotateCcw, Award, Share2, GitCompare,
  Banknote, Building2, Bitcoin, X as XIcon, ChevronLeft,
  CheckCircle2, ThumbsUp, Zap
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
import { FREE_DELIVERY_THRESHOLD_NGN } from '../data/deliveryZones'
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
  const [paymentMethod, setPaymentMethod] = useState('transfer') // default to bank transfer (safe everywhere)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxIdx, setLightboxIdx] = useState(0)
  const [reviewFilter, setReviewFilter] = useState('all')
  const [reviewsToShow, setReviewsToShow] = useState(4)
  const [stickyVisible, setStickyVisible] = useState(false)

  const heroRef = useRef(null)

  // Pay on Delivery is only available in Benin City (your operations base)
  const podAvailable = isPayOnDeliveryAvailable(selectedState, selectedCity)

  // If user had POD selected but switches to a city where POD isn't available,
  // automatically switch them to Bank Transfer.
  useEffect(() => {
    if (paymentMethod === 'pod' && !podAvailable) {
      setPaymentMethod('transfer')
    }
  }, [podAvailable, paymentMethod])

  // When POD becomes available (user picked Benin City), suggest it as default
  useEffect(() => {
    if (podAvailable && paymentMethod === 'transfer') {
      setPaymentMethod('pod')
    }
  }, [podAvailable])

  // Track recently viewed
  useEffect(() => {
    if (product) addRecentlyViewed(product.id)
  }, [product?.id])

  // Sticky scroll-aware mini bar
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
    document.body.style.overflow = lightboxOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [lightboxOpen])

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
  const finalTotal = baseTotal - bulkSavings

  const freeDeliveryThreshold = FREE_DELIVERY_THRESHOLD_NGN
  const amountNeeded = Math.max(0, freeDeliveryThreshold - finalTotal)
  const freeDeliveryProgress = Math.min(100, (finalTotal / freeDeliveryThreshold) * 100)
  const qualifiesForFreeDelivery = finalTotal >= freeDeliveryThreshold

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
  const handleAddToCart = () => addToCart(product, quantity)
  const handleBuyNow = () => {
    addToCart(product, quantity)
    navigate('/cart') // change to '/checkout' once you build it
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

        <div className="pdp-rating-row">
          <Star size={14} fill="#FFB800" stroke="#FFB800" />
          <span className="pdp-rating-num">{product.rating}</span>
          <span className="pdp-reviews">({product.reviewCount} Reviews)</span>
        </div>

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

        {/* QUANTITY */}
        <div className="pdp-qty-row">
          <span className="pdp-qty-label">Quantity</span>
          <div className="pdp-qty-control">
            <button className="pdp-qty-btn" onClick={handleQtyDecrease} disabled={quantity <= 1} aria-label="Decrease">
              <Minus size={16} />
            </button>
            <span className="pdp-qty-num">{quantity}</span>
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
        <LocationPicker cartSubtotal={finalTotal} />

        {/* PAYMENT METHOD — POD only when Benin City */}
        <div className="pdp-payment">
          <p className="pdp-payment-title">Payment method</p>
          <div className="pdp-payment-options">

            {/* Pay on Delivery — only available in Benin City */}
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
              💡 Pay on Delivery is only available in Benin City right now. Bank Transfer & USDT available everywhere.
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
              You save <strong>{formatNaira(bulkSavings)}</strong> · Total: <strong>{formatNaira(finalTotal)}</strong>
            </p>
          )}
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

        {/* REVIEWS */}
        <div className="pdp-static-section">
          <h2 className="pdp-static-title">Reviews</h2>

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

          <button className="pdp-rev-write">Write a review</button>
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

      {/* STICKY BOTTOM BAR */}
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
        <button className="pdp-buy-btn" onClick={handleBuyNow}>
          <Zap size={16} /> Buy Now
        </button>
      </div>
    </div>
  )
}
