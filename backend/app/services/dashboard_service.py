"""Dashboard service for MergeMind — uses unified GitHub client."""
from .github_client import github_client


class DashboardService:
    
    async def get_dashboard(self, username: str) -> dict:
        """Get personalized dashboard data for the authenticated user."""
        
        # Get user profile
        data = await github_client.request(
            f"https://api.github.com/users/{username}"
        )
        
        if data is None:
            return {
                "username": username,
                "error": "Could not fetch GitHub profile",
                "followers": 0,
                "public_repos": 0,
                "repositories": []
            }
        
        # Get user's repos
        repos = await github_client.request(
            f"https://api.github.com/users/{username}/repos",
            params={"sort": "updated", "per_page": 10, "type": "owner"}
        )
        
        total_stars = sum(r.get("stargazers_count", 0) for r in (repos or []))
        
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
                for r in (repos or [])
            ]
        }