import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowRight, Check, Eye, EyeOff, Mail, Lock, User, Phone,
  IdCard, Sparkles, TrendingUp, Wallet, BarChart3, Copy, Award,
  Target, ChevronRight, Star
} from 'lucide-react'
import './Affiliate.css'

const ID_TYPES = [
  { value: 'nin', label: 'NIN (National ID)' },
  { value: 'voter', label: "Voter's Card" },
  { value: 'driver', label: "Driver's License" },
  { value: 'passport', label: 'International Passport' },
]

const QUICK_BENEFITS = [
  { icon: Sparkles, label: 'Free to join' },
  { icon: TrendingUp, label: 'Earn up to 15%' },
  { icon: Wallet, label: 'Bank transfer payouts' },
]

// Mock data for the dashboard preview
const MOCK_STATS = [
  { label: 'Total earned', value: '₦0', sub: 'all time' },
  { label: 'Pending', value: '₦0', sub: 'awaiting release' },
  { label: 'This month', value: '₦0', sub: '0 sales' },
  { label: 'Total clicks', value: '0', sub: 'across all codes' },
]

const MOCK_CODES = [
  { code: 'KEN10', product: '4K Projector', commission: '8%', uses: 0 },
  { code: 'KEN10', product: 'Mini Portable Projector', commission: '6%', uses: 0 },
]

const MOCK_TOP = [
  { name: 'Smart Projector Pro', commission: '10%', cat: 'PROJECTORS' },
  { name: 'Wireless Earbuds X', commission: '12%', cat: 'AUDIO' },
  { name: 'Power Bank 30K', commission: '8%', cat: 'GADGETS' },
]

export default function Affiliate() {
  const [tab, setTab] = useState('register') // register | signin
  const [showPw, setShowPw] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [showDashboard, setShowDashboard] = useState(false)

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    idType: 'nin',
    idNumber: '',
    password: '',
    bio: '',
    agree: false,
  })

  const [signIn, setSignIn] = useState({ email: '', password: '' })

  const handleField = (key, value) => setForm((f) => ({ ...f, [key]: value }))

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.agree) return
    // No backend yet — just show success state
    setSubmitted(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleSignIn = (e) => {
    e.preventDefault()
    // No backend yet — placeholder
    alert('Sign in will be enabled once the backend is wired up.')
  }

  // ----- success screen after register submit -----
  if (submitted) {
    return (
      <div className="affportal page-enter">
        <div className="affportal-container affportal-container-tight">
          <motion.div
            className="affportal-success"
            initial={{ opacity: 0, scale: 0.95, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="affportal-success-icon">
              <Check size={32} strokeWidth={2.5} />
            </div>
            <h1>Application received</h1>
            <p>
              Thanks for applying, <strong>{form.name || 'creator'}</strong>. We're reviewing your details
              and ID verification now.
            </p>
            <p>
              You'll get an email at <strong>{form.email}</strong> within 24-48 hours with your
              login credentials and your unique affiliate dashboard.
            </p>

            <div className="affportal-success-next">
              <p className="affportal-section-eyebrow">WHILE YOU WAIT</p>
              <Link to="/affiliate/about" className="affportal-success-link">
                Read more about the program <ChevronRight size={14} />
              </Link>
              <Link to="/shop" className="affportal-success-link">
                Browse products you might promote <ChevronRight size={14} />
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    )
  }

  return (
    <div className="affportal page-enter">

      {/* HERO */}
      <section className="affportal-hero">
        <div className="affportal-container">
          <p className="affportal-eyebrow">
            <Sparkles size={12} /> JOIN THE PROGRAM
          </p>
          <h1 className="affportal-hero-title">
            Become a Shoply<br/>
            <span className="affportal-hero-accent">affiliate.</span>
          </h1>
          <p className="affportal-hero-sub">
            Apply in 2 minutes. Verification in 24-48 hours. Then start earning.
          </p>

          <div className="affportal-quickbenefits">
            {QUICK_BENEFITS.map((b) => {
              const Icon = b.icon
              return (
                <div key={b.label} className="affportal-quickbenefit">
                  <Icon size={14} />
                  <span>{b.label}</span>
                </div>
              )
            })}
          </div>

          <Link to="/affiliate/about" className="affportal-hero-link">
            How the program works <ChevronRight size={14} />
          </Link>
        </div>
      </section>

      {/* FORM SECTION */}
      <section className="affportal-form-section">
        <div className="affportal-container affportal-container-tight">

          {/* Tabs */}
          <div className="affportal-tabs">
            <button
              type="button"
              className={`affportal-tab ${tab === 'register' ? 'is-active' : ''}`}
              onClick={() => setTab('register')}
            >
              Register
            </button>
            <button
              type="button"
              className={`affportal-tab ${tab === 'signin' ? 'is-active' : ''}`}
              onClick={() => setTab('signin')}
            >
              Sign in
            </button>
          </div>

          <AnimatePresence mode="wait">
            {tab === 'register' ? (
              <motion.form
                key="register"
                onSubmit={handleSubmit}
                className="affportal-form"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
              >
                <div className="affportal-field">
                  <label htmlFor="aff-name">Full name</label>
                  <div className="affportal-input-wrap">
                    <User size={16} className="affportal-input-icon" />
                    <input
                      id="aff-name"
                      type="text"
                      autoComplete="name"
                      value={form.name}
                      onChange={(e) => handleField('name', e.target.value)}
                      placeholder="As it appears on your ID"
                      required
                    />
                  </div>
                </div>

                <div className="affportal-field-row">
                  <div className="affportal-field">
                    <label htmlFor="aff-email">Email</label>
                    <div className="affportal-input-wrap">
                      <Mail size={16} className="affportal-input-icon" />
                      <input
                        id="aff-email"
                        type="email"
                        autoComplete="email"
                        value={form.email}
                        onChange={(e) => handleField('email', e.target.value)}
                        placeholder="you@email.com"
                        required
                      />
                    </div>
                  </div>

                  <div className="affportal-field">
                    <label htmlFor="aff-phone">Phone</label>
                    <div className="affportal-input-wrap">
                      <Phone size={16} className="affportal-input-icon" />
                      <input
                        id="aff-phone"
                        type="tel"
                        autoComplete="tel"
                        value={form.phone}
                        onChange={(e) => handleField('phone', e.target.value)}
                        placeholder="0801 234 5678"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="affportal-field-row">
                  <div className="affportal-field">
                    <label htmlFor="aff-idtype">ID type</label>
                    <div className="affportal-input-wrap">
                      <IdCard size={16} className="affportal-input-icon" />
                      <select
                        id="aff-idtype"
                        value={form.idType}
                        onChange={(e) => handleField('idType', e.target.value)}
                        className="affportal-select"
                      >
                        {ID_TYPES.map((t) => (
                          <option key={t.value} value={t.value}>{t.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="affportal-field">
                    <label htmlFor="aff-idnum">ID number</label>
                    <div className="affportal-input-wrap">
                      <input
                        id="aff-idnum"
                        type="text"
                        value={form.idNumber}
                        onChange={(e) => handleField('idNumber', e.target.value)}
                        placeholder="11+ digits"
                        required
                        style={{ paddingLeft: 14 }}
                      />
                    </div>
                  </div>
                </div>

                <div className="affportal-field">
                  <label htmlFor="aff-password">Password</label>
                  <div className="affportal-input-wrap">
                    <Lock size={16} className="affportal-input-icon" />
                    <input
                      id="aff-password"
                      type={showPw ? 'text' : 'password'}
                      autoComplete="new-password"
                      value={form.password}
                      onChange={(e) => handleField('password', e.target.value)}
                      placeholder="At least 8 characters"
                      minLength={8}
                      required
                    />
                    <button
                      type="button"
                      className="affportal-input-toggle"
                      onClick={() => setShowPw(!showPw)}
                      aria-label={showPw ? 'Hide password' : 'Show password'}
                    >
                      {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <div className="affportal-field">
                  <label htmlFor="aff-bio">
                    How will you promote? <span className="affportal-optional">optional</span>
                  </label>
                  <textarea
                    id="aff-bio"
                    value={form.bio}
                    onChange={(e) => handleField('bio', e.target.value)}
                    placeholder="Tell us about your audience — Instagram, TikTok, WhatsApp groups, your community, etc."
                    rows={3}
                    className="affportal-textarea"
                  />
                </div>

                <label className="affportal-check">
                  <input
                    type="checkbox"
                    checked={form.agree}
                    onChange={(e) => handleField('agree', e.target.checked)}
                    required
                  />
                  <span>
                    I agree to the <Link to="/policies">affiliate terms</Link> and confirm
                    that all details and the ID number above are accurate.
                  </span>
                </label>

                <button
                  type="submit"
                  className="affportal-submit"
                  disabled={!form.agree}
                >
                  Submit application <ArrowRight size={16} />
                </button>

                <p className="affportal-form-note">
                  Verification takes 24-48 hours. We'll email you once you're approved.
                </p>
              </motion.form>
            ) : (
              <motion.form
                key="signin"
                onSubmit={handleSignIn}
                className="affportal-form"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
              >
                <div className="affportal-field">
                  <label htmlFor="aff-signin-email">Email</label>
                  <div className="affportal-input-wrap">
                    <Mail size={16} className="affportal-input-icon" />
                    <input
                      id="aff-signin-email"
                      type="email"
                      autoComplete="email"
                      value={signIn.email}
                      onChange={(e) => setSignIn({ ...signIn, email: e.target.value })}
                      placeholder="you@email.com"
                      required
                    />
                  </div>
                </div>

                <div className="affportal-field">
                  <label htmlFor="aff-signin-pw">Password</label>
                  <div className="affportal-input-wrap">
                    <Lock size={16} className="affportal-input-icon" />
                    <input
                      id="aff-signin-pw"
                      type={showPw ? 'text' : 'password'}
                      autoComplete="current-password"
                      value={signIn.password}
                      onChange={(e) => setSignIn({ ...signIn, password: e.target.value })}
                      placeholder="Your password"
                      required
                    />
                    <button
                      type="button"
                      className="affportal-input-toggle"
                      onClick={() => setShowPw(!showPw)}
                      aria-label={showPw ? 'Hide password' : 'Show password'}
                    >
                      {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <div className="affportal-signin-row">
                  <button type="button" className="affportal-link-btn">
                    Forgot password?
                  </button>
                </div>

                <button type="submit" className="affportal-submit">
                  Sign in <ArrowRight size={16} />
                </button>

                <p className="affportal-form-note">
                  Don't have an affiliate account yet?{' '}
                  <button
                    type="button"
                    className="affportal-link-btn"
                    onClick={() => setTab('register')}
                  >
                    Apply here
                  </button>
                </p>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* DASHBOARD PREVIEW */}
      <section className="affportal-preview-section">
        <div className="affportal-container">
          <div className="affportal-preview-head">
            <div>
              <p className="affportal-section-eyebrow">DASHBOARD PREVIEW</p>
              <h2 className="affportal-preview-title">See what you'll get inside.</h2>
            </div>
            <button
              type="button"
              className="affportal-preview-toggle"
              onClick={() => setShowDashboard(!showDashboard)}
            >
              {showDashboard ? 'Hide preview' : 'Show preview'}
              <ChevronRight
                size={14}
                style={{
                  transform: showDashboard ? 'rotate(90deg)' : 'rotate(0deg)',
                  transition: 'transform 0.2s ease',
                }}
              />
            </button>
          </div>

          <AnimatePresence>
            {showDashboard && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="affportal-preview-wrap"
              >
                <div className="affportal-dash">

                  {/* Welcome banner */}
                  <div className="affportal-dash-welcome">
                    <div>
                      <p className="affportal-dash-hello">Welcome back, Creator</p>
                      <h3>Your affiliate dashboard</h3>
                    </div>
                    <div className="affportal-dash-level">
                      <Sparkles size={14} />
                      <span>SPARK</span>
                    </div>
                  </div>

                  {/* Stats grid */}
                  <div className="affportal-dash-stats">
                    {MOCK_STATS.map((s) => (
                      <div key={s.label} className="affportal-dash-stat">
                        <p className="affportal-dash-stat-label">{s.label}</p>
                        <strong>{s.value}</strong>
                        <span>{s.sub}</span>
                      </div>
                    ))}
                  </div>

                  {/* Progress */}
                  <div className="affportal-dash-progress">
                    <div className="affportal-dash-progress-head">
                      <div>
                        <strong>Progress to Rising</strong>
                        <p>0 / 10 sales this month</p>
                      </div>
                      <div className="affportal-dash-progress-target">
                        <Target size={14} />
                        <span>+2% commission unlock</span>
                      </div>
                    </div>
                    <div className="affportal-dash-progress-bar">
                      <div className="affportal-dash-progress-fill" style={{ width: '0%' }} />
                    </div>
                  </div>

                  {/* Coupon codes */}
                  <div className="affportal-dash-card">
                    <div className="affportal-dash-card-head">
                      <h4>Your active coupon codes</h4>
                      <span className="affportal-dash-card-meta">{MOCK_CODES.length} codes</span>
                    </div>
                    <div className="affportal-dash-codes">
                      {MOCK_CODES.map((c, i) => (
                        <div key={i} className="affportal-dash-code">
                          <div className="affportal-dash-code-main">
                            <span className="affportal-dash-code-tag">{c.code}</span>
                            <button className="affportal-dash-code-copy" type="button">
                              <Copy size={12} />
                            </button>
                          </div>
                          <div className="affportal-dash-code-meta">
                            <span>{c.product}</span>
                            <span className="affportal-dash-code-comm">{c.commission}</span>
                          </div>
                          <span className="affportal-dash-code-uses">{c.uses} uses</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Top products */}
                  <div className="affportal-dash-card">
                    <div className="affportal-dash-card-head">
                      <h4>Top products to promote</h4>
                      <span className="affportal-dash-card-meta">By commission</span>
                    </div>
                    <div className="affportal-dash-top">
                      {MOCK_TOP.map((p, i) => (
                        <div key={i} className="affportal-dash-top-item">
                          <div className="affportal-dash-top-icon">
                            <Star size={14} />
                          </div>
                          <div className="affportal-dash-top-body">
                            <p className="affportal-dash-top-cat">{p.cat}</p>
                            <p className="affportal-dash-top-name">{p.name}</p>
                          </div>
                          <span className="affportal-dash-top-comm">{p.commission}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Custom landing page CTA */}
                  <div className="affportal-dash-landing">
                    <Award size={20} />
                    <div>
                      <strong>Want a custom landing page?</strong>
                      <p>Available for Star and Legend tiers. Reach out once you qualify.</p>
                    </div>
                    <button type="button" className="affportal-dash-landing-btn">
                      Learn more
                    </button>
                  </div>

                  <p className="affportal-dash-note">
                    <BarChart3 size={12} /> This is a preview. All numbers are zero until you start making sales.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* BOTTOM LINK */}
      <section className="affportal-bottom-section">
        <div className="affportal-container">
          <div className="affportal-bottom-card">
            <div>
              <h3>Want to know more first?</h3>
              <p>Read the full breakdown — levels, commissions, payouts, FAQ.</p>
            </div>
            <Link to="/affiliate/about" className="affportal-bottom-cta">
              Learn about the program <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
