from typing import Dict, List, Optional
import httpx
from ..config import settings
from .issue_scorer import issue_scorer

class RecommendationEngine:
    
    def __init__(self):
        self.headers = {
            "Authorization": f"Bearer {settings.github_token}",
            "Accept": "application/vnd.github.v3+json",
            "User-Agent": "MergeMind"
        }
    
    async def get_top_recommendations(self, languages: List[str] = None, limit: int = 5) -> List[Dict]:
        if not languages:
            languages = ["python", "javascript", "typescript"]
        
        all_ranked = []
        
        # Use known repos with good first issues
        known_repos = [
            "fastapi/fastapi", "microsoft/vscode", "facebook/react",
            "vercel/next.js", "tiangolo/fastapi", "python/cpython",
            "pallets/flask", "django/django", "streamlit/streamlit"
        ]
        
        async with httpx.AsyncClient(timeout=30) as client:
            for repo_full_name in known_repos[:6]:
                try:
                    owner, repo = repo_full_name.split("/")
                    
                    # Get issues
                    r = await client.get(
                        f"https://api.github.com/repos/{owner}/{repo}/issues",
                        headers=self.headers,
                        params={"labels": "good first issue", "state": "open", "per_page": 3}
                    )
                    
                    if r.status_code != 200:
                        continue
                    
                    issues = r.json()
                    
                    # Get repo info
                    repo_r = await client.get(
                        f"https://api.github.com/repos/{owner}/{repo}",
                        headers=self.headers
                    )
                    repo_data = repo_r.json() if repo_r.status_code == 200 else {}
                    
                    for issue in issues:
                        if "pull_request" in issue:
                            continue
                        
                        labels = [l["name"] for l in issue.get("labels", [])]
                        
                        issue_data = {
                            "title": issue.get("title", ""),
                            "body": issue.get("body", ""),
                            "labels": labels,
                            "comments": issue.get("comments", 0),
                            "assignees": issue.get("assignees", [])
                        }
                        
                        repo_info = {
                            "full_name": f"{owner}/{repo}",
                            "stars": repo_data.get("stargazers_count", 0),
                            "pushed_at": repo_data.get("pushed_at")
                        }
                        
                        scoring = issue_scorer.score(issue_data, repo_info)
                        
                        time_score = scoring["factors"]["time_estimate"]["score"]
                        hours = "1-2h" if time_score >= 80 else "2-4h" if time_score >= 60 else "4-8h"
                        
                        all_ranked.append({
                            "issue_number": issue["number"],
                            "title": issue["title"],
                            "repo": f"{owner}/{repo}",
                            "repo_stars": repo_data.get("stargazers_count", 0),
                            "labels": labels,
                            "composite_score": scoring["overall_score"],
                            "overall_score": scoring["overall_score"],
                            "difficulty_score": scoring["factors"]["difficulty"]["score"],
                            "merge_chance": scoring["factors"]["merge_probability"]["score"],
                            "beginner_score": scoring["factors"]["beginner_friendly"]["score"],
                            "repo_health": scoring["factors"]["repo_activity"]["score"],
                            "url": issue["html_url"],
                            "verdict": scoring["verdict"],
                            "estimated_hours": hours,
                            "reason": scoring["factors"]["difficulty"]["reason"]
                        })
                        
                except Exception as e:
                    print(f"Error: {repo_full_name}: {e}")
                    continue
        
        all_ranked.sort(key=lambda x: x["composite_score"], reverse=True)
        return all_ranked[:limit]
    
    async def get_personalized_recommendations(self, username: str, limit: int = 5) -> Dict:
        recommendations = await self.get_top_recommendations(["python", "javascript"], limit)
        return {
            "username": username,
            "recommendations": recommendations,
            "total": len(recommendations)
        }

recommendation_engine = RecommendationEngine()