import React from 'react'
import { Link } from 'react-router-dom'
import { MapPin, Shield, ChevronRight } from 'lucide-react'

const RAMPS = [
  { name: "Honeysuckle Beach Boat Ramp", desc: "The primary public ramp on Hayden Lake. Well-maintained paved lanes with a sandy beach area nearby.", coords: "47.7659,-116.7832" },
]

export default function HaydenLake() {
  return (
    <div className="px-4 py-6 pb-24 space-y-6">
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-crew-blue text-xs font-medium">
          <MapPin size={12} /> North Idaho · Hayden Lake
        </div>
        <h1 className="text-2xl font-bold text-navy-800 leading-tight">
          Boat Launch Help on Hayden Lake
        </h1>
        <p className="text-navy-700 text-sm leading-relaxed">
          RampCrew connects boaters on Hayden Lake with verified local helpers for launch guidance, dock support, and retrieval coordination at Honeysuckle Beach Ramp.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Link to="/concierge" className="bg-crew-blue text-white py-3 rounded-2xl text-sm font-semibold text-center">Book a Helper</Link>
        <Link to="/conditions" className="bg-white border border-navy-800/10 shadow-sm text-navy-800 py-3 rounded-2xl text-sm font-semibold text-center">Live Conditions</Link>
      </div>

      <div className="space-y-3">
        <h2 className="text-sm font-semibold text-navy-800">Boat Ramps We Serve</h2>
        {RAMPS.map(r => (
          <div key={r.name} className="bg-white border border-navy-800/10 shadow-sm border border-navy-800/15 rounded-2xl p-4 space-y-1">
            <div className="flex items-start justify-between gap-2">
              <div className="text-sm font-semibold text-navy-800">{r.name}</div>
              <a href={`https://maps.google.com/?q=${r.coords}`} target="_blank" rel="noopener noreferrer"
                className="text-crew-blue text-xs shrink-0 flex items-center gap-1">
                <MapPin size={11} /> Directions
              </a>
            </div>
            <p className="text-xs text-navy-700">{r.desc}</p>
          </div>
        ))}
      </div>

      <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-4 space-y-3">
        <h2 className="text-sm font-semibold text-navy-800">What RampCrew Helpers Do</h2>
        {['Lane guidance at the ramp', 'Step-by-step coaching for new boaters', 'Dock-side vessel hold while you park', 'Load coordination on retrieval', 'Ramp etiquette tips and local knowledge'].map(s => (
          <div key={s} className="flex items-start gap-2 text-xs text-navy-700">
            <span className="text-green-400 mt-0.5">✓</span> {s}
          </div>
        ))}
      </div>

      <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4 space-y-2">
        <div className="flex items-center gap-2 text-amber-400 font-semibold text-sm">⚠️ Safety Policy</div>
        <p className="text-xs text-navy-700 leading-relaxed">Helpers provide guidance and dock support only. <span className="text-navy-800 font-semibold">Boat owners remain responsible for operating their vehicle, trailer, and vessel.</span></p>
      </div>

      <div className="space-y-3">
        <h2 className="text-sm font-semibold text-navy-800">About Hayden Lake</h2>
        <p className="text-xs text-navy-700 leading-relaxed">
          Hayden Lake is a 3,500-acre gem just minutes north of Coeur d'Alene. Known for its crystal-clear water and quieter atmosphere compared to CDA, it's a favorite for families and wake sports. The Honeysuckle Beach ramp can get crowded on summer weekends — RampCrew helps you navigate it stress-free.
        </p>
      </div>

      <div className="flex items-start gap-3 bg-white border border-navy-800/10 shadow-sm rounded-2xl p-4">
        <Shield size={18} className="text-green-400 shrink-0 mt-0.5" />
        <div>
          <div className="text-sm font-semibold text-navy-800">All Helpers Verified</div>
          <p className="text-xs text-navy-700 mt-1">Every helper passes a government ID check, photo verification, and background review before listing on RampCrew.</p>
        </div>
      </div>

      <div className="space-y-2">
        <div className="text-xs text-navy-700/70 font-medium uppercase tracking-wider">More RampCrew Lakes</div>
        {[
          { to: '/launch/lake-coeur-dalene', label: "Lake Coeur d'Alene Boat Launch Help" },
          { to: '/launch/sandpoint', label: 'Sandpoint Boat Launch Help' },
          { to: '/launch/twin-lakes', label: 'Twin Lakes Boat Launch Help' },
        ].map(l => (
          <Link key={l.to} to={l.to} className="flex items-center justify-between bg-white border border-navy-800/10 shadow-sm rounded-xl px-4 py-3 text-sm text-navy-700 hover:text-navy-800">
            {l.label} <ChevronRight size={14} className="text-navy-700/60" />
          </Link>
        ))}
      </div>

      <Link to="/" className="block text-center text-xs text-crew-blue py-2">← Back to RampCrew Home</Link>
    </div>
  )
}
