import React from 'react'
import { CheckCircle2, Circle } from 'lucide-react'

const STAGES = ["ELIGIBILITY", "APPLICATION", "VERIFICATION", "BENEFIT"]

export default function ProgressFlow({ currentStage }) {
  const currentIndex = STAGES.indexOf(currentStage)
  return (
    <div className="flex items-center w-full overflow-x-auto py-2">
      {STAGES.map((stage, i) => (
        <React.Fragment key={stage}>
          <div className="flex flex-col items-center min-w-[90px]">
            {i <= currentIndex ? (
              <CheckCircle2 className={`w-6 h-6 ${i === currentIndex ? 'text-gov-saffron' : 'text-gov-teal'}`} />
            ) : (
              <Circle className="w-6 h-6 text-slate-300" />
            )}
            <span className={`text-xs mt-1 font-medium text-center ${i === currentIndex ? 'text-gov-saffron' : 'text-slate-500'}`}>
              {stage}
            </span>
          </div>
          {i < STAGES.length - 1 && (
            <div className={`flex-1 h-0.5 mx-1 ${i < currentIndex ? 'bg-gov-teal' : 'bg-slate-200'}`} />
          )}
        </React.Fragment>
      ))}
    </div>
  )
}
