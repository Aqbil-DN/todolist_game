def _iso(value):
    return value.isoformat() if value is not None else None


def serialize_user(user: dict) -> dict:
    return {
        "id": user["id"],
        "firebaseUid": user["firebase_uid"],
        "username": user["player_tag"],
        "playerTag": user["player_tag"],
        "email": user["email"],
        "classId": user["class_id"],
        "title": user["title"],
        "bio": user["bio"],
        "level": user["level"],
        "xp": user["xp"],
        "coins": user["coins"],
        "color": user["color"],
        "stats": {
            "focus": user["focus"],
            "consistency": user["consistency"],
            "creativity": user["creativity"],
            "stamina": user["stamina"],
        },
        "needsProfile": user["player_tag"] is None,
        "createdAt": _iso(user["created_at"]),
    }


def serialize_hero(hero: dict) -> dict:
    return {
        "id": hero["id"],
        "name": hero["name"],
        "title": hero["title"],
        "rarity": hero["rarity"],
        "color": hero["color"],
        "glow": hero["glow"],
        "emoji": hero["emoji"],
        "img": hero["img"],
        "desc": hero["description"],
    }
