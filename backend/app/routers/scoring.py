from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional, List
import httpx
from ..config import settings
from ..services.issue_scorer import issue_scorer

router = APIRouter()

class ScoreRequest(BaseModel):
    issue_title: str
    issue_body: Optional[str] = ""
    labels: Optional[List[str]] = []
    comments: Optional[int] = 0
    repo_full_name: Optional[str] = None
    repo_stars: Optional[int] = 0
    use_ai: Optional[bool] = False

@router.post("/score")
async def score_issue(request: ScoreRequest):
    """Score an issue with optional AI enhancement"""
    
    issue_data = {
        "title": request.issue_title,
        "body": request.issue_body or "",
        "labels": request.labels or [],
        "comments": request.comments or 0,
        "assignees": []
    }
    
    repo_data = {
        "full_name": request.repo_full_name,
        "stars": request.repo_stars or 0,
        "pushed_at": None
    } if request.repo_full_name else None
    
    if request.use_ai:
        result = await issue_scorer.score_with_ai(issue_data, repo_data)
    else:
        result = issue_scorer.score(issue_data, repo_data)
    
    return result

@router.post("/score-github-issue")
async def score_github_issue(owner: str, repo: str, issue_number: int):
    """Fetch a real GitHub issue and score it"""
    
    headers = {
        "Authorization": f"Bearer {settings.github_token}",
        "Accept": "application/vnd.github.v3+json",
        "User-Agent": "MergeMind"
    }
    
    async with httpx.AsyncClient(timeout=30) as client:
        # Fetch issue
        issue_r = await client.get(
            f"https://api.github.com/repos/{owner}/{repo}/issues/{issue_number}",
            headers=headers
        )
        if issue_r.status_code != 200:
            raise HTTPException(status_code=404, detail="Issue not found")
        issue = issue_r.json()
        
        # Fetch repo
        repo_r = await client.get(
            f"https://api.github.com/repos/{owner}/{repo}",
            headers=headers
        )
        repo_data = repo_r.json() if repo_r.status_code == 200 else None
    
    issue_data = {
        "title": issue.get("title", ""),
        "body": issue.get("body", ""),
        "labels": [l["name"] for l in issue.get("labels", [])],
        "comments": issue.get("comments", 0),
        "assignees": issue.get("assignees", [])
    }
    
    repo_info = {
        "full_name": f"{owner}/{repo}",
        "stars": repo_data.get("stargazers_count", 0) if repo_data else 0,
        "pushed_at": repo_data.get("pushed_at") if repo_data else None
    } if repo_data else None
    
    # Score with AI
    result = await issue_scorer.score_with_ai(issue_data, repo_info)
    result["issue"] = {"owner": owner, "repo": repo, "number": issue_number, "title": issue["title"]}
    
    return result