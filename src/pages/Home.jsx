import { Link } from 'react-router-dom';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import HeroCarousel from '../components/HeroCarousel';
import { products, hotProducts, newProducts, categories } from '../data/products';
import './Home.css';

export default function Home() {
  const featured = products.slice(0, 4);
  const editorial = newProducts[0] || products[1];

  return (
    <div className="page-enter">
      {/* ===================== HERO CAROUSEL ===================== */}
      <HeroCarousel />

      {/* ===================== CATEGORIES ===================== */}
      <section className="section">
        <div className="container">
          <SectionHead kicker="01 / Categories" title="By department" link="/shop" linkLabel="All products" />
          <div className="cat-grid">
            {categories.filter((c) => c.id !== 'all').map((c) => (
              <Link to={`/shop?cat=${c.id}`} key={c.id} className="cat-tile">
                <div className="cat-tile-top">
                  <span className="mono">{c.count} products</span>
                  <ArrowUpRight size={16} />
                </div>
                <h3 className="cat-tile-name display">{c.name}</h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== FEATURED ===================== */}
      <section className="section">
        <div className="container">
          <SectionHead kicker="02 / Featured" title="This week's four" link="/shop?filter=hot" linkLabel="See hot drops" />
          <div className="product-grid product-grid-4">
            {featured.map((p, i) => (
              <ProductCard product={p} key={p.id} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ===================== EDITORIAL SPLIT ===================== */}
      <section className="section">
        <div className="container">
          <div className="editorial">
            <div className="editorial-text">
              <p className="eyebrow">A closer look</p>
              <h2 className="display editorial-title">
                The {editorial.name}.<br />
                <em>Quietly, exceptionally good.</em>
              </h2>
              <p className="editorial-body">{editorial.description}</p>
              <ul className="editorial-specs">
                {Object.entries(editorial.specs).map(([k, v]) => (
                  <li key={k}>
                    <span className="mono">{k}</span>
                    <span>{v}</span>
                  </li>
                ))}
              </ul>
              <Link to={`/product/${editorial.slug}`} className="btn">
                View product <ArrowRight size={14} />
              </Link>
            </div>
            <div className="editorial-visual">
              <div className="editorial-frame">
                <ProductCard product={editorial} index={0} />
              </div>
              <span className="editorial-big-num display">
                {editorial.id.replace('p', '').padStart(2, '0')}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ===================== NEW ARRIVALS ===================== */}
      <section className="section">
        <div className="container">
          <SectionHead kicker="03 / New" title="Just landed" link="/shop?filter=new" linkLabel="All new" />
          <div className="product-grid product-grid-4">
            {newProducts.slice(0, 4).map((p, i) => (
              <ProductCard product={p} key={p.id} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ===================== MANIFESTO ===================== */}
      <section className="manifesto">
        <div className="container">
          <p className="eyebrow">Manifesto</p>
          <p className="manifesto-text display">
            We don't sell everything. We sell <em>the one we'd keep.</em> Objects
            chosen for how they feel at 7am, at 11pm, on the fifth year. Sound that
            respects your ears. Light that respects the room.
          </p>
          <p className="mono manifesto-sig">— The Shoply team, Spring '26</p>
        </div>
      </section>
    </div>
  );
}

function SectionHead({ kicker, title, link, linkLabel }) {
  return (
    <header className="sec-head">
      <div>
        <p className="eyebrow">{kicker}</p>
        <h2 className="display sec-title">{title}</h2>
      </div>
      {link && (
        <Link to={link} className="sec-link">
          {linkLabel} <ArrowRight size={14} />
        </Link>
      )}
    </header>
  );
}
