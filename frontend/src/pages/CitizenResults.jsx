import React from 'react'
import { useLocation, Link, Navigate } from 'react-router-dom'
import SchemeCard from '../components/SchemeCard.jsx'
import GapCard from '../components/GapCard.jsx'
import ProgressFlow from '../components/ProgressFlow.jsx'

function StatCard({ label, value, accent }) {
  return (
    <div className="card text-center">
      <p className={`text-3xl font-bold ${accent}`}>{value}</p>
      <p className="text-sm text-slate-500 mt-1">{label}</p>
    </div>
  )
}

export default function CitizenResults() {
  const { state } = useLocation()
  if (!state) return <Navigate to="/eligibility" replace />

  const { eligibilityResult, gapResult } = state
  const eligibleCount = eligibilityResult.eligible_schemes.length
  const receivingCount = gapResult.receiving_count || 0
  const gapCount = gapResult.gaps?.length || 0
  const completion = eligibleCount > 0 ? Math.round(((receivingCount + gapCount) / eligibleCount) * 100) : 100

  const stages = Object.values(gapResult.progress_by_scheme || {})
  const order = ["ELIGIBILITY", "APPLICATION", "VERIFICATION", "BENEFIT"]
  const overallStage = stages.length
    ? order[Math.min(...stages.map((s) => order.indexOf(s)))]
    : "ELIGIBILITY"

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-slate-800 mb-1">Your Results</h1>
      <p className="text-slate-500 mb-6 text-sm">Based on the information you provided (demo data)</p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard label="Potentially Eligible" value={eligibleCount} accent="text-gov-navy" />
        <StatCard label="Currently Receiving" value={receivingCount} accent="text-green-600" />
        <StatCard label="Potential Benefit Gaps" value={gapCount} accent="text-amber-600" />
        <StatCard label="Profile Completion" value={`${completion}%`} accent="text-gov-teal" />
      </div>

      <div className="card mb-8">
        <h2 className="font-semibold text-slate-800 mb-3">Where You're Stuck</h2>
        <ProgressFlow currentStage={overallStage} />
      </div>

      {gapCount > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-slate-800 mb-3">Potential Benefit Gaps</h2>
          <div className="space-y-3">
            {gapResult.gaps.map((g) => <GapCard key={g.scheme_id} gap={g} />)}
          </div>
        </div>
      )}

      <div>
        <h2 className="text-lg font-semibold text-slate-800 mb-3">All Potentially Eligible Schemes</h2>
        <div className="space-y-3">
          {eligibilityResult.eligible_schemes.map((s) => <SchemeCard key={s.scheme_id} scheme={s} />)}
        </div>
      </div>

      {eligibleCount === 0 && (
        <div className="card text-center py-10">
          <p className="text-slate-600">No matching demo schemes were found for this profile.</p>
        </div>
      )}

      <div className="mt-8 flex gap-3">
        <Link to="/eligibility" className="btn-secondary">Check Another Profile</Link>
        <Link to="/officer" className="btn-primary">View Officer Dashboard</Link>
      </div>
    </div>
  )
}
