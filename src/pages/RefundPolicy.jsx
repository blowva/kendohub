import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Clock, RefreshCw, Wallet, ShieldCheck, AlertTriangle, Truck,
  CheckCircle2, XCircle, ArrowRight, Plus, Minus, Mail, Package,
  Camera, MessageSquare, BadgeCheck, Sparkles, Video, Lock,
  Eye, Upload, Zap, ArrowDown
} from 'lucide-react'
import './RefundPolicy.css'

const KEY_RULES = [
  {
    icon: Clock,
    title: '24-hour return window',
    body: 'You have 24 hours from delivery to request a return. Move fast — keeps it fair for everyone.',
  },
  {
    icon: Video,
    title: 'Unboxing video required',
    body: 'For gadgets and electronics, an unboxing video is mandatory. Accessories like cables are exempt.',
  },
  {
    icon: Truck,
    title: 'You pay return shipping',
    body: 'Return logistics are on you, except when the item arrived defective or wrong — then we cover it.',
  },
  {
    icon: RefreshCw,
    title: 'Refund or upgrade exchange',
    body: 'Get your money back, or exchange for an item of equal or higher value (you pay the difference).',
  },
]

const VIDEO_RULES = [
  {
    num: '01',
    title: 'Seal must be visible',
    body: 'Start the recording showing the package unopened, with the original seal intact and unbroken.',
  },
  {
    num: '02',
    title: 'Continuous unboxing',
    body: 'Open the box on camera. No cuts, no pausing — one clean take from sealed box to product in hand.',
  },
  {
    num: '03',
    title: 'Power it on',
    body: 'If the item is a gadget that powers on, turn it on while still recording. Show it working — or not working.',
  },
  {
    num: '04',
    title: 'Upload to start return',
    body: 'Upload your video through your account to begin the return. We unlock our pre-ship video instantly so you can compare.',
  },
]

const STEPS = [
  {
    num: '01',
    icon: Video,
    title: 'Record your unboxing',
    body: 'The moment your package arrives, start recording before you break the seal. Show the unbroken seal, open the box, take the product out, and power it on if applicable.',
  },
  {
    num: '02',
    icon: Upload,
    title: 'Upload your video',
    body: 'Log in to your account, find your order, and upload the unboxing video to start your return request. Include your reason for the return.',
  },
  {
    num: '03',
    icon: Lock,
    title: 'Our pre-ship video unlocks',
    body: 'Once your video is uploaded, our recording from before we shipped is automatically released to you. You can now compare both sides and verify the issue yourself.',
  },
  {
    num: '04',
    icon: BadgeCheck,
    title: 'We review and approve',
    body: 'Our team reviews both videos within 4 hours. If the return qualifies, we send you the return address and instructions. If declined, we explain why.',
  },
  {
    num: '05',
    icon: Package,
    title: 'Ship it back',
    body: 'Pack the item exactly as you received it and ship it back at your cost (unless the issue was on our end — then we cover it). Send us the tracking number.',
  },
  {
    num: '06',
    icon: CheckCircle2,
    title: 'Refund or exchange processed',
    body: 'Once we receive and verify the item, your refund hits your account within 1–3 business days, or we ship out your exchange item.',
  },
]

const ELIGIBLE = [
  'Item returned within 24 hours of delivery',
  'Original packaging, accessories, and gifts intact',
  'Unboxing video uploaded (gadgets and electronics)',
  'Item unused or only tested briefly',
  'Order number or receipt provided',
]

const NOT_ELIGIBLE = [
  'No unboxing video for gadgets / electronics',
  'Hygiene items (in-ear earbuds once unsealed)',
  'Software or digital products once activated',
  'Custom or personalized orders',
  'Damage from drops, water, or misuse',
  'Returns submitted after the 24-hour window',
]

const FAQ = [
  {
    q: 'Why do I need to record an unboxing video?',
    a: 'It protects both of us. Your video proves the condition of the item the moment it arrived. Our pre-shipping video proves what we sent. With both, neither side can be falsely accused — clean, fair, transparent.',
  },
  {
    q: 'What if I forgot to record the unboxing?',
    a: 'For gadgets and electronics, we cannot accept the return without it. This rule is firm — it\'s the only way the system stays fair for everyone. For accessories like cables, phone stands, and laptop sleeves, no video is required.',
  },
  {
    q: 'How do I see the video Shoply recorded?',
    a: 'It\'s automatically unlocked the moment you upload your own unboxing video through your account. You\'ll see both side-by-side. We never release our video until yours is uploaded — that\'s how we keep it honest.',
  },
  {
    q: 'Can I exchange for a cheaper product and get the difference back?',
    a: 'No. Exchanges only work for items of equal or higher value. If you want a cheaper product, request a refund instead and place a new order separately.',
  },
  {
    q: 'What if the item arrives defective?',
    a: 'You\'re fully covered. Show us in your unboxing video, upload it, and we\'ll arrange a free pickup or cover return shipping ourselves. Choose: full refund OR replacement at no extra cost.',
  },
  {
    q: 'How long does the refund take?',
    a: 'After we receive and inspect your return, refunds are processed within 1–3 business days through whichever method gets your money back fastest — usually direct bank transfer.',
  },
  {
    q: 'What format should the video be?',
    a: 'Any standard phone video works — MP4, MOV. Just make sure: (1) the seal is visible at the start, (2) it\'s one continuous take, (3) the product is shown clearly. Phone vertical or horizontal is fine.',
  },
  {
    q: 'What if I miss the 24-hour window?',
    a: 'Returns outside the 24-hour window are usually not accepted. In rare cases (manufacturing defect that only shows after a day, etc.) we review case-by-case — reach out and we\'ll do our best.',
  },
  {
    q: 'Can I cancel before shipment?',
    a: 'Yes. If your order hasn\'t shipped yet, you can cancel for a full refund — no video needed, no questions asked.',
  },
]

export default function RefundPolicy() {
  const [openFaq, setOpenFaq] = useState(0)

  return (
    <div className="refund page-enter">

      {/* HERO */}
      <section className="refund-hero">
        <div className="refund-container">
          <p className="refund-eyebrow">
            <ShieldCheck size={12} /> RETURN & REFUND POLICY
          </p>
          <h1 className="refund-title">
            Honest returns.<br/>
            <span className="refund-title-accent">Verified by video.</span>
          </h1>
          <p className="refund-lede">
            We protect both you and us with a dual-video verification system. You record the unboxing,
            we record the packing — both sides accountable, no room for disputes.
          </p>

          <div className="refund-hero-stats">
            <div className="refund-hero-stat">
              <strong>24<span>h</span></strong>
              <span>Return window</span>
            </div>
            <div className="refund-hero-stat">
              <strong>4<span>h</span></strong>
              <span>Approval response</span>
            </div>
            <div className="refund-hero-stat">
              <strong>1–3<span> days</span></strong>
              <span>Refund processed</span>
            </div>
          </div>
        </div>
      </section>

      {/* KEY RULES */}
      <section className="refund-section">
        <div className="refund-container">
          <p className="refund-section-eyebrow">THE BASICS</p>
          <h2 className="refund-section-title">Four rules to know.</h2>

          <div className="refund-rules-grid">
            {KEY_RULES.map((rule) => {
              const Icon = rule.icon
              return (
                <div key={rule.title} className="refund-rule">
                  <div className="refund-rule-icon">
                    <Icon size={18} strokeWidth={2} />
                  </div>
                  <h3>{rule.title}</h3>
                  <p>{rule.body}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* DUAL VIDEO SYSTEM — THE HERO PIECE */}
      <section className="refund-section refund-section-tinted">
        <div className="refund-container">
          <p className="refund-section-eyebrow">HOW IT WORKS</p>
          <h2 className="refund-section-title">The dual-video system.</h2>
          <p className="refund-section-lede">
            Both sides record. Both sides are accountable. Nobody can cheat the process.
          </p>

          <div className="refund-dual-grid">
            {/* Shoply side */}
            <div className="refund-dual-card refund-dual-shoply">
              <div className="refund-dual-head">
                <div className="refund-dual-icon">
                  <Video size={20} />
                </div>
                <div>
                  <p className="refund-dual-label">SHOPLY RECORDS</p>
                  <h3>Before we ship</h3>
                </div>
              </div>
              <ul>
                <li><CheckCircle2 size={14} /> Product packed on camera</li>
                <li><CheckCircle2 size={14} /> Powered on to confirm working (if applicable)</li>
                <li><CheckCircle2 size={14} /> Sealed with original packaging</li>
                <li><CheckCircle2 size={14} /> Stored as proof until needed</li>
              </ul>
            </div>

            {/* Customer side */}
            <div className="refund-dual-card refund-dual-customer">
              <div className="refund-dual-head">
                <div className="refund-dual-icon">
                  <Camera size={20} />
                </div>
                <div>
                  <p className="refund-dual-label">YOU RECORD</p>
                  <h3>On delivery</h3>
                </div>
              </div>
              <ul>
                <li><CheckCircle2 size={14} /> Show the seal unbroken</li>
                <li><CheckCircle2 size={14} /> Open the box on camera</li>
                <li><CheckCircle2 size={14} /> Power it on (if it's a gadget)</li>
                <li><CheckCircle2 size={14} /> Show the issue, if any</li>
              </ul>
            </div>
          </div>

          {/* Unlock flow */}
          <div className="refund-unlock-flow">
            <div className="refund-unlock-step">
              <Upload size={18} />
              <span>You upload yours</span>
            </div>
            <ArrowDown className="refund-unlock-arrow refund-unlock-arrow-mobile" size={20} />
            <ArrowRight className="refund-unlock-arrow refund-unlock-arrow-desktop" size={20} />
            <div className="refund-unlock-step refund-unlock-key">
              <Zap size={18} />
              <span>Ours unlocks instantly</span>
            </div>
            <ArrowDown className="refund-unlock-arrow refund-unlock-arrow-mobile" size={20} />
            <ArrowRight className="refund-unlock-arrow refund-unlock-arrow-desktop" size={20} />
            <div className="refund-unlock-step">
              <Eye size={18} />
              <span>You compare both</span>
            </div>
          </div>

          <div className="refund-unlock-note">
            <Lock size={14} />
            <p>
              <strong>You can't see our video first.</strong> It only unlocks after you upload yours. This stops anyone
              from gaming the system on either side.
            </p>
          </div>
        </div>
      </section>

      {/* WHAT MAKES A VALID VIDEO */}
      <section className="refund-section">
        <div className="refund-container">
          <p className="refund-section-eyebrow">VIDEO REQUIREMENTS</p>
          <h2 className="refund-section-title">What counts as valid proof.</h2>
          <p className="refund-section-lede">
            For your unboxing video to be accepted, it needs to follow these four rules. If you skip a step,
            we may not be able to approve the return.
          </p>

          <div className="refund-video-rules">
            {VIDEO_RULES.map((rule) => (
              <div key={rule.num} className="refund-video-rule">
                <span className="refund-video-rule-num">{rule.num}</span>
                <div>
                  <h3>{rule.title}</h3>
                  <p>{rule.body}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="refund-exempt">
            <Sparkles size={16} />
            <p>
              <strong>Accessories are exempt:</strong> cables, stands, sleeves, and other non-electronics
              don't require an unboxing video — but the 24-hour window and other rules still apply.
            </p>
          </div>
        </div>
      </section>

      {/* STEP BY STEP */}
      <section className="refund-section refund-section-tinted">
        <div className="refund-container">
          <p className="refund-section-eyebrow">RETURN PROCESS</p>
          <h2 className="refund-section-title">From unboxing to refund.</h2>
          <p className="refund-section-lede">
            Six clean steps. Most returns wrap up in 3–5 days end-to-end.
          </p>

          <div className="refund-steps">
            {STEPS.map((step, idx) => {
              const Icon = step.icon
              return (
                <div key={step.num} className="refund-step">
                  <div className="refund-step-left">
                    <span className="refund-step-num">{step.num}</span>
                    {idx < STEPS.length - 1 && <div className="refund-step-line" />}
                  </div>
                  <div className="refund-step-body">
                    <div className="refund-step-icon">
                      <Icon size={16} strokeWidth={2} />
                    </div>
                    <h3>{step.title}</h3>
                    <p>{step.body}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* EXCHANGE RULES */}
      <section className="refund-section">
        <div className="refund-container">
          <div className="refund-exchange">
            <div className="refund-exchange-head">
              <div className="refund-exchange-icon">
                <RefreshCw size={20} />
              </div>
              <h3>Exchange rules</h3>
            </div>
            <p className="refund-exchange-rule">
              <CheckCircle2 size={14} className="refund-rule-yes" />
              <span>Exchange for an item of <strong>equal value</strong> — straight swap, no extra payment.</span>
            </p>
            <p className="refund-exchange-rule">
              <CheckCircle2 size={14} className="refund-rule-yes" />
              <span>Exchange for an item of <strong>higher value</strong> — you pay the price difference.</span>
            </p>
            <p className="refund-exchange-rule">
              <XCircle size={14} className="refund-rule-no" />
              <span>Exchange for a <strong>cheaper product</strong> is <strong>not allowed</strong>. If you want something cheaper, request a refund and place a new order.</span>
            </p>
          </div>
        </div>
      </section>

      {/* ELIGIBLE / NOT ELIGIBLE */}
      <section className="refund-section refund-section-tinted">
        <div className="refund-container">
          <p className="refund-section-eyebrow">ELIGIBILITY</p>
          <h2 className="refund-section-title">What can be returned?</h2>

          <div className="refund-eligibility-grid">
            <div className="refund-elig-card refund-elig-yes">
              <div className="refund-elig-head">
                <CheckCircle2 size={20} strokeWidth={2} />
                <h3>Eligible</h3>
              </div>
              <ul>
                {ELIGIBLE.map((item) => (
                  <li key={item}>
                    <CheckCircle2 size={14} strokeWidth={2.2} />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="refund-elig-card refund-elig-no">
              <div className="refund-elig-head">
                <XCircle size={20} strokeWidth={2} />
                <h3>Not eligible</h3>
              </div>
              <ul>
                {NOT_ELIGIBLE.map((item) => (
                  <li key={item}>
                    <XCircle size={14} strokeWidth={2.2} />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* DAMAGED ON ARRIVAL */}
      <section className="refund-section">
        <div className="refund-container">
          <div className="refund-damaged">
            <div className="refund-damaged-icon">
              <AlertTriangle size={22} />
            </div>
            <div className="refund-damaged-body">
              <h3>Item arrived damaged or wrong?</h3>
              <p>
                You're 100% covered when it's our fault. Show it in your unboxing video, upload it, and:
              </p>
              <ul>
                <li>We arrange free pickup OR cover your return shipping cost</li>
                <li>You choose: full refund OR replacement at no extra charge</li>
                <li>Resolved within 24–48 hours of upload</li>
              </ul>
              <p className="refund-damaged-note">
                This is the <strong>only</strong> case where Shoply pays for return shipping. We stand behind every product we send.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="refund-section refund-section-tinted">
        <div className="refund-container refund-container-tight">
          <p className="refund-section-eyebrow">QUESTIONS</p>
          <h2 className="refund-section-title">Common questions.</h2>

          <div className="refund-faq">
            {FAQ.map((item, idx) => {
              const isOpen = openFaq === idx
              return (
                <div key={idx} className={`refund-faq-item ${isOpen ? 'is-open' : ''}`}>
                  <button
                    type="button"
                    className="refund-faq-q"
                    onClick={() => setOpenFaq(isOpen ? -1 : idx)}
                    aria-expanded={isOpen}
                  >
                    <span>{item.q}</span>
                    {isOpen ? <Minus size={18} /> : <Plus size={18} />}
                  </button>
                  {isOpen && (
                    <div className="refund-faq-a-wrap">
                      <p className="refund-faq-a">{item.a}</p>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="refund-final">
        <div className="refund-container">
          <h2 className="refund-final-title">Need to start a return?</h2>
          <p className="refund-final-sub">
            Have your unboxing video ready. Most returns are resolved in under 5 days.
          </p>
          <div className="refund-final-ctas">
            <Link to="/account" className="refund-cta-primary">
              Go to my account <ArrowRight size={16} />
            </Link>
            <a href="mailto:hello@shoply.ng" className="refund-cta-secondary">
              <Mail size={15} /> Email support
            </a>
          </div>
          <p className="refund-final-note">
            Last updated: May 2026. Shoply reserves the right to update this policy. Material changes will be
            communicated to active customers via email.
          </p>
        </div>
      </section>
    </div>
  )
}
