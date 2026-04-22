import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Minus, Plus, Star, Truck, RotateCcw, Shield, Check } from 'lucide-react';
import ProductVisual from '../components/ProductVisual';
import ProductCard from '../components/ProductCard';
import { getProductBySlug, products } from '../data/products';
import { useCart } from '../context/CartContext';
import './ProductDetail.css';

export default function ProductDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const product = getProductBySlug(slug);
  const { add } = useCart();
  const [qty, setQty] = useState(1);
  const [justAdded, setJustAdded] = useState(false);

  useEffect(() => { window.scrollTo({ top: 0 }); }, [slug]);

  if (!product) {
    return (
      <div className="container page-enter pd-404">
        <p className="eyebrow">404</p>
        <h1 className="display">Product not found.</h1>
        <Link to="/shop" className="btn">← Back to shop</Link>
      </div>
    );
  }

  const related = products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 3);

  const handleAdd = () => {
    for (let i = 0; i < qty; i++) add(product);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 2000);
  };

  const productSeed = parseInt(product.id.replace('p', ''), 10);

  return (
    <div className="page-enter pd">
      <div className="container">
        <button className="pd-back" onClick={() => navigate(-1)}>
          <ArrowLeft size={14} /> Back
        </button>

        <div className="pd-grid">
          {/* ======== Gallery ======== */}
          <div className="pd-gallery">
            <div className="pd-main-visual">
              <div className="pd-badges">
                {product.isHot && <span className="chip chip-hot">Hot</span>}
                {product.isNew && <span className="chip chip-new">New</span>}
                {product.tags.map((t) => (
                  <span className="chip" key={t}>{t}</span>
                ))}
              </div>
              <span className="pd-num mono">№ {product.id.replace('p', '').padStart(3, '0')}</span>
              <ProductVisual category={product.category} seed={productSeed} size="lg" />
            </div>
            <div className="pd-thumbs">
              {[0, 1, 2, 3].map((i) => (
                <button key={i} className={`pd-thumb ${i === 0 ? 'is-active' : ''}`}>
                  <ProductVisual category={product.category} seed={productSeed + i * 7} />
                </button>
              ))}
            </div>
          </div>

          {/* ======== Info ======== */}
          <div className="pd-info">
            <p className="eyebrow pd-breadcrumb">
              <Link to="/shop">Shop</Link> / <Link to={`/shop?cat=${product.category}`}>{product.category}</Link>
            </p>

            <h1 className="display pd-name">{product.name}</h1>
            <p className="pd-tagline">{product.tagline}</p>

            <div className="pd-meta">
              <span className="pd-rating">
                <Star size={14} fill="currentColor" strokeWidth={0} /> {product.rating}
                <span className="pd-review-count">({product.reviewCount.toLocaleString()} reviews)</span>
              </span>
              <span className="pd-stock">
                {product.stock > 20 ? (
                  <><span className="pd-stock-dot pd-stock-ok" /> In stock</>
                ) : product.stock > 0 ? (
                  <><span className="pd-stock-dot pd-stock-low" /> Only {product.stock} left</>
                ) : (
                  <><span className="pd-stock-dot pd-stock-out" /> Out of stock</>
                )}
              </span>
            </div>

            <div className="pd-prices">
              <span className="pd-price display">${product.price.toFixed(2)}</span>
              {product.oldPrice && (
                <>
                  <span className="pd-old">${product.oldPrice.toFixed(2)}</span>
                  <span className="pd-save mono">
                    Save {Math.round((1 - product.price / product.oldPrice) * 100)}%
                  </span>
                </>
              )}
            </div>

            <p className="pd-desc">{product.description}</p>

            <div className="pd-qty-row">
              <div className="pd-qty">
                <button onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="Decrease quantity">
                  <Minus size={14} />
                </button>
                <span>{qty}</span>
                <button onClick={() => setQty((q) => q + 1)} aria-label="Increase quantity">
                  <Plus size={14} />
                </button>
              </div>
              <button className={`btn btn-accent pd-add ${justAdded ? 'is-added' : ''}`} onClick={handleAdd}>
                {justAdded ? (
                  <><Check size={14} /> Added to cart</>
                ) : (
                  <>Add to cart — ${(product.price * qty).toFixed(2)}</>
                )}
              </button>
            </div>

            <ul className="pd-perks">
              <li><Truck size={16} strokeWidth={1.3} /> Free shipping over $200</li>
              <li><RotateCcw size={16} strokeWidth={1.3} /> 30-day returns, no questions</li>
              <li><Shield size={16} strokeWidth={1.3} /> 2-year manufacturer warranty</li>
            </ul>
          </div>
        </div>

        {/* ======== Specs ======== */}
        <section className="pd-specs-block">
          <div className="pd-specs-head">
            <p className="eyebrow">Specifications</p>
            <h2 className="display pd-specs-title">The details that matter.</h2>
          </div>
          <dl className="pd-specs">
            {Object.entries(product.specs).map(([k, v]) => (
              <div key={k} className="pd-spec-row">
                <dt className="mono">{k}</dt>
                <dd>{v}</dd>
              </div>
            ))}
          </dl>
        </section>

        {/* ======== Related ======== */}
        {related.length > 0 && (
          <section className="pd-related">
            <header className="sec-head">
              <div>
                <p className="eyebrow">You may also like</p>
                <h2 className="display sec-title">From the same shelf</h2>
              </div>
            </header>
            <div className="product-grid product-grid-3">
              {related.map((p, i) => (
                <ProductCard product={p} key={p.id} index={i} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
