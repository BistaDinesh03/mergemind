"""
Database configuration — PostgreSQL-ready with SQLite fallback.
Uses SQLAlchemy 2.0 patterns with async support prepared.
"""
from sqlalchemy import create_engine, event
from sqlalchemy.orm import sessionmaker, declarative_base
from sqlalchemy.pool import StaticPool
from .config import settings

# Use SQLite for development, PostgreSQL for production
DATABASE_URL = settings.database_url or "sqlite:///./mergemind.db"

# SQLite-specific optimizations
connect_args = {}
engine_kwargs = {}

if "sqlite" in DATABASE_URL:
    # SQLite: enable WAL mode, foreign keys, single connection for safety
    connect_args = {"check_same_thread": False}
    engine_kwargs = {"poolclass": StaticPool}
else:
    # PostgreSQL: connection pooling
    engine_kwargs = {
        "pool_size": 10,
        "max_overflow": 20,
        "pool_recycle": 3600,
        "pool_pre_ping": True,
    }

engine = create_engine(
    DATABASE_URL,
    connect_args=connect_args,
    echo=settings.debug,
    **engine_kwargs
)

# Enable SQLite optimizations
if "sqlite" in DATABASE_URL:
    @event.listens_for(engine, "connect")
    def set_sqlite_pragma(dbapi_connection, connection_record):
        cursor = dbapi_connection.cursor()
        cursor.execute("PRAGMA journal_mode=WAL")
        cursor.execute("PRAGMA foreign_keys=ON")
        cursor.execute("PRAGMA cache_size=-8000")  # 8MB cache
        cursor.close()

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


def get_db():
    """Dependency that provides a database session."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def init_db():
    """Create all tables. Call on startup."""
    Base.metadata.create_all(bind=engine)