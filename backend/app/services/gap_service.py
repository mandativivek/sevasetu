"""
Benefit Gap Detection service.

Given a citizen's answer about whether they're receiving a scheme they're
eligible for, this maps the answer to a probable gap category and a
recommended next action. This is intentionally rule-based and explainable -
NOT a predictive model.
"""

STATUS_TO_GAP = {
    "no": {
        "reason": "not_submitted",
        "label": "Application not submitted",
        "next_step": "Complete and submit the application for this scheme.",
    },
    "submitted": {
        "reason": "verification_pending",
        "label": "Verification pending",
        "next_step": "Follow up with the concerned office regarding verification status.",
    },
    "rejected": {
        "reason": "rejected",
        "label": "Application rejected",
        "next_step": "Check the rejection reason and reapply with corrected/complete documents.",
    },
    "verification_pending": {
        "reason": "verification_pending",
        "label": "Verification pending",
        "next_step": "Visit the nearest facilitation center to check verification progress.",
    },
    "dont_know": {
        "reason": "not_aware",
        "label": "Not aware of scheme / unclear status",
        "next_step": "Visit the nearest Common Service Center to check scheme awareness and status.",
    },
}


def detect_gap(scheme, status: str):
    """
    scheme: dict with at least 'scheme_id'/'id', 'name', 'documents'
    status: one of yes | no | submitted | rejected | verification_pending | dont_know
    Returns None if status == 'yes' (benefit is being received, no gap).
    """
    if status == "yes":
        return None

    gap_info = STATUS_TO_GAP.get(status, STATUS_TO_GAP["dont_know"])

    return {
        "scheme_id": scheme.get("scheme_id") or scheme.get("id"),
        "scheme_name": scheme.get("name"),
        "current_status": status,
        "gap_reason": gap_info["reason"],
        "gap_reason_label": gap_info["label"],
        "recommended_next_step": gap_info["next_step"],
        "required_documents": scheme.get("documents", []),
    }


def build_progress_stage(status: str):
    """
    Maps a benefit status to a stage in:
    ELIGIBILITY -> APPLICATION -> VERIFICATION -> BENEFIT
    Used by the frontend to highlight where the citizen is stuck.
    """
    mapping = {
        "yes": "BENEFIT",
        "verification_pending": "VERIFICATION",
        "submitted": "VERIFICATION",
        "rejected": "APPLICATION",
        "no": "APPLICATION",
        "dont_know": "ELIGIBILITY",
    }
    return mapping.get(status, "ELIGIBILITY")
