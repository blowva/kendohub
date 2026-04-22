import { Link } from 'react-router-dom';
import './Misc.css';

/* ====================== ABOUT ====================== */
export function About() {
  return (
    <div className="page-enter misc">
      <div className="container">
        <header className="misc-head">
          <p className="eyebrow">About · Est. 2026</p>
          <h1 className="display misc-title">
            Small shop, <em>big opinions.</em>
          </h1>
        </header>

        <div className="about-lead">
          <p>
            Shoply started as a list of favourites — the cables that didn't fray,
            the speakers that didn't fatigue, the projector we kept recommending.
            Now it's a shop. Same idea: objects we'd keep ourselves.
          </p>
        </div>

        <div className="about-grid">
          <div className="about-card">
            <p className="mono about-card-num">01</p>
            <h3 className="display">Curated, not stocked.</h3>
            <p>We test everything we list. If it doesn't earn a spot in one of our own homes, it doesn't make the shelf.</p>
          </div>
          <div className="about-card">
            <p className="mono about-card-num">02</p>
            <h3 className="display">Service, not self-service.</h3>
            <p>Real humans answer real questions, usually within the hour. Two-year warranty on everything.</p>
          </div>
          <div className="about-card">
            <p className="mono about-card-num">03</p>
            <h3 className="display">Built to last.</h3>
            <p>Spare parts, repair guides, firmware updates — planned obsolescence has no place here.</p>
          </div>
        </div>

        <section className="about-numbers">
          <div><p className="display about-num">18</p><p className="mono">Products</p></div>
          <div><p className="display about-num">2.4k</p><p className="mono">Happy buyers</p></div>
          <div><p className="display about-num">4.6</p><p className="mono">Avg rating</p></div>
          <div><p className="display about-num">30</p><p className="mono">Day returns</p></div>
        </section>

        <section className="about-values">
          <p className="eyebrow">Affiliate</p>
          <h2 className="display about-values-title">Earn with us.</h2>
          <p>
            Our affiliate program pays 8% on every referred sale. Coupon codes, real-time
            dashboards, monthly payouts. <Link to="/account" className="about-link">Apply from your account →</Link>
          </p>
        </section>
      </div>
    </div>
  );
}

/* ====================== ACCOUNT ====================== */
export function Account() {
  return (
    <div className="page-enter misc">
      <div className="container">
        <header className="misc-head">
          <p className="eyebrow">Account</p>
          <h1 className="display misc-title">Welcome back.</h1>
        </header>

        <div className="account-grid">
          <form className="account-form" onSubmit={(e) => e.preventDefault()}>
            <h2 className="account-form-title display">Sign in</h2>
            <label className="field">
              <span className="field-label mono">Email</span>
              <input type="email" required />
            </label>
            <label className="field">
              <span className="field-label mono">Password</span>
              <input type="password" required />
            </label>
            <button type="submit" className="btn btn-accent account-btn">Sign in →</button>
            <p className="account-alt">
              New here? <Link to="/account" className="about-link">Create an account</Link>
            </p>
          </form>

          <aside className="account-perks">
            <p className="eyebrow">Why sign in</p>
            <ul>
              <li>◆ Track orders in real time</li>
              <li>◆ Save favourites</li>
              <li>◆ Faster checkout</li>
              <li>◆ Early access to drops</li>
              <li>◆ Affiliate dashboard</li>
            </ul>
          </aside>
        </div>
      </div>
    </div>
  );
}

/* ====================== POLICIES ====================== */
export function Policies() {
  return (
    <div className="page-enter misc">
      <div className="container">
        <header className="misc-head">
          <p className="eyebrow">Policies</p>
          <h1 className="display misc-title">The fine print.</h1>
        </header>

        <div className="policy-grid">
          <section className="policy">
            <h2 className="display">Returns</h2>
            <p>30-day hassle-free returns on everything. If it arrived damaged or you changed your mind, ship it back. We'll refund the card it came from within 5 business days.</p>
          </section>
          <section className="policy">
            <h2 className="display">Shipping</h2>
            <p>Free over $200. Flat $12 below. Standard delivery 3–5 business days, express 1–2. We ship worldwide — duties and local taxes are your responsibility.</p>
          </section>
          <section className="policy">
            <h2 className="display">Warranty</h2>
            <p>Two years, manufacturer-backed, on every product. Register your serial number on the product page to activate. Warranty covers defects, not accidental damage.</p>
          </section>
          <section className="policy">
            <h2 className="display">Privacy</h2>
            <p>We collect what's needed to fulfil your order. Email, address, payment. We don't sell data, we don't spam, and you can request deletion any time.</p>
          </section>
          <section className="policy">
            <h2 className="display">Terms</h2>
            <p>By using Shoply you agree to pay for what you order, receive what we send, and not resell counterfeit goods as if they came from us. Be decent. That's most of it.</p>
          </section>
          <section className="policy">
            <h2 className="display">Contact</h2>
            <p>Questions? Email hi@shoply.example. We answer within a business day. For press, affiliates, or bulk orders, use the same address with a subject line.</p>
          </section>
        </div>
      </div>
    </div>
  );
}

/* ====================== 404 ====================== */
export function NotFound() {
  return (
    <div className="page-enter misc notfound">
      <div className="container">
        <p className="eyebrow">Error · 404</p>
        <h1 className="display notfound-big">
          Page not <em>found.</em>
        </h1>
        <p className="notfound-sub">
          The page you're looking for doesn't exist — or the link has moved on.
          Try the home page, or browse the shop.
        </p>
        <div className="notfound-cta">
          <Link to="/" className="btn btn-accent">Home</Link>
          <Link to="/shop" className="btn btn-ghost">Shop</Link>
        </div>
      </div>
    </div>
  );
}
