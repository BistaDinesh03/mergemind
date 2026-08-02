"""Recommendation engine — personalized to user's real GitHub skills with caching."""
import asyncio
import logging
import random
from datetime import datetime, timezone
from collections import Counter
from .github_client import github_client
from .ai_service import ai_service
from .health_scorer import HealthScorer, IssueScorer
from ..database import SessionLocal
from ..models.recommendation import RecommendationHistory

logger = logging.getLogger("mergemind.recommendations")

BEGINNER_LABELS = [
    "good first issue",
    "help wanted",
    "beginner",
    "easy",
    "documentation",
]

# Global cache for recommendations per user
_rec_cache: dict = {}
REC_CACHE_TTL = 120  # 2 minutes


class RecommendationEngine:

    async def get_recommendations(self, username: str = None, limit: int = 5, language: str = None) -> list[dict]:
        cache_key = f"{username}:{limit}:{language}"
        if cache_key in _rec_cache:
            entry, timestamp = _rec_cache[cache_key]
            if time.time() - timestamp < REC_CACHE_TTL:
                return entry
        
        skill_profile = await self._build_skill_profile(username)
        
        if language:
            search_languages = [language]
        elif skill_profile["primary_languages"]:
            search_languages = skill_profile["primary_languages"][:2]
        else:
            search_languages = ["python", "javascript"]
        
        all_issues = await self._search_matching_issues(search_languages, limit * 2)
        recommendations = await self._score_by_skill_match(all_issues, skill_profile, limit, username)
        
        if len(_rec_cache) > 50:
            oldest = min(_rec_cache, key=lambda k: _rec_cache[k][1])
            del _rec_cache[oldest]
        _rec_cache[cache_key] = (recommendations, time.time())
        
        return recommendations
    
    async def _build_skill_profile(self, username: str) -> dict:
        profile = {
            "primary_languages": [],
            "secondary_languages": [],
            "topics": [],
            "experience_level": "beginner",
            "total_repos": 0,
            "total_stars": 0,
            "active_contributions": 0
        }
        
        if not username:
            return profile
        
        owned_repos = await github_client.request(
            f"https://api.github.com/users/{username}/repos",
            params={"sort": "updated", "per_page": 30, "type": "owner"}
        )
        owned_repos = owned_repos or []
        
        starred_repos = await github_client.request(
            f"https://api.github.com/users/{username}/starred",
            params={"per_page": 20}
        )
        starred_repos = starred_repos or []
        
        lang_weight = {}
        for repo in owned_repos:
            lang = repo.get("language")
            if lang and not repo.get("fork"):
                weight = 1 + repo.get("stargazers_count", 0) * 0.1
                lang_weight[lang] = lang_weight.get(lang, 0) + weight
        
        sorted_langs = sorted(lang_weight.items(), key=lambda x: x[1], reverse=True)
        profile["primary_languages"] = [lang for lang, _ in sorted_langs[:3]]
        
        starred_langs = Counter()
        for repo in starred_repos:
            lang = repo.get("language")
            if lang and lang not in profile["primary_languages"]:
                starred_langs[lang] += 1
        profile["secondary_languages"] = [lang for lang, _ in starred_langs.most_common(2)]
        
        all_topics = []
        for repo in owned_repos + starred_repos:
            all_topics.extend(repo.get("topics", [])[:5])
        topic_counts = Counter(all_topics)
        profile["topics"] = [t for t, _ in topic_counts.most_common(8)]
        
        profile["total_repos"] = len(owned_repos)
        profile["total_stars"] = sum(r.get("stargazers_count", 0) for r in owned_repos)
        
        if profile["total_repos"] >= 30:
            profile["experience_level"] = "advanced"
        elif profile["total_repos"] >= 10:
            profile["experience_level"] = "intermediate"
        
        return profile
    
    async def _search_matching_issues(self, languages: list, limit: int) -> list:
        all_issues = []
        
        for lang in languages[:2]:
            if len(all_issues) >= limit:
                break
            
            for label in BEGINNER_LABELS[:2]:
                if len(all_issues) >= limit:
                    break
                
                try:
                    q_parts = [
                        "state:open", "type:issue", "is:public",
                        f'label:"{label}"', f"language:{lang}"
                    ]
                    
                    data = await github_client.request(
                        "https://api.github.com/search/issues",
                        {"q": " ".join(q_parts), "sort": "updated", "order": "desc", "per_page": 5}
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
                            "language": lang,
                            "is_beginner_friendly": any(l.lower() in BEGINNER_LABELS for l in issue_labels)
                        })
                        
                except Exception as e:
                    continue
        
        random.shuffle(all_issues)
        return all_issues[:limit]
    
    async def _score_by_skill_match(self, issues: list, profile: dict, limit: int, username: str) -> list:
        recommendations = []
        
        # Fetch all repo data in parallel
        repo_tasks = []
        for item in issues:
            parts = item["repo_full_name"].split("/")
            if len(parts) == 2:
                owner, repo_name = parts
                repo_tasks.append(github_client.request(f"https://api.github.com/repos/{owner}/{repo_name}"))
            else:
                repo_tasks.append(None)
        
        repo_results = await asyncio.gather(*[t if t else asyncio.sleep(0) for t in repo_tasks], return_exceptions=True)
        
        for i, item in enumerate(issues):
            if len(recommendations) >= limit:
                break
            
            repo_data = repo_results[i] if i < len(repo_results) and not isinstance(repo_results[i], Exception) else None
            if not repo_data:
                continue
            
            issue = item["issue"]
            repo_full_name = item["repo_full_name"]
            issue_labels = item["labels"]
            issue_language = item["language"]
            
            health = HealthScorer.calculate(repo_data)
            issue_scoring = IssueScorer.calculate(issue, repo_data)
            
            is_beginner = item["is_beginner_friendly"]
            has_good_first = "good first issue" in [l.lower() for l in issue_labels]
            
            skill_match_bonus = 0
            match_reasons = []
            
            if issue_language in profile["primary_languages"]:
                skill_match_bonus += 15
                match_reasons.append(f"Matches your primary language: {issue_language}")
            elif issue_language in profile["secondary_languages"]:
                skill_match_bonus += 8
            
            base_score = issue_scoring.get("overall", 75)
            final_score = min(100, base_score + skill_match_bonus)
            
            rec = {
                "issue_number": issue["number"],
                "title": issue["title"],
                "repo": repo_full_name,
                "repo_stars": repo_data.get("stargazers_count", 0),
                "labels": issue_labels,
                "overall_score": final_score,
                "difficulty_score": 90 if has_good_first else 70 if is_beginner else 50,
                "merge_chance": 90 if has_good_first else 75 if is_beginner else 60,
                "beginner_score": 95 if has_good_first else 80 if is_beginner else 40,
                "repo_health": health.get("overall", 75),
                "url": issue["html_url"],
                "verdict": "Highly Recommended" if final_score >= 80 else "Recommended" if final_score >= 60 else "Worth Considering",
                "estimated_hours": "1-2h" if has_good_first else "2-4h" if is_beginner else "4-8h",
                "match_reasons": match_reasons,
                "reason": ai_service.generate_recommendation_reason(
                    issue["title"], repo_full_name, final_score,
                    "Easy" if has_good_first else "Medium",
                    issue_labels
                )
            }
            recommendations.append(rec)
            self._store_history(username, issue, rec, repo_full_name)
        
        recommendations.sort(key=lambda x: x["overall_score"], reverse=True)
        return recommendations
    
    def _store_history(self, username: str, issue: dict, rec: dict, repo_full_name: str):
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