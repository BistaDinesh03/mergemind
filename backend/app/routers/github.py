"""GitHub API router with OpenAPI documentation."""
from fastapi import APIRouter, Query, HTTPException, Path
from typing import Optional
from ..services.github_client import github_client
from ..services.ai_service import ai_service
from ..services.health_scorer import HealthScorer, IssueScorer

router = APIRouter(tags=["GitHub"])


@router.get(
    "/repositories",
    summary="Search GitHub repositories",
    description="Search public GitHub repositories with language filtering and pagination."
)
async def search_repositories(
    query: Optional[str] = Query(None, description="Search term for repository name or description"),
    language: Optional[str] = Query(None, description="Filter by programming language"),
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
    description="Search open GitHub issues by keyword, language, and labels."
)
async def search_issues(
    query: Optional[str] = Query(None),
    language: Optional[str] = Query(None),
    labels: Optional[str] = Query("good first issue,help wanted"),
    sort: str = Query("updated"),
    order: str = Query("desc"),
    page: int = Query(1, ge=1),
    per_page: int = Query(20, ge=1, le=100)
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
    return {"total": data.get("total_count", 0), "page": page, "per_page": per_page, "issues": [{"id": i["id"], "number": i["number"], "title": i["title"], "labels": [l["name"] for l in i.get("labels", [])], "comments": i.get("comments", 0), "created_at": i.get("created_at"), "url": i["html_url"], "repository_full_name": i.get("repository_url", "").replace("https://api.github.com/repos/", ""), "user": {"login": i["user"]["login"], "avatar": i["user"]["avatar_url"]} if i.get("user") else None, "is_beginner_friendly": any(l.lower() in ["good first issue", "beginner", "easy", "help wanted"] for l in [lbl["name"] for lbl in i.get("labels", [])])} for i in data.get("items", []) if "pull_request" not in i]}


@router.get("/repositories/{owner}/{repo}")
async def get_repository(owner: str = Path(example="fastapi"), repo: str = Path(example="fastapi")):
    owner = owner.strip().strip("/"); repo = repo.strip().strip("/")
    data = await github_client.request(f"https://api.github.com/repos/{owner}/{repo}")
    if data is None: raise HTTPException(status_code=404, detail=f"Repository {owner}/{repo} not found")
    health = HealthScorer.calculate(data)
    return {"id": data["id"], "full_name": data["full_name"], "description": data.get("description", ""), "owner": {"login": data["owner"]["login"], "avatar": data["owner"]["avatar_url"]}, "stars": data["stargazers_count"], "forks": data["forks_count"], "open_issues": data["open_issues_count"], "watchers": data.get("watchers_count", 0), "language": data.get("language"), "topics": data.get("topics", []), "license": data.get("license", {}).get("spdx_id") if data.get("license") else None, "default_branch": data.get("default_branch", "main"), "pushed_at": data.get("pushed_at"), "updated_at": data.get("updated_at"), "url": data["html_url"], "health": health}


@router.get("/repositories/{owner}/{repo}/issues")
async def get_issues(owner: str = Path(example="fastapi"), repo: str = Path(example="fastapi"), labels: Optional[str] = Query(None), sort: str = Query("updated"), order: str = Query("desc"), page: int = Query(1, ge=1), per_page: int = Query(30, ge=1, le=100)):
    owner = owner.strip().strip("/"); repo = repo.strip().strip("/")
    params = {"state": "open", "sort": sort, "direction": order, "page": page, "per_page": per_page}
    if labels: params["labels"] = labels
    data = await github_client.request(f"https://api.github.com/repos/{owner}/{repo}/issues", params)
    return {"repository": f"{owner}/{repo}", "page": page, "per_page": per_page, "issues": [{"id": i["id"], "number": i["number"], "title": i["title"], "labels": [l["name"] for l in i.get("labels", [])], "comments": i["comments"], "created_at": i["created_at"], "url": i["html_url"], "author": {"login": i["user"]["login"], "avatar": i["user"]["avatar_url"]} if i.get("user") else None, "is_beginner_friendly": any(l.lower() in ["good first issue", "beginner", "easy"] for l in [lbl["name"] for lbl in i.get("labels", [])])} for i in (data or []) if "pull_request" not in i]}


@router.get(
    "/repositories/{owner}/{repo}/issues/{issue_number}/guide",
    summary="Generate contribution guide for an issue",
    description="Returns a step-by-step contribution guide for a specific GitHub issue. Uses AI to summarize the issue and provides practical steps based on real repository data."
)
async def contribution_guide(
    owner: str = Path(description="Repository owner"),
    repo: str = Path(description="Repository name"),
    issue_number: int = Path(description="Issue number")
):
    owner = owner.strip().strip("/")
    repo = repo.strip().strip("/")
    
    # Fetch issue and repo data in parallel
    import asyncio
    issue_data, repo_data = await asyncio.gather(
        github_client.request(f"https://api.github.com/repos/{owner}/{repo}/issues/{issue_number}"),
        github_client.request(f"https://api.github.com/repos/{owner}/{repo}")
    )
    
    if not issue_data:
        raise HTTPException(status_code=404, detail=f"Issue #{issue_number} not found")
    if not repo_data:
        raise HTTPException(status_code=404, detail=f"Repository {owner}/{repo} not found")
    
    # Get AI analysis of the issue
    issue_labels = [l["name"] for l in issue_data.get("labels", [])]
    ai_analysis = ai_service.analyze_issue(
        issue_data.get("title", ""),
        issue_data.get("body", "") or "",
        issue_labels,
        f"{owner}/{repo}",
        repo_data.get("stargazers_count", 0),
        HealthScorer.calculate(repo_data).get("overall", 75)
    )
    
    # Get repo details for setup instructions
    language = repo_data.get("language", "")
    default_branch = repo_data.get("default_branch", "main")
    clone_url = repo_data.get("clone_url", f"https://github.com/{owner}/{repo}.git")
    topics = repo_data.get("topics", [])
    
    # Generate setup commands based on language
    setup_commands = _get_setup_commands(language, topics)
    
    # Score the issue
    issue_scoring = IssueScorer.calculate(issue_data, repo_data)
    
    is_beginner = any(
        l.lower() in ["good first issue", "beginner", "easy"]
        for l in issue_labels
    )
    
    return {
        "repository": f"{owner}/{repo}",
        "issue": {
            "number": issue_number,
            "title": issue_data.get("title", ""),
            "url": issue_data.get("html_url", ""),
            "labels": issue_labels,
            "is_beginner_friendly": is_beginner,
            "author": issue_data.get("user", {}).get("login", "unknown") if issue_data.get("user") else "unknown"
        },
        "ai_summary": ai_analysis,
        "scoring": issue_scoring,
        "guide": {
            "estimated_time": "1-2 hours" if is_beginner else "2-4 hours",
            "difficulty": "Easy" if is_beginner else "Medium",
            "steps": [
                {
                    "step": 1,
                    "title": "Fork the Repository",
                    "description": f"Click the Fork button on {owner}/{repo} to create your own copy.",
                    "action": f"Visit https://github.com/{owner}/{repo} and click Fork"
                },
                {
                    "step": 2,
                    "title": "Clone Your Fork",
                    "description": "Download your fork to your local machine.",
                    "command": f"git clone https://github.com/YOUR_USERNAME/{repo}.git\ncd {repo}"
                },
                {
                    "step": 3,
                    "title": "Set Up Development Environment",
                    "description": f"Install dependencies for this {language or 'project'}.",
                    "commands": setup_commands
                },
                {
                    "step": 4,
                    "title": "Create a Branch",
                    "description": "Create a new branch for your changes.",
                    "command": f"git checkout -b fix-issue-{issue_number}"
                },
                {
                    "step": 5,
                    "title": "Make Your Changes",
                    "description": "Implement the fix or feature described in the issue.",
                    "files_to_edit": _suggest_files(language, issue_data.get("title", ""), issue_data.get("body", "") or "")
                },
                {
                    "step": 6,
                    "title": "Run Tests",
                    "description": "Ensure your changes don't break anything.",
                    "commands": _get_test_commands(language, topics)
                },
                {
                    "step": 7,
                    "title": "Commit and Push",
                    "description": "Commit your changes with a clear message.",
                    "command": f'git add .\ngit commit -m "Fix #{issue_number}: {issue_data.get("title", "")[:80]}"\ngit push origin fix-issue-{issue_number}'
                },
                {
                    "step": 8,
                    "title": "Open a Pull Request",
                    "description": f"Go to your fork on GitHub and open a Pull Request to {owner}/{repo}.",
                    "action": f"Visit https://github.com/{owner}/{repo}/compare/{default_branch}...YOUR_USERNAME:fix-issue-{issue_number}"
                }
            ],
            "pull_request_checklist": [
                "✓ Code follows the project's style guide",
                "✓ Tests pass locally",
                "✓ Changes are focused on the issue",
                "✓ Commit messages are clear",
                "✓ PR description references the issue number",
                "✓ No unrelated files were changed"
            ]
        }
    }


@router.get("/repositories/{owner}/{repo}/similar")
async def similar_repos(owner: str, repo: str, limit: int = Query(3, ge=1, le=10)):
    owner = owner.strip().strip("/"); repo = repo.strip().strip("/")
    current = await github_client.request(f"https://api.github.com/repos/{owner}/{repo}")
    if not current: raise HTTPException(status_code=404, detail=f"Repository {owner}/{repo} not found")
    repo_language = current.get("language")
    repo_topics = current.get("topics", [])[:3]
    similar = []
    if repo_topics:
        topic_query = " ".join([f"topic:{t}" for t in repo_topics[:2]])
        if repo_language: topic_query += f" language:{repo_language}"
        data = await github_client.request("https://api.github.com/search/repositories", {"q": topic_query, "sort": "stars", "per_page": limit + 1})
        if data:
            for r in data.get("items", []):
                if r["full_name"] == current["full_name"]: continue
                if len(similar) >= limit: break
                similar.append({"id": r["id"], "full_name": r["full_name"], "description": (r.get("description") or "")[:120], "stars": r["stargazers_count"], "forks": r["forks_count"], "language": r.get("language"), "open_issues": r["open_issues_count"], "url": r["html_url"], "topics": r.get("topics", [])[:5]})
    if len(similar) < limit and repo_language:
        needed = limit - len(similar)
        data = await github_client.request("https://api.github.com/search/repositories", {"q": f"language:{repo_language} good-first-issues:>0", "sort": "stars", "per_page": needed + 1})
        if data:
            for r in data.get("items", []):
                if r["full_name"] == current["full_name"]: continue
                if any(s["full_name"] == r["full_name"] for s in similar): continue
                if len(similar) >= limit: break
                similar.append({"id": r["id"], "full_name": r["full_name"], "description": (r.get("description") or "")[:120], "stars": r["stargazers_count"], "forks": r["forks_count"], "language": r.get("language"), "open_issues": r["open_issues_count"], "url": r["html_url"], "topics": r.get("topics", [])[:5]})
    if len(similar) < limit and repo_language:
        needed = limit - len(similar)
        data = await github_client.request("https://api.github.com/search/repositories", {"q": f"language:{repo_language}", "sort": "stars", "per_page": needed + 1})
        if data:
            for r in data.get("items", []):
                if r["full_name"] == current["full_name"]: continue
                if any(s["full_name"] == r["full_name"] for s in similar): continue
                if len(similar) >= limit: break
                similar.append({"id": r["id"], "full_name": r["full_name"], "description": (r.get("description") or "")[:120], "stars": r["stargazers_count"], "forks": r["forks_count"], "language": r.get("language"), "open_issues": r["open_issues_count"], "url": r["html_url"], "topics": r.get("topics", [])[:5]})
    return {"repository": f"{owner}/{repo}", "similar": similar[:limit], "total": len(similar)}


@router.get("/repositories/{owner}/{repo}/ai-summary")
async def ai_summary(owner: str, repo: str):
    owner = owner.strip().strip("/"); repo = repo.strip().strip("/")
    data = await github_client.request(f"https://api.github.com/repos/{owner}/{repo}")
    if data is None: raise HTTPException(status_code=404, detail=f"Repository {owner}/{repo} not found")
    summary = ai_service.generate_repository_summary(data.get("full_name", f"{owner}/{repo}"), data.get("stargazers_count", 0), data.get("language", "Unknown"), data.get("description", ""), data.get("topics", []))
    return {"summary": summary, "repository": f"{owner}/{repo}"}


@router.get("/user/{username}")
async def get_user(username: str = Path(example="octocat")):
    username = username.strip().strip("/")
    data = await github_client.request(f"https://api.github.com/users/{username}")
    if data is None: raise HTTPException(status_code=404, detail=f"User {username} not found")
    return {"username": data["login"], "name": data.get("name"), "avatar": data.get("avatar_url"), "followers": data["followers"], "following": data.get("following", 0), "public_repos": data.get("public_repos", 0), "bio": data.get("bio")}


# Helper functions for contribution guide

def _get_setup_commands(language: str, topics: list) -> list:
    """Generate setup commands based on language and topics."""
    lang = (language or "").lower()
    topic_str = " ".join(topics).lower() if topics else ""
    
    commands = []
    
    if lang in ("python",):
        commands = ["python -m venv venv", "source venv/bin/activate  # or venv\\Scripts\\activate on Windows"]
        if "requirements.txt" in topic_str or "pip" in topic_str:
            commands.append("pip install -r requirements.txt")
        else:
            commands.append("pip install -e .")
        if "pytest" in topic_str:
            commands.append("pip install pytest")
    
    elif lang in ("javascript", "typescript"):
        commands = ["npm install"]
        if "next" in topic_str or "react" in topic_str:
            commands.append("npm run dev")
    
    elif lang in ("go",):
        commands = ["go mod download", "go build ./..."]
    
    elif lang in ("rust",):
        commands = ["cargo build"]
    
    elif lang in ("java",):
        commands = ["./gradlew build  # or mvn install"]
    
    else:
        commands = ["# Follow the setup instructions in the repository's README.md"]
    
    return commands


def _get_test_commands(language: str, topics: list) -> list:
    """Generate test commands based on language."""
    lang = (language or "").lower()
    topic_str = " ".join(topics).lower() if topics else ""
    
    if lang in ("python",):
        if "pytest" in topic_str:
            return ["pytest"]
        return ["python -m pytest", "# or: python -m unittest discover"]
    elif lang in ("javascript", "typescript"):
        if "jest" in topic_str:
            return ["npm test"]
        return ["npm test", "# or: npx jest"]
    elif lang in ("go",):
        return ["go test ./..."]
    elif lang in ("rust",):
        return ["cargo test"]
    else:
        return ["# Run the project's test suite as described in the README"]


def _suggest_files(language: str, title: str, body: str) -> list:
    """Suggest likely files to edit based on language and issue content."""
    lang = (language or "").lower()
    text = (title + " " + body).lower()
    
    suggestions = []
    
    if "documentation" in text or "readme" in text or "docs" in text:
        suggestions.append("README.md or docs/ folder")
    if "bug" in text or "fix" in text:
        suggestions.append(f"Source files in src/ or {lang}/ directory")
    if "test" in text:
        suggestions.append("Test files (*_test.* or test_*)")
    if "css" in text or "style" in text or "ui" in text:
        suggestions.append("CSS/style files")
    if "config" in text or "setting" in text:
        suggestions.append("Configuration files (.json, .yaml, .toml)")
    if "api" in text or "endpoint" in text:
        suggestions.append("API route handlers")
    
    if not suggestions:
        suggestions = [
            f"Source code files in the main {lang or 'project'} directory",
            "Check the repository structure in the README for guidance"
        ]
    
    return suggestions