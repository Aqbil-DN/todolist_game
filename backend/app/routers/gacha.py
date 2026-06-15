import random

from fastapi import APIRouter, Depends, HTTPException

from ..database import fetch_all, fetch_one, get_conn
from ..firebase import get_current_user
from ..schemas import GachaPullRequest
from ..serializers import serialize_hero

router = APIRouter(prefix="/gacha", tags=["gacha"])

COST_PER_PULL = 100


def _roll_rarity() -> str:
    roll = random.random() * 100
    if roll <= 5:
        return "LEGENDARY"
    if roll <= 30:
        return "EPIC"
    return "RARE"


@router.post("/pull")
def pull(
    payload: GachaPullRequest,
    user=Depends(get_current_user),
    conn=Depends(get_conn),
):
    cost = payload.times * COST_PER_PULL
    if user["coins"] < cost:
        raise HTTPException(status_code=400, detail="Not enough coins")

    cursor = conn.cursor()
    cursor.execute("SELECT * FROM heroes")
    heroes = fetch_all(cursor)
    if not heroes:
        raise HTTPException(status_code=503, detail="Hero pool is empty")

    by_rarity: dict[str, list[dict]] = {}
    for hero in heroes:
        by_rarity.setdefault(hero["rarity"], []).append(hero)

    pulls: list[dict] = []
    for _ in range(payload.times):
        rarity = _roll_rarity()
        pool = by_rarity.get(rarity) or heroes
        hero = random.choice(pool)

        cursor.execute(
            "SELECT copies FROM user_heroes WHERE user_id = ? AND hero_id = ?",
            (user["id"], hero["id"]),
        )
        is_new = fetch_one(cursor) is None
        if is_new:
            cursor.execute(
                "INSERT INTO user_heroes (user_id, hero_id, copies) VALUES (?, ?, 1)",
                (user["id"], hero["id"]),
            )
        else:
            cursor.execute(
                "UPDATE user_heroes SET copies = copies + 1 WHERE user_id = ? AND hero_id = ?",
                (user["id"], hero["id"]),
            )
        pulls.append({**serialize_hero(hero), "isNew": is_new})

    new_coins = user["coins"] - cost
    cursor.execute(
        "UPDATE users SET coins = ? WHERE id = ?", (new_coins, user["id"])
    )
    conn.commit()

    return {"pulls": pulls, "coins": new_coins, "cost": cost}
