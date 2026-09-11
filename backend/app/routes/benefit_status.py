import json
import uuid
from fastapi import APIRouter
from app.models.schemas import BenefitStatusRequest
from app.database.db import get_scheme_by_id, get_conn
from app.services.gap_service import detect_gap, build_progress_stage

router = APIRouter()


@router.post("/benefit-status")
def submit_benefit_status(payload: BenefitStatusRequest):
    citizen_id = payload.citizen_id or str(uuid.uuid4())[:8]
    conn = get_conn()
    cur = conn.cursor()
    cur.execute(
        "INSERT OR REPLACE INTO citizens (id, profile_json) VALUES (?, ?)",
        (citizen_id, json.dumps(payload.profile.dict())),
    )

    gaps = []
    receiving_count = 0
    progress = {}

    for entry in payload.statuses:
        scheme = get_scheme_by_id(entry.scheme_id)
        if not scheme:
            continue
        scheme["scheme_id"] = scheme["id"]

        cur.execute(
            "INSERT INTO benefit_status (citizen_id, scheme_id, status, gap_reason) VALUES (?, ?, ?, ?)",
            (citizen_id, entry.scheme_id, entry.status, None),
        )

        if entry.status == "yes":
            receiving_count += 1
        else:
            gap = detect_gap(scheme, entry.status)
            if gap:
                gaps.append(gap)
                cur.execute(
                    "UPDATE benefit_status SET gap_reason = ? WHERE citizen_id = ? AND scheme_id = ?",
                    (gap["gap_reason"], citizen_id, entry.scheme_id),
                )

        progress[entry.scheme_id] = build_progress_stage(entry.status)

    conn.commit()
    conn.close()

    return {
        "citizen_id": citizen_id,
        "receiving_count": receiving_count,
        "gaps": gaps,
        "progress_by_scheme": progress,
    }
