"""Portfolio service — fetches real GitHub user data."""
import httpx
from fastapi import HTTPException
from ..config import settings


class PortfolioService:
    
    async def get_portfolio(self, username: str) -> dict | None:
        """Fetch portfolio for a GitHub user. Returns None if not found."""
        headers = {
            "Authorization": f"Bearer {settings.github_token}",
            "Accept": "application/vnd.github.v3+json",
            "User-Agent": "MergeMind"
        }
        
        async with httpx.AsyncClient(timeout=30) as client:
            # Get user profile
            r = await client.get(
                f"https://api.github.com/users/{username}",
                headers=headers
            )
            
            if r.status_code == 404:
                return None
            if r.status_code != 200:
                raise HTTPException(status_code=502, detail="GitHub API unavailable")
            
            data = r.json()
            
            # Get repositories
            repos_r = await client.get(
                f"https://api.github.com/users/{username}/repos",
                params={"sort": "updated", "per_page": 30, "type": "owner"},
                headers=headers
            )
            repos = repos_r.json() if repos_r.status_code == 200 else []
        
        return {
            "username": username,
            "name": data.get("name") or data.get("login"),
            "bio": data.get("bio"),
            "avatar": data.get("avatar_url"),
            "followers": data.get("followers", 0),
            "following": data.get("following", 0),
            "public_repos": data.get("public_repos", 0),
            "repositories": [
                {
                    "name": r["full_name"],
                    "stars": r["stargazers_count"],
                    "forks": r.get("forks_count", 0),
                    "language": r.get("language"),
                    "description": r.get("description", ""),
                    "url": r["html_url"],
                    "is_fork": r.get("fork", False)
                }
                for r in repos
            ]
        }