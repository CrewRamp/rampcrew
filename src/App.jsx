import React, { useState } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar'
import BottomNav from './components/BottomNav'
import Home from './pages/Home'
import Concierge from './pages/Concierge'
import BookRamp from './pages/BookRamp'
import RampConditions from './pages/RampConditions'
import Marketplace from './pages/Marketplace'
import RampMap from './pages/RampMap'
import AdminDashboard from './pages/AdminDashboard'

const BASE_API = 'https://superagent-9068a6ba.base44.app/functions'

// Password is NEVER stored in client JS — validated server-side via adminLogin function
function AdminGate() {
  const [token, setToken]   = useState(() => sessionStorage.getItem('rc_admin_token'))
  const [expiry, setExpiry] = useState(() => Number(sessionStorage.getItem('rc_admin_expiry') || 0))
  const [pw, setPw]         = useState('')
  const [error, setError]   = useState('')
  const [loading, setLoading] = useState(false)

  const isAuthed = token && expiry > Date.now()

  async function login() {
    if (!pw.trim()) return
    setLoading(true)
    setError('')
    try {
      const res = await fetch(`${BASE_API}/adminLogin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: pw }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Incorrect password')
        setPw('')
      } else {
        sessionStorage.setItem('rc_admin_token', data.token)
        sessionStorage.setItem('rc_admin_expiry', String(data.expiresAt))
        setToken(data.token)
        setExpiry(data.expiresAt)
      }
    } catch {
      setError('Network error — please try again')
    } finally {
      setLoading(false)
    }
  }

  function logout() {
    sessionStorage.removeItem('rc_admin_token')
    sessionStorage.removeItem('rc_admin_expiry')
    setToken(null)
    setExpiry(0)
    setPw('')
  }

  if (!isAuthed) {
    return (
      <div className="min-h-screen bg-navy-900 flex items-center justify-center px-6">
        <div className="w-full max-w-sm space-y-6">
          <div className="text-center space-y-2">
            <div className="text-4xl">⚓</div>
            <h1 className="text-2xl font-bold text-white">RampCrew Admin</h1>
            <p className="text-gray-400 text-sm">Authorized access only</p>
          </div>
          <div className="space-y-3">
            <input
              type="password"
              value={pw}
              onChange={e => { setPw(e.target.value); setError('') }}
              onKeyDown={e => e.key === 'Enter' && !loading && login()}
              placeholder="Admin password"
              autoFocus
              className="w-full bg-white/5 border border-white/10 rounded-xl text-white px-4 py-3 text-sm placeholder-gray-600 outline-none focus:border-crew-teal transition"
            />
            {error && <p className="text-red-400 text-xs text-center">{error}</p>}
            <button
              onClick={login}
              disabled={loading || !pw.trim()}
              className="w-full bg-crew-blue text-white py-3 rounded-xl font-semibold text-sm disabled:opacity-50"
            >
              {loading ? 'Signing in…' : 'Sign In'}
            </button>
          </div>
        </div>
      </div>
    )
  }

  return <AdminDashboard token={token} onLogout={logout} />
}

function PublicLayout() {
  return (
    <div className="min-h-screen bg-navy-900 text-white max-w-md mx-auto relative">
      <Navbar />
      <main className="pb-20 pt-16">
        <Routes>
          <Route path="/"           element={<Home />} />
          <Route path="/concierge"  element={<Concierge />} />
          <Route path="/book"       element={<BookRamp />} />
          <Route path="/conditions" element={<RampConditions />} />
          <Route path="/helpers"    element={<Marketplace />} />
          <Route path="/map"        element={<RampMap />} />
        </Routes>
      </main>
      <BottomNav />
    </div>
  )
}

export default function App() {
  const location = useLocation()
  const isAdmin  = location.pathname.startsWith('/admin')

  if (isAdmin) {
    return (
      <div className="min-h-screen bg-navy-900 text-white max-w-md mx-auto">
        <AdminGate />
      </div>
    )
  }

  return <PublicLayout />
}
