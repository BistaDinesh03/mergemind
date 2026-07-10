from fastapi import APIRouter, Query, Request, HTTPException
from typing import Optional
from ..services.recommendation_engine import RecommendationEngine
from .auth import get_optional_user

router = APIRouter()


@router.get("/top")
async def get_recommendations(
    request: Request,
    limit: int = Query(default=5, ge=1, le=20),
    language: Optional[str] = None
):
    """
    Get top issue recommendations.
    Personalized if user is authenticated.
    """
    username = await get_optional_user(request)
    engine = RecommendationEngine()
    recommendations = await engine.get_recommendations(
        username=username,
        limit=limit,
        language=language
    )
    return {"recommendations": recommendations, "personalized": username is not None}