import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import './HeroCarousel.css'

const slides = [
  {
    id: 1,
    eyebrow: 'NEW DROP',
    title: 'Cinema in your pocket',
    bg: 'linear-gradient(135deg, #0A1628 0%, #11223D 100%)',
    accent: '#2DD4FF',
    cta: 'Shop Projectors',
    href: '/shop?category=projectors',
  },
  {
    id: 2,
    eyebrow: 'HOT DROP',
    title: 'Sound, unleashed',
    bg: 'linear-gradient(135deg, #2DD4FF 0%, #11223D 100%)',
    accent: '#0A1628',
    cta: 'Shop Audio',
    href: '/shop?category=audio',
  },
  {
    id: 3,
    eyebrow: 'SPRING 2026',
    title: 'Every day, elevated',
    bg: 'linear-gradient(135deg, #E8EEF5 0%, #C0C7D0 100%)',
    accent: '#0A1628',
    cta: 'Shop Gadgets',
    href: '/shop?category=gadgets',
  },
]

export default function HeroCarousel() {
  const [active, setActive] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setActive((i) => (i + 1) % slides.length)
    }, 4000)
    return () => clearInterval(timer)
  }, [])

  return (
    <section className="hc">
      <div className="hc-track">
        {slides.map((slide, i) => (
          <Link
            key={slide.id}
            to={slide.href}
            className={`hc-slide ${i === active ? 'is-active' : ''}`}
            style={{ background: slide.bg }}
            aria-hidden={i !== active}
          >
            <div className="hc-placeholder">
              <span className="hc-ph-label" style={{ color: slide.accent }}>
                {slide.eyebrow}
              </span>
              <h2 className="hc-ph-title" style={{ color: slide.accent }}>
                {slide.title}
              </h2>
              <span className="hc-ph-hint" style={{ color: slide.accent, opacity: 0.5 }}>
                — banner image —
              </span>
            </div>
          </Link>
        ))}
      </div>
      <div className="hc-dots">
        {slides.map((_, i) => (
          <button
            key={i}
            className={`hc-dot ${i === active ? 'is-active' : ''}`}
            onClick={() => setActive(i)}
            aria-label={`Slide ${i + 1}`}
          />
        ))}
      </div>
    </section>
  )
}
