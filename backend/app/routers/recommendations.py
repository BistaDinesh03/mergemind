"""Recommendations router with Pydantic response models."""
from fastapi import APIRouter, Query, Request
from typing import Optional
from ..services.recommendation_engine import RecommendationEngine
from .auth import get_optional_user

router = APIRouter(tags=["Recommendations"])


@router.get(
    "/top",
    summary="Get top issue recommendations",
    description="Returns AI-ranked GitHub issues recommended for contribution. Personalized when user is authenticated using their preferred languages and repository history.",
    responses={
        200: {
            "description": "List of recommended issues with AI analysis",
            "content": {"application/json": {"example": {
                "recommendations": [{
                    "issue_number": 123, "title": "Add dark mode support",
                    "repo": "fastapi/fastapi", "repo_stars": 75000,
                    "labels": ["good first issue", "documentation"],
                    "overall_score": 85, "difficulty_score": 80,
                    "merge_chance": 90, "beginner_score": 95,
                    "repo_health": 82, "url": "https://github.com/fastapi/fastapi/issues/123",
                    "verdict": "Highly Recommended", "estimated_hours": "1-2h",
                    "reason": "Great first issue with clear documentation requirements."
                }],
                "personalized": True
            }}}
        }
    }
)
async def get_recommendations(
    request: Request,
    limit: int = Query(5, ge=1, le=20, description="Maximum number of recommendations to return"),
    language: Optional[str] = Query(None, description="Filter by programming language", example="python")
):
    username = await get_optional_user(request)
    engine = RecommendationEngine()
    recommendations = await engine.get_recommendations(username=username, limit=limit, language=language)
    return {"recommendations": recommendations, "personalized": username is not None}