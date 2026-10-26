import { useEffect, useMemo, useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import JobMap from '../components/JobMap'
import { getJobs } from '../utils/storage'
import { distanceMeters, formatDistance } from '../utils/geo'
import { getSavedRadius, saveRadius, useUserLocation } from '../utils/useUserLocation'

const RADII = [500, 1000, 2000, 5000, 10000]

export default function NearbyPage() {
  const navigate = useNavigate()
  const { location, status, request, setManual } = useUserLocation()
  const [radius, setRadius] = useState(getSavedRadius)

  useEffect(() => {
    if (status === 'idle') request()
  }, [status])

  const nearby = useMemo(() => {
    if (!location) return []
    return getJobs()
      .map((j) => ({ ...j, distance: distanceMeters(location, j) }))
      .filter((j) => j.distance <= radius)
      .sort((a, b) => a.distance - b.distance)
  }, [location, radius])

  if (status === 'idle' || status === 'loading') {
    return <div className="alert alert-info">Konum izni bekleniyor...</div>
  }

  if (status === 'denied') {
    return (
      <div className="alert alert-warning">
        <p>Konum izni alınamadı. Haritadan konumunuzu elle seçebilir veya tüm ilanlara bakabilirsiniz.</p>
        <JobMap center={{ lat: 41.0082, lng: 28.9784 }} onPick={setManual} pin={null} height={300} />
        <button className="btn btn-primary mt-3 me-2" onClick={request}>Tekrar dene</button>
        <Link className="btn btn-outline-primary mt-3" to="/jobs">Tüm ilanlar</Link>
      </div>
    )
  }

  if (nearby.length === 0) return <Navigate to="/jobs" replace state={{ noNearby: true, radius }} />

  return (
    <>
      <div className="d-flex flex-wrap align-items-center gap-3 mb-3">
        <h3 className="page-title mb-0">Yakınındaki ilanlar ({nearby.length})</h3>
        <select
          className="form-select w-auto"
          value={radius}
          onChange={(e) => {
            setRadius(Number(e.target.value))
            saveRadius(e.target.value)
          }}
        >
          {RADII.map((r) => <option key={r} value={r}>{formatDistance(r)} çapında</option>)}
        </select>
      </div>
      <JobMap center={location} radius={radius} jobs={nearby} onSelect={(j) => navigate(`/jobs/${j.id}`)} />
    </>
  )
}
