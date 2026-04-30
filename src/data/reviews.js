// src/data/reviews.js
// Generates realistic-looking customer reviews for any product.
// Replace with real Supabase reviews table when you build the admin panel.

const NAMES = [
  'Chioma A.', 'Bashir O.', 'Adaeze N.', 'Tunde S.', 'Funmi B.',
  'Emeka O.', 'Aisha M.', 'Blessing U.', 'Kelechi I.', 'Yemi A.',
  'Ifeanyi C.', 'Hauwa S.', 'Obinna E.', 'Folake O.', 'Ibrahim K.',
  'Ngozi P.', 'Damilola A.', 'Suleiman B.', 'Chinwe O.', 'Tobi A.',
]

const TIMES = [
  '2 days ago', '5 days ago', '1 week ago', '2 weeks ago',
  '3 weeks ago', '1 month ago', '2 months ago', '3 months ago',
]

const REVIEW_5_STAR = [
  'Exactly as described! Delivery was fast and packaging was excellent. Will definitely buy from Shoply again.',
  'Quality blew me away. Worth every naira. The build feels premium and it works perfectly.',
  'Best decision I made this year. Reliable shop, genuine product. 10/10 recommend.',
  'Got it in 3 days to Lagos. Fully sealed, original. Impressed with the customer service too.',
  'My family loves this. Setup was easy, performance is solid. Five stars from us.',
  'I was skeptical at first but now I am a believer. Authentic and it works beautifully.',
]

const REVIEW_4_STAR = [
  'Good product overall. Shipping took a bit longer than expected but the item is solid.',
  'Works well, looks good. Wish the manual was clearer but figured it out from YouTube.',
  'Solid value for the price. Minor issues with the box (slightly dented) but the product itself is fine.',
  'Happy with the purchase. Quality is good — would buy again. Not perfect but very close.',
]

const REVIEW_3_STAR = [
  'It works but I expected a bit more for the price. Not bad, just average.',
  'Decent product. Took a while to arrive. Does what it says on the box.',
]

function pick(arr, seed) {
  return arr[seed % arr.length]
}

function seedFor(productId, idx) {
  const hash = String(productId).split('').reduce((a, c) => a + c.charCodeAt(0), 0)
  return (hash * 31 + idx * 17) % 100000
}

export function getReviewsForProduct(product, count = 8) {
  if (!product) return []

  const reviews = []
  const baseRating = product.rating || 4.5

  for (let i = 0; i < count; i++) {
    const s = seedFor(product.id, i + 1)

    let stars
    const r = (s % 100) / 100
    if (baseRating >= 4.7) {
      stars = r < 0.78 ? 5 : r < 0.95 ? 4 : 3
    } else if (baseRating >= 4.3) {
      stars = r < 0.55 ? 5 : r < 0.85 ? 4 : 3
    } else {
      stars = r < 0.35 ? 5 : r < 0.7 ? 4 : 3
    }

    const pool = stars === 5 ? REVIEW_5_STAR : stars === 4 ? REVIEW_4_STAR : REVIEW_3_STAR

    reviews.push({
      id: `${product.id}-rev-${i}`,
      name: pick(NAMES, s + 1),
      stars,
      time: pick(TIMES, s + 7),
      body: pick(pool, s + 13),
      helpful: (s % 24) + 2,
      verified: r > 0.15,
    })
  }

  return reviews
}

export function getRatingBreakdown(reviews) {
  const total = reviews.length
  if (total === 0) return null

  const counts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
  reviews.forEach(r => { counts[r.stars] = (counts[r.stars] || 0) + 1 })

  return {
    5: { count: counts[5], pct: Math.round((counts[5] / total) * 100) },
    4: { count: counts[4], pct: Math.round((counts[4] / total) * 100) },
    3: { count: counts[3], pct: Math.round((counts[3] / total) * 100) },
    2: { count: counts[2], pct: Math.round((counts[2] / total) * 100) },
    1: { count: counts[1], pct: Math.round((counts[1] / total) * 100) },
    total,
  }
}
