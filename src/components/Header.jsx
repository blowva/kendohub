import { Link, NavLink } from 'react-router-dom';
import { ShoppingBag, Search, Sun, Moon, User, Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';
import './Header.css';

export default function Header() {
  const { itemCount } = useCart();
  const { theme, toggle } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <div className="ticker">
        <div className="ticker-track">
          <span>◆ FREE SHIPPING OVER $200</span>
          <span>◆ 30-DAY RETURNS</span>
          <span>◆ AUTHORISED DEALER</span>
          <span>◆ NEW: 4K PROJECTOR — IN STOCK</span>
          <span>◆ FREE SHIPPING OVER $200</span>
          <span>◆ 30-DAY RETURNS</span>
          <span>◆ AUTHORISED DEALER</span>
          <span>◆ NEW: 4K PROJECTOR — IN STOCK</span>
        </div>
      </div>

      <header className={`header ${scrolled ? 'is-scrolled' : ''}`}>
        <div className="container header-inner">
          <Link to="/" className="logo" aria-label="Shoply home">
            <span className="logo-mark">◆</span>
            <span className="logo-wordmark">Shoply</span>
          </Link>

          <nav className="nav-desktop" aria-label="Primary">
            <NavLink to="/shop" className={({ isActive }) => `nav-link ${isActive ? 'is-active' : ''}`}>
              Shop
            </NavLink>
            <NavLink to="/shop?filter=hot" className="nav-link">
              Hot <sup className="nav-sup">·new</sup>
            </NavLink>
            <NavLink to="/shop?filter=new" className="nav-link">
              Arrivals
            </NavLink>
            <NavLink to="/about" className={({ isActive }) => `nav-link ${isActive ? 'is-active' : ''}`}>
              About
            </NavLink>
          </nav>

          <div className="header-actions">
            <button className="icon-btn" aria-label="Search">
              <Search size={18} strokeWidth={1.5} />
            </button>
            <button className="icon-btn" aria-label="Toggle theme" onClick={toggle}>
              {theme === 'light' ? <Moon size={18} strokeWidth={1.5} /> : <Sun size={18} strokeWidth={1.5} />}
            </button>
            <Link to="/account" className="icon-btn" aria-label="Account">
              <User size={18} strokeWidth={1.5} />
            </Link>
            <Link to="/cart" className="cart-btn" aria-label={`Cart, ${itemCount} items`}>
              <ShoppingBag size={18} strokeWidth={1.5} />
              <span className="cart-count">{itemCount}</span>
            </Link>
            <button
              className="icon-btn mobile-only"
              aria-label="Menu"
              onClick={() => setMobileOpen((o) => !o)}
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {mobileOpen && (
          <div className="mobile-menu">
            <div className="container">
              <nav className="nav-mobile" onClick={() => setMobileOpen(false)}>
                <NavLink to="/shop" className="nav-mobile-link">Shop <span>→</span></NavLink>
                <NavLink to="/shop?filter=hot" className="nav-mobile-link">Hot <span>→</span></NavLink>
                <NavLink to="/shop?filter=new" className="nav-mobile-link">Arrivals <span>→</span></NavLink>
                <NavLink to="/about" className="nav-mobile-link">About <span>→</span></NavLink>
                <NavLink to="/account" className="nav-mobile-link">Account <span>→</span></NavLink>
              </nav>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
