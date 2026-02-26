from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine

from app.config import settings

# Create async engine — manages connection pool to PostgreSQL
engine = create_async_engine(
    settings.DATABASE_URL,
    echo=False,  # Set to True to log all SQL queries (useful for debugging)
)

# Session factory — each request gets its own session via get_db()
AsyncSessionLocal = async_sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False,  # Keep objects accessible after commit
)
