import { useMemo } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { getJobs } from '../utils/storage'
import { distanceMeters, formatDistance, formatTL } from '../utils/geo'
import { getSavedLocation } from '../utils/useUserLocation'

export default function JobsPage() {
  const { state } = useLocation()
  const userLoc = getSavedLocation()

  const jobs = useMemo(() => {
    const list = getJobs().map((j) => ({ ...j, distance: userLoc ? distanceMeters(userLoc, j) : null }))
    return userLoc ? list.sort((a, b) => a.distance - b.distance) : list
  }, [userLoc])

  return (
    <>
      {state?.noNearby && (
        <div className="alert alert-warning">
          {formatDistance(state.radius)} çapında ilan bulunamadı. Tüm ilanlar mesafeye göre listeleniyor.{' '}
          <Link to="/nearby">Haritaya dön</Link>
        </div>
      )}
      <h3 className="page-title mb-3">Tüm İlanlar <small className="text-muted fs-6">({jobs.length})</small></h3>
      <div className="row g-3">
        {jobs.map((j) => (
          <div key={j.id} className="col-12 col-md-6 col-lg-4">
            <Link to={`/jobs/${j.id}`} className="card job-card h-100 text-decoration-none">
              <div className="card-body">
                <div className="d-flex gap-3 mb-3">
                  <div className="job-avatar">{j.company.charAt(0).toUpperCase()}</div>
                  <div className="min-w-0">
                    <h6 className="mb-0 text-dark">{j.title}</h6>
                    <small className="text-muted">{j.company}</small>
                  </div>
                </div>
                <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
                  <span className="badge rounded-pill salary-badge">{formatTL(j.salary)}</span>
                  <small className="text-muted">
                    📍 {j.district}{j.distance != null && ` · ${formatDistance(j.distance)}`}
                  </small>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </>
  )
}
