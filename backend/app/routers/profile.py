from fastapi import APIRouter, Depends, HTTPException

from ..database import fetch_one, get_conn
from ..firebase import get_current_user
from ..schemas import ProfileUpdate
from ..serializers import serialize_user

router = APIRouter(prefix="/profile", tags=["profile"])


@router.get("")
def get_profile(user=Depends(get_current_user)):
    return serialize_user(user)


@router.put("")
def update_profile(
    payload: ProfileUpdate,
    user=Depends(get_current_user),
    conn=Depends(get_conn),
):
    fields: list[str] = []
    values: list = []

    if payload.player_tag is not None:
        cursor = conn.cursor()
        cursor.execute(
            "SELECT id FROM users WHERE player_tag = %s AND id <> %s",
            (payload.player_tag, user["id"]),
        )
        if fetch_one(cursor):
            raise HTTPException(status_code=409, detail="Player tag already taken")
        fields.append("player_tag = %s")
        values.append(payload.player_tag)
    if payload.title is not None:
        fields.append("title = %s")
        values.append(payload.title)
    if payload.email is not None:
        fields.append("email = %s")
        values.append(payload.email)
    if payload.bio is not None:
        fields.append("bio = %s")
        values.append(payload.bio)

    if fields:
        values.append(user["id"])
        cursor = conn.cursor()
        cursor.execute(
            f"UPDATE users SET {', '.join(fields)} WHERE id = %s", tuple(values)
        )
        conn.commit()

    cursor = conn.cursor()
    cursor.execute("SELECT * FROM users WHERE id = %s", (user["id"],))
    return serialize_user(fetch_one(cursor))
