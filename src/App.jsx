import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import NavBar from './components/NavBar'
import ProtectedRoute from './components/ProtectedRoute'
import Home from './pages/Home'
import AuthPage from './pages/AuthPage'
import NearbyPage from './pages/NearbyPage'
import JobsPage from './pages/JobsPage'
import JobDetailPage from './pages/JobDetailPage'
import EmployerPage from './pages/EmployerPage'
import ProfilePage from './pages/ProfilePage'
import './App.css'

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <NavBar />
        <main className="container py-4">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<AuthPage mode="login" />} />
            <Route path="/register" element={<AuthPage mode="register" />} />
            <Route path="/nearby" element={<ProtectedRoute role="seeker"><NearbyPage /></ProtectedRoute>} />
            <Route path="/jobs" element={<ProtectedRoute role="seeker"><JobsPage /></ProtectedRoute>} />
            <Route path="/jobs/:id" element={<ProtectedRoute role="seeker"><JobDetailPage /></ProtectedRoute>} />
            <Route path="/employer" element={<ProtectedRoute role="employer"><EmployerPage /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
            <Route path="*" element={<Home />} />
          </Routes>
        </main>
      </AuthProvider>
    </BrowserRouter>
  )
}
