import { Link, useParams } from 'react-router-dom'
import CostPanel from '../components/CostPanel'
import JobMap from '../components/JobMap'
import { getJobs } from '../utils/storage'
import { distanceMeters, formatDistance, formatTL } from '../utils/geo'
import { getSavedLocation } from '../utils/useUserLocation'

export default function JobDetailPage() {
  const { id } = useParams()
  const job = getJobs().find((j) => j.id === id)
  const userLoc = getSavedLocation()

  if (!job) {
    return (
      <div className="alert alert-warning">
        İlan bulunamadı. <Link to="/jobs">İlanlara dön</Link>
      </div>
    )
  }

  return (
    <>
      <Link to="/jobs" className="btn btn-sm btn-outline-primary mb-3">← İlanlara dön</Link>

      <CostPanel job={job} />

      <div className="card mt-4">
        <div className="card-body">
          <div className="d-flex gap-3 align-items-center mb-3">
            <div className="job-avatar">{job.company.charAt(0).toUpperCase()}</div>
            <div>
              <h3 className="page-title mb-0">{job.title}</h3>
              <span className="text-muted">{job.company}</span>
            </div>
          </div>
          <div className="row g-3 mb-4">
            <div className="col-6 col-md-3"><div className="stat-tile"><small>Şehir / İlçe</small><strong>İstanbul / {job.district}</strong></div></div>
            <div className="col-6 col-md-3"><div className="stat-tile"><small>Maaş</small><strong>{formatTL(job.salary)}</strong></div></div>
            {userLoc && (
              <div className="col-6 col-md-3"><div className="stat-tile"><small>Mesafe</small><strong>{formatDistance(distanceMeters(userLoc, job))}</strong></div></div>
            )}
          </div>
          <h5 className="section-title mb-2">Açıklama</h5>
          <p>{job.description || 'Açıklama girilmemiş.'}</p>
          <h5 className="section-title mb-2">Konum</h5>
          <JobMap center={job} pin={job} height={300} />
        </div>
      </div>
    </>
  )
}
