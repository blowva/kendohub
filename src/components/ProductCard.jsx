import { Link } from 'react-router-dom'
import { Heart, Star } from 'lucide-react'
import { useCart } from '../context/CartContext'
import ProductVisual from './ProductVisual'
import { formatNaira } from '../utils/format'
import './ProductCard.css'

export default function ProductCard({ product, variant = 'default' }) {
  const { addToCart } = useCart()

  const handleAddToCart = (e) => {
    e.preventDefault()
    e.stopPropagation()
    addToCart(product, 1)
  }

  const handleBuyNow = (e) => {
    e.preventDefault()
    e.stopPropagation()
    addToCart(product, 1)
    window.location.href = '/cart'
  }

  const showCategoryTag = variant === 'hot-new'
  const showBadge = product.isHot || product.isNew

  return (
    <Link to={`/product/${product.slug}`} className="pc">
      <div className="pc-image-wrap">
        {showCategoryTag && (
          <span className="pc-cat-tag">{product.category}</span>
        )}
        {showBadge && (
          <span className={`pc-badge ${product.isHot ? 'is-hot' : 'is-new'}`}>
            {product.isHot ? 'HOT' : 'NEW'}
          </span>
        )}
        <button className="pc-wishlist" aria-label="Add to wishlist">
          <Heart size={16} strokeWidth={2} />
        </button>
        <div className="pc-image">
          <ProductVisual product={product} />
        </div>
      </div>
      <div className="pc-body">
        <h3 className="pc-name">{product.name}</h3>

        {/* NEW: tagline appears below name */}
        {product.tagline && (
          <p className="pc-tagline">{product.tagline}</p>
        )}

        <div className="pc-meta">
          <span className="pc-rating">
            <Star size={12} fill="#FFB800" stroke="#FFB800" />
            <span className="pc-rating-num">{product.rating}</span>
            <span className="pc-reviews">({product.reviewCount})</span>
          </span>
          {/* CHANGED: $ → ₦ via formatNaira helper */}
          <span className="pc-price">{formatNaira(product.price)}</span>
        </div>
        <div className="pc-actions">
          <button className="pc-btn pc-btn-add" onClick={handleAddToCart}>
            Add to Cart
          </button>
          <button className="pc-btn pc-btn-buy" onClick={handleBuyNow}>
            Buy Now
          </button>
        </div>
      </div>
    </Link>
  )
}
