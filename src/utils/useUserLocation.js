import { useState } from 'react'

const KEY = 'findme_loc'
const RADIUS_KEY = 'findme_radius'

export const getSavedLocation = () => {
  try {
    return JSON.parse(sessionStorage.getItem(KEY))
  } catch {
    return null
  }
}
export const getSavedRadius = () => Number(sessionStorage.getItem(RADIUS_KEY)) || 5000
export const saveRadius = (r) => sessionStorage.setItem(RADIUS_KEY, String(r))

export function useUserLocation() {
  const [location, setLocation] = useState(getSavedLocation)
  const [status, setStatus] = useState(location ? 'ready' : 'idle')

  function request() {
    if (!navigator.geolocation) return setStatus('denied')
    setStatus('loading')
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const loc = { lat: pos.coords.latitude, lng: pos.coords.longitude }
        sessionStorage.setItem(KEY, JSON.stringify(loc))
        setLocation(loc)
        setStatus('ready')
      },
      () => setStatus('denied'),
      { enableHighAccuracy: true, timeout: 10000 },
    )
  }

  function setManual(loc) {
    sessionStorage.setItem(KEY, JSON.stringify(loc))
    setLocation(loc)
    setStatus('ready')
  }

  return { location, status, request, setManual }
}
