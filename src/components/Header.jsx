import { Link, NavLink, useLocation } from 'react-router-dom';
import { ShoppingBag, Search, Sun, Moon, Menu, X, Home, Flame, Sparkles, Ticket, Info, Users, User, RotateCcw, FileText, ChevronRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';
import './Header.css';

const NAV_ITEMS = [
  { label: 'Home',             to: '/',                icon: Home },
  { label: 'Shop',             to: '/shop',            icon: ShoppingBag },
  { label: 'Hot Drops',        to: '/shop?filter=hot', icon: Flame },
  { label: 'New Arrivals',     to: '/shop?filter=new', icon: Sparkles },
  { label: 'Coupon Affiliate', to: '/affiliate',       icon: Ticket },
  { label: 'About Affiliate',  to: '/affiliate/about', icon: Info },
  { label: 'About',            to: '/about',           icon: Users },
  { label: 'Account',          to: '/account',         icon: User },
  { label: 'Refund Policy',    to: '/refund-policy',   icon: RotateCcw },
  { label: 'Policies',         to: '/policies',        icon: FileText },
];

export default function Header() {
  const { itemCount } = useCart();
  const { theme, toggle } = useTheme();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Lock body scroll when drawer is open
  useEffect(() => {
    document.body.style.overflow = drawerOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [drawerOpen]);

  // Close drawer on navigation
  useEffect(() => { setDrawerOpen(false); }, [location]);

  const close = () => setDrawerOpen(false);

  return (
    <>
      <header className={`header ${scrolled ? 'is-scrolled' : ''}`}>
        <div className="container header-inner">
          <button className="icon-btn" aria-label="Menu" onClick={() => setDrawerOpen((o) => !o)}>
            <Menu size={20} />
          </button>

          <Link to="/" className="logo" aria-label="Shoply home">
            <span className="logo-mark">◆</span>
            <span className="logo-wordmark">Shoply</span>
          </Link>

          <div className="header-spacer" />

          <div className="header-actions">
            <button className="icon-btn" aria-label="Search">
              <Search size={18} strokeWidth={1.5} />
            </button>
            <button className="icon-btn" aria-label="Toggle theme" onClick={toggle}>
              {theme === 'light' ? <Moon size={18} strokeWidth={1.5} /> : <Sun size={18} strokeWidth={1.5} />}
            </button>
            <Link to="/cart" className="cart-btn" aria-label={`Cart, ${itemCount} items`}>
              <ShoppingBag size={18} strokeWidth={1.5} />
              <span className="cart-count">{itemCount}</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Drawer */}
      {drawerOpen && (
        <>
          <div className="drawer-backdrop" onClick={close} aria-hidden="true" />
          <div className="drawer" role="dialog" aria-label="Navigation menu" aria-modal="true">

            {/* Navy header */}
            <div className="drawer-header">
              <div className="drawer-header-top">
                <span className="drawer-menu-label">MENU</span>
                <button className="drawer-close" onClick={close} aria-label="Close menu">
                  <X size={20} />
                </button>
              </div>
              <p className="drawer-welcome-title">Welcome back</p>
              <p className="drawer-welcome-sub">Sign in to track your orders</p>
            </div>

            {/* Nav items */}
            <div className="drawer-body">
              <nav className="drawer-nav">
                {NAV_ITEMS.map(({ label, to, icon: Icon }) => (
                  <NavLink
                    key={to}
                    to={to}
                    className={({ isActive }) => `drawer-item${isActive ? ' is-active' : ''}`}
                  >
                    <span className="drawer-icon"><Icon size={18} strokeWidth={1.5} /></span>
                    <span className="drawer-label">{label}</span>
                    <ChevronRight size={16} strokeWidth={1.5} className="drawer-chevron" />
                  </NavLink>
                ))}

                {/* Dark mode toggle */}
                <div className="drawer-item drawer-item-toggle">
                  <span className="drawer-icon">
                    {theme === 'light' ? <Sun size={18} strokeWidth={1.5} /> : <Moon size={18} strokeWidth={1.5} />}
                  </span>
                  <span className="drawer-label">Dark Mode</span>
                  <button
                    className={`drawer-toggle ${theme === 'dark' ? 'is-on' : ''}`}
                    onClick={toggle}
                    aria-label="Toggle dark mode"
                    aria-checked={theme === 'dark'}
                    role="switch"
                  />
                </div>
              </nav>
            </div>

            {/* Footer */}
            <div className="drawer-footer">
              <p>Shoply &copy; 2026</p>
            </div>
          </div>
        </>
      )}
    </>
  );
}
