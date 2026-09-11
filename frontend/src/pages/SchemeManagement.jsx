import React, { useEffect, useState } from 'react'
import { Loader2 } from 'lucide-react'
import { api } from '../services/api.js'

export default function SchemeManagement() {
  const [schemes, setSchemes] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.getDashboardSchemes().then(setSchemes).finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="flex justify-center py-24"><Loader2 className="w-8 h-8 animate-spin text-gov-navy" /></div>

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-slate-800 mb-1">Scheme Management</h1>
      <p className="text-slate-500 mb-6 text-sm">DEMO / SYNTHETIC DATA · {schemes.length} schemes configured</p>

      <div className="space-y-4">
        {schemes.map((s) => (
          <div key={s.scheme_id} className="card">
            <div className="flex flex-wrap justify-between items-start gap-3 mb-2">
              <div>
                <span className="badge bg-teal-50 text-gov-teal mb-1">{s.category}</span>
                <h3 className="font-semibold text-slate-800">{s.name}</h3>
              </div>
              <span className={`badge ${s.gap_rate >= 30 ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-700'}`}>
                Gap rate: {s.gap_rate}%
              </span>
            </div>
            <div className="grid grid-cols-3 gap-4 text-center my-3">
              <div><p className="font-bold text-gov-navy">{s.potentially_eligible.toLocaleString()}</p><p className="text-xs text-slate-500">Eligible</p></div>
              <div><p className="font-bold text-green-600">{s.receiving.toLocaleString()}</p><p className="text-xs text-slate-500">Receiving</p></div>
              <div><p className="font-bold text-amber-600">{s.gap.toLocaleString()}</p><p className="text-xs text-slate-500">Gap</p></div>
            </div>
            <p className="text-xs font-medium text-slate-600 mb-1">Required documents:</p>
            <p className="text-xs text-slate-500">{s.documents.join(', ')}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
