// src/utils/format.js
// Currency formatting helpers for Shoply (Naira-first).

export function formatNaira(amount) {
  if (amount === null || amount === undefined || isNaN(amount)) return '₦0'
  return '₦' + Number(amount).toLocaleString('en-NG', { maximumFractionDigits: 0 })
}

// If you want to display kobo (decimal) for any reason, use this version.
export function formatNairaWithKobo(amount) {
  if (amount === null || amount === undefined || isNaN(amount)) return '₦0.00'
  return '₦' + Number(amount).toLocaleString('en-NG', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}
