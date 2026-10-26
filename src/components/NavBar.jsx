import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Avatar from './Avatar'

export default function NavBar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const close = () => setOpen(false)

  return (
    <nav className="navbar navbar-expand-md navbar-dark fm-navbar sticky-top no-print">
      <div className="container">
        <Link className="navbar-brand fw-bold fm-logo" to="/" onClick={close}>
          📍 Find<span>Me</span>
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          aria-label="Menüyü aç/kapat"
          aria-expanded={open}
          onClick={() => setOpen(!open)}
        >
          <span className="navbar-toggler-icon" />
        </button>
        <div className={`collapse navbar-collapse ${open ? 'show' : ''}`}>
          <div className="navbar-nav me-auto gap-md-1 py-2 py-md-0" onClick={close}>
            {user?.role === 'seeker' && (
              <>
                <NavLink className="nav-link" to="/nearby">🗺️ Harita</NavLink>
                <NavLink className="nav-link" to="/jobs">💼 İlanlar</NavLink>
              </>
            )}
            {user?.role === 'employer' && (
              <NavLink className="nav-link" to="/employer">💼 İlanlarım</NavLink>
            )}
            {user && <NavLink className="nav-link" to="/profile">👤 Profil</NavLink>}
          </div>
          {user ? (
            <div className="d-flex align-items-center gap-2 text-white pb-2 pb-md-0">
              <Avatar user={user} size={32} className="cv-avatar" />
              <span>{user.name}</span>
              <button
                className="btn btn-sm btn-light"
                onClick={() => {
                  close()
                  logout()
                  navigate('/login')
                }}
              >
                Çıkış
              </button>
            </div>
          ) : (
            <Link className="btn btn-sm btn-light" to="/login" onClick={close}>Giriş</Link>
          )}
        </div>
      </div>
    </nav>
  )
}
