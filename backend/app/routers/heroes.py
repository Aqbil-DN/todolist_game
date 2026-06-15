from fastapi import APIRouter, Depends

from ..database import fetch_all, get_conn
from ..firebase import get_current_user
from ..serializers import serialize_hero

router = APIRouter(tags=["heroes"])


@router.get("/heroes")
def list_heroes(conn=Depends(get_conn)):
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM heroes ORDER BY id")
    return [serialize_hero(hero) for hero in fetch_all(cursor)]


@router.get("/me/heroes")
def my_heroes(user=Depends(get_current_user), conn=Depends(get_conn)):
    cursor = conn.cursor()
    cursor.execute(
        "SELECT hero_id, copies, unlocked_at FROM user_heroes WHERE user_id = %s",
        (user["id"],),
    )
    return [
        {
            "heroId": row["hero_id"],
            "count": row["copies"],
            "unlockedAt": row["unlocked_at"].isoformat()
            if row["unlocked_at"] is not None
            else None,
        }
        for row in fetch_all(cursor)
    ]
