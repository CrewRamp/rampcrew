import React from 'react'
import { Link } from 'react-router-dom'
import { CalendarClock, Users, Bell } from 'lucide-react'

// Booking is intentionally disabled until verified helpers are active in the
// North Idaho service area. This page shows a "coming soon" state so no slot
// can be confirmed when there is no crew to fulfill it.
export default function BookRamp() {
  return (
    <div className="min-h-screen bg-[#f0f4f8] pb-24">
      {/* Header */}
      <div className="px-5 pt-6 pb-4">
        <h1 className="text-2xl font-bold text-navy-900">Book a Ramp Slot</h1>
        <p className="text-navy-700/70 text-sm mt-1">
          Reserve a launch window at your favorite North Idaho ramp.
        </p>
      </div>

      {/* Coming Soon card */}
      <div className="px-5">
        <div className="bg-white rounded-2xl border border-navy-900/10 shadow-sm p-8 text-center">
          <div className="w-16 h-16 rounded-full bg-crew-blue/10 flex items-center justify-center mx-auto mb-4">
            <CalendarClock className="text-crew-blue" size={32} />
          </div>

          <h2 className="text-xl font-bold text-navy-900">Booking Coming Soon</h2>

          <p className="text-navy-700/80 text-sm mt-3 leading-relaxed">
            We're onboarding verified helpers across Lake Coeur d'Alene, Lake
            Pend Oreille, and Hayden Lake right now. Ramp slot booking will open
            as soon as crew is available in your area.
          </p>

          <div className="mt-6 space-y-3 text-left">
            <div className="flex items-start gap-3 bg-[#f0f4f8] rounded-xl p-3">
              <Users className="text-crew-blue mt-0.5 flex-shrink-0" size={18} />
              <p className="text-sm text-navy-800">
                <span className="font-semibold">Are you experienced at the ramp?</span>{' '}
                Become a verified helper and be first to take bookings.
              </p>
            </div>

            <div className="flex items-start gap-3 bg-[#f0f4f8] rounded-xl p-3">
              <Bell className="text-crew-blue mt-0.5 flex-shrink-0" size={18} />
              <p className="text-sm text-navy-800">
                <span className="font-semibold">Want to be notified?</span>{' '}
                Send us a message and we'll let you know the moment booking goes live.
              </p>
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-3">
            <Link
              to="/helpers"
              className="w-full bg-crew-blue text-white font-semibold py-3 rounded-xl hover:bg-crew-blue/90 transition-colors"
            >
              Become a Helper
            </Link>
            <Link
              to="/contact"
              className="w-full bg-white border border-navy-900/15 text-navy-900 font-semibold py-3 rounded-xl hover:bg-[#f0f4f8] transition-colors"
            >
              Notify Me When Live
            </Link>
          </div>
        </div>

        {/* Meanwhile card */}
        <div className="mt-4 bg-white rounded-2xl border border-navy-900/10 shadow-sm p-5">
          <p className="text-sm text-navy-700/80">
            In the meantime, you can check{' '}
            <Link to="/conditions" className="text-crew-blue font-semibold">
              live ramp conditions
            </Link>{' '}
            and{' '}
            <Link to="/map" className="text-crew-blue font-semibold">
              find ramps near you
            </Link>
            .
          </p>
        </div>

        <p className="text-xs text-navy-700/50 text-center mt-4 px-4">
          Ramp access hours follow Idaho State Code IDAPA 26.01.20: 7:00 AM – 10:00 PM Pacific Time.
        </p>
      </div>
    </div>
  )
}
