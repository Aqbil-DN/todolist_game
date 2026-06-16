"""Achievement granting engine.

Evaluates the achievements a player has earned from data the backend actually
tracks (completed quests + account state) and unlocks any that are newly
satisfied. Re-running is safe: it recomputes from current state, so past
activity is backfilled and nothing is granted twice.

Achievements that depend on features the backend does not model yet (login
streaks, Focus Arena/bosses, journal/energy, the AI Oracle, distraction
blocking) are intentionally left for the catalog to display as locked.
"""

from .database import fetch_all, fetch_one

# id -> predicate(metrics) deciding whether the achievement is earned.
# Only achievements derivable from quests/account live here; see module docstring.
_RULES = {
    1: lambda m: m["completed_count"] >= 1,      # FIRST BLOOD
    2: lambda m: m["completed_count"] >= 10,     # TASK SLAYER
    3: lambda m: m["completed_count"] >= 50,     # QUEST KNIGHT
    4: lambda m: m["completed_count"] >= 100,    # TASK LORD
    5: lambda m: m["completed_count"] >= 500,    # GRANDMASTER
    6: lambda m: m["early_count"] >= 1,          # EARLY BIRD  (completed before 06:00)
    7: lambda m: m["night_count"] >= 1,          # NIGHT OWL   (completed 00:00-03:59)
    8: lambda m: m["sunday_count"] >= 5,         # WEEKEND WARRIOR (5 completed on Sunday)
    10: lambda m: m["daily_total"] >= 1 and m["daily_pending"] == 0,  # INBOX ZERO
    20: lambda m: m["total_xp"] >= 10000,        # RELENTLESS
    41: lambda m: m["registered"],               # HELLO WORLD
    49: lambda m: m["max_day_xp"] >= 1000,       # OVERCLOCKER (1000 XP in one day)
}

# Achievements the backend can actually award (exactly the rule ids above).
# The catalog endpoint uses this so players only see obtainable achievements;
# keeping it derived from _RULES means the two can never drift out of sync.
OBTAINABLE_ACHIEVEMENT_IDS = frozenset(_RULES)


def _gather_metrics(cursor, user_id: int) -> dict:
    """Collect the aggregate signals the rules need, in two small queries."""
    cursor.execute(
        """
        SELECT
            COUNT(*) FILTER (WHERE completed = 1) AS completed_count,
            COUNT(*) FILTER (
                WHERE completed = 1 AND EXTRACT(HOUR FROM completed_at) < 6
            ) AS early_count,
            COUNT(*) FILTER (
                WHERE completed = 1 AND EXTRACT(HOUR FROM completed_at) < 4
            ) AS night_count,
            COUNT(*) FILTER (
                WHERE completed = 1 AND EXTRACT(DOW FROM completed_at) = 0
            ) AS sunday_count,
            COUNT(*) FILTER (WHERE frequency = 'daily') AS daily_total,
            COUNT(*) FILTER (WHERE frequency = 'daily' AND completed = 0) AS daily_pending
        FROM quests
        WHERE user_id = %s
        """,
        (user_id,),
    )
    quest_stats = fetch_one(cursor) or {}

    cursor.execute(
        """
        SELECT COALESCE(MAX(day_xp), 0) AS max_day_xp
        FROM (
            SELECT SUM(xp) AS day_xp
            FROM quests
            WHERE user_id = %s AND completed = 1 AND completed_at IS NOT NULL
            GROUP BY DATE(completed_at)
        ) AS per_day
        """,
        (user_id,),
    )
    max_day_xp = (fetch_one(cursor) or {}).get("max_day_xp") or 0

    cursor.execute(
        "SELECT xp, player_tag FROM users WHERE id = %s",
        (user_id,),
    )
    user = fetch_one(cursor) or {}

    return {
        "completed_count": quest_stats.get("completed_count") or 0,
        "early_count": quest_stats.get("early_count") or 0,
        "night_count": quest_stats.get("night_count") or 0,
        "sunday_count": quest_stats.get("sunday_count") or 0,
        "daily_total": quest_stats.get("daily_total") or 0,
        "daily_pending": quest_stats.get("daily_pending") or 0,
        "max_day_xp": max_day_xp,
        "total_xp": user.get("xp") or 0,
        "registered": user.get("player_tag") is not None,
    }


def _notify(cursor, user_id: int, achievement_ids: list[int]) -> None:
    """Drop an in-app notification for each freshly unlocked achievement."""
    cursor.execute(
        "SELECT id, title, emoji, color FROM achievements WHERE id = ANY(%s)",
        (achievement_ids,),
    )
    catalog = {row["id"]: row for row in fetch_all(cursor)}
    for achievement_id in achievement_ids:
        achievement = catalog.get(achievement_id)
        if not achievement:
            continue
        cursor.execute(
            """
            INSERT INTO notifications (user_id, type, title, message, color)
            VALUES (%s, %s, %s, %s, %s)
            """,
            (
                user_id,
                "SYSTEM",
                "ACHIEVEMENT UNLOCKED",
                f"{achievement['emoji']} {achievement['title']} unlocked.",
                achievement["color"],
            ),
        )


def evaluate_achievements(cursor, user_id: int, *, notify: bool = True) -> list[int]:
    """Unlock any newly-earned achievements for ``user_id``.

    Returns the list of achievement ids unlocked by this call (empty if none).
    The caller owns the transaction and is responsible for committing.
    """
    metrics = _gather_metrics(cursor, user_id)
    satisfied = [aid for aid, rule in _RULES.items() if rule(metrics)]
    if not satisfied:
        return []

    cursor.execute(
        "SELECT achievement_id FROM user_achievements "
        "WHERE user_id = %s AND achievement_id = ANY(%s)",
        (user_id, satisfied),
    )
    already_unlocked = {row["achievement_id"] for row in fetch_all(cursor)}
    newly_unlocked = [aid for aid in satisfied if aid not in already_unlocked]
    if not newly_unlocked:
        return []

    for achievement_id in newly_unlocked:
        cursor.execute(
            "INSERT INTO user_achievements (user_id, achievement_id) VALUES (%s, %s) "
            "ON CONFLICT (user_id, achievement_id) DO NOTHING",
            (user_id, achievement_id),
        )

    if notify:
        _notify(cursor, user_id, newly_unlocked)

    return sorted(newly_unlocked)
