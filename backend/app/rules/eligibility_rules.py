"""
Rule-based eligibility engine.

This module intentionally contains ONLY explainable, transparent rules -
no black-box ML. It is kept separate from services/ so that a future
ML-based scoring model could be substituted behind the same
`evaluate_scheme()` function signature without touching the rest of the app.
"""

# Map of rule-key -> human readable explanation template
RULE_LABELS = {
    "age_max": "Age must be {v} or below",
    "age_min": "Age must be {v} or above",
    "student": "Must be a student",
    "farmer": "Must be a farmer",
    "senior_citizen": "Must be a senior citizen",
    "disability": "Must have a registered disability",
    "woman_headed_household": "Household must be woman-headed",
    "income_max": "Annual household income must be ₹{v} or below",
    "family_size_min": "Family size must be {v} or more",
    "employment_status": "Employment status must be '{v}'",
}


def evaluate_scheme(profile: dict, rules: dict):
    """
    Evaluate a single scheme's rules against a citizen profile.
    Returns (is_eligible: bool, matched_reasons: list[str], failed_reasons: list[str])
    """
    matched, failed = [], []

    checks = {
        "age_max": lambda: profile["age"] <= rules.get("age_max", 200),
        "age_min": lambda: profile["age"] >= rules.get("age_min", 0),
        "student": lambda: profile.get("student") == rules.get("student"),
        "farmer": lambda: profile.get("farmer") == rules.get("farmer"),
        "senior_citizen": lambda: profile.get("senior_citizen") == rules.get("senior_citizen"),
        "disability": lambda: profile.get("disability") == rules.get("disability"),
        "woman_headed_household": lambda: profile.get("woman_headed_household") == rules.get("woman_headed_household"),
        "income_max": lambda: profile["annual_income"] <= rules.get("income_max", float("inf")),
        "family_size_min": lambda: profile.get("family_size", 1) >= rules.get("family_size_min", 0),
        "employment_status": lambda: profile.get("employment_status") == rules.get("employment_status"),
    }

    for key in rules:
        if key not in checks:
            continue
        label = RULE_LABELS[key].format(v=rules[key])
        if checks[key]():
            matched.append(label)
        else:
            failed.append(label)

    is_eligible = len(failed) == 0 and len(matched) > 0
    return is_eligible, matched, failed
