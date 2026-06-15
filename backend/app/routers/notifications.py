from fastapi import APIRouter, Depends

from ..database import fetch_all, get_conn
from ..firebase import get_current_user

router = APIRouter(prefix="/notifications", tags=["notifications"])


def serialize_notification(notification: dict) -> dict:
    created_at = notification["created_at"]
    return {
        "id": notification["id"],
        "type": notification["type"],
        "title": notification["title"],
        "message": notification["message"],
        "color": notification["color"],
        "read": bool(notification["is_read"]),
        "createdAt": created_at.isoformat() if created_at is not None else None,
    }


@router.get("")
def list_notifications(user=Depends(get_current_user), conn=Depends(get_conn)):
    cursor = conn.cursor()
    cursor.execute(
        "SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC, id DESC",
        (user["id"],),
    )
    return [serialize_notification(item) for item in fetch_all(cursor)]


@router.post("/{notification_id}/read")
def mark_read(
    notification_id: int,
    user=Depends(get_current_user),
    conn=Depends(get_conn),
):
    cursor = conn.cursor()
    cursor.execute(
        "UPDATE notifications SET is_read = 1 WHERE id = ? AND user_id = ?",
        (notification_id, user["id"]),
    )
    conn.commit()
    return {"status": "ok"}


@router.delete("/read")
def purge_read(user=Depends(get_current_user), conn=Depends(get_conn)):
    cursor = conn.cursor()
    cursor.execute(
        "DELETE FROM notifications WHERE user_id = ? AND is_read = 1", (user["id"],)
    )
    conn.commit()
    return {"status": "ok"}
