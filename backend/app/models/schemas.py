from pydantic import BaseModel
from typing import Optional, List


class CitizenProfile(BaseModel):
    age: int
    state: str
    district: str
    occupation: str
    student: bool = False
    annual_income: float
    family_size: int = 1
    farmer: bool = False
    employment_status: str = "employed"  # employed | unemployed | self_employed | retired
    disability: bool = False
    senior_citizen: bool = False
    woman_headed_household: bool = False
    existing_benefits: List[str] = []


class BenefitStatusEntry(BaseModel):
    scheme_id: str
    status: str  # yes | no | submitted | rejected | verification_pending | dont_know


class BenefitStatusRequest(BaseModel):
    citizen_id: Optional[str] = None
    profile: CitizenProfile
    statuses: List[BenefitStatusEntry]
