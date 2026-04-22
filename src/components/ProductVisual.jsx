// Abstract per-category visuals. Replaces need for placeholder product photos.
// Each returns an SVG that sits in the card image area.

export default function ProductVisual({ category, seed = 0, size = 'md' }) {
  const hue = (seed * 37) % 360;

  const visuals = {
    audio: (
      <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <defs>
          <radialGradient id={`g-audio-${seed}`} cx="50%" cy="40%">
            <stop offset="0%" stopColor="var(--ink)" stopOpacity="0.08" />
            <stop offset="100%" stopColor="var(--ink)" stopOpacity="0" />
          </radialGradient>
        </defs>
        <rect width="200" height="200" fill={`url(#g-audio-${seed})`} />
        <circle cx="100" cy="100" r="58" fill="none" stroke="currentColor" strokeWidth="0.8" opacity="0.35" />
        <circle cx="100" cy="100" r="42" fill="none" stroke="currentColor" strokeWidth="0.8" opacity="0.5" />
        <circle cx="100" cy="100" r="26" fill="currentColor" opacity="0.9" />
        <circle cx="100" cy="100" r="8" fill="var(--accent)" />
        {[...Array(12)].map((_, i) => {
          const a = (i / 12) * Math.PI * 2;
          const x1 = 100 + Math.cos(a) * 70;
          const y1 = 100 + Math.sin(a) * 70;
          const x2 = 100 + Math.cos(a) * 78;
          const y2 = 100 + Math.sin(a) * 78;
          return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="currentColor" strokeWidth="0.6" />;
        })}
      </svg>
    ),
    projectors: (
      <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <rect width="200" height="200" fill="var(--bg-elevated)" />
        <rect x="40" y="82" width="120" height="50" rx="3" fill="currentColor" />
        <circle cx="70" cy="107" r="14" fill="var(--bg)" />
        <circle cx="70" cy="107" r="8" fill="var(--accent)" />
        <circle cx="70" cy="107" r="3" fill="var(--bg)" />
        <rect x="96" y="92" width="50" height="4" fill="var(--bg)" opacity="0.4" />
        <rect x="96" y="100" width="30" height="2" fill="var(--bg)" opacity="0.3" />
        <path d="M 56 107 L 10 60 L 10 154 Z" fill="var(--accent)" opacity="0.08" />
        <path d="M 56 107 L 20 75 L 20 139 Z" fill="var(--accent)" opacity="0.04" />
      </svg>
    ),
    screens: (
      <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <rect width="200" height="200" fill="var(--bg-elevated)" />
        <rect x="25" y="45" width="150" height="100" fill="currentColor" opacity="0.08" stroke="currentColor" strokeWidth="1" />
        <rect x="30" y="50" width="140" height="90" fill="var(--bg)" />
        <circle cx="60" cy="95" r="14" fill="var(--accent)" opacity="0.9" />
        <path d="M 90 110 L 110 85 L 130 110 L 150 95 L 150 130 L 90 130 Z" fill="currentColor" opacity="0.5" />
        <rect x="95" y="150" width="10" height="18" fill="currentColor" opacity="0.4" />
        <rect x="75" y="168" width="50" height="3" fill="currentColor" opacity="0.4" />
      </svg>
    ),
    gadgets: (
      <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <rect width="200" height="200" fill="var(--bg-elevated)" />
        <rect x="72" y="50" width="56" height="90" rx="14" fill="currentColor" />
        <rect x="78" y="58" width="44" height="74" rx="8" fill="var(--bg)" />
        <circle cx="100" cy="95" r="14" fill="var(--accent)" />
        <circle cx="100" cy="95" r="8" fill="var(--bg)" />
        <rect x="68" y="40" width="8" height="14" rx="2" fill="currentColor" />
        <rect x="124" y="40" width="8" height="14" rx="2" fill="currentColor" />
        <rect x="68" y="146" width="8" height="14" rx="2" fill="currentColor" />
        <rect x="124" y="146" width="8" height="14" rx="2" fill="currentColor" />
        <path d="M 50 160 Q 100 185 150 160" stroke="currentColor" strokeWidth="0.6" fill="none" opacity="0.3" />
      </svg>
    ),
    accessories: (
      <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <rect width="200" height="200" fill="var(--bg-elevated)" />
        <rect x="55" y="85" width="90" height="30" rx="4" fill="currentColor" />
        {[0, 1, 2, 3, 4].map((i) => (
          <rect key={i} x={65 + i * 15} y="95" width="8" height="10" rx="1" fill="var(--bg)" />
        ))}
        <rect x="40" y="97" width="15" height="6" fill="currentColor" opacity="0.6" />
        <rect x="145" y="97" width="15" height="6" fill="currentColor" opacity="0.6" />
        <circle cx="100" cy="140" r="4" fill="var(--accent)" />
      </svg>
    ),
  };

  return (
    <div className={`pvisual pvisual-${size}`} style={{ '--seed-hue': hue }}>
      {visuals[category] || visuals.gadgets}
    </div>
  );
}
