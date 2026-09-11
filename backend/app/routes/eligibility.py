from fastapi import APIRouter
from app.models.schemas import CitizenProfile
from app.services.eligibility_service import check_eligibility

router = APIRouter()


@router.post("/eligibility/check")
def eligibility_check(profile: CitizenProfile):
    result = check_eligibility(profile.dict())
    return result
