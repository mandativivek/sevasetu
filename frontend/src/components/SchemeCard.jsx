import React, { useState } from 'react'
import { ChevronDown, ChevronUp, FileCheck } from 'lucide-react'

export default function SchemeCard({ scheme, children }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="card">
      <div className="flex justify-between items-start gap-3">
        <div>
          <span className="badge bg-teal-50 text-gov-teal mb-1">{scheme.category}</span>
          <h3 className="font-semibold text-slate-800">{scheme.name}</h3>
          <p className="text-sm text-slate-500 mt-1">{scheme.description}</p>
        </div>
        <button onClick={() => setOpen(!open)} className="text-slate-400 hover:text-slate-600 shrink-0">
          {open ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </button>
      </div>

      {open && (
        <div className="mt-3 pt-3 border-t border-slate-100 space-y-2 text-sm">
          <p className="text-slate-700"><strong>Benefit:</strong> {scheme.benefit_description}</p>
          {scheme.matched_reasons?.length > 0 && (
            <div>
              <p className="font-medium text-slate-700 mb-1">Why you matched:</p>
              <ul className="space-y-1">
                {scheme.matched_reasons.map((r, i) => (
                  <li key={i} className="flex items-center gap-1.5 text-green-700">
                    <FileCheck className="w-3.5 h-3.5 shrink-0" /> {r}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {scheme.documents?.length > 0 && (
            <div>
              <p className="font-medium text-slate-700 mb-1">Required documents:</p>
              <ul className="list-disc list-inside text-slate-600">
                {scheme.documents.map((d, i) => <li key={i}>{d}</li>)}
              </ul>
            </div>
          )}
        </div>
      )}
      {children}
    </div>
  )
}
