"""GitHub API router with OpenAPI documentation."""
from fastapi import APIRouter, Query, HTTPException, Path
from typing import Optional
from ..services.github_client import github_client
from ..services.ai_service import ai_service
from ..services.health_scorer import HealthScorer

router = APIRouter(tags=["GitHub"])


@router.get(
    "/repositories",
    summary="Search GitHub repositories",
    description="Search public GitHub repositories with language filtering and pagination. Results include star count, forks, open issues, and topics."
)
async def search_repositories(
    query: Optional[str] = Query(None, description="Search term for repository name or description", example="fastapi"),
    language: Optional[str] = Query(None, description="Filter by programming language", example="python"),
    sort: str = Query("stars", description="Sort order: stars, forks, or updated"),
    page: int = Query(1, ge=1, description="Page number"),
    per_page: int = Query(20, ge=1, le=100, description="Results per page")
):
    q_parts = ["stars:>10"]
    if query: q_parts.append(f"{query} in:name,description")
    if language: q_parts.append(f"language:{language}")
    data = await github_client.request("https://api.github.com/search/repositories", {"q": " ".join(q_parts), "sort": sort, "order": "desc", "page": page, "per_page": per_page})
    return {"total": data.get("total_count", 0) if data else 0, "page": page, "per_page": per_page, "repositories": [{"id": r["id"], "full_name": r["full_name"], "owner": {"login": r["owner"]["login"], "avatar": r["owner"]["avatar_url"]}, "description": (r.get("description") or "")[:150], "stars": r["stargazers_count"], "forks": r["forks_count"], "open_issues": r["open_issues_count"], "language": r.get("language") or "Other", "topics": r.get("topics", [])[:5], "updated_at": r["updated_at"], "url": r["html_url"]} for r in (data.get("items", []) if data else [])]}


@router.get(
    "/search/issues",
    summary="Search GitHub issues for contribution opportunities",
    description="Search open GitHub issues by keyword, language, and labels. Returns actual issues ready to work on — not just repository names."
)
async def search_issues(
    query: Optional[str] = Query(None, description="Search term for issue title or body"),
    language: Optional[str] = Query(None, description="Filter by programming language"),
    labels: Optional[str] = Query("good first issue,help wanted", description="Comma-separated labels to filter"),
    sort: str = Query("updated", description="Sort order: created, updated, comments"),
    order: str = Query("desc", description="Sort direction: asc or desc"),
    page: int = Query(1, ge=1, description="Page number"),
    per_page: int = Query(20, ge=1, le=100, description="Results per page")
):
    q_parts = ["state:open", "type:issue", "is:public"]
    if query: q_parts.append(f"{query} in:title,body")
    if language: q_parts.append(f"language:{language}")
    if labels:
        for label in labels.split(","):
            q_parts.append(f'label:"{label.strip()}"')
    
    data = await github_client.request("https://api.github.com/search/issues", {"q": " ".join(q_parts), "sort": sort, "order": order, "page": page, "per_page": per_page})
    
    if not data:
        return {"total": 0, "page": page, "per_page": per_page, "issues": []}
    
    return {"total": data.get("total_count", 0), "page": page, "per_page": per_page, "issues": [{"id": i["id"], "number": i["number"], "title": i["title"], "state": i.get("state", "open"), "body": (i.get("body") or "")[:200], "labels": [l["name"] for l in i.get("labels", [])], "comments": i.get("comments", 0), "created_at": i.get("created_at"), "updated_at": i.get("updated_at"), "url": i["html_url"], "repository_url": i.get("repository_url", ""), "repository_full_name": i.get("repository_url", "").replace("https://api.github.com/repos/", ""), "user": {"login": i["user"]["login"], "avatar": i["user"]["avatar_url"]} if i.get("user") else None, "is_beginner_friendly": any(l.lower() in ["good first issue", "beginner", "easy", "help wanted"] for l in [lbl["name"] for lbl in i.get("labels", [])])} for i in data.get("items", []) if "pull_request" not in i]}


@router.get(
    "/repositories/{owner}/{repo}",
    summary="Get repository details with health score",
    description="Returns detailed information about a GitHub repository including health analysis."
)
async def get_repository(
    owner: str = Path(description="Repository owner username", example="fastapi"),
    repo: str = Path(description="Repository name", example="fastapi")
):
    owner = owner.strip().strip("/"); repo = repo.strip().strip("/")
    data = await github_client.request(f"https://api.github.com/repos/{owner}/{repo}")
    if data is None: raise HTTPException(status_code=404, detail=f"Repository {owner}/{repo} not found")
    health = HealthScorer.calculate(data)
    return {"id": data["id"], "full_name": data["full_name"], "description": data.get("description", ""), "owner": {"login": data["owner"]["login"], "avatar": data["owner"]["avatar_url"]}, "stars": data["stargazers_count"], "forks": data["forks_count"], "open_issues": data["open_issues_count"], "watchers": data.get("watchers_count", 0), "language": data.get("language"), "topics": data.get("topics", []), "license": data.get("license", {}).get("spdx_id") if data.get("license") else None, "default_branch": data.get("default_branch", "main"), "pushed_at": data.get("pushed_at"), "updated_at": data.get("updated_at"), "url": data["html_url"], "health": health}


@router.get(
    "/repositories/{owner}/{repo}/issues",
    summary="List repository issues",
    description="Returns open issues for a repository with label filtering and pagination."
)
async def get_issues(
    owner: str = Path(description="Repository owner", example="fastapi"),
    repo: str = Path(description="Repository name", example="fastapi"),
    labels: Optional[str] = Query(None, description="Comma-separated label names to filter"),
    sort: str = Query("updated", description="Sort by: created, updated, or comments"),
    order: str = Query("desc", description="Sort direction: asc or desc"),
    page: int = Query(1, ge=1, description="Page number"),
    per_page: int = Query(30, ge=1, le=100, description="Results per page")
):
    owner = owner.strip().strip("/"); repo = repo.strip().strip("/")
    params = {"state": "open", "sort": sort, "direction": order, "page": page, "per_page": per_page}
    if labels: params["labels"] = labels
    data = await github_client.request(f"https://api.github.com/repos/{owner}/{repo}/issues", params)
    return {"repository": f"{owner}/{repo}", "page": page, "per_page": per_page, "issues": [{"id": i["id"], "number": i["number"], "title": i["title"], "labels": [l["name"] for l in i.get("labels", [])], "comments": i["comments"], "created_at": i["created_at"], "url": i["html_url"], "author": {"login": i["user"]["login"], "avatar": i["user"]["avatar_url"]} if i.get("user") else None, "is_beginner_friendly": any(l.lower() in ["good first issue", "beginner", "easy"] for l in [lbl["name"] for lbl in i.get("labels", [])])} for i in (data or []) if "pull_request" not in i]}


@router.get(
    "/repositories/{owner}/{repo}/similar",
    summary="Find similar repositories",
    description="Returns repositories similar to the given one, based on language and topics. Falls back to popular repos in the same language."
)
async def similar_repos(
    owner: str = Path(description="Repository owner", example="fastapi"),
    repo: str = Path(description="Repository name", example="fastapi"),
    limit: int = Query(3, ge=1, le=10, description="Number of similar repos to return")
):
    owner = owner.strip().strip("/"); repo = repo.strip().strip("/")
    
    # Get the current repo's details
    current = await github_client.request(f"https://api.github.com/repos/{owner}/{repo}")
    if not current:
        raise HTTPException(status_code=404, detail=f"Repository {owner}/{repo} not found")
    
    repo_language = current.get("language")
    repo_topics = current.get("topics", [])[:3]
    
    similar = []
    
    # Strategy 1: Search by same topics
    if repo_topics:
        topic_query = " ".join([f"topic:{t}" for t in repo_topics[:2]])
        if repo_language:
            topic_query += f" language:{repo_language}"
        
        data = await github_client.request(
            "https://api.github.com/search/repositories",
            {"q": topic_query, "sort": "stars", "per_page": limit + 1}
        )
        if data:
            for r in data.get("items", []):
                if r["full_name"] == current["full_name"]:
                    continue
                if len(similar) >= limit:
                    break
                similar.append({
                    "id": r["id"],
                    "full_name": r["full_name"],
                    "description": (r.get("description") or "")[:120],
                    "stars": r["stargazers_count"],
                    "forks": r["forks_count"],
                    "language": r.get("language"),
                    "open_issues": r["open_issues_count"],
                    "url": r["html_url"],
                    "topics": r.get("topics", [])[:5]
                })
    
    # Strategy 2: If not enough, search by language + beginner labels
    if len(similar) < limit and repo_language:
        needed = limit - len(similar)
        data = await github_client.request(
            "https://api.github.com/search/repositories",
            {"q": f"language:{repo_language} good-first-issues:>0", "sort": "stars", "per_page": needed + 1}
        )
        if data:
            for r in data.get("items", []):
                if r["full_name"] == current["full_name"]:
                    continue
                if any(s["full_name"] == r["full_name"] for s in similar):
                    continue
                if len(similar) >= limit:
                    break
                similar.append({
                    "id": r["id"],
                    "full_name": r["full_name"],
                    "description": (r.get("description") or "")[:120],
                    "stars": r["stargazers_count"],
                    "forks": r["forks_count"],
                    "language": r.get("language"),
                    "open_issues": r["open_issues_count"],
                    "url": r["html_url"],
                    "topics": r.get("topics", [])[:5]
                })
    
    # Strategy 3: Popular repos in same language
    if len(similar) < limit and repo_language:
        needed = limit - len(similar)
        data = await github_client.request(
            "https://api.github.com/search/repositories",
            {"q": f"language:{repo_language}", "sort": "stars", "per_page": needed + 1}
        )
        if data:
            for r in data.get("items", []):
                if r["full_name"] == current["full_name"]:
                    continue
                if any(s["full_name"] == r["full_name"] for s in similar):
                    continue
                if len(similar) >= limit:
                    break
                similar.append({
                    "id": r["id"],
                    "full_name": r["full_name"],
                    "description": (r.get("description") or "")[:120],
                    "stars": r["stargazers_count"],
                    "forks": r["forks_count"],
                    "language": r.get("language"),
                    "open_issues": r["open_issues_count"],
                    "url": r["html_url"],
                    "topics": r.get("topics", [])[:5]
                })
    
    return {
        "repository": f"{owner}/{repo}",
        "similar": similar[:limit],
        "total": len(similar)
    }


@router.get(
    "/repositories/{owner}/{repo}/ai-summary",
    summary="Get AI-generated repository summary",
    description="Returns a Gemini AI-generated summary of a GitHub repository."
)
async def ai_summary(
    owner: str = Path(description="Repository owner", example="fastapi"),
    repo: str = Path(description="Repository name", example="fastapi")
):
    owner = owner.strip().strip("/"); repo = repo.strip().strip("/")
    data = await github_client.request(f"https://api.github.com/repos/{owner}/{repo}")
    if data is None: raise HTTPException(status_code=404, detail=f"Repository {owner}/{repo} not found")
    summary = ai_service.generate_repository_summary(data.get("full_name", f"{owner}/{repo}"), data.get("stargazers_count", 0), data.get("language", "Unknown"), data.get("description", ""), data.get("topics", []))
    return {"summary": summary, "repository": f"{owner}/{repo}"}


@router.get(
    "/user/{username}",
    summary="Get GitHub user profile",
    description="Returns public GitHub profile information for any user."
)
async def get_user(
    username: str = Path(description="GitHub username", example="octocat")
):
    username = username.strip().strip("/")
    data = await github_client.request(f"https://api.github.com/users/{username}")
    if data is None: raise HTTPException(status_code=404, detail=f"User {username} not found")
    return {"username": data["login"], "name": data.get("name"), "avatar": data.get("avatar_url"), "followers": data["followers"], "following": data.get("following", 0), "public_repos": data.get("public_repos", 0), "bio": data.get("bio")}