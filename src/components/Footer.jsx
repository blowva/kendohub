import { Link } from 'react-router-dom';
import { Instagram, Twitter, Mail } from 'lucide-react';
import './Footer.css';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container footer-inner">

        {/* Brand block */}
        <div className="footer-brand">
          <Link to="/" className="footer-logo" aria-label="Kendo Hub home">
            <span className="footer-logo-kendo">Kendo</span>
            <span className="footer-logo-hub">Hub</span>
          </Link>
          <p className="footer-tagline">
            Premium gadgets, delivered with care.
          </p>
          <p className="footer-domain">kendohub.co</p>
        </div>

        {/* Links */}
        <div className="footer-cols">
          <div className="footer-col">
            <p className="footer-col-title">Shop</p>
            <Link to="/shop">All products</Link>
            <Link to="/shop?filter=hot">Hot drops</Link>
            <Link to="/shop?filter=new">New arrivals</Link>
            <Link to="/track">Track package</Link>
          </div>

          <div className="footer-col">
            <p className="footer-col-title">Support</p>
            <Link to="/refund-policy">Refund policy</Link>
            <Link to="/policies">All policies</Link>
            <Link to="/account">My account</Link>
            <Link to="/cart">Cart</Link>
          </div>

          <div className="footer-col">
            <p className="footer-col-title">Affiliate</p>
            <Link to="/affiliate">Earn with us</Link>
            <Link to="/affiliate/about">How it works</Link>
            <Link to="/about">About Kendo Hub</Link>
          </div>
        </div>

        {/* Socials */}
        <div className="footer-social">
          <a href="https://instagram.com/kendohub" target="_blank" rel="noreferrer" aria-label="Instagram">
            <Instagram size={18} strokeWidth={1.5} />
          </a>
          <a href="https://twitter.com/kendohub" target="_blank" rel="noreferrer" aria-label="Twitter / X">
            <Twitter size={18} strokeWidth={1.5} />
          </a>
          <a href="mailto:hello@kendohub.co" aria-label="Email">
            <Mail size={18} strokeWidth={1.5} />
          </a>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; {year} Kendo Hub. All rights reserved.</p>
        <p className="footer-bottom-meta">Made in Benin City · Shipping nationwide 🇳🇬</p>
      </div>
    </footer>
  );
}
