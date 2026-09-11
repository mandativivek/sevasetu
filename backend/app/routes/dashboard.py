import random
from fastapi import APIRouter
from app.database.db import get_conn, get_all_schemes, GAP_REASON_LABELS

router = APIRouter()


@router.get("/dashboard/summary")
def dashboard_summary():
    conn = get_conn()
    rows = conn.execute(
        "SELECT SUM(eligible) as eligible, SUM(receiving) as receiving, SUM(gap) as gap FROM district_statistics"
    ).fetchone()
    conn.close()

    total_assessed = int(rows["eligible"] * 1.18)  # some assessed citizens are eligible for 0 schemes
    return {
        "total_assessed": total_assessed,
        "potentially_eligible": rows["eligible"],
        "receiving_benefits": rows["receiving"],
        "potential_gaps": rows["gap"],
        "note": "DEMO / SYNTHETIC DATA - aggregated, no individual citizen data shown.",
    }


@router.get("/dashboard/gap-reasons")
def dashboard_gap_reasons():
    random.seed(7)
    # Synthetic distribution matching the design brief
    dist = {
        "missing_documents": 32,
        "incomplete": 25,
        "not_aware": 20,
        "verification_pending": 13,
        "other": 10,
    }
    data = [{"reason": GAP_REASON_LABELS[k], "reason_key": k, "percentage": v} for k, v in dist.items()]

    top = max(dist, key=dist.get)
    recommendations = {
        "missing_documents": "Documentation issues are the largest barrier. Consider organizing a document-assistance camp.",
        "incomplete": "Many applications are left incomplete. Consider simplified application forms or assisted-filing desks.",
        "not_aware": "Awareness is the top barrier. Consider local outreach campaigns and information kiosks.",
        "verification_pending": "Verification delays dominate. Consider additional verification staff or camps.",
        "other": "Barriers are spread across miscellaneous causes - a general helpdesk may help.",
    }
    return {
        "distribution": data,
        "recommended_intervention": recommendations[top],
        "note": "Recommendation only - not an automated government decision.",
    }


@router.get("/dashboard/districts")
def dashboard_districts():
    conn = get_conn()
    rows = conn.execute(
        """SELECT district, SUM(eligible) as eligible, SUM(receiving) as receiving, SUM(gap) as gap
           FROM district_statistics GROUP BY district ORDER BY district"""
    ).fetchall()
    conn.close()
    result = []
    for r in rows:
        gap_rate = round((r["gap"] / r["eligible"]) * 100, 1) if r["eligible"] else 0
        result.append({
            "district": r["district"],
            "eligible": r["eligible"],
            "receiving": r["receiving"],
            "gap": r["gap"],
            "gap_rate": gap_rate,
            "high_priority": gap_rate >= 30,
        })
    return result


@router.get("/dashboard/schemes")
def dashboard_schemes():
    conn = get_conn()
    schemes = get_all_schemes()
    result = []
    for s in schemes:
        row = conn.execute(
            """SELECT SUM(eligible) as eligible, SUM(receiving) as receiving, SUM(gap) as gap
               FROM district_statistics WHERE scheme_id = ?""",
            (s["id"],),
        ).fetchone()
        eligible = row["eligible"] or 0
        gap = row["gap"] or 0
        gap_rate = round((gap / eligible) * 100, 1) if eligible else 0
        result.append({
            "scheme_id": s["id"],
            "name": s["name"],
            "category": s["category"],
            "documents": s["documents"],
            "rules": s["rules"],
            "potentially_eligible": eligible,
            "receiving": row["receiving"] or 0,
            "gap": gap,
            "gap_rate": gap_rate,
        })
    conn.close()
    return result


@router.get("/dashboard/priority-areas")
def dashboard_priority_areas():
    conn = get_conn()
    rows = conn.execute(
        """SELECT district, SUM(eligible) as eligible, SUM(receiving) as receiving, SUM(gap) as gap
           FROM district_statistics GROUP BY district"""
    ).fetchall()
    conn.close()
    areas = []
    for r in rows:
        gap_rate = round((r["gap"] / r["eligible"]) * 100, 1) if r["eligible"] else 0
        areas.append({
            "district": r["district"],
            "eligible": r["eligible"],
            "receiving": r["receiving"],
            "gap": r["gap"],
            "gap_rate": gap_rate,
            "high_priority": gap_rate >= 30,
        })
    areas.sort(key=lambda x: x["gap_rate"], reverse=True)
    return areas
