from datetime import timedelta

from fastapi import APIRouter, Depends, HTTPException, Response

from ..achievements_engine import evaluate_achievements
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


@router.get("")
def list_quests(user=Depends(get_current_user), conn=Depends(get_conn)):
    cursor = conn.cursor()
    cursor.execute(
        "SELECT * FROM quests WHERE user_id = %s ORDER BY created_at DESC, id DESC",
        (user["id"],),
    )
    return [serialize_quest(quest) for quest in fetch_all(cursor)]


def _current_streak(days: set, today) -> int:
    """Count consecutive days (ending today or yesterday) with a completion."""
    if today in days:
        anchor = today
    elif (today - timedelta(days=1)) in days:
        anchor = today - timedelta(days=1)
    else:
        return 0
    streak = 0
    while anchor in days:
        streak += 1
        anchor -= timedelta(days=1)
    return streak


@router.get("/streak")
def quest_streak(user=Depends(get_current_user), conn=Depends(get_conn)):
    """Current quest-completion streak: consecutive days with >=1 completion."""
    cursor = conn.cursor()
    cursor.execute(
        """
        SELECT DISTINCT DATE(completed_at) AS day
        FROM quests
        WHERE user_id = %s AND completed = 1 AND completed_at IS NOT NULL
        """,
        (user["id"],),
    )
    days = {row["day"] for row in fetch_all(cursor)}
    cursor.execute("SELECT CURRENT_DATE AS today")
    today = fetch_one(cursor)["today"]
    return {"streak": _current_streak(days, today)}


@router.get("/activity")
def quest_activity(user=Depends(get_current_user), conn=Depends(get_conn)):
    """Recent quest completions, newest first, for the dashboard activity log."""
    cursor = conn.cursor()
    cursor.execute(
        """
        SELECT id, title, xp, color, completed_at
        FROM quests
        WHERE user_id = %s AND completed = 1 AND completed_at IS NOT NULL
        ORDER BY completed_at DESC
        LIMIT 10
        """,
        (user["id"],),
    )
    return [
        {
            "id": row["id"],
            "title": row["title"],
            "xp": row["xp"],
            "color": row["color"],
            "completedAt": row["completed_at"].isoformat()
            if row["completed_at"] is not None
            else None,
        }
        for row in fetch_all(cursor)
    ]


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

    unlocked = evaluate_achievements(cursor, user["id"])

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
