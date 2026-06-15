from fastapi import APIRouter, Depends

from ..firebase import get_current_user

router = APIRouter(prefix="/wallet", tags=["wallet"])


@router.get("")
def get_wallet(user=Depends(get_current_user)):
    return {"coins": user["coins"]}
