"""Recommendation engine — personalized per user."""
import asyncio
import logging
import random
from .github_client import github_client
from .ai_service import ai_service
from .health_scorer import HealthScorer
from ..database import SessionLocal
from ..models.recommendation import RecommendationHistory
from datetime import datetime, timezone

logger = logging.getLogger("mergemind.recommendations")


class RecommendationEngine:
    
    async def get_recommendations(
        self,
        username: str = None,
        limit: int = 5,
        language: str = None
    ) -> list[dict]:
        """Get personalized recommendations based on user's GitHub profile."""
        
        user_languages = []
        user_repos = []
        starred_repos = []
        
        # Step 1: Fetch user's real GitHub data
        if username:
            user_data, user_repos, starred_repos = await asyncio.gather(
                self._fetch_user_profile(username),
                self._fetch_user_repos(username),
                self._fetch_starred_repos(username)
            )
            user_languages = self._extract_languages(user_repos)
        
        # Step 2: Determine search languages
        if language:
            search_languages = [language]
        elif user_languages:
            search_languages = user_languages[:3]  # Top 3 languages
        else:
            search_languages = ["python", "javascript", "typescript"]
        
        # Step 3: Search GitHub for beginner-friendly issues in user's languages
        all_issues = await self._search_issues(search_languages, limit * 3)
        
        # Step 4: Score and rank
        recommendations = await self._score_and_rank(all_issues, limit, username)
        
        return recommendations
    
    async def _fetch_user_profile(self, username: str) -> dict:
        """Fetch user's GitHub profile."""
        return await github_client.request(f"https://api.github.com/users/{username}")
    
    async def _fetch_user_repos(self, username: str) -> list:
        """Fetch user's repositories."""
        repos = await github_client.request(
            f"https://api.github.com/users/{username}/repos",
            params={"sort": "updated", "per_page": 30, "type": "owner"}
        )
        return repos or []
    
    async def _fetch_starred_repos(self, username: str) -> list:
        """Fetch user's starred repositories."""
        starred = await github_client.request(
            f"https://api.github.com/users/{username}/starred",
            params={"per_page": 20}
        )
        return starred or []
    
    def _extract_languages(self, repos: list) -> list:
        """Extract and rank languages from user's repos."""
        lang_count = {}
        for repo in repos:
            lang = repo.get("language")
            if lang and not repo.get("fork"):
                lang_count[lang] = lang_count.get(lang, 0) + repo.get("stargazers_count", 0) + 1
        
        # Sort by frequency (stars + count)
        sorted_langs = sorted(lang_count.items(), key=lambda x: x[1], reverse=True)
        return [lang for lang, _ in sorted_langs]
    
    async def _search_issues(self, languages: list, limit: int) -> list:
        """Search GitHub for beginner-friendly issues in given languages."""
        all_issues = []
        labels = ["good first issue", "help wanted", "beginner", "easy"]
        
        for lang in languages[:3]:  # Search top 3 languages
            for label in labels[:2]:  # Try 2 different labels
                if len(all_issues) >= limit:
                    break
                
                try:
                    # Search repositories in this language
                    repos = await github_client.request(
                        "https://api.github.com/search/repositories",
                        {
                            "q": f"language:{lang} stars:>50 good-first-issues:>0",
                            "sort": "updated",
                            "per_page": 5
                        }
                    )
                    
                    if not repos:
                        continue
                    
                    for repo in repos.get("items", [])[:3]:
                        if len(all_issues) >= limit:
                            break
                        
                        owner = repo["owner"]["login"]
                        repo_name = repo["name"]
                        
                        issues = await github_client.request(
                            f"https://api.github.com/repos/{owner}/{repo_name}/issues",
                            params={
                                "state": "open",
                                "labels": label,
                                "sort": "updated",
                                "per_page": 3
                            }
                        )
                        
                        if not issues:
                            continue
                        
                        for issue in issues:
                            if "pull_request" in issue:
                                continue
                            if len(all_issues) >= limit:
                                break
                            
                            all_issues.append({
                                "issue": issue,
                                "repo_data": repo,
                                "repo_full_name": f"{owner}/{repo_name}"
                            })
                            
                except Exception as e:
                    logger.warning(f"Search failed for {lang}/{label}: {str(e)[:80]}")
                    continue
        
        # Shuffle to add variety
        random.shuffle(all_issues)
        return all_issues[:limit]
    
    async def _score_and_rank(self, issues: list, limit: int, username: str) -> list:
        """Score issues and generate recommendations."""
        recommendations = []
        
        for item in issues:
            if len(recommendations) >= limit:
                break
            
            issue = item["issue"]
            repo_data = item["repo_data"]
            repo_full_name = item["repo_full_name"]
            
            health = HealthScorer.calculate(repo_data)
            issue_labels = [l["name"] for l in issue.get("labels", [])]
            
            is_beginner = any(
                l.lower() in ["good first issue", "beginner", "easy"]
                for l in issue_labels
            )
            
            rec = {
                "issue_number": issue["number"],
                "title": issue["title"],
                "repo": repo_full_name,
                "repo_stars": repo_data.get("stargazers_count", 0),
                "labels": issue_labels,
                "overall_score": health.get("overall", 75),
                "difficulty_score": 85 if is_beginner else 55,
                "merge_chance": 88 if is_beginner else 65,
                "beginner_score": 92 if is_beginner else 45,
                "repo_health": health.get("overall", 75),
                "url": issue["html_url"],
                "verdict": "Highly Recommended" if is_beginner and health.get("overall", 0) >= 70 else "Recommended",
                "estimated_hours": "1-2h" if is_beginner else "2-4h",
                "reason": ai_service.generate_recommendation_reason(
                    issue["title"], repo_full_name, health.get("overall", 75),
                    "Easy" if is_beginner else "Medium", issue_labels
                )
            }
            recommendations.append(rec)
            
            # Store history
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