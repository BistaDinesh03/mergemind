"""Recommendation history and progress tracking router."""
from fastapi import APIRouter, Request, Query, HTTPException
from datetime import datetime, timezone
from ..database import SessionLocal
from ..models.recommendation import RecommendationHistory
from ..services.github_client import github_client
from .auth import get_current_user

router = APIRouter(tags=["History"])


@router.get("/in-progress")
async def get_in_progress(request: Request):
    """Get contributions the user has started but not finished."""
    username = await get_current_user(request)
    
    db = SessionLocal()
    try:
        records = db.query(RecommendationHistory).filter(
            RecommendationHistory.user_id == username,
            RecommendationHistory.was_clicked == True,
            RecommendationHistory.was_contributed == False
        ).order_by(RecommendationHistory.interacted_at.desc()).limit(3).all()
        
        return {
            "username": username,
            "total": len(records),
            "in_progress": [
                {
                    "id": r.id,
                    "issue_github_id": r.issue_github_id,
                    "issue_number": r.issue_number,
                    "issue_title": r.issue_title,
                    "repository_full_name": r.repository_full_name,
                    "current_step": r.current_step or 0,
                    "total_steps": r.total_steps or 8,
                    "completed_steps": r.completed_steps or [],
                    "last_updated": r.interacted_at.isoformat() if r.interacted_at else None
                }
                for r in records
            ]
        }
    finally:
        db.close()


@router.post("/recommendations/{issue_github_id}/step/{step_number}")
async def update_step(request: Request, issue_github_id: int, step_number: int):
    """Update the current step for a contribution in progress."""
    username = await get_current_user(request)
    
    db = SessionLocal()
    try:
        record = db.query(RecommendationHistory).filter(
            RecommendationHistory.user_id == username,
            RecommendationHistory.issue_github_id == issue_github_id
        ).first()
        
        if record:
            record.current_step = step_number
            record.was_clicked = True
            record.interacted_at = datetime.now(timezone.utc)
            
            completed = list(record.completed_steps or [])
            if step_number not in completed:
                completed.append(step_number)
            record.completed_steps = completed
            
            db.commit()
            return {"status": "ok", "current_step": step_number, "completed_steps": completed}
        
        return {"status": "not_found"}
    finally:
        db.close()


@router.get("/recommendations")
async def get_recommendation_history(request: Request, limit: int = Query(20, ge=1, le=100), offset: int = Query(0, ge=0)):
    username = await get_current_user(request)
    db = SessionLocal()
    try:
        records = db.query(RecommendationHistory).filter(
            RecommendationHistory.user_id == username
        ).order_by(RecommendationHistory.recommended_at.desc()).offset(offset).limit(limit).all()
        total = db.query(RecommendationHistory).filter(RecommendationHistory.user_id == username).count()
        return {
            "username": username, "total": total, "offset": offset, "limit": limit,
            "history": [
                {
                    "id": r.id, "issue_github_id": r.issue_github_id, "issue_number": r.issue_number,
                    "issue_title": r.issue_title, "repository_full_name": r.repository_full_name,
                    "overall_score": r.overall_score, "verdict": r.verdict, "estimated_hours": r.estimated_hours,
                    "labels": r.labels, "saved": r.saved, "was_viewed": r.was_viewed,
                    "was_clicked": r.was_clicked, "was_contributed": r.was_contributed,
                    "current_step": r.current_step or 0, "total_steps": r.total_steps or 8,
                    "completed_steps": r.completed_steps or [],
                    "pr_url": r.pr_url, "pr_status": r.pr_status, "pr_merged": r.pr_merged,
                    "recommended_at": r.recommended_at.isoformat() if r.recommended_at else None
                }
                for r in records
            ]
        }
    finally:
        db.close()


@router.get("/saved")
async def get_saved_recommendations(request: Request):
    username = await get_current_user(request)
    db = SessionLocal()
    try:
        records = db.query(RecommendationHistory).filter(
            RecommendationHistory.user_id == username,
            RecommendationHistory.saved == True
        ).order_by(RecommendationHistory.interacted_at.desc()).all()
        return {
            "username": username, "total": len(records),
            "saved": [
                {"id": r.id, "issue_github_id": r.issue_github_id, "issue_number": r.issue_number,
                 "issue_title": r.issue_title, "repository_full_name": r.repository_full_name,
                 "overall_score": r.overall_score, "labels": r.labels,
                 "saved_at": r.interacted_at.isoformat() if r.interacted_at else None}
                for r in records
            ]
        }
    finally:
        db.close()


@router.get("/progress")
async def get_progress(request: Request):
    username = await get_current_user(request)
    db = SessionLocal()
    try:
        all_records = db.query(RecommendationHistory).filter(RecommendationHistory.user_id == username).all()
        merged_prs = sum(1 for r in all_records if r.pr_merged)
        open_prs = sum(1 for r in all_records if r.pr_status == "open")
        in_progress = sum(1 for r in all_records if r.was_clicked and not r.was_contributed)
        return {
            "username": username,
            "progress": {
                "viewed": sum(1 for r in all_records if r.was_viewed),
                "saved": sum(1 for r in all_records if r.saved),
                "started": sum(1 for r in all_records if r.was_clicked),
                "in_progress": in_progress,
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
        return {"status": "not_found"}
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
        return {"status": "not_found"}
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
    username = await get_current_user(request)
    q = f"type:pr author:{username} state:all"
    data = await github_client.request("https://api.github.com/search/issues", {"q": q, "sort": "updated", "order": "desc", "per_page": 50})
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
        for pr in prs:
            pr_number = pr.get("number")
            pr_url = pr.get("html_url", "")
            pr_state = pr.get("state", "")
            repo_full_name = pr.get("repository_url", "").replace("https://api.github.com/repos/", "")
            for tracked_record in tracked:
                if tracked_record.pr_merged:
                    continue
                if tracked_record.repository_full_name == repo_full_name:
                    tracked_record.pr_url = pr_url
                    tracked_record.pr_number = pr_number
                    tracked_record.pr_status = "merged" if pr_state == "closed" else pr_state
                    tracked_record.pr_merged = True if pr_state == "closed" else False
                    matched += 1
                    break
        db.commit()
        return {"username": username, "synced": matched, "prs_found": len(prs)}
    finally:
        db.close()