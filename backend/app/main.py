import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .config import get_settings
from .firebase import init_firebase
from .routers import (
    achievements,
    auth,
    gacha,
    heroes,
    notifications,
    profile,
    quests,
    wallet,
)

logging.basicConfig(level=logging.INFO)


@asynccontextmanager
async def lifespan(_app: FastAPI):
    init_firebase()
    yield


settings = get_settings()

app = FastAPI(title="TodoList Game API", version="1.0.0", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origin_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health", tags=["meta"])
def health():
    return {"status": "ok"}


app.include_router(auth.router)
app.include_router(profile.router)
app.include_router(quests.router)
app.include_router(wallet.router)
app.include_router(gacha.router)
app.include_router(heroes.router)
app.include_router(achievements.router)
app.include_router(notifications.router)
