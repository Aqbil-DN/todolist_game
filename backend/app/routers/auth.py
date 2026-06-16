from fastapi import APIRouter, Depends, HTTPException

from ..achievements_engine import evaluate_achievements
from ..database import fetch_one, get_conn
from ..firebase import get_current_user
from ..schemas import RegisterRequest
from ..serializers import serialize_user

router = APIRouter(prefix="/auth", tags=["auth"])

CLASS_TITLES = {
    "hacker": "CYBER HACKER",
    "artist": "NEON ARTIST",
    "hustler": "STREET SAMURAI",
}


@router.get("/me")
def get_me(user=Depends(get_current_user)):
    return serialize_user(user)


@router.post("/register")
def register(
    payload: RegisterRequest,
    user=Depends(get_current_user),
    conn=Depends(get_conn),
):
    if payload.class_id not in CLASS_TITLES:
        raise HTTPException(status_code=400, detail="Invalid class_id")

    cursor = conn.cursor()
    cursor.execute(
        "SELECT id FROM users WHERE player_tag = %s AND id <> %s",
        (payload.player_tag, user["id"]),
    )
    if fetch_one(cursor):
        raise HTTPException(status_code=409, detail="Player tag already taken")

    cursor.execute(
        "SELECT color FROM character_classes WHERE id = %s", (payload.class_id,)
    )
    class_row = fetch_one(cursor)
    color = class_row["color"] if class_row else "#A3FF12"
    title = CLASS_TITLES[payload.class_id]
    email = payload.email or user.get("email")

    cursor.execute(
        """
        UPDATE users
        SET player_tag = %s, class_id = %s, title = %s, color = %s, email = %s
        WHERE id = %s
        """,
        (payload.player_tag, payload.class_id, title, color, email, user["id"]),
    )
    cursor.execute(
        """
        INSERT INTO notifications (user_id, type, title, message, color)
        VALUES (%s, %s, %s, %s, %s)
        """,
        (
            user["id"],
            "SYSTEM",
            "SYSTEM BOOT COMPLETE",
            f"Welcome to the grid, {payload.player_tag}. Your journey begins now.",
            "#6A4CFF",
        ),
    )
    evaluate_achievements(cursor, user["id"])
    conn.commit()

    cursor.execute("SELECT * FROM users WHERE id = %s", (user["id"],))
    return serialize_user(fetch_one(cursor))
