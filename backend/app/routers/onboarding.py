"""Onboarding router — save user preferences."""
from fastapi import APIRouter, HTTPException, Request
from pydantic import BaseModel, Field
from typing import Optional, List
from ..database import SessionLocal
from ..models.user import User
from .auth import get_current_user

router = APIRouter(tags=["Onboarding"])


class OnboardingRequest(BaseModel):
    languages: List[str] = Field(default=[], description="Preferred programming languages")
    experience_level: str = Field(default="beginner", description="beginner, intermediate, or advanced")
    interests: List[str] = Field(default=[], description="Areas of interest")
    available_time: str = Field(default="1-2h", description="Time available per session")
    preferred_difficulty: str = Field(default="beginner", description="Preferred issue difficulty")


@router.post("/save")
async def save_onboarding(request: Request, data: OnboardingRequest):
    """Save user onboarding preferences."""
    username = await get_current_user(request)
    
    db = SessionLocal()
    try:
        user = db.query(User).filter(User.username == username).first()
        
        if not user:
            user = User(username=username)
            db.add(user)
        
        user.preferred_languages = data.languages
        user.preferred_difficulty = data.preferred_difficulty
        user.interests = data.interests
        user.onboarding_completed = True
        
        db.commit()
        
        return {
            "status": "ok",
            "username": username,
            "preferences": {
                "languages": data.languages,
                "experience_level": data.experience_level,
                "interests": data.interests,
                "available_time": data.available_time,
                "preferred_difficulty": data.preferred_difficulty,
            }
        }
    finally:
        db.close()


@router.get("/status")
async def get_onboarding_status(request: Request):
    """Check if user has completed onboarding."""
    username = await get_current_user(request)
    
    db = SessionLocal()
    try:
        user = db.query(User).filter(User.username == username).first()
        
        return {
            "username": username,
            "onboarding_completed": user.onboarding_completed if user else False,
            "preferences": {
                "languages": user.preferred_languages if user else [],
                "experience_level": user.preferred_difficulty if user else "beginner",
                "interests": user.interests if user else [],
            } if user else None
        }
    finally:
        db.close()