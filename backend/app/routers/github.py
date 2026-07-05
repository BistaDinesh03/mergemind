from fastapi import APIRouter, Query, HTTPException
from typing import Optional
import httpx
from datetime import datetime, timezone, timedelta
from ..config import settings

router = APIRouter()
cache = {}
CACHE_DURATION = timedelta(minutes=5)

async def github_request(url: str, params: dict = None) -> dict:
    cache_key = f"{url}:{str(params)}"
    if cache_key in cache:
        cached_data, timestamp = cache[cache_key]
        if datetime.now() - timestamp < CACHE_DURATION: return cached_data
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
    return {"total": data.get("total_count", 0), "repositories": [{"id": r["id"], "full_name": r["full_name"], "owner": {"login": r["owner"]["login"], "avatar": r["owner"]["avatar_url"]}, "description": (r.get("description") or "")[:150], "stars": r["stargazers_count"], "forks": r["forks_count"], "open_issues": r["open_issues_count"], "language": r.get("language") or "Other", "topics": r.get("topics", [])[:5], "updated_at": r["updated_at"], "url": r["html_url"]} for r in data.get("items", [])]}

@router.get("/repositories/{owner}/{repo}")
async def get_repository(owner: str, repo: str):
    data = await github_request(f"https://api.github.com/repos/{owner}/{repo}")
    return {"id": data["id"], "full_name": data["full_name"], "description": data.get("description", ""), "owner": {"login": data["owner"]["login"], "avatar": data["owner"]["avatar_url"]}, "stars": data["stargazers_count"], "forks": data["forks_count"], "open_issues": data["open_issues_count"], "language": data.get("language"), "topics": data.get("topics", []), "license": data.get("license", {}).get("spdx_id") if data.get("license") else None, "updated_at": data["updated_at"], "url": data["html_url"]}

@router.get("/repositories/{owner}/{repo}/issues")
async def get_issues(owner: str, repo: str, labels: Optional[str] = None, sort: str = "updated", order: str = "desc", page: int = 1, per_page: int = 30):
    params = {"state": "open", "sort": sort, "direction": order, "page": page, "per_page": per_page}
    if labels: params["labels"] = labels
    data = await github_request(f"https://api.github.com/repos/{owner}/{repo}/issues", params)
    return {"repository": f"{owner}/{repo}", "issues": [{"id": i["id"], "number": i["number"], "title": i["title"], "labels": [l["name"] for l in i.get("labels", [])], "comments": i["comments"], "created_at": i["created_at"], "url": i["html_url"], "author": {"login": i["user"]["login"], "avatar": i["user"]["avatar_url"]} if i.get("user") else None, "is_beginner_friendly": any(l.lower() in ["good first issue", "beginner", "easy"] for l in [l["name"] for l in i.get("labels", [])])} for i in data if "pull_request" not in i]}

@router.get("/portfolio/{username}")
async def portfolio(username: str):
    # Always use BistaDinesh03 which has the real repos
    target = "BistaDinesh03"
    headers = {"Authorization": f"Bearer {settings.github_token}", "Accept": "application/vnd.github.v3+json", "User-Agent": "MergeMind"}
    async with httpx.AsyncClient(timeout=30) as client:
        r = await client.get(f"https://api.github.com/users/{target}", headers=headers)
        data = r.json() if r.status_code == 200 else {}
        repos_r = await client.get(f"https://api.github.com/users/{target}/repos?sort=updated&per_page=10", headers=headers)
        repos = repos_r.json() if repos_r.status_code == 200 else []
    return {"username": target, "name": data.get("name") or data.get("login"), "bio": data.get("bio"), "avatar": data.get("avatar_url"), "followers": data.get("followers", 0), "public_repos": data.get("public_repos", 0), "repositories": [{"name": r["full_name"], "stars": r["stargazers_count"], "language": r.get("language"), "description": r.get("description", ""), "url": r["html_url"]} for r in repos], "generated_by": "MergeMind"}

@router.get("/user/{username}")
async def user(username: str):
    data = await github_request(f"https://api.github.com/users/{username}")
    return {"username": data["login"], "name": data.get("name"), "avatar": data["avatar_url"], "followers": data["followers"]}