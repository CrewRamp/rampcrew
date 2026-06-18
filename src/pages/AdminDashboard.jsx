import React, { useState, useEffect } from 'react'
import { Users, Calendar, Waves, DollarSign, Shield, CheckCircle, XCircle, AlertTriangle, LogOut, RefreshCw, Flag, Clock, ChevronDown, ChevronUp } from 'lucide-react'

const BASE_API = 'https://superagent-9068a6ba.base44.app/functions'
const tabs = ['Overview', 'Applications', 'Ramps', 'Reports']

function StatusBadge({ status }) {
  const map = {
    pending:  'bg-yellow-400/10 text-yellow-400 border-yellow-400/20',
    approved: 'bg-green-400/10  text-green-400  border-green-400/20',
    rejected: 'bg-red-400/10    text-red-400    border-red-400/20',
  }
  return (
    <span className={`text-xs px-2 py-0.5 rounded-full border capitalize font-medium ${map[status] || 'bg-white/10 text-gray-400'}`}>
      {status}
    </span>
  )
}

function ApplicationCard({ app, onUpdate }) {
  const [expanded, setExpanded] = useState(false)
  const [updating, setUpdating] = useState(false)
  const [notes, setNotes] = useState(app.admin_notes || '')

  async function updateStatus(status) {
    setUpdating(true)
    try {
      const res = await fetch(`${BASE_API}/updateHelperStatus`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: app.id, status, admin_notes: notes }),
      })
      if (res.ok) onUpdate(app.id, status, notes)
    } catch {}
    setUpdating(false)
  }

  const skills = app.skills ? app.skills.split(',').filter(Boolean) : []
  const days   = app.available_days ? app.available_days.split(',').filter(Boolean) : []

  return (
    <div className="bg-white/5 rounded-2xl overflow-hidden">
      <button className="w-full px-4 py-3 flex items-center justify-between" onClick={() => setExpanded(e => !e)}>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-crew-blue/20 rounded-full flex items-center justify-center text-sm font-bold text-white">
            {app.full_name?.[0]?.toUpperCase() || '?'}
          </div>
          <div className="text-left">
            <div className="text-sm font-semibold text-white">{app.full_name}</div>
            <div className="text-xs text-gray-500">{app.primary_lake} · {app.rate || '—'}/hr</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <StatusBadge status={app.status} />
          {expanded ? <ChevronUp size={14} className="text-gray-500" /> : <ChevronDown size={14} className="text-gray-500" />}
        </div>
      </button>

      {expanded && (
        <div className="px-4 pb-4 space-y-3 border-t border-white/5 pt-3">
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div><span className="text-gray-500">Phone</span><div className="text-white">{app.phone}</div></div>
            <div><span className="text-gray-500">Email</span><div className="text-white break-all">{app.email}</div></div>
            <div><span className="text-gray-500">DOB</span><div className="text-white">{app.dob || '—'}</div></div>
            <div><span className="text-gray-500">Experience</span><div className="text-white">{app.experience || '—'}</div></div>
            <div className="col-span-2"><span className="text-gray-500">Address</span><div className="text-white">{[app.address, app.city, app.state, app.zip].filter(Boolean).join(', ') || '—'}</div></div>
            <div><span className="text-gray-500">Emergency</span><div className="text-white">{app.emergency_name || '—'}</div></div>
            <div><span className="text-gray-500">Em. Phone</span><div className="text-white">{app.emergency_phone || '—'}</div></div>
          </div>

          {skills.length > 0 && (
            <div>
              <div className="text-xs text-gray-500 mb-1">Skills</div>
              <div className="flex flex-wrap gap-1">
                {skills.map(s => <span key={s} className="text-xs bg-white/5 text-gray-300 px-2 py-0.5 rounded-full">{s}</span>)}
              </div>
            </div>
          )}

          {days.length > 0 && (
            <div>
              <div className="text-xs text-gray-500 mb-1">Available</div>
              <div className="flex flex-wrap gap-1">
                {days.map(d => <span key={d} className="text-xs bg-crew-teal/10 text-crew-teal px-2 py-0.5 rounded-full">{d}</span>)}
              </div>
            </div>
          )}

          {app.bio && (
            <div>
              <div className="text-xs text-gray-500 mb-1">Bio</div>
              <p className="text-xs text-gray-300">{app.bio}</p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-2 text-xs">
            {app.id_file_name && <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl px-3 py-2 text-blue-300">📄 ID: {app.id_file_name}</div>}
            {app.photo_file_name && <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl px-3 py-2 text-blue-300">📷 Photo: {app.photo_file_name}</div>}
          </div>

          <div>
            <div className="text-xs text-gray-500 mb-1">Admin Notes</div>
            <textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="Internal notes..."
              className="w-full bg-white/5 border border-white/10 rounded-xl text-xs text-white placeholder-gray-600 p-2.5 resize-none h-16 focus:outline-none focus:border-crew-teal/40" />
          </div>

          {app.status === 'pending' && (
            <div className="grid grid-cols-2 gap-2">
              <button onClick={() => updateStatus('approved')} disabled={updating}
                className="py-2.5 rounded-xl text-xs font-semibold bg-green-500/20 text-green-400 border border-green-500/30 disabled:opacity-40 flex items-center justify-center gap-1">
                <CheckCircle size={12} /> Approve
              </button>
              <button onClick={() => updateStatus('rejected')} disabled={updating}
                className="py-2.5 rounded-xl text-xs font-semibold bg-red-500/20 text-red-400 border border-red-500/30 disabled:opacity-40 flex items-center justify-center gap-1">
                <XCircle size={12} /> Reject
              </button>
            </div>
          )}
          {app.status !== 'pending' && (
            <button onClick={() => updateStatus('pending')} disabled={updating}
              className="w-full py-2.5 rounded-xl text-xs font-semibold bg-white/5 text-gray-400 border border-white/10 disabled:opacity-40">
              Reset to Pending
            </button>
          )}

          <div className="text-xs text-gray-600 text-right">Applied {new Date(app.created_date).toLocaleDateString()}</div>
        </div>
      )}
    </div>
  )
}

export default function AdminDashboard({ token, onLogout }) {
  const [tab, setTab]             = useState('Overview')
  const [rampReports, setRampReports] = useState({})
  const [applications, setApplications] = useState([])
  const [appFilter, setAppFilter] = useState('all')
  const [loading, setLoading]     = useState(false)
  const [appsLoading, setAppsLoading] = useState(false)

  async function fetchReports() {
    setLoading(true)
    try {
      const res = await fetch(`${BASE_API}/getRampConditions`)
      const json = await res.json()
      setRampReports(json.conditions || {})
    } catch {}
    setLoading(false)
  }

  async function fetchApplications(filter = appFilter) {
    setAppsLoading(true)
    try {
      const res = await fetch(`${BASE_API}/getHelperApplications?status=${filter}`)
      const json = await res.json()
      setApplications(json.applications || [])
    } catch {}
    setAppsLoading(false)
  }

  useEffect(() => { fetchReports() }, [])
  useEffect(() => { if (tab === 'Applications') fetchApplications() }, [tab])

  function handleAppUpdate(id, status, notes) {
    setApplications(prev => prev.map(a => a.id === id ? { ...a, status, admin_notes: notes } : a))
  }

  const pendingCount   = applications.filter(a => a.status === 'pending').length
  const approvedCount  = applications.filter(a => a.status === 'approved').length
  const filteredApps   = appFilter === 'all' ? applications : applications.filter(a => a.status === appFilter)

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <div className="px-4 pt-12 pb-4 flex items-center justify-between border-b border-white/10">
        <div>
          <h1 className="text-xl font-bold text-white">Admin Dashboard</h1>
          <p className="text-xs text-gray-400 mt-0.5">RampCrew Operations Center</p>
        </div>
        <button onClick={onLogout} className="flex items-center gap-1.5 text-xs text-gray-400 bg-white/5 px-3 py-2 rounded-xl">
          <LogOut size={13} /> Sign Out
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 px-4 pt-4 overflow-x-auto">
        {tabs.map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all relative ${tab === t ? 'bg-crew-blue text-white' : 'bg-white/5 text-gray-400'}`}>
            {t}
            {t === 'Applications' && pendingCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-white text-xs flex items-center justify-center leading-none">{pendingCount}</span>
            )}
          </button>
        ))}
      </div>

      <div className="flex-1 px-4 py-5 space-y-4">

        {/* OVERVIEW */}
        {tab === 'Overview' && (
          <>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Total Bookings',       value: '0',             icon: Calendar,    color: 'text-blue-400',   bg: 'bg-blue-400/10' },
                { label: 'Approved Helpers',      value: String(approvedCount), icon: Users, color: 'text-green-400',  bg: 'bg-green-400/10' },
                { label: 'Pending Applications',  value: String(pendingCount),  icon: Clock, color: 'text-yellow-400', bg: 'bg-yellow-400/10' },
                { label: 'Ramps Monitored',       value: '6',             icon: Waves,       color: 'text-teal-400',   bg: 'bg-teal-400/10' },
              ].map(({ label, value, icon: Icon, color, bg }) => (
                <div key={label} className="bg-white/5 rounded-2xl p-4 space-y-2">
                  <div className={`w-8 h-8 ${bg} rounded-xl flex items-center justify-center`}>
                    <Icon size={16} className={color} />
                  </div>
                  <div className="text-2xl font-bold text-white">{value}</div>
                  <div className="text-xs text-gray-400">{label}</div>
                </div>
              ))}
            </div>

            <div className="bg-white/5 rounded-2xl p-4">
              <div className="font-semibold text-white text-sm mb-3">Platform Status</div>
              <div className="space-y-2 text-xs text-gray-400">
                <div className="flex justify-between"><span>Total Bookings</span><span className="text-white">0</span></div>
                <div className="flex justify-between"><span>Approved Helpers</span><span className="text-white">{approvedCount}</span></div>
                <div className="flex justify-between"><span>Pending Applications</span><span className="text-yellow-400 font-semibold">{pendingCount}</span></div>
                <div className="flex justify-between"><span>Avg Booking Value</span><span className="text-white">—</span></div>
              </div>
              {pendingCount > 0 && (
                <button onClick={() => setTab('Applications')} className="mt-3 w-full text-xs text-crew-teal border border-crew-teal/30 rounded-xl py-2">
                  Review {pendingCount} pending application{pendingCount !== 1 ? 's' : ''} →
                </button>
              )}
            </div>
          </>
        )}

        {/* APPLICATIONS */}
        {tab === 'Applications' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="text-sm font-semibold text-white">Helper Applications</div>
              <button onClick={() => fetchApplications()} className="p-2 bg-white/5 rounded-xl">
                <RefreshCw size={13} className={`text-gray-400 ${appsLoading ? 'animate-spin' : ''}`} />
              </button>
            </div>

            {/* Filter tabs */}
            <div className="flex gap-2">
              {['all', 'pending', 'approved', 'rejected'].map(f => (
                <button key={f} onClick={() => { setAppFilter(f); fetchApplications(f) }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all capitalize ${appFilter === f ? 'bg-crew-blue text-white' : 'bg-white/5 text-gray-400'}`}>
                  {f}
                </button>
              ))}
            </div>

            {appsLoading ? (
              <div className="text-center text-gray-500 text-xs py-8">Loading…</div>
            ) : filteredApps.length === 0 ? (
              <div className="bg-white/5 rounded-2xl p-5 flex flex-col items-center text-center gap-3">
                <Users size={28} className="text-gray-500" />
                <div className="text-white font-semibold">No {appFilter !== 'all' ? appFilter : ''} applications</div>
                <p className="text-xs text-gray-500">When boaters apply through the app, they'll appear here.</p>
              </div>
            ) : (
              filteredApps.map(app => (
                <ApplicationCard key={app.id} app={app} onUpdate={handleAppUpdate} />
              ))
            )}
          </div>
        )}

        {/* RAMPS */}
        {tab === 'Ramps' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="text-sm font-semibold text-white">Live Ramp Status</div>
              <button onClick={fetchReports} className="p-2 bg-white/5 rounded-xl">
                <RefreshCw size={13} className={`text-gray-400 ${loading ? 'animate-spin' : ''}`} />
              </button>
            </div>
            {[
              { id: 1, name: 'Higgens Point',       lake: 'Lake CDA' },
              { id: 2, name: 'City Park Ramp',      lake: 'Lake CDA' },
              { id: 3, name: 'Blackwell Island',    lake: 'Lake CDA' },
              { id: 4, name: 'Sandpoint City Ramp', lake: 'Lake Pend Oreille' },
              { id: 5, name: 'Hope Boat Basin',     lake: 'Lake Pend Oreille' },
              { id: 6, name: 'Honeysuckle Beach',   lake: 'Hayden Lake' },
            ].map(ramp => {
              const live = rampReports[ramp.id]
              const status = live?.status || 'no data'
              const dot = { good: 'bg-green-400', busy: 'bg-yellow-400', closed: 'bg-red-400' }[status] || 'bg-gray-600'
              return (
                <div key={ramp.id} className="bg-white/5 rounded-xl px-4 py-3 flex items-center justify-between">
                  <div>
                    <div className="text-sm text-white font-medium">{ramp.name}</div>
                    <div className="text-xs text-gray-500">{ramp.lake}</div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <div className="flex items-center gap-1.5">
                      <div className={`w-2 h-2 rounded-full ${dot}`} />
                      <span className="text-xs text-gray-300 capitalize">{status}</span>
                    </div>
                    {live && <span className="text-xs text-gray-600">{live.report_count} report{live.report_count !== 1 ? 's' : ''}</span>}
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* REPORTS */}
        {tab === 'Reports' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="text-sm font-semibold text-white">Crowd Reports (last 2 hrs)</div>
              <button onClick={fetchReports} className="p-2 bg-white/5 rounded-xl">
                <RefreshCw size={13} className={`text-gray-400 ${loading ? 'animate-spin' : ''}`} />
              </button>
            </div>
            {Object.keys(rampReports).length === 0 ? (
              <div className="bg-white/5 rounded-2xl p-5 flex flex-col items-center text-center gap-3">
                <Flag size={28} className="text-gray-500" />
                <div className="text-white font-semibold">No reports in the last 2 hours</div>
                <p className="text-xs text-gray-500">Boater condition reports will appear here in real time.</p>
              </div>
            ) : (
              Object.entries(rampReports).map(([id, data]) => data && (
                <div key={id} className="bg-white/5 rounded-xl px-4 py-3 space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-white font-medium">Ramp #{id}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full capitalize font-medium ${
                      data.status === 'good' ? 'bg-green-400/10 text-green-400' :
                      data.status === 'busy' ? 'bg-yellow-400/10 text-yellow-400' :
                      'bg-red-400/10 text-red-400'}`}>
                      {data.status}
                    </span>
                  </div>
                  <div className="text-xs text-gray-400">
                    {data.report_count} report{data.report_count !== 1 ? 's' : ''} · {data.wait_minutes != null ? `${data.wait_minutes} min avg wait` : 'no wait data'} · {data.surface || ''}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

      </div>
    </div>
  )
}
