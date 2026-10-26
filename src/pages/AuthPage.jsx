import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function AuthPage({ mode }) {
  const isRegister = mode === 'register'
  const { user, login, register } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'seeker' })
  const [error, setError] = useState('')
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value })

  if (user) return <Navigate to="/" replace />

  function submit(e) {
    e.preventDefault()
    try {
      if (isRegister) register(form)
      else login(form.email, form.password)
      navigate('/')
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="row g-4 align-items-stretch justify-content-center">
      <div className="col-lg-6 d-none d-md-block">
        <div className="fm-hero p-4 p-lg-5 h-100 d-flex flex-column justify-content-center">
          <h1 className="fw-bold display-6">Sana en yakın işi bul 📍</h1>
          <p className="lead opacity-75">
            Konumunu paylaş, çevrendeki iş ilanlarını haritada gör ve maaşını bölgenin yaşam maliyetiyle karşılaştır.
          </p>
          <ul className="list-unstyled fm-hero-list mb-0">
            <li>🗺️ Haritada yakınındaki ilanlar</li>
            <li>💰 Maaş ve kira karşılaştırması</li>
            <li>📄 Kendi CV&apos;ni oluştur</li>
          </ul>
        </div>
      </div>
      <div className="col-md-8 col-lg-5">
        <form onSubmit={submit} className="card card-body p-4 h-100 justify-content-center">
          <h3 className="page-title mb-1">{isRegister ? 'Hesap oluştur' : 'Tekrar hoş geldin'}</h3>
          <p className="text-muted mb-4">{isRegister ? 'Birkaç saniyede kayıt ol.' : 'Hesabınla giriş yap.'}</p>
          {isRegister && (
            <>
              <input className="form-control form-control-lg mb-3" placeholder="Ad Soyad" required value={form.name} onChange={set('name')} />
              <select className="form-select form-select-lg mb-3" value={form.role} onChange={set('role')}>
                <option value="seeker">İş arıyorum</option>
                <option value="employer">İşverenim</option>
              </select>
            </>
          )}
          <input type="email" className="form-control form-control-lg mb-3" placeholder="E-posta" required value={form.email} onChange={set('email')} />
          <input type="password" minLength={4} className="form-control form-control-lg mb-3" placeholder="Şifre" required value={form.password} onChange={set('password')} />
          {error && <div className="alert alert-danger">{error}</div>}
          <button className="btn btn-primary btn-lg">{isRegister ? 'Kayıt Ol' : 'Giriş Yap'}</button>
          <small className="mt-3 text-center">
            {isRegister ? <>Hesabın var mı? <Link to="/login">Giriş yap</Link></> : <>Hesabın yok mu? <Link to="/register">Kayıt ol</Link></>}
          </small>
        </form>
      </div>
    </div>
  )
}
