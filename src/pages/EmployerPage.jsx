import { useState } from 'react'
import JobForm from '../components/JobForm'
import { useAuth } from '../context/AuthContext'
import { getJobs, saveJobs } from '../utils/storage'
import { formatTL } from '../utils/geo'

export default function EmployerPage() {
  const { user } = useAuth()
  const [jobs, setJobs] = useState(getJobs)
  const [editing, setEditing] = useState(null)

  const mine = jobs.filter((j) => j.ownerId === user.id)
  const commit = (next) => {
    saveJobs(next)
    setJobs(next)
  }

  const add = (data) => commit([...jobs, { ...data, id: crypto.randomUUID(), ownerId: user.id }])
  const update = (data) => {
    commit(jobs.map((j) => (j.id === data.id ? data : j)))
    setEditing(null)
  }
  const remove = (id) => {
    if (confirm('Bu ilan silinsin mi?')) commit(jobs.filter((j) => j.id !== id))
  }

  return (
    <>
      {editing ? (
        <JobForm key={editing.id} initial={editing} onSubmit={update} onCancel={() => setEditing(null)} />
      ) : (
        <JobForm key="new" onSubmit={add} />
      )}
      <h3 className="page-title mb-3">İlanlarım ({mine.length})</h3>
      {mine.length === 0 && <p className="text-muted">Henüz ilan eklemediniz.</p>}
      <ul className="list-group">
        {mine.map((j) => (
          <li key={j.id} className="list-group-item d-flex flex-column flex-md-row gap-2 justify-content-between align-items-md-center">
            <span>
              <strong>{j.title}</strong> – {j.company} · {j.district} · {formatTL(j.salary)}
            </span>
            <span className="btn-group">
              <button className="btn btn-sm btn-outline-primary" onClick={() => setEditing(j)}>Düzenle</button>
              <button className="btn btn-sm btn-outline-danger" onClick={() => remove(j.id)}>Sil</button>
            </span>
          </li>
        ))}
      </ul>
    </>
  )
}
