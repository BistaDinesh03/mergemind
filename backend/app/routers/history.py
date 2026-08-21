"""Recommendation history and progress tracking router."""
from fastapi import APIRouter, Request, Query, HTTPException
from datetime import datetime, timezone
from ..database import SessionLocal
from ..models.recommendation import RecommendationHistory
from ..services.github_client import github_client
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
        ).order_by(RecommendationHistory.recommended_at.desc()).offset(offset).limit(limit).all()
        
        total = db.query(RecommendationHistory).filter(RecommendationHistory.user_id == username).count()
        
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
                    "verdict": r.verdict,
                    "estimated_hours": r.estimated_hours,
                    "labels": r.labels,
                    "saved": r.saved,
                    "was_viewed": r.was_viewed,
                    "was_clicked": r.was_clicked,
                    "was_contributed": r.was_contributed,
                    "pr_url": r.pr_url,
                    "pr_number": r.pr_number,
                    "pr_status": r.pr_status,
                    "pr_merged": r.pr_merged,
                    "pr_merged_at": r.pr_merged_at.isoformat() if r.pr_merged_at else None,
                    "recommended_at": r.recommended_at.isoformat() if r.recommended_at else None
                }
                for r in records
            ]
        }
    finally:
        db.close()


@router.get("/saved")
async def get_saved_recommendations(request: Request):
    """Get user's saved recommendations."""
    username = await get_current_user(request)
    
    db = SessionLocal()
    try:
        records = db.query(RecommendationHistory).filter(
            RecommendationHistory.user_id == username,
            RecommendationHistory.saved == True
        ).order_by(RecommendationHistory.interacted_at.desc()).all()
        
        return {
            "username": username,
            "total": len(records),
            "saved": [
                {
                    "id": r.id,
                    "issue_github_id": r.issue_github_id,
                    "issue_number": r.issue_number,
                    "issue_title": r.issue_title,
                    "repository_full_name": r.repository_full_name,
                    "overall_score": r.overall_score,
                    "labels": r.labels,
                    "saved_at": r.interacted_at.isoformat() if r.interacted_at else None
                }
                for r in records
            ]
        }
    finally:
        db.close()


@router.get("/progress")
async def get_progress(request: Request):
    """Get user's contribution progress stats."""
    username = await get_current_user(request)
    
    db = SessionLocal()
    try:
        all_records = db.query(RecommendationHistory).filter(
            RecommendationHistory.user_id == username
        ).all()
        
        merged_prs = sum(1 for r in all_records if r.pr_merged)
        open_prs = sum(1 for r in all_records if r.pr_status == "open")
        
        return {
            "username": username,
            "progress": {
                "viewed": sum(1 for r in all_records if r.was_viewed),
                "saved": sum(1 for r in all_records if r.saved),
                "started": sum(1 for r in all_records if r.was_clicked),
                "completed": sum(1 for r in all_records if r.was_contributed),
                "merged_prs": merged_prs,
                "open_prs": open_prs,
                "total_recommendations": len(all_records),
            }
        }
    finally:
        db.close()


@router.post("/recommendations/{issue_github_id}/save")
async def save_recommendation(request: Request, issue_github_id: int):
    username = await get_current_user(request)
    db = SessionLocal()
    try:
        record = db.query(RecommendationHistory).filter(
            RecommendationHistory.user_id == username,
            RecommendationHistory.issue_github_id == issue_github_id
        ).first()
        if record:
            record.saved = True
            record.interacted_at = datetime.now(timezone.utc)
            db.commit()
            return {"status": "ok", "saved": True}
        return {"status": "not_found", "saved": False}
    finally:
        db.close()


@router.post("/recommendations/{issue_github_id}/unsave")
async def unsave_recommendation(request: Request, issue_github_id: int):
    username = await get_current_user(request)
    db = SessionLocal()
    try:
        record = db.query(RecommendationHistory).filter(
            RecommendationHistory.user_id == username,
            RecommendationHistory.issue_github_id == issue_github_id
        ).first()
        if record:
            record.saved = False
            db.commit()
            return {"status": "ok", "saved": False}
        return {"status": "not_found", "saved": False}
    finally:
        db.close()


@router.post("/recommendations/{issue_github_id}/viewed")
async def mark_viewed(request: Request, issue_github_id: int):
    username = await get_current_user(request)
    db = SessionLocal()
    try:
        record = db.query(RecommendationHistory).filter(
            RecommendationHistory.user_id == username,
            RecommendationHistory.issue_github_id == issue_github_id
        ).first()
        if record:
            record.was_viewed = True
            record.interacted_at = datetime.now(timezone.utc)
            db.commit()
            return {"status": "ok"}
        return {"status": "not_found"}
    finally:
        db.close()


@router.post("/recommendations/{issue_github_id}/started")
async def mark_started(request: Request, issue_github_id: int):
    username = await get_current_user(request)
    db = SessionLocal()
    try:
        record = db.query(RecommendationHistory).filter(
            RecommendationHistory.user_id == username,
            RecommendationHistory.issue_github_id == issue_github_id
        ).first()
        if record:
            record.was_clicked = True
            record.interacted_at = datetime.now(timezone.utc)
            db.commit()
            return {"status": "ok"}
        return {"status": "not_found"}
    finally:
        db.close()


@router.post("/recommendations/{issue_github_id}/completed")
async def mark_completed(request: Request, issue_github_id: int):
    username = await get_current_user(request)
    db = SessionLocal()
    try:
        record = db.query(RecommendationHistory).filter(
            RecommendationHistory.user_id == username,
            RecommendationHistory.issue_github_id == issue_github_id
        ).first()
        if record:
            record.was_contributed = True
            record.interacted_at = datetime.now(timezone.utc)
            db.commit()
            return {"status": "ok"}
        return {"status": "not_found"}
    finally:
        db.close()


@router.post("/sync-pull-requests")
async def sync_pull_requests(request: Request):
    """
    Fetch the user's real GitHub PRs and match them against tracked issues.
    Updates pr_status, pr_merged, pr_url, pr_merged_at when found.
    """
    username = await get_current_user(request)
    
    # Search for PRs from this user across all repos
    q = f"type:pr author:{username} state:all"
    data = await github_client.request(
        "https://api.github.com/search/issues",
        {"q": q, "sort": "updated", "order": "desc", "per_page": 50}
    )
    
    if not data:
        return {"username": username, "synced": 0, "prs_found": 0}
    
    prs = data.get("items", [])
    matched = 0
    
    db = SessionLocal()
    try:
        tracked = db.query(RecommendationHistory).filter(
            RecommendationHistory.user_id == username,
            RecommendationHistory.was_contributed == True
        ).all()
        
        tracked_by_issue = {r.issue_github_id: r for r in tracked}
        
        for pr in prs:
            pr_number = pr.get("number")
            pr_url = pr.get("html_url", "")
            pr_state = pr.get("state", "")
            repo_full_name = pr.get("repository_url", "").replace("https://api.github.com/repos/", "")
            
            # Try to match by checking if the PR references a tracked issue
            # GitHub search for PRs linked to specific issues
            for tracked_issue_id, tracked_record in tracked_by_issue.items():
                if tracked_record.pr_status == "merged":
                    continue  # Already merged, skip
                
                # Check if this PR is for the same repo
                if tracked_record.repository_full_name == repo_full_name:
                    tracked_record.pr_url = pr_url
                    tracked_record.pr_number = pr_number
                    tracked_record.pr_status = "merged" if pr_state == "closed" and "merged" in str(pr.get("pull_request", {})) else pr_state
                    tracked_record.pr_merged = True if pr_state == "closed" and pr.get("pull_request", {}).get("merged_at") else False
                    if pr.get("pull_request", {}).get("merged_at"):
                        tracked_record.pr_merged_at = datetime.fromisoformat(pr["pull_request"]["merged_at"].replace("Z", "+00:00"))
                    matched += 1
                    break
        
        db.commit()
        
        return {
            "username": username,
            "synced": matched,
            "prs_found": len(prs),
            "merged_count": sum(1 for r in tracked if r.pr_merged)
        }
    finally:
        db.close()