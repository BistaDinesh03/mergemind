"""Recommendation history router."""
from fastapi import APIRouter, Request, Query
from ..database import SessionLocal
from ..models.recommendation import RecommendationHistory
from .auth import get_current_user

router = APIRouter(tags=["History"])


@router.get("/recommendations")
async def get_recommendation_history(
    request: Request,
    limit: int = Query(20, ge=1, le=100),
    offset: int = Query(0, ge=0)
):
    """Get recommendation history for the authenticated user."""
    username = await get_current_user(request)
    
    db = SessionLocal()
    try:
        records = db.query(RecommendationHistory).filter(
            RecommendationHistory.user_id == username
        ).order_by(
            RecommendationHistory.recommended_at.desc()
        ).offset(offset).limit(limit).all()
        
        total = db.query(RecommendationHistory).filter(
            RecommendationHistory.user_id == username
        ).count()
        
        return {
            "username": username,
            "total": total,
            "offset": offset,
            "limit": limit,
            "history": [
                {
                    "id": r.id,
                    "issue_github_id": r.issue_github_id,
                    "issue_number": r.issue_number,
                    "issue_title": r.issue_title,
                    "repository_full_name": r.repository_full_name,
                    "overall_score": r.overall_score,
                    "difficulty_score": r.difficulty_score,
                    "merge_chance": r.merge_chance,
                    "beginner_score": r.beginner_score,
                    "repo_health": r.repo_health,
                    "verdict": r.verdict,
                    "estimated_hours": r.estimated_hours,
                    "ai_reason": r.ai_reason,
                    "labels": r.labels,
                    "was_viewed": r.was_viewed,
                    "was_clicked": r.was_clicked,
                    "was_contributed": r.was_contributed,
                    "recommended_at": r.recommended_at.isoformat() if r.recommended_at else None
                }
                for r in records
            ]
        }
    finally:
        db.close()


@router.post("/recommendations/{issue_github_id}/viewed")
async def mark_viewed(request: Request, issue_github_id: int):
    """Mark a recommendation as viewed."""
    username = await get_current_user(request)
    
    db = SessionLocal()
    try:
        record = db.query(RecommendationHistory).filter(
            RecommendationHistory.user_id == username,
            RecommendationHistory.issue_github_id == issue_github_id
        ).first()
        
        if record:
            record.was_viewed = True
            db.commit()
            return {"status": "ok"}
        
        return {"status": "not_found"}
    finally:
        db.close()