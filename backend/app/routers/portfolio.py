from fastapi import APIRouter, Query
import httpx
from ..config import settings

router = APIRouter()

@router.get("/{username}")
async def portfolio(username: str):
    """Generate portfolio from GitHub contributions"""
    headers = {"Authorization": f"Bearer {settings.github_token}", "User-Agent": "MergeMind"}
    
    async with httpx.AsyncClient() as c:
        # Get user info
        user_r = await c.get(f"https://api.github.com/users/{username}", headers=headers)
        user = user_r.json() if user_r.status_code == 200 else {}
        
        # Get repos
        repos_r = await c.get(f"https://api.github.com/users/{username}/repos?sort=updated&per_page=10", headers=headers)
        repos = repos_r.json() if repos_r.status_code == 200 else []
        
    return {
        "username": username,
        "name": user.get("name"),
        "bio": user.get("bio"),
        "avatar": user.get("avatar_url"),
        "followers": user.get("followers", 0),
        "public_repos": user.get("public_repos", 0),
        "repositories": [
            {
                "name": r["full_name"],
                "stars": r["stargazers_count"],
                "language": r["language"],
                "description": r.get("description", "")[:100] if r.get("description") else "",
                "url": r["html_url"]
            } for r in repos
        ],
        "generated_by": "MergeMind"
    }