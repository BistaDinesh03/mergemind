"""Recommendation Engine — Personalized per user."""
import logging
import httpx
from ..config import settings
from .issue_scorer import issue_scorer

logger = logging.getLogger("mergemind")

class RecommendationEngine:
    def __init__(self):
        self.headers = {"Authorization": f"Bearer {settings.github_token}", "Accept": "application/vnd.github.v3+json", "User-Agent": "MergeMind"}
    
    async def get_top_recommendations(self, username: str = None, limit: int = 5):
        """Get personalized recommendations based on user's GitHub profile."""
        
        # Step 1: Get user's languages from their repos
        user_languages = []
        if username:
            try:
                async with httpx.AsyncClient(timeout=15) as client:
                    r = await client.get(f"https://api.github.com/users/{username}/repos?per_page=20&sort=updated", headers=self.headers)
                    if r.status_code == 200:
                        repos = r.json()
                        lang_counts = {}
                        for repo in repos:
                            lang = repo.get("language")
                            if lang:
                                lang_counts[lang] = lang_counts.get(lang, 0) + 1
                        user_languages = sorted(lang_counts, key=lang_counts.get, reverse=True)[:3]
            except Exception as e:
                logger.warning(f"Could not fetch user languages: {e}")
        
        if not user_languages:
            user_languages = ["python", "javascript", "typescript"]
        
        logger.info(f"User languages: {user_languages}")
        
        # Step 2: Search repos matching user's languages
        all_ranked = []
        async with httpx.AsyncClient(timeout=30) as client:
            for lang in user_languages[:2]:
                try:
                    r = await client.get(
                        "https://api.github.com/search/repositories",
                        headers=self.headers,
                        params={"q": f"language:{lang} good-first-issues:>3 stars:>100", "sort": "stars", "per_page": 3}
                    )
                    if r.status_code != 200: continue
                    repos = r.json().get("items", [])
                    
                    for repo in repos:
                        owner = repo["owner"]["login"]
                        repo_name = repo["name"]
                        
                        issues_r = await client.get(
                            f"https://api.github.com/repos/{owner}/{repo_name}/issues",
                            headers=self.headers,
                            params={"labels": "good first issue", "state": "open", "per_page": 2}
                        )
                        if issues_r.status_code != 200: continue
                        
                        for issue in issues_r.json():
                            if "pull_request" in issue: continue
                            labels = [l["name"] for l in issue.get("labels", [])]
                            issue_data = {"title": issue.get("title", ""), "body": issue.get("body", ""), "labels": labels, "comments": issue.get("comments", 0), "assignees": issue.get("assignees", [])}
                            repo_info = {"full_name": f"{owner}/{repo_name}", "stars": repo.get("stargazers_count", 0), "pushed_at": repo.get("pushed_at")}
                            scoring = issue_scorer.score(issue_data, repo_info)
                            
                            # Boost score for matching user's primary language
                            lang_bonus = 10 if repo.get("language") == user_languages[0] else 5
                            
                            all_ranked.append({
                                "issue_number": issue["number"], "title": issue["title"], "repo": f"{owner}/{repo_name}",
                                "repo_stars": repo.get("stargazers_count", 0), "labels": labels,
                                "overall_score": min(scoring["overall_score"] + lang_bonus, 100),
                                "difficulty_score": scoring["factors"]["difficulty"]["score"],
                                "merge_chance": scoring["factors"]["merge_probability"]["score"],
                                "beginner_score": scoring["factors"]["beginner_friendly"]["score"],
                                "repo_health": scoring["factors"]["repo_activity"]["score"],
                                "url": issue["html_url"], "verdict": scoring["verdict"],
                                "estimated_hours": "1-2h" if scoring["factors"]["time_estimate"]["score"] >= 80 else "2-4h",
                                "reason": scoring["factors"]["difficulty"]["reason"]
                            })
                except Exception as e:
                    logger.error(f"Error processing language {lang}: {e}")
                    continue
        
        all_ranked.sort(key=lambda x: x["overall_score"], reverse=True)
        result = all_ranked[:limit]
        logger.info(f"Returning {len(result)} personalized recommendations")
        return result

recommendation_engine = RecommendationEngine()