// src/data/deliveryZones.js
// All 36 Nigerian states + FCT grouped into 4 delivery zones.
// Edit fees and days here when your logistics partner changes pricing.

export const FREE_DELIVERY_THRESHOLD_NGN = 100000

export const deliveryZones = {
  // ZONE 1 — LAGOS (1-2 days)
  'Lagos': { zone: 1, minDays: 1, maxDays: 2, fee: 1500 },

  // ZONE 2 — SW + FCT (2-3 days)
  'FCT (Abuja)': { zone: 2, minDays: 2, maxDays: 3, fee: 2500 },
  'Ogun':        { zone: 2, minDays: 2, maxDays: 3, fee: 2500 },
  'Oyo':         { zone: 2, minDays: 2, maxDays: 3, fee: 2500 },
  'Ondo':        { zone: 2, minDays: 2, maxDays: 3, fee: 2500 },
  'Osun':        { zone: 2, minDays: 2, maxDays: 3, fee: 2500 },
  'Ekiti':       { zone: 2, minDays: 2, maxDays: 3, fee: 2500 },
  'Edo':         { zone: 2, minDays: 2, maxDays: 3, fee: 2500 },

  // ZONE 3 — SE + SS (3-4 days)
  'Anambra':     { zone: 3, minDays: 3, maxDays: 4, fee: 3500 },
  'Imo':         { zone: 3, minDays: 3, maxDays: 4, fee: 3500 },
  'Abia':        { zone: 3, minDays: 3, maxDays: 4, fee: 3500 },
  'Enugu':       { zone: 3, minDays: 3, maxDays: 4, fee: 3500 },
  'Ebonyi':      { zone: 3, minDays: 3, maxDays: 4, fee: 3500 },
  'Rivers':      { zone: 3, minDays: 3, maxDays: 4, fee: 3500 },
  'Delta':       { zone: 3, minDays: 3, maxDays: 4, fee: 3500 },
  'Bayelsa':     { zone: 3, minDays: 3, maxDays: 4, fee: 3500 },
  'Cross River': { zone: 3, minDays: 3, maxDays: 4, fee: 3500 },
  'Akwa Ibom':   { zone: 3, minDays: 3, maxDays: 4, fee: 3500 },

  // ZONE 4 — NORTH (4-6 days)
  'Kwara':       { zone: 4, minDays: 4, maxDays: 6, fee: 4500 },
  'Kogi':        { zone: 4, minDays: 4, maxDays: 6, fee: 4500 },
  'Benue':       { zone: 4, minDays: 4, maxDays: 6, fee: 4500 },
  'Nasarawa':    { zone: 4, minDays: 4, maxDays: 6, fee: 4500 },
  'Plateau':     { zone: 4, minDays: 4, maxDays: 6, fee: 4500 },
  'Niger':       { zone: 4, minDays: 4, maxDays: 6, fee: 4500 },
  'Kaduna':      { zone: 4, minDays: 4, maxDays: 6, fee: 4500 },
  'Kano':        { zone: 4, minDays: 4, maxDays: 6, fee: 4500 },
  'Katsina':     { zone: 4, minDays: 4, maxDays: 6, fee: 4500 },
  'Jigawa':      { zone: 4, minDays: 4, maxDays: 6, fee: 4500 },
  'Bauchi':      { zone: 4, minDays: 4, maxDays: 6, fee: 4500 },
  'Gombe':       { zone: 4, minDays: 4, maxDays: 6, fee: 4500 },
  'Adamawa':     { zone: 4, minDays: 4, maxDays: 6, fee: 4500 },
  'Taraba':      { zone: 4, minDays: 4, maxDays: 6, fee: 4500 },
  'Yobe':        { zone: 4, minDays: 4, maxDays: 6, fee: 4500 },
  'Borno':       { zone: 4, minDays: 4, maxDays: 6, fee: 4500 },
  'Sokoto':      { zone: 4, minDays: 4, maxDays: 6, fee: 4500 },
  'Kebbi':       { zone: 4, minDays: 4, maxDays: 6, fee: 4500 },
  'Zamfara':     { zone: 4, minDays: 4, maxDays: 6, fee: 4500 },
}

// Sorted alphabetical state list for the dropdown (Lagos pinned first).
export const stateList = [
  'Lagos',
  ...Object.keys(deliveryZones).filter(s => s !== 'Lagos').sort(),
]

// Calculate delivery date range based on selected state.
// Returns { startDate, endDate, label } where label = "Tue, May 5 – Wed, May 6"
export function getDeliveryDateRange(stateName) {
  const zone = deliveryZones[stateName]
  if (!zone) return null

  const today = new Date()
  const start = new Date(today)
  start.setDate(today.getDate() + zone.minDays)
  const end = new Date(today)
  end.setDate(today.getDate() + zone.maxDays)

  const fmt = (d) =>
    d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })

  return {
    startDate: start,
    endDate: end,
    label: zone.minDays === zone.maxDays ? fmt(start) : `${fmt(start)} – ${fmt(end)}`,
    minDays: zone.minDays,
    maxDays: zone.maxDays,
  }
}

// Get delivery fee for a state, with free-delivery rule applied.
export function getDeliveryFee(stateName, cartSubtotalNGN = 0) {
  const zone = deliveryZones[stateName]
  if (!zone) return null

  if (cartSubtotalNGN >= FREE_DELIVERY_THRESHOLD_NGN) {
    return { fee: 0, free: true, originalFee: zone.fee }
  }
  return { fee: zone.fee, free: false, originalFee: zone.fee }
}
