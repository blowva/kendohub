import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import {
  ArrowLeft, ShoppingBag, Heart, Star, Package, Truck, Store,
  ChevronRight, Play, Image as ImageIcon, Minus, Plus,
  Flame, ShieldCheck, RotateCcw, Award, Share2, GitCompare
} from 'lucide-react'
import { products } from '../data/products'
import { useCart } from '../context/CartContext'
import ProductVisual from '../components/ProductVisual'
import ProductCard from '../components/ProductCard'
import LocationPicker from '../components/LocationPicker'
import { formatNaira } from '../utils/format'
import './ProductDetail.css'

export default function ProductDetail() {
  const { slug } = useParams()
  const product = products.find(p => p.slug === slug)
  const { addToCart } = useCart()

  const [activeImage, setActiveImage] = useState(0)
  const [selectedVariant, setSelectedVariant] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const [wishlisted, setWishlisted] = useState(false)
  const [compared, setCompared] = useState(false)
  const [shareToast, setShareToast] = useState(false)

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

  // Box items normalization
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

  const relatedProducts = products
    .filter(p => p.id !== product.id && p.category === product.category)
    .slice(0, 6)

  // Stock urgency
  const stockLow = product.stock > 0 && product.stock <= 10

  // Bulk discount tiers
  const bulkTiers = [
    { qty: 2, percent: 5 },
    { qty: 3, percent: 10 },
    { qty: 5, percent: 15 },
  ]
  const activeBulkTier = [...bulkTiers].reverse().find(t => quantity >= t.qty)
  const baseTotal = product.price * quantity
  const bulkSavings = activeBulkTier ? (baseTotal * activeBulkTier.percent / 100) : 0
  const finalTotal = baseTotal - bulkSavings

  const handleQtyDecrease = () => {
    if (quantity > 1) setQuantity(quantity - 1)
  }
  const handleQtyIncrease = () => {
    if (quantity < (product.stock || 99)) setQuantity(quantity + 1)
  }
  const handleAddToCart = () => {
    addToCart(product, quantity)
  }
  const handleShare = async () => {
    const url = window.location.href
    if (navigator.share) {
      try {
        await navigator.share({ title: product.name, text: product.tagline, url })
      } catch (e) { /* cancelled */ }
    } else if (navigator.clipboard) {
      await navigator.clipboard.writeText(url)
      setShareToast(true)
      setTimeout(() => setShareToast(false), 2000)
    }
  }

  return (
    <div className="pdp">
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
      <div className="pdp-gallery">
        <div className="pdp-image-main">
          <ProductVisual product={product} />
        </div>
        <div className="pdp-image-dots">
          <button
            className={`pdp-dot ${activeImage === 0 ? 'is-active' : ''}`}
            onClick={() => setActiveImage(0)}
            aria-label="Image 1"
          />
          <button
            className={`pdp-dot ${activeImage === 1 ? 'is-active' : ''}`}
            onClick={() => setActiveImage(1)}
            aria-label="Image 2"
          />
          <button
            className={`pdp-dot ${activeImage === 2 ? 'is-active' : ''}`}
            onClick={() => setActiveImage(2)}
            aria-label="Image 3"
          />
        </div>
      </div>

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

        {/* WISHLIST · SHARE · COMPARE row */}
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
        {shareToast && (
          <div className="pdp-toast">Link copied to clipboard ✓</div>
        )}

        {/* QUANTITY SELECTOR */}
        <div className="pdp-qty-row">
          <span className="pdp-qty-label">Quantity</span>
          <div className="pdp-qty-control">
            <button
              className="pdp-qty-btn"
              onClick={handleQtyDecrease}
              disabled={quantity <= 1}
              aria-label="Decrease quantity"
            >
              <Minus size={16} />
            </button>
            <span className="pdp-qty-num">{quantity}</span>
            <button
              className="pdp-qty-btn"
              onClick={handleQtyIncrease}
              disabled={quantity >= (product.stock || 99)}
              aria-label="Increase quantity"
            >
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

        {/* DELIVERY ESTIMATE BY STATE (auto-IP + manual override) */}
        <LocationPicker cartSubtotal={finalTotal} />

        {/* BULK DISCOUNT TIERS */}
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
            <span>Free delivery on orders over {formatNaira(100000)}</span>
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

        {/* TAGLINE */}
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

        {/* RELATED PRODUCTS */}
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
      </div>
    </div>
  )
}
