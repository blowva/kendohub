import { useMemo, useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SlidersHorizontal, Search as SearchIcon } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { products, categories } from '../data/products';
import './Shop.css';

export default function Shop() {
  const [params, setParams] = useSearchParams();
  const activeCat = params.get('cat') || 'all';
  const filter = params.get('filter') || null; // 'hot' | 'new' | null
  const [sort, setSort] = useState('featured');
  const [query, setQuery] = useState('');

  useEffect(() => { window.scrollTo({ top: 0 }); }, []);

  const filtered = useMemo(() => {
    let list = [...products];
    if (activeCat !== 'all') list = list.filter((p) => p.category === activeCat);
    if (filter === 'hot') list = list.filter((p) => p.isHot);
    if (filter === 'new') list = list.filter((p) => p.isNew);
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (p) => p.name.toLowerCase().includes(q) || p.tagline.toLowerCase().includes(q),
      );
    }
    switch (sort) {
      case 'price-asc':  list.sort((a, b) => a.price - b.price); break;
      case 'price-desc': list.sort((a, b) => b.price - a.price); break;
      case 'rating':     list.sort((a, b) => b.rating - a.rating); break;
      case 'newest':     list.sort((a, b) => new Date(b.releaseDate) - new Date(a.releaseDate)); break;
      default: break;
    }
    return list;
  }, [activeCat, filter, query, sort]);

  const setCat = (cat) => {
    const next = new URLSearchParams(params);
    if (cat === 'all') next.delete('cat'); else next.set('cat', cat);
    setParams(next);
  };

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
              onChange={(e) => setQuery(e.target.value)}
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

          <div className="shop-sort">
            <SlidersHorizontal size={14} strokeWidth={1.5} />
            <select value={sort} onChange={(e) => setSort(e.target.value)} aria-label="Sort">
              <option value="featured">Featured</option>
              <option value="newest">Newest</option>
              <option value="price-asc">Price: low to high</option>
              <option value="price-desc">Price: high to low</option>
              <option value="rating">Highest rated</option>
            </select>
          </div>
        </div>

        <p className="shop-count mono">
          {filtered.length} {filtered.length === 1 ? 'product' : 'products'}
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
