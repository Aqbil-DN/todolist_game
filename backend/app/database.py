import psycopg2

from .config import get_settings


def get_connection():
    """Open a new psycopg2 connection (PostgreSQL is UTF-8, emoji-safe)."""
    settings = get_settings()
    if not settings.database_url:
        raise RuntimeError(
            "DATABASE_URL is not configured. Set it in backend/.env"
        )
    return psycopg2.connect(settings.database_url)


def get_conn():
    """FastAPI dependency that yields a request-scoped connection."""
    conn = get_connection()
    try:
        yield conn
    finally:
        conn.close()


def fetch_all(cursor) -> list[dict]:
    columns = [column[0] for column in cursor.description]
    return [dict(zip(columns, row)) for row in cursor.fetchall()]


def fetch_one(cursor) -> dict | None:
    row = cursor.fetchone()
    if row is None:
        return None
    columns = [column[0] for column in cursor.description]
    return dict(zip(columns, row))
