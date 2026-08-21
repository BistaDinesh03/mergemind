"""Recommendations router with Pydantic response models."""
from fastapi import APIRouter, Query, Request
from typing import Optional
from ..services.recommendation_engine import RecommendationEngine
from .auth import get_optional_user

router = APIRouter(tags=["Recommendations"])


@router.get("/top")
async def get_recommendations(
    request: Request,
    limit: int = Query(5, ge=1, le=20),
    language: Optional[str] = Query(None),
    exclude_issue_id: Optional[int] = Query(None)
):
    """
    Get top issue recommendations.
    Personalized when user is authenticated.
    exclude_issue_id ensures the user gets a DIFFERENT issue on "Find Another".
    """
    username = await get_optional_user(request)
    engine = RecommendationEngine()
    recommendations = await engine.get_recommendations(
        username=username,
        limit=limit,
        language=language,
        exclude_issue_id=exclude_issue_id
    )
    return {"recommendations": recommendations, "personalized": username is not None}