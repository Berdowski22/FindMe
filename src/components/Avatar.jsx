export default function Avatar({ user, name, size = 40, className = 'cv-avatar' }) {
  const label = (name ?? user?.name ?? '?').charAt(0).toUpperCase() || '?'
  const style = { width: size, height: size, fontSize: size * 0.4 }
  if (user?.photo) {
    return <img src={user.photo} alt="Profil fotoğrafı" className="rounded-circle object-fit-cover" style={style} />
  }
  return <div className={className} style={style}>{label}</div>
}
