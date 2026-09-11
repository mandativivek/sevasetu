import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, CartesianGrid } from 'recharts'
import { AlertTriangle, Loader2 } from 'lucide-react'
import { api } from '../services/api.js'

const COLORS = ['#123e64ff', '#0E7C7B', '#E98A15', '#C0392B', '#7F8C8D']

function StatCard({ label, value }) {
  return (
    <div className="card text-center">
      <p className="text-2xl font-bold text-gov-navy">{value?.toLocaleString?.() ?? value}</p>
      <p className="text-sm text-slate-500 mt-1">{label}</p>
    </div>
  )
}

export default function OfficerDashboard() {
  const [summary, setSummary] = useState(null)
  const [gapReasons, setGapReasons] = useState(null)
  const [districts, setDistricts] = useState([])
  const [priorityAreas, setPriorityAreas] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      api.getDashboardSummary(),
      api.getGapReasons(),
      api.getDistricts(),
      api.getPriorityAreas(),
    ]).then(([s, g, d, p]) => {
      setSummary(s); setGapReasons(g); setDistricts(d); setPriorityAreas(p)
    }).finally(() => setLoading(false))
  }, [])

  if (loading) {
    return <div className="flex justify-center py-24"><Loader2 className="w-8 h-8 animate-spin text-gov-navy" /></div>
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="flex justify-between items-center mb-1">
        <h1 className="text-2xl font-bold text-slate-800">Officer Dashboard</h1>
        <Link to="/officer/schemes" className="text-sm text-gov-teal font-medium hover:underline">Manage Schemes →</Link>
      </div>
      <p className="text-slate-500 mb-6 text-sm">DEMO / SYNTHETIC DATA · Aggregated & anonymized only — no individual citizen data</p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total Assessed" value={summary.total_assessed} />
        <StatCard label="Potentially Eligible" value={summary.potentially_eligible} />
        <StatCard label="Receiving Benefits" value={summary.receiving_benefits} />
        <StatCard label="Potential Gaps" value={summary.potential_gaps} />
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div className="card">
          <h2 className="font-semibold text-slate-800 mb-4">Benefit Gap by District</h2>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={districts}>
              <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
              <XAxis dataKey="district" tick={{ fontSize: 11 }} angle={-30} textAnchor="end" height={60} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="gap" fill="#E98A15" radius={[4, 4, 0, 0]} name="Gap" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <h2 className="font-semibold text-slate-800 mb-4">Gap Reasons</h2>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={gapReasons.distribution} dataKey="percentage" nameKey="reason" cx="50%" cy="50%" outerRadius={90} label={(e) => `${e.percentage}%`}>
                {gapReasons.distribution.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-3 bg-amber-50 border border-amber-200 rounded-lg p-3 text-sm text-amber-800 flex gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
            <span><strong>Recommended intervention:</strong> {gapReasons.recommended_intervention}</span>
          </div>
        </div>
      </div>

      <div className="card mb-8">
        <h2 className="font-semibold text-slate-800 mb-4">High Priority Areas</h2>
        <p className="text-xs text-slate-500 mb-4">
          Priority Area = districts where Benefit Gap Rate (eligible-but-not-receiving ÷ potentially eligible) is 30% or higher.
          This is a rule-based flag, not a prediction.
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-slate-500 border-b border-slate-200">
                <th className="py-2 pr-4">District</th>
                <th className="py-2 pr-4">Eligible</th>
                <th className="py-2 pr-4">Receiving</th>
                <th className="py-2 pr-4">Gap</th>
                <th className="py-2 pr-4">Gap Rate</th>
                <th className="py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {priorityAreas.map((a) => (
                <tr key={a.district} className="border-b border-slate-100">
                  <td className="py-2 pr-4 font-medium text-slate-700">{a.district}</td>
                  <td className="py-2 pr-4">{a.eligible.toLocaleString()}</td>
                  <td className="py-2 pr-4">{a.receiving.toLocaleString()}</td>
                  <td className="py-2 pr-4">{a.gap.toLocaleString()}</td>
                  <td className="py-2 pr-4">{a.gap_rate}%</td>
                  <td className="py-2">
                    {a.high_priority
                      ? <span className="badge bg-red-50 text-red-600">HIGH PRIORITY</span>
                      : <span className="badge bg-green-50 text-green-700">Normal</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
