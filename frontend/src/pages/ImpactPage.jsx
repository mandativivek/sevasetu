import React, { useEffect, useState } from 'react'
import { Loader2 } from 'lucide-react'
import { api } from '../services/api.js'

export default function ImpactPage() {
  const [summary, setSummary] = useState(null)
  const [gapReasons, setGapReasons] = useState(null)
  const [priorityAreas, setPriorityAreas] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([api.getDashboardSummary(), api.getGapReasons(), api.getPriorityAreas()])
      .then(([s, g, p]) => { setSummary(s); setGapReasons(g); setPriorityAreas(p) })
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="flex justify-center py-24"><Loader2 className="w-8 h-8 animate-spin text-gov-navy" /></div>

  const highPriorityCount = priorityAreas.filter((a) => a.high_priority).length
  const topReason = gapReasons.distribution[0]

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-slate-800 mb-1">Impact</h1>
      <span className="badge bg-amber-50 text-amber-700 mb-6 inline-block">DEMO / SYNTHETIC DATA</span>

      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="card text-center"><p className="text-3xl font-bold text-gov-navy">{summary.total_assessed.toLocaleString()}</p><p className="text-sm text-slate-500 mt-1">Citizens Assessed</p></div>
        <div className="card text-center"><p className="text-3xl font-bold text-amber-600">{summary.potential_gaps.toLocaleString()}</p><p className="text-sm text-slate-500 mt-1">Potential Gaps Detected</p></div>
        <div className="card text-center"><p className="text-3xl font-bold text-green-600">{Math.round(summary.potential_gaps * 0.18).toLocaleString()}</p><p className="text-sm text-slate-500 mt-1">Potential Gaps Resolved (simulated)</p></div>
        <div className="card text-center"><p className="text-3xl font-bold text-red-600">{highPriorityCount}</p><p className="text-sm text-slate-500 mt-1">High-Priority Areas</p></div>
      </div>

      <div className="card">
        <h2 className="font-semibold text-slate-800 mb-2">Most Common Barrier</h2>
        <p className="text-slate-600 text-sm">
          <strong>{topReason.reason}</strong> accounts for {topReason.percentage}% of detected benefit gaps across all districts in this demo dataset.
        </p>
      </div>
    </div>
  )
}
