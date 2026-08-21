"""Portfolio router with pagination support."""
from fastapi import APIRouter, HTTPException, Query, Request
from ..services.portfolio_service import PortfolioService
from ..database import SessionLocal
from ..models.recommendation import RecommendationHistory
from .auth import get_current_user

router = APIRouter(tags=["Portfolio"])


@router.get("/{username}")
async def get_portfolio(
    username: str = Query(..., description="GitHub username"),
    page: int = Query(1, ge=1),
    per_page: int = Query(30, ge=1, le=100)
):
    username = username.strip().strip("/")
    if not username:
        raise HTTPException(status_code=400, detail="Username is required")
    
    service = PortfolioService()
    data = await service.get_portfolio(username, page=page, per_page=per_page)
    
    if not data:
        raise HTTPException(status_code=404, detail=f"GitHub user '{username}' not found")
    
    # Add contribution proof from MergeMind database
    db = SessionLocal()
    try:
        records = db.query(RecommendationHistory).filter(
            RecommendationHistory.user_id == username
        ).all()
        
        viewed = sum(1 for r in records if r.was_viewed)
        saved = sum(1 for r in records if r.saved)
        started = sum(1 for r in records if r.was_clicked)
        completed = sum(1 for r in records if r.was_contributed)
        
        # Extract skills from contribution labels
        skills_demonstrated = {}
        for r in records:
            if r.was_contributed and r.labels:
                for label in r.labels:
                    if label and label != "good first issue" and label != "help wanted" and label != "beginner" and label != "easy":
                        skills_demonstrated[label] = skills_demonstrated.get(label, 0) + 1
        
        data["contributions"] = {
            "viewed": viewed,
            "saved": saved,
            "started": started,
            "completed": completed,
            "total_tracked": len(records),
            "skills_demonstrated": skills_demonstrated
        }
    finally:
        db.close()
    
    return data