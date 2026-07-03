from fastapi import APIRouter, Query, HTTPException
from typing import Optional
import httpx
from datetime import datetime, timezone, timedelta
from ..config import settings
from ..services.health_scorer import HealthScorer
from ..services.issue_scorer import issue_scorer

router = APIRouter()
cache = {}
CACHE_DURATION = timedelta(minutes=5)

async def github_request(url: str, params: dict = None) -> dict:
    cache_key = f"{url}:{str(params)}"
    if cache_key in cache:
        cached_data, timestamp = cache[cache_key]
        if datetime.now() - timestamp < CACHE_DURATION:
            return cached_data
    headers = {"Authorization": f"Bearer {settings.github_token}", "Accept": "application/vnd.github.v3+json", "User-Agent": "MergeMind"}
    async with httpx.AsyncClient(timeout=30) as client:
        response = await client.get(url, headers=headers, params=params)
        if response.status_code != 200: raise HTTPException(status_code=500, detail="GitHub API error")
        data = response.json(); cache[cache_key] = (data, datetime.now()); return data

@router.get("/repositories")
async def search_repositories(query: Optional[str] = None, language: Optional[str] = None, sort: str = "stars", page: int = 1):
    q_parts = ["stars:>10"]
    if query: q_parts.append(f"{query} in:name,description")
    if language: q_parts.append(f"language:{language}")
    data = await github_request("https://api.github.com/search/repositories", {"q": " ".join(q_parts), "sort": sort, "order": "desc", "page": page, "per_page": 20})
    repos = []; languages_set = set()
    for repo in data.get("items", []):
        lang = repo.get("language") or "Other"; languages_set.add(lang)
        repos.append({"id": repo["id"], "full_name": repo["full_name"], "owner": {"login": repo["owner"]["login"], "avatar": repo["owner"]["avatar_url"]}, "description": (repo.get("description") or "")[:150], "stars": repo["stargazers_count"], "forks": repo["forks_count"], "open_issues": repo["open_issues_count"], "language": lang, "topics": repo.get("topics", [])[:5], "updated_at": repo["updated_at"], "url": repo["html_url"]})
    return {"total": data.get("total_count", 0), "repositories": repos, "languages": sorted([l for l in languages_set if l != "Other"])}

@router.get("/repositories/{owner}/{repo}")
async def get_repository(owner: str, repo: str):
    data = await github_request(f"https://api.github.com/repos/{owner}/{repo}")
    release = None
    try: 
        rd = await github_request(f"https://api.github.com/repos/{owner}/{repo}/releases/latest")
        release = {"tag": rd.get("tag_name")}
    except: pass
    health = HealthScorer.calculate(data)
    return {"id": data["id"], "full_name": data["full_name"], "description": data.get("description", ""), "owner": {"login": data["owner"]["login"], "avatar": data["owner"]["avatar_url"]}, "stars": data["stargazers_count"], "forks": data["forks_count"], "watchers": data["watchers_count"], "open_issues": data["open_issues_count"], "language": data.get("language"), "topics": data.get("topics", []), "license": data.get("license", {}).get("spdx_id") if data.get("license") else None, "default_branch": data.get("default_branch", "main"), "pushed_at": data["pushed_at"], "updated_at": data["updated_at"], "url": data["html_url"], "latest_release": release, "health": health}

@router.get("/repositories/{owner}/{repo}/issues")
async def get_issues(owner: str, repo: str, labels: Optional[str] = None, sort: str = "updated", order: str = "desc", search: Optional[str] = None, page: int = 1, per_page: int = 30):
    params = {"state": "open", "sort": sort, "direction": order, "page": page, "per_page": per_page}
    if labels: params["labels"] = labels
    data = await github_request(f"https://api.github.com/repos/{owner}/{repo}/issues", params)
    labels_data = await github_request(f"https://api.github.com/repos/{owner}/{repo}/labels")
    all_labels = [l["name"] for l in labels_data] if isinstance(labels_data, list) else []
    issues = []
    for issue in data:
        if "pull_request" in issue: continue
        il = [l["name"] for l in issue.get("labels", [])]
        if search:
            q = search.lower()
            if q not in issue.get("title", "").lower() and q not in (issue.get("body") or "").lower(): continue
        issues.append({"id": issue["id"], "number": issue["number"], "title": issue["title"], "labels": il, "comments": issue["comments"], "created_at": issue["created_at"], "url": issue["html_url"], "author": {"login": issue["user"]["login"], "avatar": issue["user"]["avatar_url"]} if issue.get("user") else None, "assignees": [{"login": a["login"]} for a in issue.get("assignees", [])], "is_beginner_friendly": any(l.lower() in ["good first issue", "beginner", "easy"] for l in il)})
    return {"repository": f"{owner}/{repo}", "issues": issues, "all_labels": all_labels}

@router.get("/repositories/{owner}/{repo}/issues/{issue_number}")
async def get_issue_detail(owner: str, repo: str, issue_number: int):
    """Get single issue with AI scoring"""
    
    # Fetch issue
    issue = await github_request(f"https://api.github.com/repos/{owner}/{repo}/issues/{issue_number}")
    
    # Fetch repo data
    repo_data = await github_request(f"https://api.github.com/repos/{owner}/{repo}")
    
    # Fetch comments
    comments = await github_request(f"https://api.github.com/repos/{owner}/{repo}/issues/{issue_number}/comments")
    
    # Score the issue
    issue_data = {
        "title": issue.get("title", ""),
        "body": issue.get("body", ""),
        "labels": [l["name"] for l in issue.get("labels", [])],
        "comments": issue.get("comments", 0),
        "assignees": issue.get("assignees", [])
    }
    
    repo_info = {
        "full_name": f"{owner}/{repo}",
        "stars": repo_data.get("stargazers_count", 0),
        "pushed_at": repo_data.get("pushed_at")
    }
    
    scoring = issue_scorer.score(issue_data, repo_info)
    
    return {
        "id": issue["id"],
        "number": issue["number"],
        "title": issue["title"],
        "body": issue.get("body", ""),
        "state": issue["state"],
        "labels": [l["name"] for l in issue.get("labels", [])],
        "comments_count": issue["comments"],
        "created_at": issue["created_at"],
        "updated_at": issue["updated_at"],
        "closed_at": issue.get("closed_at"),
        "url": issue["html_url"],
        "author": {
            "login": issue["user"]["login"],
            "avatar": issue["user"]["avatar_url"],
            "url": issue["user"]["html_url"]
        } if issue.get("user") else None,
        "assignees": [
            {"login": a["login"], "avatar": a["avatar_url"]}
            for a in issue.get("assignees", [])
        ],
        "repository": {
            "full_name": f"{owner}/{repo}",
            "stars": repo_data["stargazers_count"],
            "language": repo_data.get("language")
        },
        "comments": [
            {
                "id": c["id"],
                "body": c["body"][:300],
                "author": {"login": c["user"]["login"], "avatar": c["user"]["avatar_url"]},
                "created_at": c["created_at"]
            }
            for c in comments[:10] if isinstance(comments, list)
        ],
        "scoring": scoring
    }

@router.get("/repositories/{owner}/{repo}/health")
async def get_health(owner: str, repo: str):
    data = await github_request(f"https://api.github.com/repos/{owner}/{repo}")
    return HealthScorer.calculate(data)

@router.get("/repositories/{owner}/{repo}/ai-summary")
async def ai_summary(owner: str, repo: str):
    data = await github_request(f"https://api.github.com/repos/{owner}/{repo}")
    prompt = f"Summarize {data['full_name']} in 2 sentences."
    try:
        async with httpx.AsyncClient(timeout=30) as c:
            r = await c.post(f"{settings.ollama_host}/api/generate", json={"model": settings.ollama_model, "prompt": prompt, "stream": False, "options": {"num_predict": 100}})
            return {"summary": r.json().get("response", "").strip()}
    except: return {"summary": "AI unavailable"}

@router.get("/trending")
async def trending(language: str = "python"):
    data = await github_request("https://api.github.com/search/repositories", {"q": f"language:{language} stars:>50", "sort": "stars", "per_page": 10})
    return {"repos": [{"name": r["full_name"], "stars": r["stargazers_count"]} for r in data.get("items", [])]}

@router.get("/user/{username}")
async def user(username: str):
    data = await github_request(f"https://api.github.com/users/{username}")
    return {"username": data["login"], "name": data.get("name"), "followers": data["followers"]}