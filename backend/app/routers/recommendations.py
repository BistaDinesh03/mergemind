from fastapi import APIRouter, Query
from typing import Optional, List
from ..services.recommendation_engine import recommendation_engine

router = APIRouter()

@router.get("/top")
async def top_recommendations(
    languages: Optional[str] = Query(default=None, description="Comma-separated languages"),
    limit: int = Query(default=5, ge=1, le=10)
):
    """Get top recommended issues"""
    lang_list = languages.split(",") if languages else None
    recommendations = await recommendation_engine.get_top_recommendations(lang_list, limit)
    
    return {
        "count": len(recommendations),
        "recommendations": recommendations,
        "refreshed_at": "now"
    }

@router.get("/personalized/{username}")
async def personalized_recommendations(
    username: str,
    limit: int = Query(default=5)
):
    """Get personalized recommendations based on user's GitHub profile"""
    result = await recommendation_engine.get_personalized_recommendations(username, limit)
    return result