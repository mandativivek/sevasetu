import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Sparkles, Loader2 } from 'lucide-react'
import { api } from '../services/api.js'
import { demoProfiles } from '../data/demoProfiles.js'
import { useToast } from '../components/Toast.jsx'

const EMPTY_PROFILE = {
  age: '', state: 'Telangana', district: '', occupation: '', student: false,
  annual_income: '', family_size: 1, farmer: false, employment_status: 'employed',
  disability: false, senior_citizen: false, woman_headed_household: false, existing_benefits: [],
}

const STATUS_OPTIONS = [
  { value: 'yes', label: 'Yes, receiving it' },
  { value: 'no', label: 'No' },
  { value: 'submitted', label: 'Application submitted' },
  { value: 'rejected', label: 'Application rejected' },
  { value: 'verification_pending', label: 'Verification pending' },
  { value: 'dont_know', label: "Don't know" },
]

export default function CitizenEligibility() {
  const [step, setStep] = useState(1) // 1: form, 2: benefit status
  const [profile, setProfile] = useState(EMPTY_PROFILE)
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [eligibilityResult, setEligibilityResult] = useState(null)
  const [statuses, setStatuses] = useState({})
  const navigate = useNavigate()
  const { showToast } = useToast()

  const update = (field, value) => setProfile((p) => ({ ...p, [field]: value }))

  const fillDemoProfile = (p) => {
    setProfile(p)
    setErrors({})
    showToast('Demo profile loaded', 'success')
  }

  const validate = () => {
    const e = {}
    if (!profile.age || profile.age < 0 || profile.age > 120) e.age = 'Enter a valid age'
    if (!profile.district) e.district = 'District is required'
    if (!profile.occupation) e.occupation = 'Occupation is required'
    if (profile.annual_income === '' || profile.annual_income < 0) e.annual_income = 'Enter a valid income'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleCheckEligibility = async () => {
    if (!validate()) return
    setLoading(true)
    try {
      const payload = { ...profile, age: Number(profile.age), annual_income: Number(profile.annual_income), family_size: Number(profile.family_size) }
      const result = await api.checkEligibility(payload)
      setEligibilityResult(result)
      setProfile(payload)
      if (result.eligible_schemes.length === 0) {
        navigate('/results', { state: { profile: payload, eligibilityResult: result, gapResult: { gaps: [], receiving_count: 0, progress_by_scheme: {} } } })
        return
      }
      setStep(2)
    } catch (err) {
      showToast('Could not reach the backend. Is it running on port 8000?', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmitStatuses = async () => {
    setLoading(true)
    try {
      const statusList = eligibilityResult.eligible_schemes.map((s) => ({
        scheme_id: s.scheme_id,
        status: statuses[s.scheme_id] || 'dont_know',
      }))
      const gapResult = await api.submitBenefitStatus({ profile, statuses: statusList })
      navigate('/results', { state: { profile, eligibilityResult, gapResult } })
    } catch (err) {
      showToast('Something went wrong submitting your answers.', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-slate-800 mb-1">Check My Eligibility</h1>
      <p className="text-slate-500 mb-6 text-sm">Step {step} of 2 · All fields are for demo purposes only</p>

      {step === 1 && (
        <div className="card">
          <div className="flex flex-wrap gap-2 mb-6">
            {demoProfiles.map((d) => (
              <button key={d.label} onClick={() => fillDemoProfile(d.profile)}
                className="text-xs flex items-center gap-1 bg-teal-50 text-gov-teal px-3 py-1.5 rounded-full hover:bg-teal-100">
                <Sparkles className="w-3 h-3" /> {d.label}
              </button>
            ))}
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="label-text">Age *</label>
              <input type="number" className="input-field" value={profile.age} onChange={(e) => update('age', e.target.value)} />
              {errors.age && <p className="text-red-500 text-xs mt-1">{errors.age}</p>}
            </div>
            <div>
              <label className="label-text">State</label>
              <input className="input-field" value={profile.state} onChange={(e) => update('state', e.target.value)} />
            </div>
            <div>
              <label className="label-text">District *</label>
              <input className="input-field" value={profile.district} onChange={(e) => update('district', e.target.value)} />
              {errors.district && <p className="text-red-500 text-xs mt-1">{errors.district}</p>}
            </div>
            <div>
              <label className="label-text">Occupation *</label>
              <input className="input-field" value={profile.occupation} onChange={(e) => update('occupation', e.target.value)} />
              {errors.occupation && <p className="text-red-500 text-xs mt-1">{errors.occupation}</p>}
            </div>
            <div>
              <label className="label-text">Annual Household Income (₹) *</label>
              <input type="number" className="input-field" value={profile.annual_income} onChange={(e) => update('annual_income', e.target.value)} />
              {errors.annual_income && <p className="text-red-500 text-xs mt-1">{errors.annual_income}</p>}
            </div>
            <div>
              <label className="label-text">Family Size</label>
              <input type="number" min="1" className="input-field" value={profile.family_size} onChange={(e) => update('family_size', e.target.value)} />
            </div>
            <div>
              <label className="label-text">Employment Status</label>
              <select className="input-field" value={profile.employment_status} onChange={(e) => update('employment_status', e.target.value)}>
                <option value="employed">Employed</option>
                <option value="unemployed">Unemployed</option>
                <option value="self_employed">Self-employed</option>
                <option value="retired">Retired</option>
              </select>
            </div>
            <div className="flex flex-col justify-end gap-2 pt-1">
              {[
                ['student', 'Student'],
                ['farmer', 'Farmer'],
                ['disability', 'Person with disability (optional)'],
                ['senior_citizen', 'Senior citizen'],
                ['woman_headed_household', 'Woman-headed household (optional)'],
              ].map(([key, lbl]) => (
                <label key={key} className="flex items-center gap-2 text-sm text-slate-700">
                  <input type="checkbox" checked={profile[key]} onChange={(e) => update(key, e.target.checked)} />
                  {lbl}
                </label>
              ))}
            </div>
          </div>

          <button onClick={handleCheckEligibility} disabled={loading} className="btn-primary mt-6 w-full md:w-auto flex items-center justify-center gap-2">
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            Check Eligibility
          </button>
        </div>
      )}

      {step === 2 && eligibilityResult && (
        <div className="space-y-4">
          <div className="card bg-teal-50 border-teal-200">
            <p className="text-sm text-gov-teal font-medium">
              You are potentially eligible for {eligibilityResult.eligible_schemes.length} scheme(s). For each, tell us your current status.
            </p>
          </div>
          {eligibilityResult.eligible_schemes.map((s) => (
            <div key={s.scheme_id} className="card">
              <h3 className="font-semibold text-slate-800 mb-2">{s.name}</h3>
              <p className="text-sm text-slate-500 mb-3">Are you currently receiving this benefit?</p>
              <div className="flex flex-wrap gap-2">
                {STATUS_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setStatuses((st) => ({ ...st, [s.scheme_id]: opt.value }))}
                    className={`text-xs px-3 py-1.5 rounded-full border ${statuses[s.scheme_id] === opt.value
                      ? 'bg-gov-navy text-white border-gov-navy'
                      : 'bg-white text-slate-600 border-slate-300 hover:border-gov-navy'}`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          ))}
          <div className="flex gap-3">
            <button onClick={() => setStep(1)} className="btn-secondary">Back</button>
            <button onClick={handleSubmitStatuses} disabled={loading} className="btn-primary flex items-center gap-2">
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              See My Results
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
