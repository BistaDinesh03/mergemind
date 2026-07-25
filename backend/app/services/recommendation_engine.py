"""Recommendation engine — recommends real GitHub Issues, not repos."""
import asyncio
import logging
import random
from datetime import datetime, timezone
from .github_client import github_client
from .ai_service import ai_service
from .health_scorer import HealthScorer
from ..database import SessionLocal
from ..models.recommendation import RecommendationHistory

logger = logging.getLogger("mergemind.recommendations")

BEGINNER_LABELS = [
    "good first issue",
    "help wanted",
    "beginner",
    "easy",
    "documentation",
    "good first bug",
    "up-for-grabs",
    "first-timers-only",
]


class RecommendationEngine:

    async def get_recommendations(
        self,
        username: str = None,
        limit: int = 5,
        language: str = None
    ) -> list[dict]:
        """Get personalized issue recommendations from real GitHub Issues."""
        
        user_languages = []
        
        # Step 1: Get user's languages from their repos
        if username:
            repos = await github_client.request(
                f"https://api.github.com/users/{username}/repos",
                params={"sort": "updated", "per_page": 30, "type": "owner"}
            )
            if repos:
                lang_count = {}
                for repo in repos:
                    lang = repo.get("language")
                    if lang and not repo.get("fork"):
                        lang_count[lang] = lang_count.get(lang, 0) + repo.get("stargazers_count", 0) + 1
                sorted_langs = sorted(lang_count.items(), key=lambda x: x[1], reverse=True)
                user_languages = [lang for lang, _ in sorted_langs[:4]]
        
        # Step 2: Determine search languages
        if language:
            search_languages = [language]
        elif user_languages:
            search_languages = user_languages
        else:
            search_languages = ["python", "javascript", "typescript", "go", "rust"]
        
        # Step 3: Search GitHub Issues directly using the Issues Search API
        all_issues = await self._search_beginner_issues(search_languages, limit * 4)
        
        # Step 4: Enrich with repo health data and rank
        recommendations = await self._enrich_and_rank(all_issues, limit, username)
        
        return recommendations
    
    async def _search_beginner_issues(self, languages: list, limit: int) -> list:
        """Search GitHub Issues API for beginner-friendly issues."""
        all_issues = []
        
        for lang in languages[:3]:
            if len(all_issues) >= limit:
                break
            
            for label in BEGINNER_LABELS[:4]:
                if len(all_issues) >= limit:
                    break
                
                try:
                    q_parts = [
                        "state:open",
                        "type:issue",
                        "is:public",
                        f'label:"{label}"',
                        f"language:{lang}"
                    ]
                    
                    data = await github_client.request(
                        "https://api.github.com/search/issues",
                        {
                            "q": " ".join(q_parts),
                            "sort": "updated",
                            "order": "desc",
                            "per_page": 10
                        }
                    )
                    
                    if not data:
                        continue
                    
                    for item in data.get("items", []):
                        if "pull_request" in item:
                            continue
                        if len(all_issues) >= limit:
                            break
                        
                        repo_url = item.get("repository_url", "")
                        repo_full_name = repo_url.replace("https://api.github.com/repos/", "")
                        
                        if not repo_full_name:
                            continue
                        
                        issue_labels = [l["name"] for l in item.get("labels", [])]
                        
                        all_issues.append({
                            "issue": item,
                            "repo_full_name": repo_full_name,
                            "labels": issue_labels,
                            "matched_label": label,
                            "is_beginner_friendly": any(
                                l.lower() in BEGINNER_LABELS
                                for l in issue_labels
                            )
                        })
                        
                except Exception as e:
                    logger.warning(f"Issue search failed for {lang}/{label}: {str(e)[:80]}")
                    continue
        
        random.shuffle(all_issues)
        return all_issues[:limit]
    
    async def _enrich_and_rank(self, issues: list, limit: int, username: str) -> list:
        """Fetch repo data for each issue, score, and rank."""
        recommendations = []
        
        for item in issues:
            if len(recommendations) >= limit:
                break
            
            issue = item["issue"]
            repo_full_name = item["repo_full_name"]
            issue_labels = item["labels"]
            
            # Fetch repository data for health score
            parts = repo_full_name.split("/")
            if len(parts) != 2:
                continue
            
            owner, repo_name = parts
            repo_data = await github_client.request(
                f"https://api.github.com/repos/{owner}/{repo_name}"
            )
            
            if not repo_data:
                continue
            
            health = HealthScorer.calculate(repo_data)
            
            is_beginner = item["is_beginner_friendly"]
            has_good_first = "good first issue" in [l.lower() for l in issue_labels]
            
            rec = {
                "issue_number": issue["number"],
                "title": issue["title"],
                "repo": repo_full_name,
                "repo_stars": repo_data.get("stargazers_count", 0),
                "labels": issue_labels,
                "overall_score": health.get("overall", 75),
                "difficulty_score": 90 if has_good_first else 70 if is_beginner else 50,
                "merge_chance": 90 if has_good_first else 75 if is_beginner else 60,
                "beginner_score": 95 if has_good_first else 80 if is_beginner else 40,
                "repo_health": health.get("overall", 75),
                "url": issue["html_url"],
                "verdict": "Highly Recommended" if has_good_first and health.get("overall", 0) >= 70 else "Recommended" if is_beginner else "Worth Considering",
                "estimated_hours": "1-2h" if has_good_first else "2-4h" if is_beginner else "4-8h",
                "reason": ai_service.generate_recommendation_reason(
                    issue["title"], repo_full_name, health.get("overall", 75),
                    "Easy" if has_good_first else "Medium" if is_beginner else "Moderate",
                    issue_labels
                )
            }
            recommendations.append(rec)
            
            # Store in history
            self._store_history(username, issue, rec, repo_full_name)
        
        return recommendations
    
    def _store_history(self, username: str, issue: dict, rec: dict, repo_full_name: str):
        """Store recommendation in database."""
        if not username:
            return
        try:
            db = SessionLocal()
            existing = db.query(RecommendationHistory).filter(
                RecommendationHistory.user_id == username,
                RecommendationHistory.issue_github_id == issue["id"]
            ).first()
            if existing:
                db.close()
                return
            
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
        except Exception as e:
            logger.warning(f"Failed to store history: {str(e)[:80]}")