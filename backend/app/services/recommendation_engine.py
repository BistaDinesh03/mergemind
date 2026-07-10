"""Recommendation engine — personalized issue recommendations."""
import httpx
from ..config import settings
from .ai_service import ai_service
from .health_scorer import HealthScorer

# Well-known beginner-friendly repos
DEFAULT_REPOS = [
    ("facebook/react", ["good first issue"]),
    ("microsoft/vscode", ["good first issue"]),
    ("fastapi/fastapi", ["good first issue"]),
    ("pallets/flask", ["good first issue"]),
    ("tiangolo/sqlmodel", ["good first issue"]),
    ("vercel/next.js", ["good first issue"]),
    ("golang/go", ["good first issue"]),
    ("rust-lang/rust", ["good first issue"]),
]


class RecommendationEngine:
    
    async def get_recommendations(
        self,
        username: str = None,
        limit: int = 5,
        language: str = None
    ) -> list[dict]:
        """Get personalized issue recommendations."""
        headers = {
            "Authorization": f"Bearer {settings.github_token}",
            "Accept": "application/vnd.github.v3+json",
            "User-Agent": "MergeMind"
        }
        
        # Get user's languages if authenticated
        user_languages = []
        if username:
            async with httpx.AsyncClient(timeout=15) as client:
                r = await client.get(
                    f"https://api.github.com/users/{username}/repos",
                    params={"sort": "updated", "per_page": 20, "type": "owner"},
                    headers=headers
                )
                if r.status_code == 200:
                    repos = r.json()
                    user_languages = list(set(
                        repo.get("language") for repo in repos
                        if repo.get("language") and not repo.get("fork")
                    ))[:5]
        
        # Use provided language, user's languages, or defaults
        if language:
            search_languages = [language]
        elif user_languages:
            search_languages = user_languages
        else:
            search_languages = ["python", "javascript", "typescript"]
        
        recommendations = []
        async with httpx.AsyncClient(timeout=30) as client:
            for repo_full_name, default_labels in DEFAULT_REPOS[:8]:
                if len(recommendations) >= limit:
                    break
                
                owner, repo = repo_full_name.split("/")
                
                # Get issues
                r = await client.get(
                    f"https://api.github.com/repos/{owner}/{repo}/issues",
                    params={
                        "state": "open",
                        "labels": ",".join(default_labels),
                        "sort": "updated",
                        "per_page": 3
                    },
                    headers=headers
                )
                
                if r.status_code != 200:
                    continue
                
                issues = r.json()
                
                for issue in issues:
                    if "pull_request" in issue:
                        continue
                    if len(recommendations) >= limit:
                        break
                    
                    # Get repo info for health score
                    repo_r = await client.get(
                        f"https://api.github.com/repos/{owner}/{repo}",
                        headers=headers
                    )
                    repo_data = repo_r.json() if repo_r.status_code == 200 else {}
                    health = HealthScorer.calculate(repo_data)
                    
                    issue_labels = [l["name"] for l in issue.get("labels", [])]
                    
                    recommendations.append({
                        "issue_number": issue["number"],
                        "title": issue["title"],
                        "repo": repo_full_name,
                        "repo_stars": repo_data.get("stargazers_count", 0),
                        "labels": issue_labels,
                        "overall_score": health.get("overall", 75),
                        "difficulty_score": 80 if "good first issue" in [l.lower() for l in issue_labels] else 60,
                        "merge_chance": 85 if "good first issue" in [l.lower() for l in issue_labels] else 70,
                        "beginner_score": 90 if "good first issue" in [l.lower() for l in issue_labels] else 50,
                        "repo_health": health.get("overall", 75),
                        "url": issue["html_url"],
                        "verdict": "Highly Recommended" if health.get("overall", 0) >= 80 else "Recommended",
                        "estimated_hours": "1-2h" if "good first issue" in [l.lower() for l in issue_labels] else "2-4h",
                        "reason": ai_service.generate_recommendation_reason(
                            issue["title"],
                            repo_full_name,
                            health.get("overall", 75),
                            "Easy" if "good first issue" in [l.lower() for l in issue_labels] else "Medium",
                            issue_labels
                        )
                    })
        
        return recommendations