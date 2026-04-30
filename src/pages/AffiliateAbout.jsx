import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ArrowRight, Check, Zap, Target, Wallet, ShieldCheck,
  Users, Globe, Plus, Minus, Sparkles, TrendingUp, Star, Crown
} from 'lucide-react'
import './AffiliateAbout.css'

const LEVELS = [
  {
    tier: '01',
    name: 'Spark',
    icon: Sparkles,
    target: '0+ sales / month',
    commission: '5%',
    perk: 'Welcome kit + onboarding call',
  },
  {
    tier: '02',
    name: 'Rising',
    icon: TrendingUp,
    target: '10+ sales / month',
    commission: '7%',
    perk: 'Branded merch drop + early product previews',
  },
  {
    tier: '03',
    name: 'Star',
    icon: Star,
    target: '25+ sales / month',
    commission: '10%',
    perk: 'Exclusive product previews + featured spotlight',
  },
  {
    tier: '04',
    name: 'Legend',
    icon: Crown,
    target: '50+ sales / month',
    commission: '15%',
    perk: 'Monthly stipend + custom landing page slot',
  },
]

const HOW_STEPS = [
  {
    num: '01',
    title: 'Apply & verify',
    body: 'Sign up with your details and a government-issued ID. We verify within 24-48 hours.',
  },
  {
    num: '02',
    title: 'Pick your products',
    body: 'Browse the catalog, see commission rates per product, and pick what fits your audience.',
  },
  {
    num: '03',
    title: 'Share & earn',
    body: 'Share your unique coupon code anywhere. Buyers get a discount, you get paid for every sale.',
  },
]

const BENEFITS = [
  { icon: Zap, label: 'Promote anything', body: 'No restrictions. Pick any product from our catalog.' },
  { icon: TrendingUp, label: 'Level up, earn more', body: 'Higher tiers unlock better commission rates.' },
  { icon: Globe, label: 'Custom landing pages', body: 'Request a dedicated page for products you push hard.' },
  { icon: Wallet, label: 'Reliable payouts', body: 'Bank transfers after delivery + return window closes.' },
  { icon: Users, label: 'No audience size required', body: 'Whether you have 100 or 100K followers — apply.' },
  { icon: ShieldCheck, label: 'Verified-only network', body: 'Every affiliate is ID-verified. We protect the brand.' },
]

const FAQ = [
  {
    q: 'Who can become a Shoply affiliate?',
    a: 'Anyone in Nigeria with a valid government-issued ID and a way to share your code with people — Instagram, WhatsApp, TikTok, in-person, your own site. No minimum follower count.',
  },
  {
    q: 'How much can I earn?',
    a: 'Commission ranges from 5% to 15% based on your tier. Each product also has its own rate, so you can see exactly what you\'ll earn before you choose what to promote.',
  },
  {
    q: 'When do I get paid?',
    a: 'Commissions are released after the order is successfully delivered AND the 24-hour return window has closed. Payouts go to your registered bank account.',
  },
  {
    q: 'What happens if a customer returns the product?',
    a: 'No commission is paid on returned orders. The 24-hour return window protects both sides — clean books, no chargebacks.',
  },
  {
    q: 'What ID do you accept?',
    a: 'NIN, voter\'s card, driver\'s license, or international passport. The ID must match the name on your bank account for payout verification.',
  },
  {
    q: 'How do I track my performance?',
    a: 'Once approved, you get a dashboard showing real-time clicks, conversions, pending commission, total earnings, and your progress to the next level.',
  },
  {
    q: 'Are level targets fixed?',
    a: 'Targets are reviewed quarterly. We may adjust based on market conditions — but we\'ll always notify you in advance and never reduce commissions you\'ve already earned.',
  },
  {
    q: 'Can I get a custom landing page?',
    a: 'Yes — Star and Legend tiers can request dedicated landing pages for products they push hard. Domain registration is your responsibility, we handle the page.',
  },
]

export default function AffiliateAbout() {
  const [openFaq, setOpenFaq] = useState(0)

  return (
    <div className="affabout page-enter">

      {/* HERO */}
      <section className="affabout-hero">
        <div className="affabout-container">
          <motion.p
            className="affabout-eyebrow"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Sparkles size={12} /> PARTNERSHIP PROGRAM
          </motion.p>

          <motion.h1
            className="affabout-hero-title"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.05 }}
          >
            Turn your audience<br/>
            into <span className="affabout-hero-accent">income.</span>
          </motion.h1>

          <motion.p
            className="affabout-hero-sub"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
          >
            Promote any product on Shoply. Get paid for every sale your code drives.
            No experience needed. No audience size required.
          </motion.p>

          <motion.div
            className="affabout-hero-ctas"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.25 }}
          >
            <Link to="/affiliate" className="affabout-cta-primary">
              Become an Affiliate <ArrowRight size={16} />
            </Link>
            <a href="#how" className="affabout-cta-secondary">
              How it works
            </a>
          </motion.div>

          <motion.div
            className="affabout-stats"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.35 }}
          >
            <div className="affabout-stat">
              <strong>5–15<span>%</span></strong>
              <span>Commission range</span>
            </div>
            <div className="affabout-stat">
              <strong>24–48<span>h</span></strong>
              <span>Verification time</span>
            </div>
            <div className="affabout-stat">
              <strong>4<span> tiers</span></strong>
              <span>Level up to earn more</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="affabout-section" id="how">
        <div className="affabout-container">
          <p className="affabout-section-eyebrow">HOW IT WORKS</p>
          <h2 className="affabout-section-title">Three steps. That's it.</h2>

          <div className="affabout-how-grid">
            {HOW_STEPS.map((step, idx) => (
              <motion.div
                key={step.num}
                className="affabout-how-card"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.4, delay: idx * 0.08 }}
              >
                <span className="affabout-how-num">{step.num}</span>
                <h3 className="affabout-how-title">{step.title}</h3>
                <p className="affabout-how-body">{step.body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* BENEFITS */}
      <section className="affabout-section affabout-section-tinted">
        <div className="affabout-container">
          <p className="affabout-section-eyebrow">WHY SHOPLY</p>
          <h2 className="affabout-section-title">Built for ambitious creators.</h2>

          <div className="affabout-benefits-grid">
            {BENEFITS.map((b) => {
              const Icon = b.icon
              return (
                <div key={b.label} className="affabout-benefit">
                  <div className="affabout-benefit-icon">
                    <Icon size={18} strokeWidth={2} />
                  </div>
                  <h4>{b.label}</h4>
                  <p>{b.body}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* LEVEL SYSTEM */}
      <section className="affabout-section" id="levels">
        <div className="affabout-container">
          <p className="affabout-section-eyebrow">LEVEL SYSTEM</p>
          <h2 className="affabout-section-title">Climb the ladder. Earn more.</h2>
          <p className="affabout-section-lede">
            Every affiliate starts at Spark. Hit your monthly sales target to unlock the next tier —
            higher commissions and better perks every step up.
          </p>

          <div className="affabout-levels">
            {LEVELS.map((lvl, idx) => {
              const Icon = lvl.icon
              return (
                <motion.div
                  key={lvl.name}
                  className={`affabout-level affabout-level-${idx}`}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: idx * 0.08 }}
                >
                  <div className="affabout-level-head">
                    <span className="affabout-level-tier">TIER {lvl.tier}</span>
                    <div className="affabout-level-icon">
                      <Icon size={20} strokeWidth={2} />
                    </div>
                  </div>
                  <h3 className="affabout-level-name">{lvl.name}</h3>
                  <div className="affabout-level-comm">
                    <strong>{lvl.commission}</strong>
                    <span>commission</span>
                  </div>
                  <div className="affabout-level-row">
                    <Target size={14} />
                    <span>{lvl.target}</span>
                  </div>
                  <div className="affabout-level-row">
                    <Zap size={14} />
                    <span>{lvl.perk}</span>
                  </div>
                </motion.div>
              )
            })}
          </div>

          <p className="affabout-fineprint">
            Targets are reviewed quarterly. You'll be notified before any change.
          </p>
        </div>
      </section>

      {/* PAYOUT */}
      <section className="affabout-section affabout-section-tinted">
        <div className="affabout-container">
          <p className="affabout-section-eyebrow">PAYOUTS</p>
          <h2 className="affabout-section-title">Get paid the right way.</h2>

          <div className="affabout-payout-grid">
            <div className="affabout-payout-card">
              <Wallet size={22} className="affabout-payout-icon" />
              <h4>Bank transfer to your account</h4>
              <p>Direct payout to the bank account you register with. No middlemen, no crypto required.</p>
            </div>
            <div className="affabout-payout-card">
              <ShieldCheck size={22} className="affabout-payout-icon" />
              <h4>Released after delivery</h4>
              <p>Commission is released only after the order is successfully delivered AND the 24-hour return window closes.</p>
            </div>
            <div className="affabout-payout-card">
              <Target size={22} className="affabout-payout-icon" />
              <h4>Per-product rates visible</h4>
              <p>Every product page shows you the exact commission rate so you can pick what's worth your time.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CUSTOM LANDING PAGES */}
      <section className="affabout-section">
        <div className="affabout-container">
          <div className="affabout-landing-card">
            <div className="affabout-landing-text">
              <p className="affabout-section-eyebrow">PRO PERK</p>
              <h2 className="affabout-section-title">Want your own landing page?</h2>
              <p className="affabout-section-lede">
                Star and Legend tier affiliates can request a dedicated landing page for products
                they push hard. We handle the design and build — you handle domain registration.
              </p>
              <p className="affabout-section-lede">
                Reach out once you're verified and we'll quote the page like an ad-buy.
              </p>
            </div>
            <div className="affabout-landing-visual" aria-hidden>
              <div className="affabout-landing-mock">
                <div className="affabout-landing-mock-bar" />
                <div className="affabout-landing-mock-hero" />
                <div className="affabout-landing-mock-line" />
                <div className="affabout-landing-mock-line affabout-landing-mock-line-short" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="affabout-section affabout-section-tinted">
        <div className="affabout-container affabout-container-tight">
          <p className="affabout-section-eyebrow">QUESTIONS</p>
          <h2 className="affabout-section-title">Things you might be wondering.</h2>

          <div className="affabout-faq">
            {FAQ.map((item, idx) => {
              const isOpen = openFaq === idx
              return (
                <div
                  key={idx}
                  className={`affabout-faq-item ${isOpen ? 'is-open' : ''}`}
                >
                  <button
                    type="button"
                    className="affabout-faq-q"
                    onClick={() => setOpenFaq(isOpen ? -1 : idx)}
                    aria-expanded={isOpen}
                  >
                    <span>{item.q}</span>
                    {isOpen ? <Minus size={18} /> : <Plus size={18} />}
                  </button>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      transition={{ duration: 0.2 }}
                      className="affabout-faq-a-wrap"
                    >
                      <p className="affabout-faq-a">{item.a}</p>
                    </motion.div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="affabout-final">
        <div className="affabout-container">
          <h2 className="affabout-final-title">Ready to start earning?</h2>
          <p className="affabout-final-sub">
            Application takes 2 minutes. Verification in 24-48 hours.
          </p>
          <Link to="/affiliate" className="affabout-cta-primary affabout-cta-large">
            Become an Affiliate <ArrowRight size={18} />
          </Link>
          <p className="affabout-final-note">
            <Check size={13} /> Free to join · <Check size={13} /> No minimum audience · <Check size={13} /> Cancel anytime
          </p>
        </div>
      </section>
    </div>
  )
}
