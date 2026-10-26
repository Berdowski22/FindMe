import { createContext, useContext, useState } from 'react'
import { getUsers, saveUsers, getSessionId, setSessionId } from '../utils/storage'

const AuthContext = createContext(null)
// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() =>
    getUsers().find((u) => u.id === getSessionId()) ?? null,
  )

  function register({ name, email, password, role }) {
    const users = getUsers()
    const mail = email.trim().toLowerCase()
    if (users.some((u) => u.email === mail)) throw new Error('Bu e-posta zaten kayıtlı.')
    const newUser = { id: crypto.randomUUID(), name: name.trim(), email: mail, password, role }
    saveUsers([...users, newUser])
    setSessionId(newUser.id)
    setUser(newUser)
  }

  function login(email, password) {
    const found = getUsers().find(
      (u) => u.email === email.trim().toLowerCase() && u.password === password,
    )
    if (!found) throw new Error('E-posta veya şifre hatalı.')
    setSessionId(found.id)
    setUser(found)
  }

  function logout() {
    setSessionId(null)
    setUser(null)
  }

  function updateProfile(changes) {
    const updated = { ...user, ...changes }
    saveUsers(getUsers().map((u) => (u.id === user.id ? updated : u)))
    setUser(updated)
  }

  function deleteAccount() {
    saveUsers(getUsers().filter((u) => u.id !== user.id))
    logout()
  }

  return (
    <AuthContext.Provider value={{ user, register, login, logout, updateProfile, deleteAccount }}>
      {children}
    </AuthContext.Provider>
  )
}
