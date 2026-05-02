import { useState, useEffect, useRef, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, X, ArrowRight, Sparkles, Flame } from 'lucide-react'
import { products } from '../data/products'
import ProductVisual from './ProductVisual'
import { formatNaira } from '../utils/format'
import './SearchOverlay.css'

// USD -> NGN factor matches the rest of the site
const NGN_RATE = 1650

// Trending = first 6 products marked hot or new (used as the empty state)
const TRENDING = products
  .filter((p) => p.isHot || p.isNew)
  .slice(0, 6)

const getSeed = (id) => {
  if (id === null || id === undefined) return 0
  if (typeof id === 'number') return id
  const digits = String(id).replace(/\D/g, '')
  return parseInt(digits, 10) || 0
}

export default function SearchOverlay({ open, onClose }) {
  const [query, setQuery] = useState('')
  const inputRef = useRef(null)
  const navigate = useNavigate()

  // Reset + autofocus when opened
  useEffect(() => {
    if (open) {
      setQuery('')
      // small delay so the input is mounted before we focus it
      setTimeout(() => inputRef.current?.focus(), 60)
    }
  }, [open])

  // Lock body scroll while open
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  // Close on Escape
  useEffect(() => {
    if (!open) return
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  // Live search across name, tagline, description, category, tags
  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return []

    return products.filter((p) => {
      const haystack = [
        p.name,
        p.tagline,
        p.description,
        p.category,
        ...(p.tags || []),
      ]
        .join(' ')
        .toLowerCase()
      return haystack.includes(q)
    })
  }, [query])

  const handleResultClick = (slug) => {
    onClose()
    navigate(`/product/${slug}`)
  }

  const handleTrendingClick = (slug) => {
    onClose()
    navigate(`/product/${slug}`)
  }

  const handleViewAll = () => {
    onClose()
    navigate(`/shop?search=${encodeURIComponent(query.trim())}`)
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="search-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            onClick={onClose}
            aria-hidden="true"
          />

          <motion.div
            className="search-panel"
            role="dialog"
            aria-label="Search products"
            aria-modal="true"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Search bar */}
            <div className="search-bar">
              <Search size={18} className="search-bar-icon" strokeWidth={2} />
              <input
                ref={inputRef}
                type="search"
                className="search-input"
                placeholder="Search products, brands, categories…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                autoComplete="off"
              />
              {query && (
                <button
                  type="button"
                  className="search-clear"
                  onClick={() => {
                    setQuery('')
                    inputRef.current?.focus()
                  }}
                  aria-label="Clear search"
                >
                  <X size={14} />
                </button>
              )}
              <button
                type="button"
                className="search-close"
                onClick={onClose}
                aria-label="Close search"
              >
                Cancel
              </button>
            </div>

            {/* Body */}
            <div className="search-body">

              {/* Empty state — trending */}
              {!query.trim() && (
                <div className="search-section">
                  <div className="search-section-head">
                    <Sparkles size={14} />
                    <span>TRENDING</span>
                  </div>
                  <div className="search-trending">
                    {TRENDING.map((p) => (
                      <button
                        key={p.id}
                        type="button"
                        className="search-trending-chip"
                        onClick={() => handleTrendingClick(p.slug)}
                      >
                        {p.isHot && <Flame size={12} className="search-chip-hot" />}
                        {!p.isHot && p.isNew && <Sparkles size={12} className="search-chip-new" />}
                        <span>{p.name}</span>
                      </button>
                    ))}
                  </div>

                  <div className="search-tip">
                    <p>Try searching by category, feature, or product name —</p>
                    <p>like <em>"projector"</em>, <em>"4K"</em>, <em>"wireless"</em>, or <em>"keyboard"</em>.</p>
                  </div>
                </div>
              )}

              {/* Results */}
              {query.trim() && results.length > 0 && (
                <div className="search-results">
                  <div className="search-results-head">
                    <span>{results.length} {results.length === 1 ? 'result' : 'results'}</span>
                    <button
                      type="button"
                      className="search-view-all"
                      onClick={handleViewAll}
                    >
                      View all in shop <ArrowRight size={13} />
                    </button>
                  </div>

                  {results.slice(0, 8).map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      className="search-result"
                      onClick={() => handleResultClick(p.slug)}
                    >
                      <div className="search-result-image">
                        <ProductVisual
                          product={p}
                          category={p.category}
                          seed={getSeed(p.id)}
                        />
                      </div>
                      <div className="search-result-body">
                        <p className="search-result-cat">{p.category?.toUpperCase()}</p>
                        <p className="search-result-name">{p.name}</p>
                        {p.tagline && (
                          <p className="search-result-tag">{p.tagline}</p>
                        )}
                      </div>
                      <div className="search-result-meta">
                        <span className="search-result-price">
                          {formatNaira(p.price * NGN_RATE)}
                        </span>
                        <ArrowRight size={14} className="search-result-arrow" />
                      </div>
                    </button>
                  ))}

                  {results.length > 8 && (
                    <button
                      type="button"
                      className="search-more"
                      onClick={handleViewAll}
                    >
                      See all {results.length} results <ArrowRight size={14} />
                    </button>
                  )}
                </div>
              )}

              {/* No results */}
              {query.trim() && results.length === 0 && (
                <div className="search-empty">
                  <div className="search-empty-icon">
                    <Search size={28} strokeWidth={1.5} />
                  </div>
                  <h3>No matches for "{query}"</h3>
                  <p>Try a different keyword, or browse the shop.</p>
                  <button
                    type="button"
                    className="search-empty-cta"
                    onClick={() => {
                      onClose()
                      navigate('/shop')
                    }}
                  >
                    Browse all products <ArrowRight size={14} />
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
