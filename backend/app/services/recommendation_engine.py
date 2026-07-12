"""Recommendation engine — parallelized, with history storage."""
import asyncio
import logging
from datetime import datetime, timezone
from .github_client import github_client
from .ai_service import ai_service
from .health_scorer import HealthScorer
from ..database import SessionLocal
from ..models.recommendation import RecommendationHistory

logger = logging.getLogger("mergemind.recommendations")

DEFAULT_REPOS = [
    ("fastapi/fastapi", ["good first issue"]),
    ("microsoft/vscode", ["good first issue"]),
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
        """Get personalized recommendations and store history."""
        
        async def fetch_repo_issues(repo_full_name: str, labels: list[str]):
            try:
                owner, repo_name = repo_full_name.split("/")
                issues_task = github_client.request(
                    f"https://api.github.com/repos/{owner}/{repo_name}/issues",
                    params={"state": "open", "labels": ",".join(labels), "sort": "updated", "per_page": 3}
                )
                repo_task = github_client.request(
                    f"https://api.github.com/repos/{owner}/{repo_name}"
                )
                issues, repo_data = await asyncio.gather(issues_task, repo_task)
                return repo_full_name, issues, repo_data
            except Exception as e:
                logger.warning(f"Skipping {repo_full_name}: {str(e)[:80]}")
                return repo_full_name, None, None
        
        tasks = [fetch_repo_issues(repo, labels) for repo, labels in DEFAULT_REPOS]
        results = await asyncio.gather(*tasks)
        
        recommendations = []
        for repo_full_name, issues, repo_data in results:
            if not issues or not repo_data:
                continue
            if len(recommendations) >= limit:
                break
            
            health = HealthScorer.calculate(repo_data)
            
            for issue in issues:
                if "pull_request" in issue:
                    continue
                if len(recommendations) >= limit:
                    break
                
                issue_labels = [l["name"] for l in issue.get("labels", [])]
                
                rec = {
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
                        issue["title"], repo_full_name, health.get("overall", 75),
                        "Easy" if "good first issue" in [l.lower() for l in issue_labels] else "Medium",
                        issue_labels
                    )
                }
                recommendations.append(rec)
                
                # Store in recommendation history
                self._store_history(username, issue, rec, repo_full_name)
        
        return recommendations
    
    def _store_history(self, username: str, issue: dict, rec: dict, repo_full_name: str):
        """Store recommendation in database if user is authenticated."""
        if not username:
            return
        
        try:
            db = SessionLocal()
            
            # Check for duplicate
            existing = db.query(RecommendationHistory).filter(
                RecommendationHistory.user_id == username,
                RecommendationHistory.issue_github_id == issue["id"]
            ).first()
            
            if existing:
                db.close()
                return
            
            # Store new record
            history = RecommendationHistory(
                user_id=username,
                issue_github_id=issue["id"],
                issue_number=issue["number"],
                issue_title=issue["title"],
                repository_full_name=repo_full_name,
                overall_score=rec["overall_score"],
                difficulty_score=rec["difficulty_score"],
                merge_chance=rec["merge_chance"],
                beginner_score=rec["beginner_score"],
                repo_health=rec["repo_health"],
                verdict=rec["verdict"],
                estimated_hours=rec["estimated_hours"],
                ai_reason=rec["reason"],
                labels=rec["labels"],
                was_viewed=False,
                was_clicked=False,
                was_contributed=False,
                recommended_at=datetime.now(timezone.utc)
            )
            db.add(history)
            db.commit()
            db.close()
            
            logger.debug(f"Stored recommendation: {username} -> {repo_full_name}#{issue['number']}")
            
        except Exception as e:
            logger.warning(f"Failed to store recommendation: {str(e)[:80]}")