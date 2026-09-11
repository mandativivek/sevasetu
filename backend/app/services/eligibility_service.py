from app.database.db import get_all_schemes
from app.rules.eligibility_rules import evaluate_scheme


def check_eligibility(profile: dict):
    """
    Runs every scheme through the rule engine.
    Returns dict with eligible_schemes, not_eligible_schemes, possible_gaps (placeholder,
    filled in later once benefit-status answers are known - see gap_service).
    """
    schemes = get_all_schemes()
    eligible_schemes = []
    not_eligible_schemes = []

    for scheme in schemes:
        is_eligible, matched, failed = evaluate_scheme(profile, scheme["rules"])
        entry = {
            "scheme_id": scheme["id"],
            "name": scheme["name"],
            "category": scheme["category"],
            "description": scheme["description"],
            "benefit_description": scheme["benefit_description"],
            "documents": scheme["documents"],
            "matched_reasons": matched,
            "failed_reasons": failed,
        }
        if is_eligible:
            eligible_schemes.append(entry)
        else:
            not_eligible_schemes.append(entry)

    return {
        "eligible_schemes": eligible_schemes,
        "not_eligible_schemes": not_eligible_schemes,
        "possible_gaps": [],  # populated after /api/benefit-status is called
    }
