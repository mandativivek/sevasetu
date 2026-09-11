import React from 'react'
import { Link } from 'react-router-dom'
import { Landmark } from 'lucide-react'
import { useLanguage } from '../utils/LanguageContext.jsx'
import LanguageSelector from './LanguageSelector.jsx'

export default function Navbar() {
  const { t } = useLanguage()
  return (
    <nav className="bg-gov-navy text-white sticky top-0 z-40 shadow-md">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-bold text-lg">
          <Landmark className="w-6 h-6 text-gov-saffron" />
          {t('appName')}
        </Link>
        <div className="hidden md:flex items-center gap-6 text-sm font-medium">
          <Link to="/" className="hover:text-gov-saffron">{t('home')}</Link>
          <Link to="/eligibility" className="hover:text-gov-saffron">{t('checkEligibility')}</Link>
          <Link to="/officer" className="hover:text-gov-saffron">{t('officerDashboard')}</Link>
          <Link to="/impact" className="hover:text-gov-saffron">{t('impact')}</Link>
        </div>
        <LanguageSelector />
      </div>
    </nav>
  )
}
