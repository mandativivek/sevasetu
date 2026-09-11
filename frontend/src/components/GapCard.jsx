import React from 'react'
import { AlertTriangle, ArrowRight } from 'lucide-react'

export default function GapCard({ gap }) {
  return (
    <div className="card border-l-4 border-l-amber-500">
      <div className="flex items-start gap-2">
        <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
        <div className="flex-1">
          <h4 className="font-semibold text-slate-800">{gap.scheme_name}</h4>
          <p className="text-sm text-slate-500 mt-0.5">
            Current status: <span className="font-medium text-slate-700">{gap.current_status.replace('_', ' ')}</span>
          </p>
          <p className="text-sm mt-2">
            <span className="badge bg-amber-50 text-amber-700">Possible reason: {gap.gap_reason_label}</span>
          </p>
          <p className="text-sm text-slate-700 mt-2 flex items-center gap-1.5">
            <ArrowRight className="w-4 h-4 text-gov-teal shrink-0" />
            <strong>Recommended:</strong> {gap.recommended_next_step}
          </p>
        </div>
      </div>
    </div>
  )
}
