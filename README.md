# SevaSetu — Government Welfare Benefit Gap Detection & Resolution System

**SIH Prototype — uses ONLY synthetic/demo data. Not connected to any real government database.**

## 1. Problem Statement

Citizens who are eligible for welfare schemes frequently do not receive them — not because
schemes don't exist, but because of missing documents, incomplete applications, low
awareness, or applications stuck in verification. Most existing "scheme discovery" portals
stop at telling a citizen *what* they might be eligible for. Almost none identify *why* an
eligible citizen isn't receiving a benefit, or give officials a way to see where
intervention is actually needed.

## 2. Proposed Solution

SevaSetu is an end-to-end pipeline:

```
Citizen eligibility → Potentially eligible schemes → Benefit received?
   → If NO → Identify probable gap/reason → Recommend next action
   → Aggregate anonymous results → Officer dashboard
```

Citizens get a transparent eligibility check and a concrete next step. Officials get
aggregated, anonymized statistics showing where benefit gaps are concentrated and why.

## 3. Innovation

Unlike a scheme-search website, SevaSetu's core loop is **gap detection and resolution**,
not just discovery:
- Explainable rule-based eligibility matching (shows *which* rule matched).
- A structured benefit-status question for every matched scheme.
- Automatic classification of *why* a benefit is missing (documents, awareness,
  verification, rejection, etc.).
- District- and scheme-level **Benefit Gap Rate** used to flag high-priority areas.
- A clearly separated rules module so a real ML model can later be swapped in without
  touching the API or frontend.

## 4. System Architecture

```
┌─────────────────┐      REST/JSON       ┌──────────────────┐
│  React + Vite    │  ───────────────►   │   FastAPI          │
│  (frontend)       │  ◄───────────────   │   (backend)        │
└─────────────────┘                      └─────────┬────────┘
                                                     │
                                           ┌─────────▼────────┐
                                           │  SQLite (sevasetu.db) │
                                           │  schemes, citizens,    │
                                           │  benefit_status,        │
                                           │  district_statistics    │
                                           └────────────────────────┘
```

- `app/rules/` — pure, explainable eligibility rules (no ML).
- `app/services/` — eligibility + gap-detection business logic (rules-consumer layer;
  an ML scoring service could later be added here behind the same function signature).
- `app/routes/` — FastAPI endpoints.
- `app/database/` — SQLite schema + synthetic seed data.

## 5. Technology Stack

**Frontend:** React 18, Vite, Tailwind CSS, React Router, Recharts, Lucide React
**Backend:** Python, FastAPI, SQLite
**AI/ML:** Rule-based eligibility engine (explainable); ML hook point isolated for future work

## 6. API Documentation

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/eligibility/check` | Takes a citizen profile, returns eligible/not-eligible schemes with match reasons |
| POST | `/api/benefit-status` | Takes profile + per-scheme status answers, returns detected gaps + progress stage |
| GET | `/api/schemes` | List all demo schemes |
| GET | `/api/schemes/{id}` | Scheme detail |
| GET | `/api/dashboard/summary` | Aggregated totals (assessed/eligible/receiving/gap) |
| GET | `/api/dashboard/gap-reasons` | Gap-reason distribution + recommended intervention |
| GET | `/api/dashboard/districts` | Per-district eligible/receiving/gap + gap rate |
| GET | `/api/dashboard/schemes` | Per-scheme aggregated stats |
| GET | `/api/dashboard/priority-areas` | Districts ranked by gap rate, flagged HIGH PRIORITY at ≥30% |

Interactive docs available at `http://localhost:8000/docs` once the backend is running.

## 7. Database Design

- **schemes** — id, name, category, description, benefit_description, documents (JSON), rules (JSON)
- **citizens** — id, profile_json (synthetic demo profiles only), created_at
- **benefit_status** — citizen_id, scheme_id, status, gap_reason, created_at
- **gap_reasons** — reference table for gap reason keys
- **district_statistics** — district, scheme_id, eligible, receiving, gap (synthetic aggregate data, pre-seeded)

## 8. Eligibility Engine Explanation

`app/rules/eligibility_rules.py` evaluates each scheme's rule dict (e.g.
`{"age_max": 25, "student": true, "income_max": 300000}`) against the citizen profile.
Every rule key maps to a human-readable explanation, so the UI can show **exactly which
condition matched** — no opaque scoring. A scheme is "eligible" only if every declared
rule passes.

## 9. Gap Detection Algorithm

For every scheme a citizen is potentially eligible for, they answer a status question
(Yes / No / Application submitted / Rejected / Verification pending / Don't know).
`app/services/gap_service.py` maps any non-"Yes" answer to a gap category
(e.g. "Application not submitted" → *Not aware / Not submitted*) and a recommended next
step. At the aggregate level:

```
Benefit Gap Rate = (Potentially Eligible − Receiving) / Potentially Eligible
```

Districts with a gap rate ≥ 30% are flagged **HIGH PRIORITY** — a transparent threshold
rule, not a predictive model.

## 10. How to Run Locally

### Backend
```bash
cd backend
python3 -m venv venv && source venv/bin/activate   # optional but recommended
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```
Backend runs at `http://localhost:8000` (docs at `/docs`). The SQLite DB and synthetic
seed data are created automatically on first startup.

### Frontend
```bash
cd frontend
npm install
cp .env.example .env   # optional, defaults already point to localhost:8000
npm run dev
```
Frontend runs at `http://localhost:5173`.

Frontend and backend can be started independently and in either order — the frontend
will simply show a toast error until the backend is reachable.

## 11. Demo Credentials

None required — this prototype has no login/auth. "Officer Dashboard" is a public route
in this prototype for demo purposes; a real deployment would require officer
authentication and role-based access control.

## 12. Limitations

- Uses synthetic/seeded data, not real citizen or scheme records.
- No authentication/authorization layer (out of scope for this prototype).
- Rule engine is intentionally simple/explainable; real eligibility rules are often more
  nuanced (state-specific, time-bound, document-verification-dependent).
- District statistics are pre-seeded random synthetic aggregates, not live rollups of
  individual citizen submissions (individual submissions are stored but not yet folded
  into the aggregate dashboard in this prototype).
- Translations cover primary UI labels only, not full content.

## 13. Future Scope

- Real authentication for officers + role-based dashboards.
- Live aggregation of citizen submissions into dashboard statistics.
- Optional ML-based eligibility scoring layered behind the existing `rules/` interface,
  with explainability preserved.
- Integration with actual scheme databases via secure, authorized government APIs.
- SMS/WhatsApp based outreach for "Not aware of scheme" gaps.
- Document-upload and verification workflow.

## 14. Privacy and Ethical Considerations

- This prototype uses **only synthetic/demo data** — no real citizen data.
- No Aadhaar numbers, biometric data, passwords, or real bank details are collected or
  requested anywhere in the system.
- The officer dashboard shows **aggregated, anonymized** statistics only — never
  individual citizen records.
- In a real deployment, citizen data would only be collected, stored, and processed
  with explicit consent and proper legal authorization.
- The prototype does **not** claim to connect to any real government database.
- Priority-area flags and intervention suggestions are presented as **recommendations**,
  not automated decisions.

---

## Demo Workflow (for judges)

1. Open the landing page → click **"Check My Eligibility"**.
2. Click a **demo profile chip** (Student / Farmer / Senior Citizen / Unemployed / Low-Income Family) to auto-fill the form.
3. Click **Check Eligibility** → see matched schemes with explained reasons.
4. Answer the benefit-status question for each scheme (try mixing "No" and "Verification pending").
5. View the **Results Dashboard**: eligible/receiving/gap counts, the ELIGIBILITY → APPLICATION → VERIFICATION → BENEFIT flow, and gap cards with recommended next steps.
6. Click **View Officer Dashboard** → see aggregated totals, benefit-gap-by-district chart, gap-reason pie chart with a recommended intervention, and the High Priority Areas table.
7. Click **Manage Schemes** → see per-scheme eligibility/receiving/gap stats.
8. Visit **Impact** → simulated program-level impact metrics, clearly labeled DEMO/SYNTHETIC DATA.

## 3-Minute SIH Presentation Flow

- **0:00–0:30** — Problem: eligible citizens missing benefits; existing portals don't diagnose *why*.
- **0:30–1:00** — Landing page walkthrough: how SevaSetu works, 4-step pipeline.
- **1:00–2:00** — Live demo: pick a demo profile → eligibility results with explained matches → answer benefit-status → results dashboard showing a detected gap and recommended action.
- **2:00–2:40** — Officer dashboard: aggregated stats, gap-reason chart + recommended intervention, High Priority Areas table.
- **2:40–3:00** — Close: privacy-by-design (synthetic data, anonymized aggregates), and future scope (ML hook, real auth, live aggregation).
