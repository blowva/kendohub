// src/context/LocationContext.jsx
// Holds the user's selected delivery state.
// On first visit: tries IP geolocation to guess the state.
// User pick is persisted to localStorage so subsequent visits skip the API call.

import { createContext, useContext, useEffect, useState } from 'react'
import { deliveryZones, stateList } from '../data/deliveryZones'

const LocationContext = createContext(null)
const STORAGE_KEY = 'shoply.deliveryState'

// Map common region names from ipapi.co's "region" field to our state list.
// ipapi sometimes returns full state names, sometimes abbreviated. Be lenient.
function normalizeIpState(rawRegion) {
  if (!rawRegion) return null
  const r = String(rawRegion).trim()

  // Direct exact match
  if (deliveryZones[r]) return r

  // Common variants
  const map = {
    'Federal Capital Territory': 'FCT (Abuja)',
    'Abuja Federal Capital Territory': 'FCT (Abuja)',
    'Abuja': 'FCT (Abuja)',
    'FCT': 'FCT (Abuja)',
    'Akwa-Ibom': 'Akwa Ibom',
    'Cross-River': 'Cross River',
  }
  if (map[r]) return map[r]

  // Case-insensitive fuzzy match
  const found = stateList.find(s => s.toLowerCase() === r.toLowerCase())
  return found || null
}

export function LocationProvider({ children }) {
  const [selectedState, setSelectedStateInner] = useState(null)
  const [isDetecting, setIsDetecting] = useState(true)
  const [detectionSource, setDetectionSource] = useState(null) // 'ip' | 'manual' | 'fallback'

  // Setter that also persists to localStorage
  const setSelectedState = (stateName, source = 'manual') => {
    setSelectedStateInner(stateName)
    setDetectionSource(source)
    if (stateName) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ stateName, source, savedAt: Date.now() }))
      } catch (e) { /* ignore quota errors */ }
    }
  }

  useEffect(() => {
    let cancelled = false

    async function detect() {
      // 1) Check localStorage first (fastest path, zero API call)
      try {
        const raw = localStorage.getItem(STORAGE_KEY)
        if (raw) {
          const saved = JSON.parse(raw)
          if (saved && saved.stateName && deliveryZones[saved.stateName]) {
            if (!cancelled) {
              setSelectedStateInner(saved.stateName)
              setDetectionSource(saved.source || 'manual')
              setIsDetecting(false)
            }
            return
          }
        }
      } catch (e) { /* ignore parse errors */ }

      // 2) Try IP geolocation (free tier, no API key)
      try {
        const res = await fetch('https://ipapi.co/json/', {
          method: 'GET',
          headers: { Accept: 'application/json' },
        })
        if (!res.ok) throw new Error('IP API failed')
        const data = await res.json()

        if (cancelled) return

        // Only auto-set if country is Nigeria
        if (data.country_code === 'NG' || data.country_name === 'Nigeria') {
          const normalized = normalizeIpState(data.region)
          if (normalized) {
            setSelectedStateInner(normalized)
            setDetectionSource('ip')
            setIsDetecting(false)
            return
          }
        }
      } catch (e) {
        // Silent fail — IP detection is best-effort, not required
      }

      // 3) Fallback: leave state as null so UI prompts user to choose
      if (!cancelled) {
        setSelectedStateInner(null)
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
        setSelectedState,
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
  if (!ctx) {
    throw new Error('useLocation must be used inside <LocationProvider>')
  }
  return ctx
}
