"""Portfolio service — fetches real GitHub user data with pagination."""
from fastapi import HTTPException
from .github_client import github_client


class PortfolioService:
    
    async def get_portfolio(
        self,
        username: str,
        page: int = 1,
        per_page: int = 30
    ) -> dict | None:
        """Fetch portfolio for a GitHub user. Returns None if not found."""
        username = username.strip().strip("/")
        
        # Get user profile
        data = await github_client.request(
            f"https://api.github.com/users/{username}"
        )
        
        if data is None:
            return None
        
        total_repos = data.get("public_repos", 0)
        total_pages = max(1, (total_repos + per_page - 1) // per_page)
        
        # Get repositories with pagination
        repos = await github_client.request(
            f"https://api.github.com/users/{username}/repos",
            params={
                "sort": "updated",
                "per_page": per_page,
                "page": page,
                "type": "owner"
            }
        )
        
        return {
            "username": username,
            "name": data.get("name") or data.get("login"),
            "bio": data.get("bio"),
            "avatar": data.get("avatar_url"),
            "followers": data.get("followers", 0),
            "following": data.get("following", 0),
            "public_repos": total_repos,
            "page": page,
            "per_page": per_page,
            "total_pages": total_pages,
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
                for r in (repos or [])
            ]
        }