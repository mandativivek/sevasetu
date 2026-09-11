import React from 'react'
import { Link } from 'react-router-dom'
import { Search, GitBranch, ShieldCheck, TrendingUp, Lock, Users, BarChart3 } from 'lucide-react'
import { useLanguage } from '../utils/LanguageContext.jsx'

export default function Landing() {
  const { t } = useLanguage()

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-gov-navy to-blue-900 text-white">
        <div className="max-w-6xl mx-auto px-4 py-20 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{t('appName')}</h1>
          <p className="text-lg text-blue-100 max-w-2xl mx-auto mb-8">{t('tagline')}</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/eligibility" className="btn-primary bg-gov-saffron hover:bg-orange-600">
              {t('checkEligibility')}
            </Link>
            <Link to="/officer" className="bg-white text-gov-navy px-5 py-2.5 rounded-lg font-medium hover:bg-slate-100">
              {t('officerDashboard')}
            </Link>
          </div>
          <p className="text-xs text-blue-200 mt-6"> Uses synthetic/demo data only</p>
        </div>
      </section>

      {/* Problem */}
      <section className="max-w-6xl mx-auto px-4 py-14">
        <h2 className="text-2xl font-bold text-slate-800 mb-3">The Problem</h2>
        <p className="text-slate-600 max-w-3xl">
          Millions of citizens who are eligible for welfare schemes never receive them —
          not because the schemes don't exist, but because of missing documents, incomplete
          applications, low awareness, or stuck verification. Most portals only help citizens
          search for schemes; almost none identify <em>why</em> an eligible citizen isn't
          receiving a benefit, or help officials target the exact intervention needed.
        </p>
      </section>

      {/* How it works */}
      <section className="bg-white py-14 border-y border-slate-200">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-slate-800 mb-8 text-center">How SevaSetu Works</h2>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { icon: Search, title: "Check Eligibility", desc: "Citizen fills a short profile; a transparent rules engine finds potentially eligible schemes." },
              { icon: GitBranch, title: "Detect the Gap", desc: "For each eligible scheme, we ask if the benefit is being received — and pinpoint why not." },
              { icon: TrendingUp, title: "Recommend Action", desc: "Citizen gets a clear next step; officials get aggregated, anonymized gap data." },
              { icon: BarChart3, title: "Target Intervention", desc: "Officer dashboard highlights high-priority districts and top barriers." },
            ].map((s, i) => (
              <div key={i} className="text-center">
                <div className="w-12 h-12 rounded-full bg-teal-50 flex items-center justify-center mx-auto mb-3">
                  <s.icon className="w-6 h-6 text-gov-teal" />
                </div>
                <h3 className="font-semibold text-slate-800 mb-1">{s.title}</h3>
                <p className="text-sm text-slate-500">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Key features */}
      <section className="max-w-6xl mx-auto px-4 py-14">
        <h2 className="text-2xl font-bold text-slate-800 mb-8 text-center">Key Features</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { icon: ShieldCheck, title: "Explainable Rules Engine", desc: "Every eligibility match shows exactly which rule it satisfied — no black box." },
            { icon: Users, title: "Citizen-First Workflow", desc: "Simple form, demo profiles, and a clear results dashboard in one flow." },
            { icon: BarChart3, title: "Priority Area Detection", desc: "Automatically flags districts with high benefit gap rates for officials." },
          ].map((f, i) => (
            <div key={i} className="card">
              <f.icon className="w-6 h-6 text-gov-navy mb-2" />
              <h3 className="font-semibold text-slate-800 mb-1">{f.title}</h3>
              <p className="text-sm text-slate-500">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Impact */}
      <section className="bg-gov-navy text-white py-14">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            ["10,000", "Citizens Assessed "],
            ["6,800", "Potentially Eligible"],
            ["1,600", "Benefit Gaps Found"],
            ["8", "Districts Covered "],
          ].map(([num, label], i) => (
            <div key={i}>
              <p className="text-3xl font-bold text-gov-saffron">{num}</p>
              <p className="text-sm text-blue-100 mt-1">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Privacy */}
      <section className="max-w-6xl mx-auto px-4 py-14">
        <div className="card flex gap-4">
          <Lock className="w-8 h-8 text-gov-teal shrink-0" />
          <div>
            <h2 className="text-xl font-bold text-slate-800 mb-2">Privacy & Data</h2>
            <ul className="text-sm text-slate-600 space-y-1 list-disc list-inside">
              <li>This prototype uses only synthetic / demo data — no real citizen records.</li>
              <li>No Aadhaar numbers, biometrics, or real financial credentials are collected.</li>
              <li>In a real deployment, citizen data would only be processed with proper authorization and consent.</li>
              <li>The officer dashboard shows aggregated, anonymized statistics only.</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  )
}
