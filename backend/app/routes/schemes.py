from fastapi import APIRouter, HTTPException
from app.database.db import get_all_schemes, get_scheme_by_id

router = APIRouter()


@router.get("/schemes")
def list_schemes():
    return get_all_schemes()


@router.get("/schemes/{scheme_id}")
def scheme_detail(scheme_id: str):
    scheme = get_scheme_by_id(scheme_id)
    if not scheme:
        raise HTTPException(status_code=404, detail="Scheme not found")
    return scheme
