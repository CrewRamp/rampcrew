import React from 'react'
import { Link } from 'react-router-dom'
import { MapPin, Shield, ChevronRight } from 'lucide-react'

const RAMPS = [
  { name: "Sandpoint City Boat Ramp", desc: "Downtown Sandpoint's main public ramp on Lake Pend Oreille. Large staging area, 3 lanes, close to the Long Bridge.", coords: "48.2766,-116.5535" },
  { name: "Hope Boat Basin", desc: "Quieter alternative east of Sandpoint near the town of Hope. Ideal for anglers and those exploring the eastern basin.", coords: "48.2396,-116.2973" },
]

export default function Sandpoint() {
  return (
    <div className="px-4 py-6 pb-24 space-y-6">
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-crew-blue text-xs font-medium">
          <MapPin size={12} /> North Idaho · Sandpoint / Lake Pend Oreille
        </div>
        <h1 className="text-2xl font-bold text-navy-800 leading-tight">
          Boat Launch Help in Sandpoint, Idaho
        </h1>
        <p className="text-navy-700 text-sm leading-relaxed">
          RampCrew provides verified launch helpers and live ramp conditions at Sandpoint City Ramp and Hope Boat Basin on Lake Pend Oreille — Idaho's deepest and largest lake.
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
        {['Ramp lane guidance and staging', 'Trailer backing coaching for beginners', 'Dock hold during peak launch windows', 'Retrieval and load-out coordination', 'Local intel on lake conditions and hazards'].map(s => (
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
        <h2 className="text-sm font-semibold text-navy-800">About Lake Pend Oreille & Sandpoint</h2>
        <p className="text-xs text-navy-700 leading-relaxed">
          Lake Pend Oreille is Idaho's largest lake at 148 square miles and over 1,100 feet deep. Sandpoint sits at its northern tip and is one of North Idaho's most popular summer destinations. The city ramp handles serious boat traffic during July and August — RampCrew helps you launch without the headache.
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
          { to: '/launch/priest-lake', label: 'Priest Lake Boat Launch Help' },
          { to: '/launch/spirit-lake', label: 'Spirit Lake Boat Launch Help' },
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
