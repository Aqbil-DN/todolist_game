from fastapi import APIRouter, Depends

from ..database import fetch_all, get_conn
from ..firebase import get_current_user

router = APIRouter(tags=["achievements"])


def serialize_achievement(achievement: dict) -> dict:
    return {
        "id": achievement["id"],
        "title": achievement["title"],
        "desc": achievement["description"],
        "emoji": achievement["emoji"],
        "color": achievement["color"],
        "category": achievement["category"],
        "isSecret": bool(achievement["is_secret"]),
    }


@router.get("/achievements")
def list_achievements(conn=Depends(get_conn)):
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM achievements ORDER BY id")
    return [serialize_achievement(item) for item in fetch_all(cursor)]


@router.get("/me/achievements")
def my_achievements(user=Depends(get_current_user), conn=Depends(get_conn)):
    cursor = conn.cursor()
    cursor.execute(
        "SELECT achievement_id, unlocked_at FROM user_achievements WHERE user_id = %s",
        (user["id"],),
    )
    return [
        {
            "achievementId": row["achievement_id"],
            "unlockedAt": row["unlocked_at"].isoformat()
            if row["unlocked_at"] is not None
            else None,
        }
        for row in fetch_all(cursor)
    ]
