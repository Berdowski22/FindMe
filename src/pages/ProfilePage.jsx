import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getJobs, saveJobs } from '../utils/storage'
import { resizeImage } from '../utils/image'
import Avatar from '../components/Avatar'

const LEVELS = ['Başlangıç', 'Orta', 'İleri', 'Anadil']
const emptyCv = { title: '', phone: '', city: '', about: '', link: '', education: [], experience: [], skills: [], languages: [] }

function Section({ title, children, onAdd, addLabel = 'Ekle' }) {
  return (
    <div className="card mb-3">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="section-title mb-0">{title}</h5>
          {onAdd && <button type="button" className="btn btn-sm btn-outline-primary no-print" onClick={onAdd}>+ {addLabel}</button>}
        </div>
        {children}
      </div>
    </div>
  )
}

function EntryList({ items, fields, onChange, empty }) {
  const patch = (i, k, v) => onChange(items.map((it, idx) => (idx === i ? { ...it, [k]: v } : it)))
  if (items.length === 0) return <p className="text-muted mb-0">{empty}</p>
  return items.map((it, i) => (
    <div key={i} className="cv-item">
      <div className="row g-2">
        {fields.map(({ key, label, type = 'text', col = 6 }) => (
          <div key={key} className={`col-12 col-md-${col}`}>
            {type === 'textarea' ? (
              <textarea className="form-control" rows="2" placeholder={label} value={it[key]} onChange={(e) => patch(i, key, e.target.value)} />
            ) : (
              <input className="form-control" placeholder={label} value={it[key]} onChange={(e) => patch(i, key, e.target.value)} />
            )}
          </div>
        ))}
      </div>
      <button type="button" className="btn btn-sm btn-link text-danger px-0 no-print" onClick={() => onChange(items.filter((_, idx) => idx !== i))}>
        Sil
      </button>
    </div>
  ))
}

export default function ProfilePage() {
  const { user, updateProfile, deleteAccount } = useAuth()
  const navigate = useNavigate()
  const isSeeker = user.role === 'seeker'
  const [name, setName] = useState(user.name)
  const [cv, setCv] = useState({ ...emptyCv, ...user.cv })
  const [skill, setSkill] = useState('')
  const [saved, setSaved] = useState(false)
  const [photoError, setPhotoError] = useState('')

  async function onPhoto(e) {
    const file = e.target.files[0]
    e.target.value = ''
    if (!file) return
    try {
      updateProfile({ photo: await resizeImage(file) })
      setPhotoError('')
    } catch (err) {
      setPhotoError(err.message)
    }
  }

  const change = (patch) => {
    setCv((c) => ({ ...c, ...patch }))
    setSaved(false)
  }
  const setField = (k) => (e) => change({ [k]: e.target.value })

  function addSkill(e) {
    e.preventDefault()
    const s = skill.trim()
    if (s && !cv.skills.includes(s)) change({ skills: [...cv.skills, s] })
    setSkill('')
  }

  function save(e) {
    e.preventDefault()
    updateProfile({ name: name.trim(), cv })
    setSaved(true)
  }

  function remove() {
    if (!confirm('Hesabınız ve ilanlarınız silinecek. Emin misiniz?')) return
    saveJobs(getJobs().filter((j) => j.ownerId !== user.id))
    deleteAccount()
    navigate('/login')
  }

  return (
    <form onSubmit={save}>
      <div className="card mb-3">
        <div className="card-body">
          <div className="d-flex flex-column flex-sm-row gap-3 align-items-sm-center">
            <div className="d-flex flex-column align-items-center gap-2">
              <Avatar user={user} name={name} size={96} />
              <div className="no-print d-flex gap-2">
                <label className="btn btn-sm btn-outline-primary mb-0">
                  📷 {user.photo ? 'Değiştir' : 'Fotoğraf ekle'}
                  <input type="file" accept="image/*" hidden onChange={onPhoto} />
                </label>
                {user.photo && <button type="button" className="btn btn-sm btn-outline-danger" onClick={() => updateProfile({ photo: null })}>Kaldır</button>}
              </div>
              {photoError && <small className="text-danger">{photoError}</small>}
            </div>
            <div className="flex-grow-1">
              <input className="form-control form-control-lg fw-bold mb-2" required placeholder="Ad Soyad" value={name} onChange={(e) => { setName(e.target.value); setSaved(false) }} />
              {isSeeker && <input className="form-control" placeholder="Unvan (ör. Frontend Developer)" value={cv.title} onChange={setField('title')} />}
              <small className="text-muted d-block mt-2">
                {user.email} · {isSeeker ? 'İş arayan' : 'İşveren'}
              </small>
            </div>
          </div>
        </div>
      </div>

      {isSeeker && (
        <>
          <Section title="📞 İletişim">
            <div className="row g-2">
              <div className="col-12 col-md-4"><input className="form-control" placeholder="Telefon" value={cv.phone} onChange={setField('phone')} /></div>
              <div className="col-12 col-md-4"><input className="form-control" placeholder="Şehir / İlçe" value={cv.city} onChange={setField('city')} /></div>
              <div className="col-12 col-md-4"><input className="form-control" placeholder="LinkedIn / GitHub bağlantısı" value={cv.link} onChange={setField('link')} /></div>
            </div>
          </Section>

          <Section title="📝 Hakkımda">
            <textarea className="form-control" rows="3" placeholder="Kendinizi kısaca tanıtın..." value={cv.about} onChange={setField('about')} />
          </Section>

          <Section
            title="💼 İş Deneyimi"
            onAdd={() => change({ experience: [...cv.experience, { company: '', position: '', period: '', description: '' }] })}
          >
            <EntryList
              items={cv.experience}
              empty="Henüz deneyim eklenmedi."
              onChange={(experience) => change({ experience })}
              fields={[
                { key: 'position', label: 'Pozisyon' },
                { key: 'company', label: 'Şirket' },
                { key: 'period', label: 'Dönem (ör. 2022 – 2024)', col: 12 },
                { key: 'description', label: 'Yaptığınız işler', type: 'textarea', col: 12 },
              ]}
            />
          </Section>

          <Section
            title="🎓 Eğitim"
            onAdd={() => change({ education: [...cv.education, { school: '', department: '', period: '' }] })}
          >
            <EntryList
              items={cv.education}
              empty="Henüz eğitim eklenmedi."
              onChange={(education) => change({ education })}
              fields={[
                { key: 'school', label: 'Okul', col: 4 },
                { key: 'department', label: 'Bölüm', col: 4 },
                { key: 'period', label: 'Dönem', col: 4 },
              ]}
            />
          </Section>

          <Section title="🛠️ Yetenekler">
            <div className="mb-2">
              {cv.skills.length === 0 && <span className="text-muted">Henüz yetenek eklenmedi.</span>}
              {cv.skills.map((s) => (
                <span key={s} className="skill-chip">
                  {s}
                  <button type="button" aria-label={`${s} yeteneğini sil`} className="no-print" onClick={() => change({ skills: cv.skills.filter((x) => x !== s) })}>×</button>
                </span>
              ))}
            </div>
            <div className="input-group no-print">
              <input className="form-control" placeholder="Yetenek yazın (ör. React)" value={skill} onChange={(e) => setSkill(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && addSkill(e)} />
              <button type="button" className="btn btn-outline-primary" onClick={addSkill}>Ekle</button>
            </div>
          </Section>

          <Section
            title="🌍 Diller"
            onAdd={() => change({ languages: [...cv.languages, { name: '', level: LEVELS[1] }] })}
          >
            {cv.languages.length === 0 && <p className="text-muted mb-0">Henüz dil eklenmedi.</p>}
            {cv.languages.map((l, i) => (
              <div key={i} className="row g-2 mb-2">
                <div className="col-7"><input className="form-control" placeholder="Dil" value={l.name} onChange={(e) => change({ languages: cv.languages.map((x, idx) => (idx === i ? { ...x, name: e.target.value } : x)) })} /></div>
                <div className="col-3">
                  <select className="form-select" value={l.level} onChange={(e) => change({ languages: cv.languages.map((x, idx) => (idx === i ? { ...x, level: e.target.value } : x)) })}>
                    {LEVELS.map((lv) => <option key={lv}>{lv}</option>)}
                  </select>
                </div>
                <div className="col-2"><button type="button" className="btn btn-outline-danger w-100 no-print" onClick={() => change({ languages: cv.languages.filter((_, idx) => idx !== i) })}>Sil</button></div>
              </div>
            ))}
          </Section>
        </>
      )}

      {saved && <div className="alert alert-success">Profil güncellendi.</div>}
      <div className="d-flex flex-wrap gap-2 mb-4 no-print">
        <button className="btn btn-primary">Kaydet</button>
        {isSeeker && <button type="button" className="btn btn-outline-secondary" onClick={() => window.print()}>🖨️ CV&apos;yi yazdır / PDF</button>}
        <button type="button" className="btn btn-outline-danger ms-auto" onClick={remove}>Hesabı Sil</button>
      </div>
    </form>
  )
}
