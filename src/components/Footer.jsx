import { Link } from 'react-router-dom';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-hero">
          <div className="footer-hero-text">
            <p className="eyebrow">Subscribe</p>
            <h2 className="display footer-hero-title">
              First to know, <em>first to own.</em>
            </h2>
          </div>
          <form className="footer-form" onSubmit={(e) => e.preventDefault()}>
            <input
              type="email"
              placeholder="your@email.com"
              aria-label="Email address"
              className="footer-input"
            />
            <button type="submit" className="btn btn-accent">
              Subscribe →
            </button>
          </form>
        </div>

        <div className="footer-grid">
          <div className="footer-col footer-brand">
            <div className="logo">
              <span className="logo-mark">◆</span>
              <span className="logo-wordmark">Shoply</span>
            </div>
            <p className="footer-tag">
              Studio-grade audio, cinema projectors, and everyday tools. Curated for people who notice the details.
            </p>
            <p className="mono footer-est">EST. 2026</p>
          </div>

          <div className="footer-col">
            <p className="eyebrow">Shop</p>
            <ul>
              <li><Link to="/shop">All products</Link></li>
              <li><Link to="/shop?filter=new">New arrivals</Link></li>
              <li><Link to="/shop?filter=hot">Hot drops</Link></li>
              <li><Link to="/shop">Coming soon</Link></li>
            </ul>
          </div>

          <div className="footer-col">
            <p className="eyebrow">Company</p>
            <ul>
              <li><Link to="/about">About</Link></li>
              <li><Link to="/about">Affiliate</Link></li>
              <li><Link to="/about">Careers</Link></li>
              <li><Link to="/about">Press</Link></li>
            </ul>
          </div>

          <div className="footer-col">
            <p className="eyebrow">Support</p>
            <ul>
              <li><Link to="/policies">Refund policy</Link></li>
              <li><Link to="/policies">Terms & conditions</Link></li>
              <li><Link to="/policies">Shipping</Link></li>
              <li><Link to="/policies">Contact</Link></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p className="mono">© 2026 Shoply — Crafted with intent.</p>
          <p className="mono">Made for the curious.</p>
        </div>
      </div>
    </footer>
  );
}
