import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import ProductVisual from './ProductVisual';
import './HeroCarousel.css';

const slides = [
  {
    id: 's1',
    eyebrow: 'New Release',
    title: 'Cinema in\nyour pocket.',
    sub: 'The 4K portable projector. 120-inch picture, auto-focus, Android TV built in.',
    cta: { label: 'Shop projector', to: '/product/4k-projector-cinema' },
    accent: '#7a1f1f',
    stage: 'stage-cinema',
    category: 'projectors',
    seed: 2,
  },
  {
    id: 's2',
    eyebrow: 'Hot Drop',
    title: 'Sound,\nunleashed.',
    sub: 'Studio-grade wireless headphones. 30-hour battery. Adaptive ANC that learns your room.',
    cta: { label: 'Shop audio', to: '/shop?cat=audio' },
    accent: '#b23a2a',
    stage: 'stage-audio',
    category: 'audio',
    seed: 1,
  },
  {
    id: 's3',
    eyebrow: 'Spring 2026',
    title: 'Every day,\nelevated.',
    sub: 'Smart gadgets and accessories built for the details — the cable, the charger, the watch.',
    cta: { label: 'Shop gadgets', to: '/shop?cat=gadgets' },
    accent: '#1a1613',
    stage: 'stage-gadgets',
    category: 'gadgets',
    seed: 14,
  },
];

export default function HeroCarousel() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    if (paused) return;
    timerRef.current = setTimeout(() => {
      setIndex((i) => (i + 1) % slides.length);
    }, 6500);
    return () => clearTimeout(timerRef.current);
  }, [index, paused]);

  const go = (dir) => {
    setIndex((i) => (i + dir + slides.length) % slides.length);
  };

  const slide = slides[index];

  return (
    <section
      className="hc"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      aria-roledescription="carousel"
    >
      <div className="container hc-inner">
        <div className={`hc-stage ${slide.stage}`} style={{ '--slide-accent': slide.accent }}>
          <div className="hc-text" key={`${slide.id}-t`}>
            <p className="eyebrow hc-eyebrow">◆ {slide.eyebrow}</p>
            <h1 className="display hc-title">
              {slide.title.split('\n').map((line, i) => (
                <span key={i} className="hc-title-line">
                  {i === 1 ? <em>{line}</em> : line}
                </span>
              ))}
            </h1>
            <p className="hc-sub">{slide.sub}</p>
            <div className="hc-cta">
              <Link to={slide.cta.to} className="btn btn-accent">
                {slide.cta.label} <ArrowRight size={14} />
              </Link>
              <Link to="/shop" className="btn btn-ghost">Browse all</Link>
            </div>
          </div>

          <div className="hc-visual" key={`${slide.id}-v`}>
            <div className="hc-visual-inner">
              <ProductVisual category={slide.category} seed={slide.seed} />
            </div>
            <span className="hc-slide-num display">
              0{index + 1}<span className="hc-slide-num-total">/0{slides.length}</span>
            </span>
          </div>

          <span className="hc-corner hc-corner-tl" aria-hidden="true" />
          <span className="hc-corner hc-corner-tr" aria-hidden="true" />
          <span className="hc-corner hc-corner-bl" aria-hidden="true" />
          <span className="hc-corner hc-corner-br" aria-hidden="true" />
        </div>

        <div className="hc-controls">
          <button className="hc-arrow" onClick={() => go(-1)} aria-label="Previous slide">
            <ChevronLeft size={18} strokeWidth={1.5} />
          </button>

          <div className="hc-dots" role="tablist">
            {slides.map((s, i) => (
              <button
                key={s.id}
                className={`hc-dot ${i === index ? 'is-active' : ''}`}
                onClick={() => setIndex(i)}
                aria-label={`Go to slide ${i + 1}`}
                aria-selected={i === index}
              >
                <span className="hc-dot-fill" />
              </button>
            ))}
          </div>

          <button className="hc-arrow" onClick={() => go(1)} aria-label="Next slide">
            <ChevronRight size={18} strokeWidth={1.5} />
          </button>
        </div>

        <dl className="hc-stats">
          <div><dt>Free shipping</dt><dd>$200+</dd></div>
          <div><dt>Returns</dt><dd>30 days</dd></div>
          <div><dt>Warranty</dt><dd>2 years</dd></div>
          <div><dt>Rated</dt><dd>4.6 ★</dd></div>
        </dl>
      </div>
    </section>
  );
}
