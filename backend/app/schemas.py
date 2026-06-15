from typing import Optional

from pydantic import BaseModel, Field


class RegisterRequest(BaseModel):
    player_tag: str = Field(min_length=3, max_length=15)
    class_id: str
    email: Optional[str] = None


class ProfileUpdate(BaseModel):
    player_tag: Optional[str] = Field(default=None, min_length=3, max_length=15)
    title: Optional[str] = Field(default=None, max_length=50)
    email: Optional[str] = Field(default=None, max_length=255)
    bio: Optional[str] = Field(default=None, max_length=120)


class QuestCreate(BaseModel):
    title: str = Field(min_length=1, max_length=255)
    xp: int = Field(default=15, ge=0, le=10000)
    tag: str = Field(default="MISC", max_length=20)
    color: str = Field(default="#A3FF12", max_length=9)
    frequency: str = Field(default="daily", max_length=20)
    date: Optional[str] = None


class QuestUpdate(BaseModel):
    title: Optional[str] = Field(default=None, max_length=255)
    xp: Optional[int] = Field(default=None, ge=0, le=10000)
    tag: Optional[str] = Field(default=None, max_length=20)
    color: Optional[str] = Field(default=None, max_length=9)
    frequency: Optional[str] = Field(default=None, max_length=20)
    date: Optional[str] = None
    completed: Optional[bool] = None


class GachaPullRequest(BaseModel):
    times: int = Field(default=1, ge=1, le=10)
