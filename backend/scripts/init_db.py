"""Initialize the database: apply data/schema.sql then data/seed.sql.

Run from the backend directory (so the .env file is picked up):

    python scripts/init_db.py
"""
import sys
from pathlib import Path

import pyodbc

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from app.config import get_settings  # noqa: E402


def split_statements(sql: str) -> list[str]:
    """Split a SQL script into individual statements.

    Skips full-line comments and blank lines, and treats a line ending in ';'
    as a statement terminator. The schema/seed files avoid semicolons inside
    string literals so this simple splitter is sufficient.
    """
    statements: list[str] = []
    buffer: list[str] = []
    for line in sql.splitlines():
        stripped = line.strip()
        if not stripped or stripped.startswith("--"):
            continue
        buffer.append(line)
        if stripped.endswith(";"):
            statements.append("\n".join(buffer).rstrip().rstrip(";"))
            buffer = []
    if buffer:
        statements.append("\n".join(buffer).rstrip().rstrip(";"))
    return [s for s in statements if s.strip()]


def run_sql_file(cursor, path: Path) -> None:
    sql = path.read_text(encoding="utf-8")
    for statement in split_statements(sql):
        cursor.execute(statement)


def main() -> None:
    settings = get_settings()
    if not settings.pyodbc_connection_string:
        print("ERROR: PYODBC_CONNECTION_STRING is not set. Create backend/.env first.")
        sys.exit(1)

    data_dir = Path(__file__).resolve().parents[1] / "data"
    conn = pyodbc.connect(settings.pyodbc_connection_string, autocommit=False)
    conn.setdecoding(pyodbc.SQL_CHAR, encoding="utf-8")
    conn.setdecoding(pyodbc.SQL_WCHAR, encoding="utf-8")
    conn.setencoding(encoding="utf-8")

    try:
        cursor = conn.cursor()
        print("Applying schema.sql ...")
        run_sql_file(cursor, data_dir / "schema.sql")
        print("Applying seed.sql ...")
        run_sql_file(cursor, data_dir / "seed.sql")
        conn.commit()
        print("Database initialized successfully.")
    except Exception:
        conn.rollback()
        raise
    finally:
        conn.close()


if __name__ == "__main__":
    main()
