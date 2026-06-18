import React, { useState } from 'react'
import { MapPin, Navigation, X } from 'lucide-react'

const ramps = [
  { id: 1, name: 'Higgens Point',           lake: "Lake Coeur d'Alene", status: 'good',   wait: '5 min',  lat: 47.6748, lng: -116.7517, gmaps: 'https://www.google.com/maps/dir/?api=1&destination=Higgens+Point+Boat+Launch+Lake+Coeur+d%27Alene+Idaho&travelmode=driving' },
  { id: 2, name: 'City Park Ramp',          lake: "Lake Coeur d'Alene", status: 'busy',   wait: '35 min', lat: 47.6736, lng: -116.7799, gmaps: 'https://www.google.com/maps/dir/?api=1&destination=City+Park+Boat+Ramp+Coeur+d%27Alene+Idaho&travelmode=driving' },
  { id: 3, name: 'Blackwell Island',        lake: "Lake Coeur d'Alene", status: 'good',   wait: '10 min', lat: 47.6833, lng: -116.8052, gmaps: 'https://www.google.com/maps/dir/?api=1&destination=Blackwell+Island+Boat+Launch+Coeur+d%27Alene+Idaho&travelmode=driving' },
  { id: 4, name: 'Sandpoint City Ramp',     lake: 'Lake Pend Oreille',  status: 'good',   wait: '0 min',  lat: 48.2720, lng: -116.5418, gmaps: 'https://www.google.com/maps/dir/?api=1&destination=Sandpoint+City+Boat+Ramp+Lake+Pend+Oreille+Idaho&travelmode=driving' },
  { id: 5, name: 'Hope Boat Basin',         lake: 'Lake Pend Oreille',  status: 'good',   wait: '5 min',  lat: 48.2393, lng: -116.3007, gmaps: 'https://www.google.com/maps/dir/?api=1&destination=Hope+Boat+Basin+Lake+Pend+Oreille+Idaho&travelmode=driving' },
  { id: 6, name: 'Honeysuckle Beach Ramp',  lake: 'Hayden Lake',        status: 'closed', wait: 'N/A',    lat: 47.7814, lng: -116.7878, gmaps: 'https://www.google.com/maps/dir/?api=1&destination=Honeysuckle+Beach+Boat+Ramp+Hayden+Lake+Idaho&travelmode=driving' },
]

const statusColor = { good: '#4ade80', busy: '#facc15', closed: '#f87171' }
const statusLabel = { good: 'Good', busy: 'Busy', closed: 'Closed' }
const statusBg    = { good: 'bg-green-400/10 text-green-400', busy: 'bg-yellow-400/10 text-yellow-400', closed: 'bg-red-400/10 text-red-400' }

export default function RampMap() {
  const [filter, setFilter] = useState('all')
  const [selected, setSelected] = useState(null)

  const filtered = filter === 'all' ? ramps : ramps.filter(r => r.status === filter)
  const selectedRamp = ramps.find(r => r.id === selected)

  // Build OpenStreetMap static-style embed via iframe (no API key needed)
  const centerLat = 47.9, centerLng = -116.65, zoom = 9

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      {/* Filter bar */}
      <div className="flex gap-2 px-4 py-3">
        {['all', 'good', 'busy', 'closed'].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium capitalize transition-all ${filter === f ? 'bg-crew-blue text-white' : 'bg-white/5 text-gray-400'}`}>
            {f}
          </button>
        ))}
      </div>

      {/* Map */}
      <div className="flex-1 relative mx-4 rounded-2xl overflow-hidden border border-white/10">
        <iframe
          title="Ramp Map"
          width="100%"
          height="100%"
          src={`https://www.openstreetmap.org/export/embed.html?bbox=${centerLng - 1.2}%2C${centerLat - 0.8}%2C${centerLng + 1.2}%2C${centerLat + 0.8}&layer=mapnik`}
          style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg)' }}
        />
        {/* Ramp pins overlay */}
        <div className="absolute inset-0 pointer-events-none">
          {filtered.map(r => {
            // Convert lat/lng to % position within the bbox
            const bboxW = centerLng - 1.2, bboxE = centerLng + 1.2
            const bboxS = centerLat - 0.8, bboxN = centerLat + 0.8
            const x = ((r.lng - bboxW) / (bboxE - bboxW)) * 100
            const y = ((bboxN - r.lat) / (bboxN - bboxS)) * 100
            return (
              <button
                key={r.id}
                onClick={() => setSelected(r.id)}
                className="absolute pointer-events-auto transform -translate-x-1/2 -translate-y-full"
                style={{ left: `${x}%`, top: `${y}%` }}
              >
                <div className="flex flex-col items-center">
                  <div className="w-3 h-3 rounded-full border-2 border-white shadow-lg" style={{ backgroundColor: statusColor[r.status] }} />
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Ramp list / bottom card */}
      <div className="px-4 py-3 space-y-2 max-h-48 overflow-y-auto">
        {selected && selectedRamp ? (
          <div className="bg-white/10 rounded-2xl p-4 space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <div className="font-semibold text-white">{selectedRamp.name}</div>
                <div className="text-xs text-gray-400">{selectedRamp.lake}</div>
              </div>
              <button onClick={() => setSelected(null)}><X size={16} className="text-gray-400" /></button>
            </div>
            <div className="flex items-center gap-3">
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusBg[selectedRamp.status]}`}>{statusLabel[selectedRamp.status]}</span>
              {selectedRamp.status !== 'closed' && <span className="text-xs text-gray-400">{selectedRamp.wait} wait</span>}
            </div>
            <a href={selectedRamp.gmaps} target="_blank" rel="noreferrer"
              className="flex items-center justify-center gap-2 bg-crew-blue text-white rounded-xl py-2.5 text-sm font-semibold w-full">
              <Navigation size={14} /> Go to Ramp
            </a>
          </div>
        ) : (
          filtered.map(r => (
            <button key={r.id} onClick={() => setSelected(r.id)}
              className="w-full flex items-center justify-between bg-white/5 rounded-xl px-4 py-2.5">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: statusColor[r.status] }} />
                <span className="text-sm text-white font-medium">{r.name}</span>
              </div>
              <span className="text-xs text-gray-500">{r.lake}</span>
            </button>
          ))
        )}
      </div>
    </div>
  )
}
