import { Link } from 'react-router-dom';
import { Star, ShoppingCart } from 'lucide-react';
import { useCart } from '../context/CartContext';
import ProductVisual from './ProductVisual';
import './ProductCard.css';

export default function ProductCard({ product, index = 0 }) {
  const { add } = useCart();

  return (
    <article className="pcard" style={{ animationDelay: `${index * 60}ms` }}>
      <Link to={`/product/${product.slug}`} className="pcard-media">
        <div className="pcard-badges">
          {product.isHot && <span className="chip chip-hot">HOT</span>}
          {product.isNew && <span className="chip chip-new">NEW</span>}
        </div>
        <ProductVisual
          category={product.category}
          seed={parseInt(product.id.replace('p', ''), 10)}
        />
      </Link>

      <div className="pcard-body">
        <div className="pcard-meta">
          <span className="mono pcard-cat">{product.category}</span>
          <span className="pcard-rating">
            <Star size={11} fill="currentColor" strokeWidth={0} /> {product.rating}
          </span>
        </div>

        <Link to={`/product/${product.slug}`} className="pcard-name-link">
          <h3 className="pcard-name display">{product.name}</h3>
        </Link>
        <p className="pcard-tag">{product.tagline}</p>

        <div className="pcard-foot">
          <div className="pcard-prices">
            <span className="pcard-price">${product.price.toFixed(2)}</span>
            {product.oldPrice && (
              <span className="pcard-old">${product.oldPrice.toFixed(2)}</span>
            )}
          </div>
          <button
            className="pcard-add"
            onClick={(e) => {
              e.preventDefault();
              add(product);
            }}
            aria-label={`Add ${product.name} to cart`}
          >
            <ShoppingCart size={13} strokeWidth={2} />
            <span>Add</span>
          </button>
        </div>
      </div>
    </article>
  );
}