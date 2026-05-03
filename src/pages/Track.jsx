import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Package, Search, ArrowRight, ArrowLeft, ShieldCheck,
  Clock, CheckCircle2, CreditCard, Box, Truck, MapPin, Home,
  AlertCircle, Sparkles
} from 'lucide-react'
import './Track.css'

// === MOCK ORDER DATA (will be replaced by Supabase later) ===
// To test the page, use one of these tracking numbers:
//   SHO-12345  → Pending
//   SHO-23456  → Paid
//   SHO-34567  → Packing
//   SHO-45678  → In transit
//   SHO-56789  → At park
//   SHO-67890  → Delivered
const MOCK_ORDERS = {
  'SHO-12345': { status: 'pending',    placed: '2026-05-03', delivery: 'May 6 – May 8' },
  'SHO-23456': { status: 'paid',       placed: '2026-05-02', delivery: 'May 5 – May 7' },
  'SHO-34567': { status: 'packing',    placed: '2026-05-01', delivery: 'May 4 – May 6' },
  'SHO-45678': { status: 'transit',    placed: '2026-04-30', delivery: 'May 3 – May 5' },
  'SHO-56789': { status: 'at-park',    placed: '2026-04-29', delivery: 'May 2 – May 4' },
  'SHO-67890': { status: 'delivered',  placed: '2026-04-25', delivery: 'Delivered May 1' },
}

// === 6-STAGE TIMELINE ===
const STAGES = [
  { id: 'pending',   icon: Clock,         title: 'Pending',           desc: 'Order received, awaiting confirmation' },
  { id: 'paid',      icon: CreditCard,    title: 'Paid',              desc: 'Payment confirmed' },
  { id: 'packing',   icon: Box,           title: 'Packing',           desc: 'Your order is being packed' },
  { id: 'transit',   icon: Truck,         title: 'In transit to park', desc: 'On its way to delivery park' },
  { id: 'at-park',   icon: MapPin,        title: 'Received at park',  desc: 'Ready for final delivery' },
  { id: 'delivered', icon: Home,          title: 'Delivered',         desc: 'Order delivered successfully' },
]

const STAGE_INDEX = STAGES.reduce((acc, s, i) => ({ ...acc, [s.id]: i }), {})

export default function Track() {
  const [trackingInput, setTrackingInput] = useState('')
  const [order, setOrder] = useState(null)
  const [error, setError] = useState('')
  const [searched, setSearched] = useState(false)

  const handleTrack = (e) => {
    if (e) e.preventDefault()
    setError('')
    const code = trackingInput.trim().toUpperCase()

    if (!code) {
      setError('Please enter a tracking number')
      return
    }

    if (!code.match(/^SHO-\d+$/)) {
      setError('Tracking numbers start with SHO- followed by numbers')
      return
    }

    const found = MOCK_ORDERS[code]
    if (!found) {
      setError('No order found with this tracking number. Double-check and try again.')
      setOrder(null)
      setSearched(true)
      return
    }

    setOrder({ ...found, code })
    setSearched(true)
  }

  const currentStageIndex = order ? STAGE_INDEX[order.status] : -1

  return (
    <div className="track page-enter">
      <div className="track-container">

        {/* HEADER */}
        <header className="track-head">
          <Link to="/" className="track-back">
            <ArrowLeft size={14} /> Back to home
          </Link>
          <p className="track-eyebrow">
            <Package size={12} /> ORDER TRACKING
          </p>
          <h1 className="track-title">
            Track your<br />
            <span className="track-title-accent">package.</span>
          </h1>
          <p className="track-lede">
            Enter your tracking number to see where your order is. No account needed.
          </p>
        </header>

        {/* SEARCH */}
        <form className="track-search" onSubmit={handleTrack}>
          <div className="track-search-wrap">
            <Package size={18} className="track-search-icon" />
            <input
              type="text"
              value={trackingInput}
              onChange={(e) => { setTrackingInput(e.target.value); setError('') }}
              placeholder="e.g., SHO-12345"
              className="track-search-input"
              autoComplete="off"
              autoCapitalize="characters"
            />
            <button type="submit" className="track-search-btn">
              <Search size={16} /> Track
            </button>
          </div>
          {error && (
            <div className="track-error">
              <AlertCircle size={14} />
              <span>{error}</span>
            </div>
          )}
          <p className="track-hint">
            Try a demo: <button type="button" className="track-demo" onClick={() => setTrackingInput('SHO-34567')}>SHO-34567</button>
            {' or '}
            <button type="button" className="track-demo" onClick={() => setTrackingInput('SHO-67890')}>SHO-67890</button>
          </p>
        </form>

        {/* RESULT */}
        {order && (
          <div className="track-result">
            {/* Status banner */}
            <div className={`track-status track-status-${order.status}`}>
              <div className="track-status-icon">
                {order.status === 'delivered' ? (
                  <CheckCircle2 size={20} />
                ) : (
                  <Sparkles size={20} />
                )}
              </div>
              <div className="track-status-body">
                <p className="track-status-label">{order.code}</p>
                <h2 className="track-status-title">
                  {STAGES[currentStageIndex].title}
                </h2>
                <p className="track-status-sub">
                  {order.status === 'delivered' ? order.delivery : `Estimated delivery: ${order.delivery}`}
                </p>
              </div>
            </div>

            {/* Timeline */}
            <div className="track-timeline">
              <p className="track-timeline-label">PROGRESS</p>
              {STAGES.map((stage, idx) => {
                const Icon = stage.icon
                const isComplete = idx < currentStageIndex
                const isCurrent  = idx === currentStageIndex
                const isPending  = idx > currentStageIndex
                const stageClass = isComplete ? 'is-complete' : isCurrent ? 'is-current' : 'is-pending'

                return (
                  <div key={stage.id} className={`track-stage ${stageClass}`}>
                    <div className="track-stage-left">
                      <div className="track-stage-dot">
                        {isComplete ? (
                          <CheckCircle2 size={14} strokeWidth={2.5} />
                        ) : (
                          <Icon size={14} strokeWidth={2} />
                        )}
                      </div>
                      {idx < STAGES.length - 1 && <div className="track-stage-line" />}
                    </div>
                    <div className="track-stage-body">
                      <h3>{stage.title}</h3>
                      <p>{stage.desc}</p>
                      {isCurrent && (
                        <span className="track-stage-now">CURRENT</span>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Help / Next steps */}
            <div className="track-help">
              <ShieldCheck size={16} />
              <div>
                <p>
                  <strong>Need help with this order?</strong>
                </p>
                <p>
                  Contact us at <a href="mailto:hello@shoply.ng">hello@shoply.ng</a> with your tracking number.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Empty state when nothing searched yet */}
        {!searched && !order && (
          <div className="track-empty">
            <Package size={48} className="track-empty-icon" />
            <h3>Where's my order?</h3>
            <p>Paste your tracking number above to see real-time status updates.</p>
            <Link to="/shop" className="track-shop-link">
              Shop instead <ArrowRight size={14} />
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
