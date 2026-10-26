import { useState } from 'react'
import { districts } from '../models/costOfLiving'
import JobMap from './JobMap'

const DEFAULT_CENTER = { lat: 41.0082, lng: 28.9784 }
const empty = { title: '', company: '', district: districts[0], salary: '', description: '', lat: null, lng: null }

export default function JobForm({ initial, onSubmit, onCancel }) {
  const [form, setForm] = useState(initial ?? empty)
  const [error, setError] = useState('')
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value })

  function submit(e) {
    e.preventDefault()
    if (form.lat == null) return setError('Haritaya tıklayarak ilan konumunu seçin.')
    if (Number(form.salary) <= 0) return setError('Geçerli bir maaş girin.')
    onSubmit({ ...form, salary: Number(form.salary) })
  }

  return (
    <form onSubmit={submit} className="card card-body mb-4">
      <h5>{initial ? 'İlanı Güncelle' : 'Yeni İlan Ekle'}</h5>
      <div className="row g-3">
        <div className="col-md-6">
          <label className="form-label">Pozisyon</label>
          <input className="form-control" required value={form.title} onChange={set('title')} />
        </div>
        <div className="col-md-6">
          <label className="form-label">Şirket</label>
          <input className="form-control" required value={form.company} onChange={set('company')} />
        </div>
        <div className="col-md-6">
          <label className="form-label">İlçe</label>
          <select className="form-select" value={form.district} onChange={set('district')}>
            {districts.map((d) => <option key={d}>{d}</option>)}
          </select>
        </div>
        <div className="col-md-6">
          <label className="form-label">Aylık maaş (₺)</label>
          <input type="number" min="1" className="form-control" required value={form.salary} onChange={set('salary')} />
        </div>
        <div className="col-12">
          <label className="form-label">Açıklama</label>
          <textarea className="form-control" rows="2" value={form.description} onChange={set('description')} />
        </div>
        <div className="col-12">
          <label className="form-label">Konum (haritaya tıklayın)</label>
          <JobMap
            center={form.lat != null ? form : DEFAULT_CENTER}
            pin={form.lat != null ? form : null}
            onPick={(p) => setForm({ ...form, ...p })}
            height={280}
          />
        </div>
      </div>
      {error && <div className="alert alert-danger mt-3 mb-0">{error}</div>}
      <div className="mt-3 d-flex gap-2">
        <button className="btn btn-primary">{initial ? 'Kaydet' : 'Ekle'}</button>
        {onCancel && <button type="button" className="btn btn-outline-secondary" onClick={onCancel}>Vazgeç</button>}
      </div>
    </form>
  )
}
