import { useState, useMemo, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { LayoutGrid, Projector, Monitor, Cpu, Headphones, Plug, ArrowRight } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import HeroCarousel from '../components/HeroCarousel';
import SearchBar from '../components/SearchBar';
import ProductVisual from '../components/ProductVisual';
import { products, hotProducts, newProducts, categories } from '../data/products';
import { formatNaira } from '../utils/format';
import './Home.css';

const NGN_RATE = 1650;

const CARD_COLORS = ['#F5C842', '#1B3A6B', '#E8D5B5', '#F2BEC4', '#0a8bb8', '#2c2c2c', '#d9e6f0'];

const CAT_ICONS = {
  all: LayoutGrid,
  projectors: Projector,
  screens: Monitor,
  gadgets: Cpu,
  audio: Headphones,
  accessories: Plug,
};

const SORT_OPTIONS = [
  { value: 'newest',     label: 'Newest first' },
  { value: 'price-asc',  label: 'Price: low to high' },
  { value: 'price-desc', label: 'Price: high to low' },
  { value: 'rating',     label: 'Highest rated' },
];

// Build the rail — Hot first, then New, deduped, capped at 7
const hotAndNewRail = [
  ...hotProducts,
  ...newProducts.filter((p) => !hotProducts.some((h) => h.id === p.id)),
].slice(0, 7);

export default function Home() {
  const [selectedCat, setSelectedCat] = useState('all');
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState('newest');
  const [sortOpen, setSortOpen] = useState(false);

  const sortRef = useRef(null);

  useEffect(() => {
    if (!sortOpen) return;
    const onClick = (e) => {
      if (sortRef.current && !sortRef.current.contains(e.target)) {
        setSortOpen(false);
      }
    };
    const onKey = (e) => { if (e.key === 'Escape') setSortOpen(false); };
    document.addEventListener('mousedown', onClick);
    document.addEventListener('touchstart', onClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onClick);
      document.removeEventListener('touchstart', onClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [sortOpen]);

  const filteredProducts = useMemo(() => {
    let result = selectedCat === 'all'
      ? [...products]
      : products.filter((p) => p.category === selectedCat);

    if (query.trim()) {
      const q = query.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.tagline?.toLowerCase().includes(q)
      );
    }

    switch (sort) {
      case 'price-asc':  result.sort((a, b) => a.price - b.price); break;
      case 'price-desc': result.sort((a, b) => b.price - a.price); break;
      case 'rating':     result.sort((a, b) => b.rating - a.rating); break;
      case 'newest':     result.sort((a, b) => Number(b.isNew) - Number(a.isNew)); break;
      default: break;
    }

    return result;
  }, [selectedCat, query, sort]);

  return (
    <div className="page-enter">
      <HeroCarousel />

      <div className="home-search-wrap">
        <div className="container">
          <SearchBar onChange={setQuery} />
        </div>
      </div>

      {/* Hot & New Arrivals — horizontal rail */}
      <section className="section">
        <div className="container">
          <div className="sec-head">
            <h2 className="display sec-title">Hot &amp; New Arrivals 🔥✨</h2>
            <Link to="/shop?filter=hot" className="sec-link">See all →</Link>
          </div>
        </div>

        {/* Rail: full-bleed so cards can scroll past edges naturally */}
        <div className="hot-rail-wrap">
          <div className="hot-rail">
            <div className="hot-rail-spacer" aria-hidden="true" />
            {hotAndNewRail.map((p, i) => (
              <ArrivalCard
                product={p}
                color={CARD_COLORS[i % CARD_COLORS.length]}
                key={p.id}
              />
            ))}
            <div className="hot-rail-spacer" aria-hidden="true" />
          </div>
        </div>

        <div className="container">
          <Link to="/shop?filter=hot" className="hot-rail-more">
            See more hot products <ArrowRight size={14} />
          </Link>
        </div>
      </section>

      {/* Categories */}
      <section className="section">
        <div className="container">
          <div className="sec-head">
            <h2 className="display sec-title">Categories</h2>

            <div className="sort-pop" ref={sortRef}>
              <button
                type="button"
                className="sec-sort-btn"
                onClick={() => setSortOpen((o) => !o)}
                aria-haspopup="listbox"
                aria-expanded={sortOpen}
              >
                Sort
              </button>

              {sortOpen && (
                <div className="sort-pop-menu" role="listbox" aria-label="Sort products">
                  {SORT_OPTIONS.map((opt) => {
                    const isActive = opt.value === sort;
                    return (
                      <button
                        key={opt.value}
                        type="button"
                        role="option"
                        aria-selected={isActive}
                        className={`sort-pop-item ${isActive ? 'is-active' : ''}`}
                        onClick={() => {
                          setSort(opt.value);
                          setSortOpen(false);
                        }}
                      >
                        {opt.label}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          <div className="cat-row">
            {categories.map((c) => {
              const Icon = CAT_ICONS[c.id] || LayoutGrid;
              return (
                <button
                  key={c.id}
                  className={`cat-chip ${selectedCat === c.id ? 'is-active' : ''}`}
                  onClick={() => setSelectedCat(c.id)}
                >
                  <Icon size={18} strokeWidth={1.5} />
                  <span className="cat-chip-name">{(c.name || '').toUpperCase()}</span>
                  <span className="cat-chip-count">{c.count} products</span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* All Products */}
      <section className="section section-last">
        <div className="container">
          <div className="sec-head">
            <h2 className="display sec-title">All Products</h2>
            <span className="sec-count mono">{filteredProducts.length} items</span>
          </div>
          <div className="product-grid product-grid-3">
            {filteredProducts.map((p, i) => (
              <ProductCard product={p} key={p.id} index={i} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

function ArrivalCard({ product, color }) {
  const light = isLightColor(color);

  const seedValue = typeof product.id === 'string'
    ? parseInt(product.id.replace(/\D/g, ''), 10) || 0
    : (product.id || 0);

  return (
    <Link
      to={`/product/${product.slug}`}
      className="arrival-card"
      style={{ '--card-bg': color }}
    >
      <div className="arrival-badges">
        {product.isHot && <span className="arrival-pill pill-hot">HOT</span>}
        {!product.isHot && product.isNew && <span className="arrival-pill pill-new">NEW</span>}
      </div>
      <div className="arrival-visual">
        <ProductVisual
          category={product.category}
          seed={seedValue}
        />
      </div>
      <div className={`arrival-info ${light ? 'on-light' : 'on-dark'}`}>
        <p className="arrival-name">{product.name}</p>
        {product.tagline && (
          <p className="arrival-tagline">{product.tagline}</p>
        )}
        <p className="arrival-price">{formatNaira(product.price * NGN_RATE)}</p>
      </div>
    </Link>
  );
}

function isLightColor(hex) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return (r * 299 + g * 587 + b * 114) / 1000 > 128;
}
