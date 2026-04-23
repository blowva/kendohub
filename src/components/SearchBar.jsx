import { useState, useRef, useEffect, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Search, PackageSearch } from 'lucide-react';
import { products } from '../data/products';
import './SearchBar.css';

export default function SearchBar({ onChange }) {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);
  const navigate = useNavigate();

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return products
      .filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.tagline?.toLowerCase().includes(q)
      )
      .slice(0, 6);
  }, [query]);

  useEffect(() => {
    const onDown = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, []);

  const handleChange = (e) => {
    const v = e.target.value;
    setQuery(v);
    onChange?.(v);
    setOpen(v.trim().length > 0);
  };

  const submit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      setOpen(false);
      navigate(`/shop?q=${encodeURIComponent(query.trim())}`);
    }
  };

  const handleKey = (e) => {
    if (e.key === 'Escape') setOpen(false);
  };

  return (
    <div className="sb-wrap" ref={wrapRef}>
      <form className="search-bar" onSubmit={submit} role="search">
        <Search size={20} strokeWidth={1.5} className="sb-icon" />
        <input
          type="search"
          className="sb-input"
          placeholder="Search products, brands, categories..."
          value={query}
          onChange={handleChange}
          onFocus={() => query.trim() && setOpen(true)}
          onKeyDown={handleKey}
          aria-label="Search products"
        />
      </form>

      {open && (
        <div className="sb-dropdown" role="listbox">
          {results.length > 0 ? (
            results.map((p) => (
              <Link
                key={p.id}
                to={`/product/${p.slug}`}
                className="sb-result"
                onClick={() => setOpen(false)}
              >
                <span className="sb-result-name">{p.name}</span>
                <span className="sb-result-meta">
                  <span className="sb-result-cat">{p.category}</span>
                  <span className="sb-result-price">${p.price.toFixed(2)}</span>
                </span>
              </Link>
            ))
          ) : (
            <div className="sb-empty">
              <PackageSearch size={18} strokeWidth={1.5} />
              <span>
                No products found —{' '}
                <Link to="/shop" onClick={() => setOpen(false)}>
                  browse shop instead
                </Link>
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}