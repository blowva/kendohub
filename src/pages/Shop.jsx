import { useMemo, useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  SlidersHorizontal,
  Search as SearchIcon,
  ChevronDown,
  Check,
  Sparkles,
  TrendingUp,
  ArrowDownNarrowWide,
  ArrowUpNarrowWide,
  Star,
} from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { products, categories } from '../data/products';
import './Shop.css';

const SORT_OPTIONS = [
  { value: 'featured',   label: 'Featured',            icon: Sparkles },
  { value: 'newest',     label: 'Newest first',        icon: TrendingUp },
  { value: 'price-asc',  label: 'Price: low to high',  icon: ArrowUpNarrowWide },
  { value: 'price-desc', label: 'Price: high to low',  icon: ArrowDownNarrowWide },
  { value: 'rating',     label: 'Highest rated',       icon: Star },
];

export default function Shop() {
  const [params, setParams] = useSearchParams();
  const activeCat = params.get('cat') || 'all';
  const filter = params.get('filter') || null; // 'hot' | 'new' | null
  const urlSearch = params.get('search') || '';

  const [sort, setSort] = useState('featured');
  const [query, setQuery] = useState(urlSearch);
  const [sortOpen, setSortOpen] = useState(false);

  const sortRef = useRef(null);

  useEffect(() => { window.scrollTo({ top: 0 }); }, []);

  // If the URL changes (e.g. arriving from search overlay), update query input
  useEffect(() => {
    setQuery(urlSearch);
  }, [urlSearch]);

  // Close sort dropdown on outside click
  useEffect(() => {
    if (!sortOpen) return;
    const onClick = (e) => {
      if (sortRef.current && !sortRef.current.contains(e.target)) {
        setSortOpen(false);
      }
    };
    const onKey = (e) => {
      if (e.key === 'Escape') setSortOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    document.addEventListener('touchstart', onClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onClick);
      document.removeEventListener('touchstart', onClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [sortOpen]);

  const filtered = useMemo(() => {
    let list = [...products];
    if (activeCat !== 'all') list = list.filter((p) => p.category === activeCat);
    if (filter === 'hot') list = list.filter((p) => p.isHot);
    if (filter === 'new') list = list.filter((p) => p.isNew);
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          (p.tagline && p.tagline.toLowerCase().includes(q)) ||
          (p.description && p.description.toLowerCase().includes(q)) ||
          (p.tags && p.tags.some((t) => t.toLowerCase().includes(q))),
      );
    }
    switch (sort) {
      case 'price-asc':  list.sort((a, b) => a.price - b.price); break;
      case 'price-desc': list.sort((a, b) => b.price - a.price); break;
      case 'rating':     list.sort((a, b) => b.rating - a.rating); break;
      case 'newest':     list.sort((a, b) => Number(b.isNew) - Number(a.isNew)); break;
      default: break;
    }
    return list;
  }, [activeCat, filter, query, sort]);

  const setCat = (cat) => {
    const next = new URLSearchParams(params);
    if (cat === 'all') next.delete('cat'); else next.set('cat', cat);
    setParams(next);
  };

  const handleSearchChange = (val) => {
    setQuery(val);
    // Keep URL in sync so search persists on refresh / share
    const next = new URLSearchParams(params);
    if (val.trim()) {
      next.set('search', val);
    } else {
      next.delete('search');
    }
    setParams(next, { replace: true });
  };

  const currentSort = SORT_OPTIONS.find((o) => o.value === sort) || SORT_OPTIONS[0];
  const SortIcon = currentSort.icon;

  return (
    <div className="page-enter shop">
      <div className="container">
        <header className="shop-head">
          <div>
            <p className="eyebrow">
              Catalogue · {filter ? (filter === 'hot' ? 'Hot drops' : 'New arrivals') : 'All products'}
            </p>
            <h1 className="display shop-title">
              {filter === 'hot' ? 'What\'s hot' : filter === 'new' ? 'Just landed' : 'The whole shop'}
            </h1>
          </div>
          <div className="shop-search">
            <SearchIcon size={16} strokeWidth={1.5} />
            <input
              type="text"
              placeholder="Search products…"
              value={query}
              onChange={(e) => handleSearchChange(e.target.value)}
            />
          </div>
        </header>

        <div className="shop-bar">
          <div className="shop-cats">
            {categories.map((c) => (
              <button
                key={c.id}
                className={`shop-cat ${activeCat === c.id ? 'is-active' : ''}`}
                onClick={() => setCat(c.id)}
              >
                {c.name} <span className="shop-cat-count">{c.count}</span>
              </button>
            ))}
          </div>

          {/* Custom sort dropdown */}
          <div className="shop-sort-wrap" ref={sortRef}>
            <button
              type="button"
              className={`shop-sort-btn ${sortOpen ? 'is-open' : ''}`}
              onClick={() => setSortOpen((o) => !o)}
              aria-haspopup="listbox"
              aria-expanded={sortOpen}
            >
              <SortIcon size={14} strokeWidth={1.8} className="shop-sort-icon" />
              <span className="shop-sort-label-mobile">SORT</span>
              <span className="shop-sort-label-desktop">{currentSort.label}</span>
              <ChevronDown
                size={14}
                strokeWidth={2}
                className={`shop-sort-chevron ${sortOpen ? 'is-open' : ''}`}
              />
            </button>

            {sortOpen && (
              <div className="shop-sort-menu" role="listbox" aria-label="Sort products">
                <p className="shop-sort-menu-head">Sort by</p>
                {SORT_OPTIONS.map((opt) => {
                  const Icon = opt.icon;
                  const isActive = opt.value === sort;
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      role="option"
                      aria-selected={isActive}
                      className={`shop-sort-option ${isActive ? 'is-active' : ''}`}
                      onClick={() => {
                        setSort(opt.value);
                        setSortOpen(false);
                      }}
                    >
                      <Icon size={15} strokeWidth={1.8} className="shop-sort-option-icon" />
                      <span className="shop-sort-option-label">{opt.label}</span>
                      {isActive && (
                        <Check size={14} strokeWidth={2.5} className="shop-sort-option-check" />
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <p className="shop-count mono">
          {filtered.length} {filtered.length === 1 ? 'product' : 'products'}
          {query.trim() && (
            <span className="shop-count-search"> · for "{query}"</span>
          )}
        </p>

        {filtered.length === 0 ? (
          <div className="shop-empty">
            <p className="display shop-empty-big">No products found.</p>
            <p className="shop-empty-sub">Try a different category or clear your search.</p>
          </div>
        ) : (
          <div className="product-grid product-grid-4">
            {filtered.map((p, i) => (
              <ProductCard product={p} key={p.id} index={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
