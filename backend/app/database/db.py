"""
SQLite database setup + synthetic seed data for SevaSetu prototype.
ALL DATA HERE IS SYNTHETIC / DEMO DATA. No real citizen data is used.
"""
import sqlite3
import os
import json
import random

DB_PATH = os.path.join(os.path.dirname(__file__), "sevasetu.db")


def get_conn():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA foreign_keys = ON")
    return conn


SCHEMES = [
    {
        "id": "SCH001", "name": "Student Scholarship (Demo)", "category": "Education",
        "description": "Financial aid for students from low-income households.",
        "benefit_description": "Annual scholarship of ₹10,000 (demo figure).",
        "documents": ["Aadhaar-equivalent ID (mock)", "Income certificate", "Bonafide student certificate"],
        "rules": {"age_max": 25, "student": True, "income_max": 300000},
    },
    {
        "id": "SCH002", "name": "Farmer Support Grant (Demo)", "category": "Agriculture",
        "description": "Direct income support for small and marginal farmers.",
        "benefit_description": "₹6,000/year in three installments (demo figure).",
        "documents": ["Land record (mock)", "Farmer ID (mock)"],
        "rules": {"farmer": True, "income_max": 500000},
    },
    {
        "id": "SCH003", "name": "Senior Citizen Pension (Demo)", "category": "Social Security",
        "description": "Monthly pension support for senior citizens without stable income.",
        "benefit_description": "₹2,000/month (demo figure).",
        "documents": ["Age proof (mock)", "Income declaration"],
        "rules": {"senior_citizen": True, "income_max": 250000},
    },
    {
        "id": "SCH004", "name": "Unemployment Support Allowance (Demo)", "category": "Employment",
        "description": "Temporary allowance for unemployed job seekers.",
        "benefit_description": "₹1,500/month for up to 6 months (demo figure).",
        "documents": ["Employment exchange registration (mock)", "Income certificate"],
        "rules": {"employment_status": "unemployed", "age_min": 18, "age_max": 59},
    },
    {
        "id": "SCH005", "name": "Women-Headed Household Support (Demo)", "category": "Social Welfare",
        "description": "Support scheme for households headed by women.",
        "benefit_description": "₹5,000 one-time support (demo figure).",
        "documents": ["Household certificate (mock)", "Income certificate"],
        "rules": {"woman_headed_household": True, "income_max": 300000},
    },
    {
        "id": "SCH006", "name": "Disability Assistance Scheme (Demo)", "category": "Social Welfare",
        "description": "Assistance for persons with disabilities.",
        "benefit_description": "₹3,000/month (demo figure).",
        "documents": ["Disability certificate (mock)"],
        "rules": {"disability": True},
    },
    {
        "id": "SCH007", "name": "Below Poverty Line Family Ration Support (Demo)", "category": "Food Security",
        "description": "Subsidized food grains for low-income large families.",
        "benefit_description": "Monthly ration subsidy (demo figure).",
        "documents": ["Ration card (mock)", "Income certificate"],
        "rules": {"income_max": 200000, "family_size_min": 4},
    },
    {
        "id": "SCH008", "name": "Skill Development Program (Demo)", "category": "Employment",
        "description": "Free vocational training for unemployed youth.",
        "benefit_description": "Free training + certificate (demo).",
        "documents": ["Age proof (mock)", "Education certificate"],
        "rules": {"age_min": 18, "age_max": 35, "employment_status": "unemployed"},
    },
    {
        "id": "SCH009", "name": "Small Farmer Crop Insurance (Demo)", "category": "Agriculture",
        "description": "Subsidized crop insurance premium for small farmers.",
        "benefit_description": "90% premium subsidy (demo figure).",
        "documents": ["Land record (mock)", "Farmer ID (mock)"],
        "rules": {"farmer": True, "family_size_min": 1},
    },
    {
        "id": "SCH010", "name": "Girl Child Education Incentive (Demo)", "category": "Education",
        "description": "Incentive for continued education of girl children in low-income families.",
        "benefit_description": "₹4,000/year (demo figure).",
        "documents": ["Bonafide student certificate", "Income certificate"],
        "rules": {"age_max": 18, "student": True, "income_max": 250000},
    },
]

DISTRICTS = [
    "Hyderabad", "Warangal", "Karimnagar", "Nizamabad", "Khammam",
    "Nalgonda", "Adilabad", "Mahbubnagar",
]

GAP_REASON_KEYS = [
    "not_aware", "not_submitted", "missing_documents",
    "incomplete", "verification_pending", "rejected", "mismatch", "other",
]

GAP_REASON_LABELS = {
    "not_aware": "Not aware of scheme",
    "not_submitted": "Application not submitted",
    "missing_documents": "Missing documents",
    "incomplete": "Application incomplete",
    "verification_pending": "Verification pending",
    "rejected": "Application rejected",
    "mismatch": "Information mismatch",
    "other": "Other",
}


def seed_district_statistics(conn):
    """Generate synthetic aggregated per-district, per-scheme statistics."""
    random.seed(42)
    cur = conn.cursor()
    cur.execute("DELETE FROM district_statistics")
    for district in DISTRICTS:
        for scheme in SCHEMES:
            eligible = random.randint(400, 1600)
            gap_rate = random.uniform(0.10, 0.45)
            gap = int(eligible * gap_rate)
            receiving = eligible - gap
            cur.execute(
                """INSERT INTO district_statistics
                (district, scheme_id, eligible, receiving, gap)
                VALUES (?, ?, ?, ?, ?)""",
                (district, scheme["id"], eligible, receiving, gap),
            )
    conn.commit()


def init_db():
    first_time = not os.path.exists(DB_PATH)
    conn = get_conn()
    cur = conn.cursor()

    cur.executescript(
        """
        CREATE TABLE IF NOT EXISTS schemes (
            id TEXT PRIMARY KEY,
            name TEXT, category TEXT, description TEXT,
            benefit_description TEXT,
            documents_json TEXT, rules_json TEXT
        );

        CREATE TABLE IF NOT EXISTS citizens (
            id TEXT PRIMARY KEY,
            profile_json TEXT,
            created_at TEXT DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS benefit_status (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            citizen_id TEXT,
            scheme_id TEXT,
            status TEXT,
            gap_reason TEXT,
            created_at TEXT DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS gap_reasons (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            scheme_id TEXT,
            reason_key TEXT,
            count INTEGER DEFAULT 0
        );

        CREATE TABLE IF NOT EXISTS district_statistics (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            district TEXT,
            scheme_id TEXT,
            eligible INTEGER,
            receiving INTEGER,
            gap INTEGER
        );
        """
    )

    cur.execute("DELETE FROM schemes")
    for s in SCHEMES:
        cur.execute(
            """INSERT INTO schemes (id, name, category, description, benefit_description, documents_json, rules_json)
            VALUES (?, ?, ?, ?, ?, ?, ?)""",
            (s["id"], s["name"], s["category"], s["description"], s["benefit_description"],
             json.dumps(s["documents"]), json.dumps(s["rules"])),
        )
    conn.commit()

    seed_district_statistics(conn)
    conn.close()
    return first_time


def get_all_schemes():
    conn = get_conn()
    rows = conn.execute("SELECT * FROM schemes").fetchall()
    conn.close()
    result = []
    for r in rows:
        d = dict(r)
        d["documents"] = json.loads(d.pop("documents_json"))
        d["rules"] = json.loads(d.pop("rules_json"))
        result.append(d)
    return result


def get_scheme_by_id(scheme_id):
    conn = get_conn()
    row = conn.execute("SELECT * FROM schemes WHERE id = ?", (scheme_id,)).fetchone()
    conn.close()
    if not row:
        return None
    d = dict(row)
    d["documents"] = json.loads(d.pop("documents_json"))
    d["rules"] = json.loads(d.pop("rules_json"))
    return d
