"""Dashboard service for MergeMind."""
import httpx
from ..config import settings
from .ai_service import ai_service


class DashboardService:
    
    async def get_dashboard(self, username: str) -> dict:
        """Get personalized dashboard data for the authenticated user."""
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
            
            if r.status_code != 200:
                return {
                    "username": username,
                    "error": "Could not fetch GitHub profile",
                    "followers": 0,
                    "public_repos": 0,
                    "repositories": []
                }
            
            data = r.json()
            
            # Get user's repos
            repos_r = await client.get(
                f"https://api.github.com/users/{username}/repos",
                params={"sort": "updated", "per_page": 10, "type": "owner"},
                headers=headers
            )
            repos = repos_r.json() if repos_r.status_code == 200 else []
        
        total_stars = sum(r.get("stargazers_count", 0) for r in repos)
        
        return {
            "username": username,
            "name": data.get("name") or data.get("login"),
            "avatar": data.get("avatar_url"),
            "followers": data.get("followers", 0),
            "following": data.get("following", 0),
            "public_repos": data.get("public_repos", 0),
            "total_stars": total_stars,
            "repositories": [
                {
                    "name": r["full_name"],
                    "stars": r["stargazers_count"],
                    "language": r.get("language"),
                    "description": r.get("description", ""),
                    "url": r["html_url"]
                }
                for r in repos
            ]
        }