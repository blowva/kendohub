import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Clock, RefreshCw, Wallet, ShieldCheck, AlertTriangle, Truck,
  CheckCircle2, XCircle, ArrowRight, Plus, Minus, Mail, Package,
  Camera, MessageSquare, BadgeCheck, Sparkles, Video, Lock,
  Eye, Upload, Zap, ArrowDown, Wrench
} from 'lucide-react'
import './RefundPolicy.css'

const KEY_RULES = [
  {
    icon: Clock,
    title: '48-hour return window',
    body: 'You have 48 hours from delivery to request a return. Extra time built in for unexpected delays.',
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
    icon: Wrench,
    title: 'Warranty for defects',
    body: 'Each product has its own manufacturer\'s warranty (set per product). 14-day default if not specified.',
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

const RETURN_STEPS = [
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
    body: 'Once your video is uploaded, our recording from before we shipped is automatically released to you. You can compare both sides yourself.',
  },
  {
    num: '04',
    icon: BadgeCheck,
    title: 'We review and approve',
    body: 'Our team reviews both videos within 4 hours. If approved, we send you the return address. If declined, we explain why.',
  },
  {
    num: '05',
    icon: Package,
    title: 'Ship it back safely',
    body: 'Pack the item carefully in original packaging and ship it back at your cost. Damage during return transit is your responsibility — we cannot accept damaged returns.',
  },
  {
    num: '06',
    icon: CheckCircle2,
    title: 'Refund or exchange processed',
    body: 'Once we receive and verify the item, your refund hits your account within 1–3 business days, or we ship out your exchange item.',
  },
]

const WARRANTY_STEPS = [
  {
    num: '01',
    icon: AlertTriangle,
    title: 'Defect appears with use',
    body: 'A real manufacturing defect shows up after a few days or weeks of normal use — not from drops, water, or misuse.',
  },
  {
    num: '02',
    icon: Camera,
    title: 'Record the defect',
    body: 'Film a short video clearly showing the issue — device won\'t turn on, battery doesn\'t hold, button stuck, etc.',
  },
  {
    num: '03',
    icon: MessageSquare,
    title: 'File the warranty claim',
    body: 'Open a warranty claim through your account. Upload the defect video. Your unboxing video from delivery is already on file.',
  },
  {
    num: '04',
    icon: Truck,
    title: 'Ship to us at your cost',
    body: 'You pay to ship the item to us. From here on, all costs are covered by Shoply.',
  },
  {
    num: '05',
    icon: Wrench,
    title: 'We assess and repair',
    body: 'Our technicians assess the device. If the defect is confirmed, we repair it (or replace internal parts as needed) at no charge to you.',
  },
  {
    num: '06',
    icon: Package,
    title: 'We ship it back to you',
    body: 'Once repaired, we ship the device back to you free of charge. Total turnaround: usually 7–14 days depending on the issue.',
  },
]

const DEFECT_COVERED = [
  'Device won\'t power on or charge',
  'Battery fails or holds no charge',
  'Buttons, ports, or sensors stop working',
  'Wireless / Bluetooth connectivity fails',
  'Manufacturing flaws not visible at unboxing',
  'Components fail during normal expected use',
]

const DEFECT_NOT_COVERED = [
  'Drops, falls, or impact damage',
  'Water or liquid damage',
  'Cracked screens from impact',
  'Damage from incorrect chargers or accessories',
  'Modifications, jailbreaks, unauthorized repairs',
  'Cosmetic wear (scratches, dents, fading)',
]

const ELIGIBLE = [
  'Item returned within 48 hours of delivery',
  'Original packaging, accessories, and gifts intact',
  'Unboxing video uploaded (gadgets and electronics)',
  'Item unused or only tested briefly',
  'Order number or receipt provided',
  'Item arrives back to us undamaged',
]

const NOT_ELIGIBLE = [
  'No unboxing video for gadgets / electronics',
  'Hygiene items (in-ear earbuds once unsealed)',
  'Software or digital products once activated',
  'Custom or personalized orders',
  'Damage from drops, water, or misuse',
  'Damaged during return shipping',
  'Returns submitted after the 48-hour window',
]

const FAQ = [
  {
    q: 'What\'s the difference between a return and a warranty claim?',
    a: 'A return is for the first 48 hours — you change your mind, the item arrived damaged, or it\'s not what you expected. A warranty claim is for after 48 hours — a real manufacturing defect appears with normal use. Returns can result in a refund or exchange. Warranty claims result in a free repair only.',
  },
  {
    q: 'How long is the warranty period?',
    a: 'Each product has its own warranty period set when we list it (e.g., 6 months, 12 months, 24 months). You\'ll see this on the product page before you buy. If no specific warranty is set, the default is 14 days.',
  },
  {
    q: 'Why do I need to record an unboxing video?',
    a: 'It protects both of us. Your video proves the condition of the item the moment it arrived. Our pre-shipping video proves what we sent. With both, neither side can be falsely accused — clean, fair, transparent.',
  },
  {
    q: 'What if I forgot to record the unboxing?',
    a: 'For gadgets and electronics, we cannot accept the return without it. This rule is firm. For accessories like cables, phone stands, and laptop sleeves, no video is required.',
  },
  {
    q: 'Can I exchange for a cheaper product and get the difference back?',
    a: 'No. Exchanges only work for items of equal or higher value. If you want a cheaper product, request a refund instead and place a new order separately.',
  },
  {
    q: 'What if my returned item gets damaged during shipping back?',
    a: 'Unfortunately, damage during return transit is your responsibility. Pack carefully, use the original packaging, and consider insured shipping for high-value items. We cannot accept damaged returns.',
  },
  {
    q: 'For warranty claims, will I get a refund or replacement?',
    a: 'Warranty claims result in a free repair only — not a refund or replacement. We assess the device, fix the defect, and ship it back at no cost to you. You only pay the shipping to send it to us.',
  },
  {
    q: 'How long does a warranty repair take?',
    a: 'Most warranty repairs are completed within 7–14 days from when we receive the device. Complex issues or parts ordering can extend this. We\'ll keep you updated throughout.',
  },
  {
    q: 'What if the warranty defect is actually misuse?',
    a: 'If our assessment shows the damage is from drops, water, modifications, or other misuse, we\'ll let you know and ship it back. We can\'t cover misuse under warranty, but we may offer paid repair if available.',
  },
  {
    q: 'How long does the refund take?',
    a: 'After we receive and inspect your return, refunds are processed within 1–3 business days through whichever method gets your money back fastest — usually direct bank transfer.',
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
            <ShieldCheck size={12} /> RETURNS & WARRANTY
          </p>
          <h1 className="refund-title">
            Two ways<br/>
            <span className="refund-title-accent">we protect you.</span>
          </h1>
          <p className="refund-lede">
            48 hours to return what doesn't work for you. Up to 24 months of warranty coverage
            if a defect appears later. Both backed by our dual-video verification system.
          </p>

          <div className="refund-hero-stats">
            <div className="refund-hero-stat">
              <strong>48<span>h</span></strong>
              <span>Return window</span>
            </div>
            <div className="refund-hero-stat">
              <strong>14<span>+ days</span></strong>
              <span>Warranty (varies)</span>
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

      {/* === BIG SECTION SPLIT: RETURNS vs WARRANTY === */}
      <section className="refund-section refund-section-tinted">
        <div className="refund-container">
          <p className="refund-section-eyebrow">UNDERSTAND THE DIFFERENCE</p>
          <h2 className="refund-section-title">Returns vs Warranty.</h2>

          <div className="refund-vs-grid">
            <div className="refund-vs-card refund-vs-returns">
              <div className="refund-vs-head">
                <div className="refund-vs-icon">
                  <RefreshCw size={20} />
                </div>
                <div>
                  <p className="refund-vs-tag">FIRST 48 HOURS</p>
                  <h3>Returns</h3>
                </div>
              </div>
              <p className="refund-vs-body">
                For when the item arrived damaged, wrong, or you changed your mind quickly.
              </p>
              <ul>
                <li><CheckCircle2 size={14} /> Refund OR exchange</li>
                <li><CheckCircle2 size={14} /> 48-hour window</li>
                <li><CheckCircle2 size={14} /> Unboxing video required</li>
                <li><CheckCircle2 size={14} /> Customer pays return shipping</li>
              </ul>
            </div>

            <div className="refund-vs-divider" aria-hidden>
              <span>OR</span>
            </div>

            <div className="refund-vs-card refund-vs-warranty">
              <div className="refund-vs-head">
                <div className="refund-vs-icon">
                  <Wrench size={20} />
                </div>
                <div>
                  <p className="refund-vs-tag">AFTER 48 HOURS</p>
                  <h3>Warranty</h3>
                </div>
              </div>
              <p className="refund-vs-body">
                For genuine manufacturing defects that show up with normal use over time.
              </p>
              <ul>
                <li><CheckCircle2 size={14} /> Free repair</li>
                <li><CheckCircle2 size={14} /> Per-product window (14+ days)</li>
                <li><CheckCircle2 size={14} /> Defect video required</li>
                <li><CheckCircle2 size={14} /> Shoply pays repair + return shipping</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ============== RETURNS SECTION ============== */}
      <section className="refund-section refund-anchor" id="returns">
        <div className="refund-container">
          <div className="refund-major-head">
            <div className="refund-major-num">
              <RefreshCw size={20} />
            </div>
            <div>
              <p className="refund-section-eyebrow">SECTION 01</p>
              <h2 className="refund-section-title">Returns &amp; Refunds</h2>
              <p className="refund-section-lede">
                If something is wrong on arrival or you change your mind within 48 hours,
                here's how it works.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* DUAL VIDEO SYSTEM */}
      <section className="refund-section refund-section-tinted">
        <div className="refund-container">
          <p className="refund-section-eyebrow">HOW WE VERIFY</p>
          <h2 className="refund-section-title">The dual-video system.</h2>
          <p className="refund-section-lede">
            Both sides record. Both sides are accountable. Nobody can cheat the process.
          </p>

          <div className="refund-dual-grid">
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
                <li><CheckCircle2 size={14} /> Powered on to confirm working</li>
                <li><CheckCircle2 size={14} /> Sealed with original packaging</li>
                <li><CheckCircle2 size={14} /> Stored as proof until needed</li>
              </ul>
            </div>

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
              <strong>You can't see our video first.</strong> It only unlocks after you upload yours.
              This stops anyone from gaming the system on either side.
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
            For your unboxing video to be accepted, it must follow these four rules.
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
              don't require an unboxing video — but the 48-hour window and other rules still apply.
            </p>
          </div>
        </div>
      </section>

      {/* RETURN STEPS */}
      <section className="refund-section refund-section-tinted">
        <div className="refund-container">
          <p className="refund-section-eyebrow">RETURN PROCESS</p>
          <h2 className="refund-section-title">From unboxing to refund.</h2>
          <p className="refund-section-lede">
            Six steps. Most returns wrap up in 3–5 days end-to-end.
          </p>

          <div className="refund-steps">
            {RETURN_STEPS.map((step, idx) => {
              const Icon = step.icon
              return (
                <div key={step.num} className="refund-step">
                  <div className="refund-step-left">
                    <span className="refund-step-num">{step.num}</span>
                    {idx < RETURN_STEPS.length - 1 && <div className="refund-step-line" />}
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
              <span>Exchange for a <strong>cheaper product</strong> is <strong>not allowed</strong>. Request a refund and place a new order instead.</span>
            </p>
          </div>
        </div>
      </section>

      {/* ELIGIBILITY */}
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
                This is the <strong>only</strong> case where Shoply covers return shipping under our return policy.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ============== WARRANTY SECTION ============== */}
      <section className="refund-section refund-anchor" id="warranty">
        <div className="refund-container">
          <div className="refund-major-head">
            <div className="refund-major-num refund-major-num-warranty">
              <Wrench size={20} />
            </div>
            <div>
              <p className="refund-section-eyebrow">SECTION 02</p>
              <h2 className="refund-section-title">Shoply Warranty</h2>
              <p className="refund-section-lede">
                Every product comes with its own manufacturer's warranty period — set per product
                when we list it. The general fallback is <strong>14 days</strong> for any product
                without a specific warranty period assigned.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* WARRANTY DETAILS */}
      <section className="refund-section refund-section-tinted">
        <div className="refund-container">
          <p className="refund-section-eyebrow">HOW WARRANTY WORKS</p>
          <h2 className="refund-section-title">Free repair, paid by us.</h2>
          <p className="refund-section-lede">
            If a real manufacturing defect appears within your product's warranty period,
            we repair it for free. You only pay to ship it to us — everything else is on Shoply.
          </p>

          <div className="refund-warranty-cards">
            <div className="refund-warranty-card">
              <div className="refund-warranty-icon">
                <Clock size={18} />
              </div>
              <h3>Per-product window</h3>
              <p>Each product has its own warranty period — see it on the product page before you buy. Default is 14 days.</p>
            </div>
            <div className="refund-warranty-card">
              <div className="refund-warranty-icon">
                <Wrench size={18} />
              </div>
              <h3>Repair only</h3>
              <p>Warranty claims result in a free repair. Not a refund, not a replacement product. We fix what's broken.</p>
            </div>
            <div className="refund-warranty-card">
              <div className="refund-warranty-icon">
                <Wallet size={18} />
              </div>
              <h3>Shoply covers most costs</h3>
              <p>You pay shipping to us. We cover assessment, parts, repair labor, and return shipping back to you.</p>
            </div>
          </div>
        </div>
      </section>

      {/* WARRANTY STEPS */}
      <section className="refund-section">
        <div className="refund-container">
          <p className="refund-section-eyebrow">WARRANTY PROCESS</p>
          <h2 className="refund-section-title">How a warranty claim works.</h2>
          <p className="refund-section-lede">
            From discovering a defect to getting your repaired device back — usually 7–14 days total.
          </p>

          <div className="refund-steps">
            {WARRANTY_STEPS.map((step, idx) => {
              const Icon = step.icon
              return (
                <div key={step.num} className="refund-step">
                  <div className="refund-step-left">
                    <span className="refund-step-num refund-step-num-warranty">{step.num}</span>
                    {idx < WARRANTY_STEPS.length - 1 && <div className="refund-step-line" />}
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

      {/* DEFECT COVERED / NOT COVERED */}
      <section className="refund-section refund-section-tinted">
        <div className="refund-container">
          <p className="refund-section-eyebrow">WARRANTY COVERAGE</p>
          <h2 className="refund-section-title">What counts as a defect?</h2>

          <div className="refund-eligibility-grid">
            <div className="refund-elig-card refund-elig-yes">
              <div className="refund-elig-head">
                <CheckCircle2 size={20} strokeWidth={2} />
                <h3>Covered</h3>
              </div>
              <ul>
                {DEFECT_COVERED.map((item) => (
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
                <h3>Not covered</h3>
              </div>
              <ul>
                {DEFECT_NOT_COVERED.map((item) => (
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

      {/* FAQ */}
      <section className="refund-section">
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
          <h2 className="refund-final-title">Need to start a claim?</h2>
          <p className="refund-final-sub">
            Whether it's a return or a warranty repair, head to your account to begin.
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
