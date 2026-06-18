import React, { useState, useRef } from 'react'
import { Shield, UserPlus, CheckCircle, Clock, ChevronRight, Upload, Camera, FileText, User, Phone, MapPin, DollarSign, Star, Calendar, AlertCircle } from 'lucide-react'

const BASE_API = 'https://superagent-9068a6ba.base44.app/functions'

function sanitize(val) {
  if (typeof val !== 'string') return val
  return val.replace(/[<>"'`]/g, '').trim()
}

const SKILLS = ['Launch & Recovery', 'Trailer Backing', 'Concierge Launch', 'Parking Assist', 'Boat Washing', 'Full Service', 'Dock Assistance', 'Equipment Rental']
const RATES  = ['$25', '$35', '$45', '$50', '$60', '$75', '$85', '$100']
const DAYS   = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const LAKES  = ["Lake Coeur d'Alene", 'Lake Pend Oreille', 'Hayden Lake']

function FileUploadBox({ label, hint, icon: Icon, value, onChange, accept }) {
  const ref = useRef()
  return (
    <div>
      <div className="text-xs text-gray-400 mb-1.5">{label}</div>
      <div
        onClick={() => ref.current.click()}
        className={`w-full border-2 border-dashed rounded-xl p-4 flex flex-col items-center gap-2 cursor-pointer transition-all ${value ? 'border-crew-teal/60 bg-crew-teal/5' : 'border-white/10 bg-white/3 hover:border-white/20'}`}
      >
        <input ref={ref} type="file" accept={accept} className="hidden" onChange={e => onChange(e.target.files[0])} />
        {value ? (
          <>
            <CheckCircle size={22} className="text-crew-teal" />
            <span className="text-xs text-crew-teal font-medium">{value.name}</span>
            <span className="text-xs text-gray-500">Tap to replace</span>
          </>
        ) : (
          <>
            <Icon size={22} className="text-gray-500" />
            <span className="text-xs text-white font-medium">{hint}</span>
            <span className="text-xs text-gray-500">Tap to upload</span>
          </>
        )}
      </div>
    </div>
  )
}

function Section({ title, children }) {
  return (
    <div className="space-y-3">
      <div className="text-xs font-semibold text-crew-teal uppercase tracking-wider border-b border-white/5 pb-1">{title}</div>
      {children}
    </div>
  )
}

function Field({ label, required, children }) {
  return (
    <div>
      <div className="text-xs text-gray-400 mb-1.5">{label}{required && <span className="text-red-400 ml-0.5">*</span>}</div>
      {children}
    </div>
  )
}

function TextInput({ value, onChange, placeholder, type = 'text' }) {
  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-gray-600 px-4 py-3 focus:outline-none focus:border-crew-teal/40"
    />
  )
}

export default function Marketplace() {
  const [showSignup, setShowSignup] = useState(false)
  const [submitted, setSubmitted]   = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [agreed, setAgreed]         = useState(false)

  const [form, setForm] = useState({
    name: '', phone: '', email: '', dob: '',
    address: '', city: '', state: 'ID', zip: '',
    location: '', skills: '', rate: '', bio: '',
    experience: '', availableDays: '', emergencyName: '', emergencyPhone: '',
  })
  const [idFile, setIdFile]      = useState(null)
  const [photoFile, setPhotoFile] = useState(null)

  function set(field) { return e => setForm(f => ({ ...f, [field]: e.target.value })) }

  function toggleSkill(skill) {
    setForm(f => {
      const arr = f.skills ? f.skills.split(',').filter(Boolean) : []
      const idx = arr.indexOf(skill)
      if (idx > -1) arr.splice(idx, 1)
      else arr.push(skill)
      return { ...f, skills: arr.join(',') }
    })
  }

  function toggleDay(day) {
    setForm(f => {
      const arr = f.availableDays ? f.availableDays.split(',').filter(Boolean) : []
      const idx = arr.indexOf(day)
      if (idx > -1) arr.splice(idx, 1)
      else arr.push(day)
      return { ...f, availableDays: arr.join(',') }
    })
  }

  const canSubmit = form.name && form.phone && form.email && form.location && form.address && form.city && form.zip && idFile && photoFile && agreed

  const [submitError, setSubmitError] = useState('')

  async function handleSubmit() {
    if (!canSubmit) return
    setSubmitting(true)
    setSubmitError('')
    try {
      const payload = {
        full_name:       sanitize(form.name),
        phone:           sanitize(form.phone),
        email:           sanitize(form.email),
        dob:             sanitize(form.dob),
        address:         sanitize(form.address),
        city:            sanitize(form.city),
        state:           sanitize(form.state),
        zip:             sanitize(form.zip),
        primary_lake:    sanitize(form.location),
        skills:          sanitize(form.skills),
        experience:      sanitize(form.experience),
        rate:            sanitize(form.rate),
        available_days:  sanitize(form.availableDays),
        bio:             sanitize(form.bio),
        emergency_name:  sanitize(form.emergencyName),
        emergency_phone: sanitize(form.emergencyPhone),
        id_file_name:    idFile ? idFile.name : '',
        photo_file_name: photoFile ? photoFile.name : '',
      }
      const res = await fetch(`${BASE_API}/submitHelperApplication`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Submission failed')
      setSubmitted(true)
    } catch (err) {
      setSubmitError(err.message || 'Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  // ── Submitted ──────────────────────────────────────────────
  if (submitted) {
    return (
      <div className="px-4 py-16 flex flex-col items-center text-center space-y-4">
        <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center">
          <CheckCircle size={40} className="text-green-400" />
        </div>
        <h2 className="text-xl font-bold text-white">Application Received!</h2>
        <p className="text-gray-400 text-sm max-w-xs">We'll review your info and reach out within 24 hours to complete ID and photo verification.</p>
        <div className="bg-white/5 rounded-2xl p-4 w-full text-left space-y-2 text-sm">
          <div className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-2">What happens next</div>
          <div className="flex items-start gap-2 text-gray-300"><CheckCircle size={14} className="text-crew-teal mt-0.5 shrink-0" /> ID documents reviewed (24–48 hrs)</div>
          <div className="flex items-start gap-2 text-gray-300"><CheckCircle size={14} className="text-crew-teal mt-0.5 shrink-0" /> Background check initiated</div>
          <div className="flex items-start gap-2 text-gray-300"><CheckCircle size={14} className="text-crew-teal mt-0.5 shrink-0" /> Profile photo verified</div>
          <div className="flex items-start gap-2 text-gray-300"><CheckCircle size={14} className="text-crew-teal mt-0.5 shrink-0" /> Listed on marketplace once approved</div>
        </div>
        <button
          onClick={() => { setSubmitted(false); setShowSignup(false); setForm({ name:'',phone:'',email:'',dob:'',address:'',city:'',state:'ID',zip:'',location:'',skills:'',rate:'',bio:'',experience:'',availableDays:'',emergencyName:'',emergencyPhone:'' }); setIdFile(null); setPhotoFile(null); setAgreed(false) }}
          className="mt-2 bg-white/10 text-white px-6 py-3 rounded-2xl text-sm font-semibold"
        >
          Back to Marketplace
        </button>
      </div>
    )
  }

  // ── Application Form ──────────────────────────────────────
  if (showSignup) {
    const selectedSkills = form.skills ? form.skills.split(',').filter(Boolean) : []
    const selectedDays   = form.availableDays ? form.availableDays.split(',').filter(Boolean) : []

    return (
      <div className="px-4 py-6 space-y-6 pb-10">
        {/* Header */}
        <div className="flex items-center gap-3">
          <button onClick={() => setShowSignup(false)} className="p-2 bg-white/5 rounded-xl">
            <ChevronRight size={16} className="text-gray-400 rotate-180" />
          </button>
          <div>
            <h1 className="text-lg font-bold text-white">Become a Helper</h1>
            <p className="text-xs text-gray-400">Apply to list on the RampCrew marketplace</p>
          </div>
        </div>

        {/* Verification badge */}
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-4 text-xs text-gray-300 space-y-1">
          <div className="font-semibold text-white mb-2 flex items-center gap-1.5"><Shield size={13} className="text-blue-400" /> Verification required</div>
          <div className="flex items-center gap-2">✓ Government ID check</div>
          <div className="flex items-center gap-2">✓ Profile photo verification</div>
          <div className="flex items-center gap-2">✓ Background review</div>
          <div className="text-gray-500 pt-1">We'll contact you after submission to complete verification.</div>
        </div>

        {/* ── Personal Info ── */}
        <Section title="Personal Information">
          <Field label="Full Legal Name" required>
            <TextInput value={form.name} onChange={set('name')} placeholder="First and last name" />
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Date of Birth" required>
              <TextInput type="date" value={form.dob} onChange={set('dob')} placeholder="" />
            </Field>
            <Field label="Phone Number" required>
              <TextInput type="tel" value={form.phone} onChange={set('phone')} placeholder="(208) 555-0100" />
            </Field>
          </div>

          <Field label="Email Address" required>
            <TextInput type="email" value={form.email} onChange={set('email')} placeholder="you@email.com" />
          </Field>
        </Section>

        {/* ── Address ── */}
        <Section title="Address">
          <Field label="Street Address" required>
            <TextInput value={form.address} onChange={set('address')} placeholder="123 Main St, Apt 4B" />
          </Field>
          <div className="grid grid-cols-5 gap-2">
            <div className="col-span-3">
              <Field label="City" required>
                <TextInput value={form.city} onChange={set('city')} placeholder="Coeur d'Alene" />
              </Field>
            </div>
            <div className="col-span-1">
              <Field label="State">
                <TextInput value={form.state} onChange={set('state')} placeholder="ID" />
              </Field>
            </div>
            <div className="col-span-1">
              <Field label="ZIP" required>
                <TextInput value={form.zip} onChange={set('zip')} placeholder="83814" />
              </Field>
            </div>
          </div>
        </Section>

        {/* ── Service Area ── */}
        <Section title="Service Area">
          <Field label="Primary Lake / Location" required>
            <div className="grid grid-cols-3 gap-2">
              {LAKES.map(loc => (
                <button key={loc} onClick={() => setForm(f => ({ ...f, location: loc }))}
                  className={`py-2.5 rounded-xl text-xs font-medium border transition-all text-center ${form.location === loc ? 'border-crew-teal bg-crew-teal/10 text-crew-teal' : 'border-white/10 text-gray-400'}`}>
                  {loc.replace('Lake ', '').replace("Coeur d'Alene", 'CDA')}
                </button>
              ))}
            </div>
          </Field>
        </Section>

        {/* ── Skills & Rate ── */}
        <Section title="Skills & Services">
          <Field label="Services You Offer">
            <div className="grid grid-cols-2 gap-2">
              {SKILLS.map(skill => (
                <button key={skill} onClick={() => toggleSkill(skill)}
                  className={`py-2 rounded-xl text-xs font-medium border transition-all ${selectedSkills.includes(skill) ? 'border-crew-teal bg-crew-teal/10 text-crew-teal' : 'border-white/10 text-gray-400'}`}>
                  {skill}
                </button>
              ))}
            </div>
          </Field>

          <Field label="Years of Boating Experience">
            <div className="grid grid-cols-4 gap-2">
              {['1–2 yrs', '3–5 yrs', '6–10 yrs', '10+ yrs'].map(exp => (
                <button key={exp} onClick={() => setForm(f => ({ ...f, experience: exp }))}
                  className={`py-2 rounded-xl text-xs font-medium border transition-all ${form.experience === exp ? 'border-crew-teal bg-crew-teal/10 text-crew-teal' : 'border-white/10 text-gray-400'}`}>
                  {exp}
                </button>
              ))}
            </div>
          </Field>

          <Field label="Hourly Rate">
            <div className="grid grid-cols-4 gap-2">
              {RATES.map(r => (
                <button key={r} onClick={() => setForm(f => ({ ...f, rate: r }))}
                  className={`py-2 rounded-xl text-xs font-medium border transition-all ${form.rate === r ? 'border-crew-teal bg-crew-teal/10 text-crew-teal' : 'border-white/10 text-gray-400'}`}>
                  {r}/hr
                </button>
              ))}
            </div>
          </Field>
        </Section>

        {/* ── Availability ── */}
        <Section title="Availability">
          <Field label="Days Available">
            <div className="grid grid-cols-7 gap-1.5">
              {DAYS.map(day => (
                <button key={day} onClick={() => toggleDay(day)}
                  className={`py-2 rounded-xl text-xs font-medium border transition-all ${selectedDays.includes(day) ? 'border-crew-teal bg-crew-teal/10 text-crew-teal' : 'border-white/10 text-gray-400'}`}>
                  {day}
                </button>
              ))}
            </div>
          </Field>
        </Section>

        {/* ── ID & Photo Upload ── */}
        <Section title="Identity Verification">
          <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-3 flex items-start gap-2 text-xs text-yellow-200">
            <AlertCircle size={13} className="shrink-0 mt-0.5" />
            <span>Your documents are encrypted and used only for identity verification. They are never shared publicly.</span>
          </div>

          <FileUploadBox
            label="Government-Issued ID *"
            hint="Driver's license, passport, or state ID"
            icon={FileText}
            value={idFile}
            onChange={setIdFile}
            accept="image/*,.pdf"
          />

          <FileUploadBox
            label="Profile Photo *"
            hint="Clear photo of your face (no sunglasses)"
            icon={Camera}
            value={photoFile}
            onChange={setPhotoFile}
            accept="image/*"
          />
        </Section>

        {/* ── Emergency Contact ── */}
        <Section title="Emergency Contact">
          <div className="grid grid-cols-2 gap-3">
            <Field label="Contact Name">
              <TextInput value={form.emergencyName} onChange={set('emergencyName')} placeholder="Full name" />
            </Field>
            <Field label="Contact Phone">
              <TextInput type="tel" value={form.emergencyPhone} onChange={set('emergencyPhone')} placeholder="(208) 555-0100" />
            </Field>
          </div>
        </Section>

        {/* ── Bio ── */}
        <Section title="About You">
          <Field label="Brief Bio (optional)">
            <textarea value={form.bio} onChange={set('bio')} placeholder="Tell boaters about your experience, how long you've been on the water, any certifications..."
              className="w-full bg-white/5 border border-white/10 rounded-xl text-xs text-white placeholder-gray-600 p-3 resize-none h-24 focus:outline-none focus:border-crew-teal/40" />
          </Field>
        </Section>

        {/* ── Agreement ── */}
        <div className="bg-white/3 border border-white/10 rounded-xl p-4 space-y-3">
          <div className="text-xs text-gray-400 leading-relaxed">
            By submitting this application you agree to RampCrew's <span className="text-crew-teal underline">Helper Terms of Service</span>, consent to a background check, and confirm that all information provided is accurate and truthful.
          </div>
          <button onClick={() => setAgreed(a => !a)} className="flex items-center gap-3 w-full">
            <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all shrink-0 ${agreed ? 'border-crew-teal bg-crew-teal' : 'border-white/20'}`}>
              {agreed && <CheckCircle size={12} className="text-white" />}
            </div>
            <span className="text-xs text-gray-300 text-left">I agree to the terms and confirm all information is accurate</span>
          </button>
        </div>

        {/* Missing fields warning */}
        {!canSubmit && (form.name || form.phone) && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 text-xs text-red-300 flex items-start gap-2">
            <AlertCircle size={13} className="shrink-0 mt-0.5" />
            <span>Required: {[!form.name && 'Full name', !form.phone && 'Phone', !form.email && 'Email', !form.address && 'Address', !form.city && 'City', !form.zip && 'ZIP', !form.location && 'Primary lake', !idFile && 'Government ID', !photoFile && 'Profile photo', !agreed && 'Agreement'].filter(Boolean).join(', ')}</span>
          </div>
        )}

        {submitError && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 text-xs text-red-300 flex items-start gap-2">
            <AlertCircle size={13} className="shrink-0 mt-0.5" />
            <span>{submitError}</span>
          </div>
        )}

        <button onClick={handleSubmit} disabled={!canSubmit || submitting}
          className="w-full py-4 rounded-2xl font-semibold text-sm bg-crew-blue text-white disabled:opacity-40 transition-all">
          {submitting ? 'Submitting…' : 'Submit Application'}
        </button>
      </div>
    )
  }

  // ── Marketplace Landing ───────────────────────────────────
  return (
    <div className="px-4 py-6 space-y-5">
      <div>
        <h1 className="text-xl font-bold text-white">Helper Marketplace</h1>
        <p className="text-gray-400 text-sm mt-1">Verified local helpers — ID checked, photo verified.</p>
      </div>

      <div className="bg-green-500/10 border border-green-500/30 rounded-2xl p-3 flex items-center gap-3">
        <Shield size={18} className="text-green-400 shrink-0" />
        <p className="text-xs text-gray-300">All helpers are <span className="text-white font-semibold">ID verified</span> and <span className="text-white font-semibold">background checked</span> by RampCrew before listing.</p>
      </div>

      {/* Empty state */}
      <div className="flex flex-col items-center text-center py-10 space-y-4">
        <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center">
          <UserPlus size={28} className="text-gray-500" />
        </div>
        <div>
          <div className="text-white font-semibold">No helpers listed yet</div>
          <div className="text-gray-500 text-xs mt-1 max-w-xs">We're verifying our first batch of helpers for North Idaho. Check back soon — or be the first to apply.</div>
        </div>
      </div>

      {/* CTA */}
      <div className="bg-gradient-to-br from-blue-900/60 to-teal-900/40 border border-crew-teal/20 rounded-2xl p-5 space-y-3">
        <div className="font-bold text-white">Are you a local boater?</div>
        <p className="text-xs text-gray-400">Earn money helping others launch. Set your own hours and rate. RampCrew handles booking and payment.</p>
        <div className="grid grid-cols-3 gap-2 text-center text-xs text-gray-400">
          <div className="bg-white/5 rounded-xl p-2"><div className="text-white font-semibold">You set</div>your rate</div>
          <div className="bg-white/5 rounded-xl p-2"><div className="text-white font-semibold">Flexible</div>schedule</div>
          <div className="bg-white/5 rounded-xl p-2"><div className="text-white font-semibold">Fast</div>payouts</div>
        </div>
        <button onClick={() => setShowSignup(true)}
          className="w-full bg-crew-blue text-white py-3.5 rounded-2xl font-semibold text-sm flex items-center justify-center gap-2">
          <UserPlus size={16} /> Apply to Be a Helper
        </button>
      </div>

      <div className="flex items-center gap-2 text-xs text-gray-600">
        <Clock size={12} />
        <span>Helpers typically go live within 24–48 hrs of applying</span>
      </div>
    </div>
  )
}
