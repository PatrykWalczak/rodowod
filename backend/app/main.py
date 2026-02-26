from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
import app.models  # noqa: F401 — registers all ORM models on startup
from app.routers import auth, users

app = FastAPI(
    title="RodoWod API",
    description="API platformy dla hodowców psów rasowych",
    version="0.1.0",
)

# Allow frontend (localhost:3000) to call backend (localhost:8000)
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(auth.router)
app.include_router(users.router)


@app.get("/api/health")
async def health_check():
    return {"status": "ok"}
