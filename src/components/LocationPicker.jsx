// src/components/LocationPicker.jsx
// Two-step location picker: state dropdown + city dropdown.
// Now passes city to delivery zone for city-level overrides (Benin City fast lane).

import { useState, useEffect } from 'react'
import { MapPin, ChevronDown, X, Check, Search, Truck, Building, Zap } from 'lucide-react'
import { useLocation } from '../context/LocationContext'
import {
  stateList,
  getDeliveryDateRange,
  getDeliveryFee,
} from '../data/deliveryZones'
import { getCitiesForState } from '../data/nigerianCities'
import { formatNaira } from '../utils/format'
import './LocationPicker.css'

export default function LocationPicker({ cartSubtotal = 0, compact = false }) {
  const {
    selectedState, selectedCity,
    setSelectedState, setSelectedCity,
    isDetecting, detectionSource
  } = useLocation()

  const [stateSheetOpen, setStateSheetOpen] = useState(false)
  const [citySheetOpen, setCitySheetOpen] = useState(false)
  const [stateSearch, setStateSearch] = useState('')
  const [citySearch, setCitySearch] = useState('')

  useEffect(() => {
    const open = stateSheetOpen || citySheetOpen
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [stateSheetOpen, citySheetOpen])

  const cities = selectedState ? getCitiesForState(selectedState) : []
  const filteredStates = stateSearch
    ? stateList.filter(s => s.toLowerCase().includes(stateSearch.toLowerCase()))
    : stateList
  const filteredCities = citySearch
    ? cities.filter(c => c.toLowerCase().includes(citySearch.toLowerCase()))
    : cities

  const handleStatePick = (s) => {
    setSelectedState(s, 'manual')
    setStateSheetOpen(false)
    setStateSearch('')
    setTimeout(() => setCitySheetOpen(true), 200)
  }

  const handleCityPick = (c) => {
    setSelectedCity(c)
    setCitySheetOpen(false)
    setCitySearch('')
  }

  if (isDetecting) {
    return (
      <div className="locpick locpick-loading">
        <MapPin size={16} className="locpick-icon" />
        <span>Detecting your location…</span>
      </div>
    )
  }

  // Pass BOTH state and city now for city-level overrides
  const range = selectedState ? getDeliveryDateRange(selectedState, selectedCity) : null
  const feeInfo = selectedState ? getDeliveryFee(selectedState, selectedCity, cartSubtotal) : null

  return (
    <>
      <div className={`locpick-block ${compact ? 'is-compact' : ''}`}>
        {/* STATE PILL */}
        <button className="locpick-pill" onClick={() => setStateSheetOpen(true)}>
          <MapPin size={15} className="locpick-icon" />
          <span className="locpick-label">
            {selectedState ? (
              <>State: <strong>{selectedState}</strong></>
            ) : (
              <>Choose your state</>
            )}
          </span>
          <ChevronDown size={15} className="locpick-chev" />
        </button>

        {/* CITY PILL */}
        {selectedState && (
          <button className="locpick-pill locpick-pill-city" onClick={() => setCitySheetOpen(true)}>
            <Building size={15} className="locpick-icon" />
            <span className="locpick-label">
              {selectedCity ? (
                <>City: <strong>{selectedCity}</strong></>
              ) : (
                <>Choose your city / area</>
              )}
            </span>
            <ChevronDown size={15} className="locpick-chev" />
          </button>
        )}

        {/* DELIVERY DETAILS */}
        {selectedState && selectedCity && range && feeInfo && (
          <div className="locpick-details">
            <div className="locpick-detail-row">
              <Truck size={14} className="locpick-detail-icon" />
              <span>Get it by <strong>{range.label}</strong></span>
              {range.fastLane && (
                <span className="locpick-fastlane">
                  <Zap size={11} /> Express
                </span>
              )}
            </div>
            <div className="locpick-detail-row">
              <span className="locpick-fee-label">Delivery fee:</span>
              {feeInfo.free ? (
                <span className="locpick-fee-free">FREE</span>
              ) : (
                <strong>{formatNaira(feeInfo.fee)}</strong>
              )}
            </div>
          </div>
        )}

        {!selectedState && (
          <p className="locpick-prompt">
            Pick your state and city to see delivery date and fee
          </p>
        )}
        {selectedState && !selectedCity && (
          <p className="locpick-prompt">
            Now pick your city in {selectedState}
          </p>
        )}
      </div>

      {/* STATE BOTTOM SHEET */}
      {stateSheetOpen && (
        <div className="locpick-overlay" onClick={() => setStateSheetOpen(false)}>
          <div className="locpick-sheet" onClick={(e) => e.stopPropagation()}>
            <div className="locpick-sheet-handle" />
            <div className="locpick-sheet-head">
              <h3 className="locpick-sheet-title">Choose your state</h3>
              <button
                className="locpick-sheet-close"
                onClick={() => setStateSheetOpen(false)}
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
                value={stateSearch}
                onChange={(e) => setStateSearch(e.target.value)}
                className="locpick-search-input"
                autoFocus
              />
            </div>
            <div className="locpick-list">
              {filteredStates.length === 0 ? (
                <p className="locpick-empty">No state matches "{stateSearch}"</p>
              ) : (
                filteredStates.map(s => (
                  <button
                    key={s}
                    className={`locpick-item ${s === selectedState ? 'is-active' : ''}`}
                    onClick={() => handleStatePick(s)}
                  >
                    <span className="locpick-item-name">{s}</span>
                    {s === selectedState && <Check size={18} className="locpick-item-check" />}
                  </button>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* CITY BOTTOM SHEET */}
      {citySheetOpen && (
        <div className="locpick-overlay" onClick={() => setCitySheetOpen(false)}>
          <div className="locpick-sheet" onClick={(e) => e.stopPropagation()}>
            <div className="locpick-sheet-handle" />
            <div className="locpick-sheet-head">
              <h3 className="locpick-sheet-title">
                Choose your city in {selectedState}
              </h3>
              <button
                className="locpick-sheet-close"
                onClick={() => setCitySheetOpen(false)}
                aria-label="Close"
              >
                <X size={20} />
              </button>
            </div>
            <div className="locpick-search">
              <Search size={16} className="locpick-search-icon" />
              <input
                type="text"
                placeholder="Search city..."
                value={citySearch}
                onChange={(e) => setCitySearch(e.target.value)}
                className="locpick-search-input"
                autoFocus
              />
            </div>
            <div className="locpick-list">
              {filteredCities.length === 0 ? (
                <p className="locpick-empty">No city matches "{citySearch}"</p>
              ) : (
                filteredCities.map(c => (
                  <button
                    key={c}
                    className={`locpick-item ${c === selectedCity ? 'is-active' : ''}`}
                    onClick={() => handleCityPick(c)}
                  >
                    <span className="locpick-item-name">{c}</span>
                    {c === selectedCity && <Check size={18} className="locpick-item-check" />}
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
