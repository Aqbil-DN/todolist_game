import pyodbc

from .config import get_settings


def get_connection() -> pyodbc.Connection:
    """Open a new pyodbc connection configured for utf8mb4 (emoji-safe)."""
    settings = get_settings()
    if not settings.pyodbc_connection_string:
        raise RuntimeError(
            "PYODBC_CONNECTION_STRING is not configured. Set it in backend/.env"
        )
    conn = pyodbc.connect(settings.pyodbc_connection_string, autocommit=False)
    conn.setdecoding(pyodbc.SQL_CHAR, encoding="utf-8")
    conn.setdecoding(pyodbc.SQL_WCHAR, encoding="utf-8")
    conn.setencoding(encoding="utf-8")
    return conn


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
