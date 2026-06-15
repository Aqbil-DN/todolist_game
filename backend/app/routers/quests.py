from fastapi import APIRouter, Depends, HTTPException, Response

from ..database import fetch_all, fetch_one, get_conn
from ..firebase import get_current_user
from ..schemas import QuestCreate, QuestUpdate

router = APIRouter(prefix="/quests", tags=["quests"])

_COLUMN_MAP = {
    "title": "title",
    "xp": "xp",
    "tag": "tag",
    "color": "color",
    "frequency": "frequency",
    "date": "quest_date",
    "completed": "completed",
}


def serialize_quest(quest: dict) -> dict:
    quest_date = quest["quest_date"]
    return {
        "id": quest["id"],
        "title": quest["title"],
        "xp": quest["xp"],
        "tag": quest["tag"],
        "color": quest["color"],
        "frequency": quest["frequency"],
        "date": quest_date.isoformat() if quest_date is not None else None,
        "completed": bool(quest["completed"]),
    }


def _unlock_achievement(cursor, user_id: int, achievement_id: int) -> bool:
    cursor.execute(
        "SELECT 1 AS found FROM user_achievements WHERE user_id = %s AND achievement_id = %s",
        (user_id, achievement_id),
    )
    if fetch_one(cursor):
        return False
    cursor.execute(
        "INSERT INTO user_achievements (user_id, achievement_id) VALUES (%s, %s)",
        (user_id, achievement_id),
    )
    return True


@router.get("")
def list_quests(user=Depends(get_current_user), conn=Depends(get_conn)):
    cursor = conn.cursor()
    cursor.execute(
        "SELECT * FROM quests WHERE user_id = %s ORDER BY created_at DESC, id DESC",
        (user["id"],),
    )
    return [serialize_quest(quest) for quest in fetch_all(cursor)]


@router.post("", status_code=201)
def create_quest(
    payload: QuestCreate,
    user=Depends(get_current_user),
    conn=Depends(get_conn),
):
    cursor = conn.cursor()
    cursor.execute(
        """
        INSERT INTO quests (user_id, title, xp, tag, color, frequency, quest_date)
        VALUES (%s, %s, %s, %s, %s, %s, %s)
        RETURNING id
        """,
        (
            user["id"],
            payload.title,
            payload.xp,
            payload.tag,
            payload.color,
            payload.frequency,
            payload.date,
        ),
    )
    new_id = cursor.fetchone()[0]
    conn.commit()
    cursor.execute("SELECT * FROM quests WHERE id = %s", (new_id,))
    return serialize_quest(fetch_one(cursor))


@router.patch("/{quest_id}")
def update_quest(
    quest_id: int,
    payload: QuestUpdate,
    user=Depends(get_current_user),
    conn=Depends(get_conn),
):
    cursor = conn.cursor()
    cursor.execute(
        "SELECT * FROM quests WHERE id = %s AND user_id = %s", (quest_id, user["id"])
    )
    if not fetch_one(cursor):
        raise HTTPException(status_code=404, detail="Quest not found")

    data = payload.model_dump(exclude_unset=True)
    fields: list[str] = []
    values: list = []
    for key, value in data.items():
        column = _COLUMN_MAP[key]
        fields.append(f"{column} = %s")
        values.append(int(value) if key == "completed" else value)

    if fields:
        values.append(quest_id)
        cursor.execute(
            f"UPDATE quests SET {', '.join(fields)} WHERE id = %s", tuple(values)
        )
        conn.commit()

    cursor.execute("SELECT * FROM quests WHERE id = %s", (quest_id,))
    return serialize_quest(fetch_one(cursor))


@router.delete("/{quest_id}", status_code=204)
def delete_quest(
    quest_id: int,
    user=Depends(get_current_user),
    conn=Depends(get_conn),
):
    cursor = conn.cursor()
    cursor.execute(
        "DELETE FROM quests WHERE id = %s AND user_id = %s", (quest_id, user["id"])
    )
    conn.commit()
    return Response(status_code=204)


@router.post("/{quest_id}/complete")
def complete_quest(
    quest_id: int,
    user=Depends(get_current_user),
    conn=Depends(get_conn),
):
    cursor = conn.cursor()
    cursor.execute(
        "SELECT * FROM quests WHERE id = %s AND user_id = %s", (quest_id, user["id"])
    )
    quest = fetch_one(cursor)
    if not quest:
        raise HTTPException(status_code=404, detail="Quest not found")
    if quest["completed"]:
        raise HTTPException(status_code=400, detail="Quest already completed")

    reward = quest["xp"]
    new_xp = user["xp"] + reward
    new_level = new_xp // 1000 + 1
    new_coins = user["coins"] + reward

    cursor.execute(
        "UPDATE quests SET completed = 1, completed_at = CURRENT_TIMESTAMP WHERE id = %s",
        (quest_id,),
    )
    cursor.execute(
        "UPDATE users SET xp = %s, level = %s, coins = %s WHERE id = %s",
        (new_xp, new_level, new_coins, user["id"]),
    )

    unlocked: list[int] = []
    cursor.execute(
        "SELECT COUNT(*) AS completed_count FROM quests WHERE user_id = %s AND completed = 1",
        (user["id"],),
    )
    if fetch_one(cursor)["completed_count"] == 1 and _unlock_achievement(
        cursor, user["id"], 1
    ):
        unlocked.append(1)

    conn.commit()

    cursor.execute("SELECT * FROM quests WHERE id = %s", (quest_id,))
    return {
        "quest": serialize_quest(fetch_one(cursor)),
        "xp": new_xp,
        "level": new_level,
        "coins": new_coins,
        "reward": reward,
        "unlockedAchievements": unlocked,
    }
