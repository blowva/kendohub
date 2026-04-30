// src/utils/recentlyViewed.js
// Tracks the last 6 products a user has viewed.
// Stored in localStorage so it persists across sessions on the same device.

const KEY = 'shoply.recentlyViewed'
const MAX_ITEMS = 6

export function getRecentlyViewed() {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return []
    const arr = JSON.parse(raw)
    return Array.isArray(arr) ? arr : []
  } catch (e) {
    return []
  }
}

export function addRecentlyViewed(productId) {
  if (!productId) return
  try {
    const current = getRecentlyViewed()
    const filtered = current.filter(id => id !== productId)
    const updated = [productId, ...filtered].slice(0, MAX_ITEMS)
    localStorage.setItem(KEY, JSON.stringify(updated))
  } catch (e) { /* ignore quota errors */ }
}

export function clearRecentlyViewed() {
  try {
    localStorage.removeItem(KEY)
  } catch (e) { /* ignore */ }
}
