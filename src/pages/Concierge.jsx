import React, { useState } from 'react'
import { LifeBuoy, Clock, CheckCircle, Phone } from 'lucide-react'
import WaiverModal from '../components/WaiverModal'

const services = [
  { id: 1, name: 'Full Launch & Recovery',  price: '$75', duration: '~45 min', desc: 'We handle everything — backing trailer, launching, docking, and recovery.' },
  { id: 2, name: 'Launch Only',             price: '$45', duration: '~20 min', desc: 'Expert help getting your boat in the water safely.' },
  { id: 3, name: 'Recovery Only',           price: '$45', duration: '~20 min', desc: 'We load your boat back onto the trailer at end of day.' },
  { id: 4, name: 'Trailer Parking Assist',  price: '$25', duration: '~15 min', desc: 'Spotting and guidance for trailer parking at the ramp.' },
]

export default function Concierge() {
  const [selected, setSelected]       = useState(null)
  const [showWaiver, setShowWaiver]   = useState(false)
  const [booked, setBooked]           = useState(false)

  const service = services.find(s => s.id === selected)

  function handleBookClick() {
    if (selected) setShowWaiver(true)
  }

  function handleWaiverAgree() {
    setShowWaiver(false)
    setBooked(true)
  }

  // ── Confirmation screen ──────────────────────────────────────────────────
  if (booked) {
    return (
      <div className="px-4 py-12 flex flex-col items-center justify-center text-center space-y-4">
        <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center">
          <CheckCircle size={40} className="text-green-400" />
        </div>
        <h2 className="text-xl font-bold text-navy-800">Concierge Booked!</h2>
        <p className="text-navy-700 text-sm">Your crew will meet you at the ramp. You'll receive a confirmation shortly.</p>
        <p className="text-xs text-navy-700/70">Liability waiver accepted at {new Date().toLocaleString()}.</p>
        <button
          onClick={() => { setBooked(false); setSelected(null) }}
          className="mt-4 bg-crew-blue text-white px-6 py-3 rounded-2xl font-semibold"
        >
          Book Another
        </button>
      </div>
    )
  }

  // ── Service picker ───────────────────────────────────────────────────────
  return (
    <>
      {showWaiver && (
        <WaiverModal
          title="Before We Connect You with a Helper"
          onAgree={handleWaiverAgree}
          onCancel={() => setShowWaiver(false)}
        />
      )}

      <div className="px-4 py-6 space-y-6">
        <div>
          <h1 className="text-xl font-bold text-navy-800">Concierge Launch Help</h1>
          <p className="text-navy-700 text-sm mt-1">Professional launch crew — certified, insured, and local.</p>
        </div>

        <div className="bg-crew-blue/10 border border-crew-blue/30 rounded-2xl p-4 flex items-center gap-3">
          <Clock size={18} className="text-crew-blue shrink-0" />
          <p className="text-sm text-navy-700">Typical response time: <span className="text-navy-800 font-semibold">15–30 minutes</span></p>
        </div>

        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-navy-700 uppercase tracking-wider">Choose a Service</h2>
          {services.map((s) => (
            <button
              key={s.id}
              onClick={() => setSelected(s.id)}
              className={`w-full text-left rounded-2xl p-4 border transition-all ${
                selected === s.id ? 'bg-crew-blue/20 border-crew-blue' : 'bg-white border border-navy-800/10 shadow-sm border-transparent'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-semibold text-navy-800">{s.name}</span>
                <div className="text-right">
                  <div className="text-crew-blue font-bold">{s.price}</div>
                  <div className="text-xs text-navy-700/70">{s.duration}</div>
                </div>
              </div>
              <p className="text-navy-700 text-xs mt-1">{s.desc}</p>
            </button>
          ))}
        </div>

        <button
          onClick={handleBookClick}
          disabled={!selected}
          className={`w-full py-4 rounded-2xl font-bold text-navy-800 transition-all ${
            selected ? 'bg-crew-blue hover:bg-blue-600' : 'bg-white border border-navy-800/10 shadow-sm text-navy-700/70 cursor-not-allowed'
          }`}
        >
          {selected ? 'Book Concierge Now' : 'Select a Service'}
        </button>

        <div className="flex items-center justify-center gap-2 text-navy-700/70 text-sm">
          <Phone size={14} />
          <span>Or call us: <a href="tel:+12085550100" className="text-crew-blue">(208) 555-0100</a></span>
        </div>

        {/* Safety Rules */}
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4 space-y-2">
          <div className="flex items-center gap-2 text-amber-400 font-semibold text-sm">
            <span>⚠️</span> Safety Rules
          </div>
          <p className="text-xs text-navy-700 leading-relaxed">
            RampCrew helpers assist with guidance, preparation, dock support, and launch/load coordination.{' '}
            <span className="text-navy-800 font-semibold">Boat owners remain responsible for operating their vehicle, trailer, and vessel.</span>
          </p>
          <p className="text-xs text-amber-300/80 leading-relaxed">
            Helpers do not drive trucks, back trailers, or operate boats on behalf of customers.
          </p>
        </div>

        {/* Disclaimer */}
        <div className="px-1 pt-2 pb-4">
          <p className="text-xs text-navy-700/60 leading-relaxed text-center">
            A liability waiver must be agreed to before any helper is assigned. RampCrew availability may vary by ramp, date, weather, and helper schedule.
          </p>
        </div>
      </div>
    </>
  )
}
