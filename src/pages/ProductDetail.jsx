import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, ShoppingBag, Heart, Star, Package, Truck, Store, ChevronDown, ChevronRight, Play } from 'lucide-react'
import { products } from '../data/products'
import { useCart } from '../context/CartContext'
import ProductVisual from '../components/ProductVisual'
import ProductCard from '../components/ProductCard'
import './ProductDetail.css'

export default function ProductDetail() {
  const { slug } = useParams()
  const product = products.find(p => p.slug === slug)
  const { addToCart } = useCart()

  const [activeImage, setActiveImage] = useState(0)
  const [selectedVariant, setSelectedVariant] = useState(null)
  const [openSection, setOpenSection] = useState(null)
  const [wishlisted, setWishlisted] = useState(false)

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

  const relatedProducts = products
    .filter(p => p.id !== product.id && p.category === product.category)
    .slice(0, 6)

  const toggleSection = (name) => {
    setOpenSection(openSection === name ? null : name)
  }

  const handleAddToCart = () => {
    addToCart(product, 1)
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
          <span className="pdp-price">${product.price.toFixed(2)} USD</span>
          {hasDiscount && (
            <>
              <span className="pdp-old-price">${product.oldPrice.toFixed(2)} USD</span>
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

        {/* INFO ICONS */}
        <div className="pdp-meta-list">
          <div className="pdp-meta-item">
            <Package size={16} className="pdp-meta-icon" />
            <span className={product.stock > 0 ? 'pdp-stock-in' : 'pdp-stock-out'}>
              {product.stock > 0 ? 'In stock' : 'Out of stock'}
            </span>
          </div>
          <div className="pdp-meta-item">
            <Truck size={16} className="pdp-meta-icon" />
            <span>Free delivery</span>
          </div>
          <div className="pdp-meta-item">
            <Store size={16} className="pdp-meta-icon" />
            <span>Available in nearest store</span>
          </div>
        </div>

        {/* SHORT DESCRIPTION */}
        <p className="pdp-tagline">{product.tagline || product.description}</p>

        {/* ACCORDION SECTIONS */}
        <div className="pdp-sections">
          <button
            className={`pdp-section ${openSection === 'description' ? 'is-open' : ''}`}
            onClick={() => toggleSection('description')}
          >
            <span>Description</span>
            <ChevronDown size={18} className="pdp-section-icon" />
          </button>
          {openSection === 'description' && (
            <div className="pdp-section-body">
              <p>{product.description}</p>
            </div>
          )}

          <button
            className={`pdp-section ${openSection === 'video' ? 'is-open' : ''}`}
            onClick={() => toggleSection('video')}
          >
            <span>Video</span>
            <ChevronDown size={18} className="pdp-section-icon" />
          </button>
          {openSection === 'video' && (
            <div className="pdp-section-body">
              <div className="pdp-video-placeholder">
                <Play size={32} fill="#FFFFFF" stroke="none" />
                <p className="pdp-video-text">Product video coming soon</p>
                <p className="pdp-video-hint">YouTube embed will appear here</p>
              </div>
            </div>
          )}

          <button
            className={`pdp-section ${openSection === 'specs' ? 'is-open' : ''}`}
            onClick={() => toggleSection('specs')}
          >
            <span>Specs</span>
            <ChevronDown size={18} className="pdp-section-icon" />
          </button>
          {openSection === 'specs' && (
            <div className="pdp-section-body">
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
                <p className="pdp-empty">Specs coming soon</p>
              )}
            </div>
          )}

          <button
            className={`pdp-section ${openSection === 'box' ? 'is-open' : ''}`}
            onClick={() => toggleSection('box')}
          >
            <span>What's in the box</span>
            <ChevronDown size={18} className="pdp-section-icon" />
          </button>
          {openSection === 'box' && (
            <div className="pdp-section-body">
              {product.boxContents && product.boxContents.length > 0 ? (
                <ul className="pdp-box-list">
                  {product.boxContents.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              ) : (
                <ul className="pdp-box-list">
                  <li>1x {product.name}</li>
                  <li>1x User manual</li>
                  <li>1x Charging cable (where applicable)</li>
                </ul>
              )}
            </div>
          )}
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
          Add to Cart
        </button>
      </div>
    </div>
  )
}
