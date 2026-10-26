import { getCost } from '../models/costOfLiving'
import { formatTL } from '../utils/geo'

export default function CostPanel({ job }) {
  const { rent, living } = getCost(job.district)
  const total = rent + living
  const left = job.salary - total
  const percent = Math.round((total / job.salary) * 100)
  const barColor = percent > 90 ? 'bg-danger' : percent > 70 ? 'bg-warning' : 'bg-success'

  return (
    <div className="card">
      <div className="card-body">
        <h5 className="section-title mb-3">🏙️ İstanbul / {job.district} – Yaşam Koşulları</h5>
        <div className="row g-3 mb-3">
          <div className="col-6 col-md-3">
            <div className="stat-tile"><small>İlan maaşı</small><strong>{formatTL(job.salary)}</strong></div>
          </div>
          <div className="col-6 col-md-3">
            <div className="stat-tile"><small>Ortalama kira (1+1)</small><strong>{formatTL(rent)}</strong></div>
          </div>
          <div className="col-6 col-md-3">
            <div className="stat-tile"><small>Yaşam gideri</small><strong>{formatTL(living)}</strong></div>
          </div>
          <div className="col-6 col-md-3">
            <div className="stat-tile">
              <small>Kalan</small>
              <strong className={left >= 0 ? 'text-success' : 'text-danger'}>{formatTL(left)}</strong>
            </div>
          </div>
        </div>
        <div className="d-flex justify-content-between small mb-1">
          <span>Maaşın harcanan oranı</span>
          <strong>%{percent}</strong>
        </div>
        <div className="progress" style={{ height: 12 }} role="progressbar" aria-label="Maaşın harcanan oranı">
          <div className={`progress-bar ${barColor}`} style={{ width: `${Math.min(100, percent)}%` }} />
        </div>
        <small className="text-muted d-block mt-2">Yaşam gideri: yemek, ulaşım, fatura. Değerler yaklaşık ve demo amaçlıdır.</small>
      </div>
    </div>
  )
}
