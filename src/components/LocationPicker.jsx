// src/components/LocationPicker.jsx
// Renders the "Deliver to: Lagos ▾" pill.
// Tapping it opens a bottom sheet with all 36 states + FCT.

import { useState, useEffect } from 'react'
import { MapPin, ChevronDown, X, Check, Search, Truck } from 'lucide-react'
import { useLocation } from '../context/LocationContext'
import {
  stateList,
  getDeliveryDateRange,
  getDeliveryFee,
} from '../data/deliveryZones'
import { formatNaira } from '../utils/format'
import './LocationPicker.css'

export default function LocationPicker({ cartSubtotal = 0, compact = false }) {
  const { selectedState, setSelectedState, isDetecting, detectionSource } = useLocation()
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')

  // Lock body scroll when sheet is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [open])

  const filtered = search
    ? stateList.filter(s => s.toLowerCase().includes(search.toLowerCase()))
    : stateList

  const handlePick = (s) => {
    setSelectedState(s, 'manual')
    setOpen(false)
    setSearch('')
  }

  // Loading / first paint
  if (isDetecting) {
    return (
      <div className="locpick locpick-loading">
        <MapPin size={16} className="locpick-icon" />
        <span>Detecting your location…</span>
      </div>
    )
  }

  const range = selectedState ? getDeliveryDateRange(selectedState) : null
  const feeInfo = selectedState ? getDeliveryFee(selectedState, cartSubtotal) : null

  return (
    <>
      {/* PILL: shows current state + delivery info */}
      <div className={`locpick-block ${compact ? 'is-compact' : ''}`}>
        <button className="locpick-pill" onClick={() => setOpen(true)}>
          <MapPin size={15} className="locpick-icon" />
          <span className="locpick-label">
            {selectedState ? (
              <>Deliver to <strong>{selectedState}</strong></>
            ) : (
              <>Choose your state</>
            )}
          </span>
          <ChevronDown size={15} className="locpick-chev" />
        </button>

        {selectedState && range && feeInfo && (
          <div className="locpick-details">
            <div className="locpick-detail-row">
              <Truck size={14} className="locpick-detail-icon" />
              <span>
                Get it by <strong>{range.label}</strong>
              </span>
            </div>
            <div className="locpick-detail-row">
              <span className="locpick-fee-label">Delivery fee:</span>
              {feeInfo.free ? (
                <span className="locpick-fee-free">FREE</span>
              ) : (
                <strong>{formatNaira(feeInfo.fee)}</strong>
              )}
            </div>
            {detectionSource === 'ip' && (
              <p className="locpick-hint">
                Auto-detected — tap to change
              </p>
            )}
          </div>
        )}

        {!selectedState && (
          <p className="locpick-prompt">
            Pick your state to see delivery date and fee
          </p>
        )}
      </div>

      {/* BOTTOM SHEET: 36 states */}
      {open && (
        <div className="locpick-overlay" onClick={() => setOpen(false)}>
          <div className="locpick-sheet" onClick={(e) => e.stopPropagation()}>
            <div className="locpick-sheet-handle" />
            <div className="locpick-sheet-head">
              <h3 className="locpick-sheet-title">Choose your state</h3>
              <button
                className="locpick-sheet-close"
                onClick={() => setOpen(false)}
                aria-label="Close"
              >
                <X size={20} />
              </button>
            </div>

            <div className="locpick-search">
              <Search size={16} className="locpick-search-icon" />
              <input
                type="text"
                placeholder="Search state..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="locpick-search-input"
                autoFocus
              />
            </div>

            <div className="locpick-list">
              {filtered.length === 0 ? (
                <p className="locpick-empty">No state matches "{search}"</p>
              ) : (
                filtered.map(s => (
                  <button
                    key={s}
                    className={`locpick-item ${s === selectedState ? 'is-active' : ''}`}
                    onClick={() => handlePick(s)}
                  >
                    <span className="locpick-item-name">{s}</span>
                    {s === selectedState && (
                      <Check size={18} className="locpick-item-check" />
                    )}
                  </button>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
