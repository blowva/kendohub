import { Link } from 'react-router-dom'
import { Instagram, Twitter, Youtube, Github } from 'lucide-react'
import './Footer.css'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-grid">
          <div className="footer-brand">
            <Link to="/" className="footer-logo">
              <span className="footer-logo-mark">◆</span>
              <span className="footer-logo-text">Shoply</span>
            </Link>
            <p className="footer-tagline">
              Studio-grade audio, cinema projectors, and the gadgets that make
              every day feel a little more dialed in.
            </p>
            <div className="footer-socials">
              <a href="#" aria-label="Instagram" className="footer-social">
                <Instagram size={18} />
              </a>
              <a href="#" aria-label="Twitter" className="footer-social">
                <Twitter size={18} />
              </a>
              <a href="#" aria-label="YouTube" className="footer-social">
                <Youtube size={18} />
              </a>
              <a href="#" aria-label="GitHub" className="footer-social">
                <Github size={18} />
              </a>
            </div>
          </div>

          <div className="footer-col">
            <h4 className="footer-col-title">Shop</h4>
            <ul className="footer-list">
              <li><Link to="/shop">All products</Link></li>
              <li><Link to="/shop?filter=new">New arrivals</Link></li>
              <li><Link to="/shop?filter=hot">Hot drops</Link></li>
              <li><Link to="/shop?category=projectors">Projectors</Link></li>
              <li><Link to="/shop?category=audio">Audio</Link></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4 className="footer-col-title">Help</h4>
            <ul className="footer-list">
              <li><Link to="/account">My account</Link></li>
              <li><Link to="/cart">Cart</Link></li>
              <li><Link to="/policies">Shipping</Link></li>
              <li><Link to="/policies">Returns</Link></li>
              <li><Link to="/about">Contact</Link></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4 className="footer-col-title">Company</h4>
            <ul className="footer-list">
              <li><Link to="/about">About</Link></li>
              <li><Link to="/policies">Privacy</Link></li>
              <li><Link to="/policies">Terms</Link></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p className="footer-copy">
            © {new Date().getFullYear()} Shoply. All rights reserved.
          </p>
          <p className="footer-built">
            Crafted in Lagos · Shipped worldwide
          </p>
        </div>
      </div>
    </footer>
  )
}
