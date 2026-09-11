const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'

async function request(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })
  if (!res.ok) {
    const body = await res.text()
    throw new Error(`API error ${res.status}: ${body}`)
  }
  return res.json()
}

export const api = {
  checkEligibility: (profile) =>
    request('/eligibility/check', { method: 'POST', body: JSON.stringify(profile) }),

  submitBenefitStatus: (payload) =>
    request('/benefit-status', { method: 'POST', body: JSON.stringify(payload) }),

  getSchemes: () => request('/schemes'),
  getScheme: (id) => request(`/schemes/${id}`),

  getDashboardSummary: () => request('/dashboard/summary'),
  getGapReasons: () => request('/dashboard/gap-reasons'),
  getDistricts: () => request('/dashboard/districts'),
  getDashboardSchemes: () => request('/dashboard/schemes'),
  getPriorityAreas: () => request('/dashboard/priority-areas'),
}
