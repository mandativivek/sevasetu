import React from 'react'
import { Languages } from 'lucide-react'
import { useLanguage } from '../utils/LanguageContext.jsx'
import { languageNames } from '../data/translations.js'

export default function LanguageSelector() {
  const { lang, setLang } = useLanguage()
  return (
    <div className="flex items-center gap-1.5 bg-white/10 rounded-lg px-2 py-1.5">
      <Languages className="w-4 h-4" />
      <select
        value={lang}
        onChange={(e) => setLang(e.target.value)}
        className="bg-transparent text-white text-sm focus:outline-none [&>option]:text-slate-800"
      >
        {Object.entries(languageNames).map(([code, name]) => (
          <option key={code} value={code}>{name}</option>
        ))}
      </select>
    </div>
  )
}
