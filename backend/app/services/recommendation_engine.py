"""Recommendation engine — personalized to user's real GitHub skills with caching."""
import asyncio
import logging
import random
import time as time_module
from datetime import datetime, timezone
from collections import Counter
from .github_client import github_client
from .ai_service import ai_service
from .health_scorer import HealthScorer, IssueScorer
from ..database import SessionLocal
from ..models.recommendation import RecommendationHistory

logger = logging.getLogger("mergemind.recommendations")

BEGINNER_LABELS = ["good first issue", "help wanted", "beginner", "easy", "documentation"]

_rec_cache: dict = {}
REC_CACHE_TTL = 300

# Framework detection from repo topics and languages
FRAMEWORK_KEYWORDS = {
    "fastapi": ["fastapi", "fast-api"],
    "django": ["django"],
    "flask": ["flask"],
    "react": ["react", "reactjs", "next.js", "nextjs"],
    "next.js": ["next.js", "nextjs"],
    "vue": ["vue", "vuejs", "nuxt"],
    "angular": ["angular"],
    "node": ["node", "nodejs", "express"],
    "express": ["express"],
    "spring": ["spring", "spring-boot"],
    "rails": ["rails", "ruby-on-rails"],
    "docker": ["docker", "docker-compose"],
    "kubernetes": ["kubernetes", "k8s"],
    "graphql": ["graphql"],
    "redis": ["redis"],
    "postgresql": ["postgresql", "postgres"],
    "mongodb": ["mongodb", "mongo"],
    "aws": ["aws", "amazon-web-services"],
    "pytest": ["pytest"],
    "jest": ["jest"],
    "typescript": ["typescript"],
    "tailwindcss": ["tailwind", "tailwindcss"],
}

# Framework categories for easier matching
FRAMEWORK_CATEGORIES = {
    "python": ["fastapi", "django", "flask", "pytest"],
    "javascript": ["react", "vue", "angular", "node", "express", "jest"],
    "typescript": ["react", "vue", "angular", "node", "next.js", "typescript"],
    "go": ["docker", "kubernetes"],
    "java": ["spring"],
    "ruby": ["rails"],
    "devops": ["docker", "kubernetes", "aws", "redis"],
    "database": ["postgresql", "mongodb", "redis"],
    "frontend": ["react", "vue", "angular", "next.js", "tailwindcss"],
    "backend": ["fastapi", "django", "flask", "express", "spring", "rails", "node"],
}


class RecommendationEngine:

    async def get_recommendations(self, username: str = None, limit: int = 5, language: str = None) -> list[dict]:
        cache_key = f"{username}:{limit}:{language}"
        
        if cache_key in _rec_cache:
            entry, timestamp, _ = _rec_cache[cache_key]
            age = time_module.time() - timestamp
            if age < REC_CACHE_TTL:
                return entry
        
        if cache_key in _rec_cache:
            entry, timestamp, _ = _rec_cache[cache_key]
            asyncio.create_task(self._background_refresh(username, limit, language, cache_key))
            return entry
        
        return await self._fetch_and_cache(username, limit, language, cache_key)
    
    async def _background_refresh(self, username: str, limit: int, language: str, cache_key: str):
        try:
            await self._fetch_and_cache(username, limit, language, cache_key)
        except Exception as e:
            logger.warning(f"Background refresh failed: {e}")
    
    async def _fetch_and_cache(self, username: str, limit: int, language: str, cache_key: str) -> list[dict]:
        skill_profile = await self._build_skill_profile(username)
        
        if language:
            search_languages = [language]
        elif skill_profile["primary_languages"]:
            search_languages = skill_profile["primary_languages"][:2]
        else:
            search_languages = ["python", "javascript"]
        
        all_issues = await self._search_matching_issues(search_languages, limit * 2)
        
        if not all_issues:
            all_issues = await self._search_matching_issues(["python", "javascript", "typescript"], limit * 2)
        
        if not all_issues:
            all_issues = await self._fallback_issues(limit * 2)
        
        recommendations = await self._score_by_skill_match(all_issues, skill_profile, limit, username)
        
        if len(_rec_cache) > 50:
            oldest = min(_rec_cache, key=lambda k: _rec_cache[k][2])
            del _rec_cache[oldest]
        _rec_cache[cache_key] = (recommendations, time_module.time(), time_module.time())
        
        return recommendations
    
    async def _fallback_issues(self, limit: int) -> list:
        all_issues = []
        try:
            q_parts = ["state:open", "type:issue", "is:public", 'label:"good first issue"']
            data = await github_client.request(
                "https://api.github.com/search/issues",
                {"q": " ".join(q_parts), "sort": "updated", "order": "desc", "per_page": limit}
            )
            if data:
                for item in data.get("items", []):
                    if "pull_request" in item: continue
                    repo_url = item.get("repository_url", "")
                    repo_full_name = repo_url.replace("https://api.github.com/repos/", "")
                    if not repo_full_name: continue
                    issue_labels = [l["name"] for l in item.get("labels", [])]
                    all_issues.append({"issue": item, "repo_full_name": repo_full_name, "labels": issue_labels, "language": "unknown", "is_beginner_friendly": True})
        except Exception as e:
            logger.error(f"Fallback search failed: {e}")
        return all_issues
    
    async def _build_skill_profile(self, username: str) -> dict:
        profile = {
            "primary_languages": [],
            "secondary_languages": [],
            "frameworks": [],
            "topics": [],
            "experience_level": "beginner",
            "total_repos": 0,
            "total_stars": 0,
        }
        if not username:
            return profile
        
        owned_repos = await github_client.request(f"https://api.github.com/users/{username}/repos", params={"sort": "updated", "per_page": 30, "type": "owner"})
        owned_repos = owned_repos or []
        
        starred_repos = await github_client.request(f"https://api.github.com/users/{username}/starred", params={"per_page": 20})
        starred_repos = starred_repos or []
        
        # Extract languages
        lang_weight = {}
        for repo in owned_repos:
            lang = repo.get("language")
            if lang and not repo.get("fork"):
                lang_weight[lang] = lang_weight.get(lang, 0) + 1 + repo.get("stargazers_count", 0) * 0.1
        
        sorted_langs = sorted(lang_weight.items(), key=lambda x: x[1], reverse=True)
        profile["primary_languages"] = [lang for lang, _ in sorted_langs[:3]]
        
        # Extract frameworks from repo topics
        framework_counts = Counter()
        for repo in owned_repos + starred_repos:
            topics = [t.lower() for t in repo.get("topics", [])]
            for topic in topics:
                for framework, keywords in FRAMEWORK_KEYWORDS.items():
                    if any(kw in topic for kw in keywords):
                        framework_counts[framework] += 1
        
        profile["frameworks"] = [fw for fw, _ in framework_counts.most_common(8)]
        
        # Extract all topics
        all_topics = []
        for repo in owned_repos + starred_repos:
            all_topics.extend([t.lower() for t in repo.get("topics", [])[:5]])
        topic_counts = Counter(all_topics)
        profile["topics"] = [t for t, _ in topic_counts.most_common(10)]
        
        profile["total_repos"] = len(owned_repos)
        profile["total_stars"] = sum(r.get("stargazers_count", 0) for r in owned_repos)
        if profile["total_repos"] >= 30: profile["experience_level"] = "advanced"
        elif profile["total_repos"] >= 10: profile["experience_level"] = "intermediate"
        
        return profile
    
    async def _search_matching_issues(self, languages: list, limit: int) -> list:
        all_issues = []
        for lang in languages[:2]:
            if len(all_issues) >= limit: break
            for label in BEGINNER_LABELS[:2]:
                if len(all_issues) >= limit: break
                try:
                    q_parts = ["state:open", "type:issue", "is:public", f'label:"{label}"', f"language:{lang}"]
                    data = await github_client.request("https://api.github.com/search/issues", {"q": " ".join(q_parts), "sort": "updated", "order": "desc", "per_page": 5})
                    if not data: continue
                    for item in data.get("items", []):
                        if "pull_request" in item: continue
                        if len(all_issues) >= limit: break
                        repo_url = item.get("repository_url", "")
                        repo_full_name = repo_url.replace("https://api.github.com/repos/", "")
                        if not repo_full_name: continue
                        issue_labels = [l["name"] for l in item.get("labels", [])]
                        all_issues.append({"issue": item, "repo_full_name": repo_full_name, "labels": issue_labels, "language": lang, "is_beginner_friendly": any(l.lower() in BEGINNER_LABELS for l in issue_labels)})
                except Exception: continue
        random.shuffle(all_issues)
        return all_issues[:limit]
    
    async def _score_by_skill_match(self, issues: list, profile: dict, limit: int, username: str) -> list:
        recommendations = []
        repo_tasks = []
        for item in issues:
            parts = item["repo_full_name"].split("/")
            if len(parts) == 2:
                owner, repo_name = parts
                repo_tasks.append(github_client.request(f"https://api.github.com/repos/{owner}/{repo_name}"))
            else:
                repo_tasks.append(None)
        
        repo_results = await asyncio.gather(*[t if t else asyncio.sleep(0, result=None) for t in repo_tasks], return_exceptions=True)
        
        for i, item in enumerate(issues):
            if len(recommendations) >= limit: break
            repo_data = repo_results[i] if i < len(repo_results) and not isinstance(repo_results[i], Exception) and repo_results[i] is not None else None
            issue = item["issue"]
            repo_full_name = item["repo_full_name"]
            issue_labels = item["labels"]
            issue_language = item["language"]
            is_beginner = item["is_beginner_friendly"]
            has_good_first = "good first issue" in [l.lower() for l in issue_labels]
            
            # Build structured match reasons
            match_reasons = []
            matched_frameworks = []
            
            if issue_language in profile["primary_languages"]:
                match_reasons.append(f"Matches your primary language: {issue_language}")
                match_reasons.append(f"{issue_language}")
            elif issue_language in profile["secondary_languages"]:
                match_reasons.append(f"Matches your interest: {issue_language}")
            
            # Check repo topics for framework overlaps
            repo_topics = [t.lower() for t in (repo_data.get("topics", []) if repo_data else [])]
            for topic in repo_topics:
                for framework, keywords in FRAMEWORK_KEYWORDS.items():
                    if any(kw in topic for kw in keywords) and framework in profile["frameworks"]:
                        matched_frameworks.append(framework)
            
            matched_frameworks = list(set(matched_frameworks))[:3]
            if matched_frameworks:
                match_reasons.append(f"Uses: {', '.join(matched_frameworks)}")
            
            if has_good_first:
                match_reasons.append("Labeled good first issue")
            elif is_beginner:
                match_reasons.append("Beginner friendly")
            
            if repo_data:
                stars = repo_data.get("stargazers_count", 0)
                if stars > 10000:
                    match_reasons.append(f"Popular repo ({stars:,} stars)")
                elif stars > 100:
                    match_reasons.append(f"Active repo ({stars:,} stars)")
            
            final_score = 85 if has_good_first else 75 if is_beginner else 60
            if matched_frameworks:
                final_score = min(100, final_score + 5)
            
            rec = {
                "issue_number": issue["number"],
                "title": issue["title"],
                "repo": repo_full_name,
                "repo_stars": repo_data.get("stargazers_count", 0) if repo_data else 0,
                "labels": issue_labels,
                "overall_score": final_score,
                "difficulty_score": 90 if has_good_first else 70,
                "merge_chance": 90 if has_good_first else 75,
                "beginner_score": 95 if has_good_first else 80,
                "repo_health": 70,
                "url": issue["html_url"],
                "verdict": "Highly Recommended" if final_score >= 80 else "Recommended",
                "estimated_hours": "1-2h" if has_good_first else "2-4h",
                "match_reasons": match_reasons,
                "matched_frameworks": matched_frameworks,
                "reason": ai_service.generate_recommendation_reason(issue["title"], repo_full_name, final_score, "Easy" if has_good_first else "Medium", issue_labels)
            }
            recommendations.append(rec)
            self._store_history(username, issue, rec, repo_full_name)
        
        recommendations.sort(key=lambda x: x["overall_score"], reverse=True)
        return recommendations
    
    def _store_history(self, username: str, issue: dict, rec: dict, repo_full_name: str):
        if not username: return
        try:
            db = SessionLocal()
            existing = db.query(RecommendationHistory).filter(RecommendationHistory.user_id == username, RecommendationHistory.issue_github_id == issue["id"]).first()
            if existing: db.close(); return
            history = RecommendationHistory(user_id=username, issue_github_id=issue["id"], issue_number=issue["number"], issue_title=issue["title"], repository_full_name=repo_full_name, overall_score=rec["overall_score"], difficulty_score=rec["difficulty_score"], merge_chance=rec["merge_chance"], beginner_score=rec["beginner_score"], repo_health=rec["repo_health"], verdict=rec["verdict"], estimated_hours=rec["estimated_hours"], ai_reason=rec["reason"], labels=rec["labels"], was_viewed=False, was_clicked=False, was_contributed=False, recommended_at=datetime.now(timezone.utc))
            db.add(history); db.commit(); db.close()
        except Exception as e: logger.warning(f"Failed to store history: {str(e)[:80]}")