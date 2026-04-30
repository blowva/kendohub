// src/context/LocationContext.jsx
// Tracks user's selected delivery state AND city.
// On first visit: tries IP geolocation to guess the state.
// User pick is persisted to localStorage so subsequent visits skip the API call.

import { createContext, useContext, useEffect, useState } from 'react'
import { deliveryZones, stateList } from '../data/deliveryZones'

const LocationContext = createContext(null)
const STORAGE_KEY = 'shoply.deliveryLocation'

// Map common region names from ipapi.co
function normalizeIpState(rawRegion) {
  if (!rawRegion) return null
  const r = String(rawRegion).trim()
  if (deliveryZones[r]) return r

  const map = {
    'Federal Capital Territory': 'FCT (Abuja)',
    'Abuja Federal Capital Territory': 'FCT (Abuja)',
    'Abuja': 'FCT (Abuja)',
    'FCT': 'FCT (Abuja)',
    'Akwa-Ibom': 'Akwa Ibom',
    'Cross-River': 'Cross River',
  }
  if (map[r]) return map[r]

  const found = stateList.find(s => s.toLowerCase() === r.toLowerCase())
  return found || null
}

export function LocationProvider({ children }) {
  const [selectedState, setSelectedStateInner] = useState(null)
  const [selectedCity, setSelectedCityInner] = useState(null)
  const [isDetecting, setIsDetecting] = useState(true)
  const [detectionSource, setDetectionSource] = useState(null)

  // Update both state and city, persist together
  const setLocation = (stateName, cityName, source = 'manual') => {
    setSelectedStateInner(stateName)
    setSelectedCityInner(cityName)
    setDetectionSource(source)
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        stateName, cityName, source, savedAt: Date.now()
      }))
    } catch (e) { /* ignore quota errors */ }
  }

  // Just update the state (clears city, since cities depend on state)
  const setSelectedState = (stateName, source = 'manual') => {
    setLocation(stateName, null, source)
  }

  // Just update city (state stays the same)
  const setSelectedCity = (cityName) => {
    setLocation(selectedState, cityName, 'manual')
  }

  useEffect(() => {
    let cancelled = false

    async function detect() {
      // 1) Check localStorage
      try {
        const raw = localStorage.getItem(STORAGE_KEY)
        if (raw) {
          const saved = JSON.parse(raw)
          if (saved && saved.stateName && deliveryZones[saved.stateName]) {
            if (!cancelled) {
              setSelectedStateInner(saved.stateName)
              setSelectedCityInner(saved.cityName || null)
              setDetectionSource(saved.source || 'manual')
              setIsDetecting(false)
            }
            return
          }
        }
      } catch (e) { /* ignore */ }

      // 2) IP geolocation
      try {
        const res = await fetch('https://ipapi.co/json/', {
          method: 'GET',
          headers: { Accept: 'application/json' },
        })
        if (!res.ok) throw new Error('IP API failed')
        const data = await res.json()
        if (cancelled) return

        if (data.country_code === 'NG' || data.country_name === 'Nigeria') {
          const normalized = normalizeIpState(data.region)
          if (normalized) {
            setSelectedStateInner(normalized)
            setSelectedCityInner(null) // user must still pick city
            setDetectionSource('ip')
            setIsDetecting(false)
            return
          }
        }
      } catch (e) { /* silent fail */ }

      // 3) Fallback
      if (!cancelled) {
        setSelectedStateInner(null)
        setSelectedCityInner(null)
        setDetectionSource('fallback')
        setIsDetecting(false)
      }
    }

    detect()
    return () => { cancelled = true }
  }, [])

  return (
    <LocationContext.Provider
      value={{
        selectedState,
        selectedCity,
        setSelectedState,
        setSelectedCity,
        setLocation,
        isDetecting,
        detectionSource,
      }}
    >
      {children}
    </LocationContext.Provider>
  )
}

export function useLocation() {
  const ctx = useContext(LocationContext)
  if (!ctx) throw new Error('useLocation must be used inside <LocationProvider>')
  return ctx
}
