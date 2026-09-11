import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar.jsx'
import Landing from './pages/Landing.jsx'
import CitizenEligibility from './pages/CitizenEligibility.jsx'
import CitizenResults from './pages/CitizenResults.jsx'
import OfficerDashboard from './pages/OfficerDashboard.jsx'
import SchemeManagement from './pages/SchemeManagement.jsx'
import ImpactPage from './pages/ImpactPage.jsx'

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/eligibility" element={<CitizenEligibility />} />
          <Route path="/results" element={<CitizenResults />} />
          <Route path="/officer" element={<OfficerDashboard />} />
          <Route path="/officer/schemes" element={<SchemeManagement />} />
          <Route path="/impact" element={<ImpactPage />} />
        </Routes>
      </main>
      <footer className="bg-white border-t border-slate-200 py-6 text-center text-xs text-slate-400">
        SevaSetu · Synthetic/demo data only · Not connected to real government databases
      </footer>
    </div>
  )
}
