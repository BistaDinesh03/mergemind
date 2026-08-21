"""GitHub API router with OpenAPI documentation."""
from fastapi import APIRouter, Query, HTTPException, Path
from typing import Optional
from datetime import datetime, timezone
from ..services.github_client import github_client
from ..services.ai_service import ai_service
from ..services.health_scorer import HealthScorer, IssueScorer

router = APIRouter(tags=["GitHub"])


async def _detect_repo_setup(owner: str, repo: str, language: str, topics: list) -> dict:
    """Detect actual setup requirements from the repository's file structure."""
    setup = {
        "language": language or "unknown",
        "setup_commands": [],
        "test_commands": [],
        "requirements_file": None,
        "package_manager": None,
        "has_docker": False,
        "has_contributing": False,
        "has_readme": False,
    }
    
    # Fetch root directory contents
    root_contents = await github_client.request(
        f"https://api.github.com/repos/{owner}/{repo}/contents/"
    )
    
    if not root_contents:
        return setup
    
    file_names = [f.get("name", "").lower() for f in root_contents]
    
    # Check for key files
    setup["has_contributing"] = "contributing.md" in file_names or "contributing.rst" in file_names
    setup["has_readme"] = any(name.startswith("readme") for name in file_names)
    
    # Detect package manager and requirements
    if "requirements.txt" in file_names:
        setup["requirements_file"] = "requirements.txt"
        setup["package_manager"] = "pip"
        setup["setup_commands"] = [
            "python -m venv venv",
            "source venv/bin/activate  # Windows: venv\\Scripts\\activate",
            "pip install -r requirements.txt"
        ]
        setup["test_commands"] = ["pytest"] if any("test" in f for f in file_names) else ["python -m pytest"]
    elif "pyproject.toml" in file_names:
        setup["requirements_file"] = "pyproject.toml"
        setup["package_manager"] = "pip/poetry"
        setup["setup_commands"] = ["pip install -e ."]
        setup["test_commands"] = ["pytest"]
    elif "package.json" in file_names:
        setup["requirements_file"] = "package.json"
        setup["package_manager"] = "npm"
        setup["setup_commands"] = ["npm install"]
        setup["test_commands"] = ["npm test"]
    elif "go.mod" in file_names:
        setup["requirements_file"] = "go.mod"
        setup["package_manager"] = "go modules"
        setup["setup_commands"] = ["go mod download", "go build ./..."]
        setup["test_commands"] = ["go test ./..."]
    elif "cargo.toml" in file_names:
        setup["requirements_file"] = "Cargo.toml"
        setup["package_manager"] = "cargo"
        setup["setup_commands"] = ["cargo build"]
        setup["test_commands"] = ["cargo test"]
    elif "pom.xml" in file_names:
        setup["requirements_file"] = "pom.xml"
        setup["package_manager"] = "maven"
        setup["setup_commands"] = ["mvn install"]
        setup["test_commands"] = ["mvn test"]
    elif "gemfile" in file_names:
        setup["requirements_file"] = "Gemfile"
        setup["package_manager"] = "bundler"
        setup["setup_commands"] = ["bundle install"]
        setup["test_commands"] = ["bundle exec rspec"]
    else:
        setup["setup_commands"] = ["# Check README.md for setup instructions"]
        setup["test_commands"] = ["# Run tests as described in the project documentation"]
    
    # Check for Docker
    setup["has_docker"] = "dockerfile" in file_names or "docker-compose.yml" in file_names or "docker-compose.yaml" in file_names
    
    if setup["has_docker"]:
        setup["setup_commands"].append("# Alternative: use Docker")
        setup["setup_commands"].append("docker compose up -d")
    
    return setup


@router.get("/repositories/{owner}/{repo}/issues/{issue_number}/guide")
async def contribution_guide(
    owner: str = Path(description="Repository owner"),
    repo: str = Path(description="Repository name"),
    issue_number: int = Path(description="Issue number")
):
    owner = owner.strip().strip("/")
    repo = repo.strip().strip("/")
    
    import asyncio
    issue_data, repo_data, related_prs_data = await asyncio.gather(
        github_client.request(f"https://api.github.com/repos/{owner}/{repo}/issues/{issue_number}"),
        github_client.request(f"https://api.github.com/repos/{owner}/{repo}"),
        github_client.request("https://api.github.com/search/issues", {"q": f"repo:{owner}/{repo} type:pr state:closed is:merged", "sort": "updated", "order": "desc", "per_page": 3})
    )
    
    if not issue_data:
        raise HTTPException(status_code=404, detail=f"Issue #{issue_number} not found")
    if not repo_data:
        raise HTTPException(status_code=404, detail=f"Repository {owner}/{repo} not found")
    
    issue_labels = [l["name"] for l in issue_data.get("labels", [])]
    language = repo_data.get("language", "")
    topics = repo_data.get("topics", [])
    default_branch = repo_data.get("default_branch", "main")
    clone_url = repo_data.get("clone_url", f"https://github.com/{owner}/{repo}.git")
    
    # Detect actual repo setup from file structure
    repo_setup = await _detect_repo_setup(owner, repo, language, topics)
    
    ai_analysis = ai_service.analyze_issue(
        issue_data.get("title", ""), issue_data.get("body", "") or "",
        issue_labels, f"{owner}/{repo}",
        repo_data.get("stargazers_count", 0),
        HealthScorer.calculate(repo_data).get("overall", 75)
    )
    
    issue_scoring = IssueScorer.calculate(issue_data, repo_data)
    is_beginner = any(l.lower() in ["good first issue", "beginner", "easy"] for l in issue_labels)
    
    related_prs = []
    if related_prs_data:
        for pr in related_prs_data.get("items", [])[:3]:
            related_prs.append({
                "number": pr.get("number"),
                "title": pr.get("title", ""),
                "url": pr.get("html_url", ""),
                "merged_at": pr.get("closed_at"),
                "author": pr.get("user", {}).get("login", "unknown") if pr.get("user") else "unknown"
            })
    
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
        "related_prs": related_prs,
        "repo_setup": repo_setup,
        "guide": {
            "estimated_time": "1-2 hours" if is_beginner else "2-4 hours",
            "difficulty": "Easy" if is_beginner else "Medium",
            "steps": [
                {"step": 1, "title": "Fork the Repository", "description": f"Click Fork on {owner}/{repo}", "action": f"https://github.com/{owner}/{repo}"},
                {"step": 2, "title": "Clone Your Fork", "description": "Download your fork", "command": f"git clone {clone_url}\ncd {repo}"},
                {"step": 3, "title": "Install Dependencies", "description": f"Setup {language or 'project'} ({repo_setup.get('package_manager', 'manual')})", "commands": repo_setup.get("setup_commands", [])},
                {"step": 4, "title": "Create a Branch", "description": "Create a branch for your changes", "command": f"git checkout -b fix-issue-{issue_number}"},
                {"step": 5, "title": "Make Changes", "description": "Implement the fix described in the issue", "files_to_edit": _suggest_files(language, issue_data.get("title", ""), issue_data.get("body", "") or "", repo_setup)},
                {"step": 6, "title": "Run Tests", "description": "Verify your changes", "commands": repo_setup.get("test_commands", [])},
                {"step": 7, "title": "Commit and Push", "description": "Commit with a clear message", "command": f'git add .\ngit commit -m "Fix #{issue_number}: {issue_data.get("title", "")[:80]}"\ngit push origin fix-issue-{issue_number}'},
                {"step": 8, "title": "Open a Pull Request", "description": f"Open a PR to {owner}/{repo}", "action": f"https://github.com/{owner}/{repo}/compare/{default_branch}...YOUR_USERNAME:fix-issue-{issue_number}"}
            ],
            "pull_request_checklist": [
                "Code follows project style guide",
                "Tests pass locally",
                "Changes focused on the issue",
                "Clear commit messages",
                "PR references the issue number"
            ]
        }
    }


def _suggest_files(language: str, title: str, body: str, repo_setup: dict = None) -> list:
    lang = (language or "").lower()
    text = (title + " " + body).lower()
    suggestions = []
    if "documentation" in text or "readme" in text: suggestions.append("README.md")
    if "bug" in text or "fix" in text: suggestions.append(f"Source files in {lang or 'src'}/ directory")
    if "test" in text: suggestions.append("Test files")
    if repo_setup and repo_setup.get("requirements_file"):
        suggestions.append(f"Check {repo_setup['requirements_file']} for dependencies")
    if not suggestions:
        suggestions = [f"Source code in the main {lang or 'project'} directory", "Check README for structure"]
    return suggestions[:3]


@router.get("/repositories")
async def search_repositories(query: Optional[str] = Query(None), language: Optional[str] = Query(None), sort: str = Query("stars"), page: int = Query(1, ge=1), per_page: int = Query(20, ge=1, le=100)):
    q_parts = ["stars:>10"]
    if query: q_parts.append(f"{query} in:name,description")
    if language: q_parts.append(f"language:{language}")
    data = await github_client.request("https://api.github.com/search/repositories", {"q": " ".join(q_parts), "sort": sort, "order": "desc", "page": page, "per_page": per_page})
    return {"total": data.get("total_count", 0) if data else 0, "page": page, "per_page": per_page, "last_checked": datetime.now(timezone.utc).isoformat(), "repositories": [{"id": r["id"], "full_name": r["full_name"], "owner": {"login": r["owner"]["login"], "avatar": r["owner"]["avatar_url"]}, "description": (r.get("description") or "No description available.")[:150], "stars": r["stargazers_count"], "forks": r["forks_count"], "open_issues": r["open_issues_count"], "language": r.get("language") or "Other", "topics": r.get("topics", [])[:5], "updated_at": r["updated_at"], "url": r["html_url"]} for r in (data.get("items", []) if data else [])]}


@router.get("/search/issues")
async def search_issues(query: Optional[str] = Query(None), language: Optional[str] = Query(None), labels: Optional[str] = Query("good first issue,help wanted"), sort: str = Query("updated"), order: str = Query("desc"), page: int = Query(1, ge=1), per_page: int = Query(20, ge=1, le=100)):
    q_parts = ["state:open", "type:issue", "is:public"]
    if query: q_parts.append(f"{query} in:title,body")
    if language: q_parts.append(f"language:{language}")
    if labels:
        for label in labels.split(","): q_parts.append(f'label:"{label.strip()}"')
    data = await github_client.request("https://api.github.com/search/issues", {"q": " ".join(q_parts), "sort": sort, "order": order, "page": page, "per_page": per_page})
    if not data: return {"total": 0, "page": page, "per_page": per_page, "last_checked": datetime.now(timezone.utc).isoformat(), "issues": []}
    return {"total": data.get("total_count", 0), "page": page, "per_page": per_page, "last_checked": datetime.now(timezone.utc).isoformat(), "issues": [{"id": i["id"], "number": i["number"], "title": i["title"], "labels": [l["name"] for l in i.get("labels", [])], "comments": i.get("comments", 0), "created_at": i.get("created_at"), "updated_at": i.get("updated_at"), "url": i["html_url"], "repository_full_name": i.get("repository_url", "").replace("https://api.github.com/repos/", ""), "user": {"login": i["user"]["login"], "avatar": i["user"]["avatar_url"]} if i.get("user") else None, "is_beginner_friendly": any(l.lower() in ["good first issue", "beginner", "easy", "help wanted"] for l in [lbl["name"] for lbl in i.get("labels", [])])} for i in data.get("items", []) if "pull_request" not in i]}


@router.get("/repositories/{owner}/{repo}")
async def get_repository(owner: str = Path(example="fastapi"), repo: str = Path(example="fastapi")):
    owner = owner.strip().strip("/")
    repo = repo.strip().strip("/")
    data = await github_client.request(f"https://api.github.com/repos/{owner}/{repo}")
    if data is None: raise HTTPException(status_code=404, detail=f"Repository {owner}/{repo} not found")
    health = HealthScorer.calculate(data)
    return {"id": data["id"], "full_name": data["full_name"], "description": data.get("description", "") or "No description available.", "owner": {"login": data["owner"]["login"], "avatar": data["owner"]["avatar_url"]}, "stars": data["stargazers_count"], "forks": data["forks_count"], "open_issues": data["open_issues_count"], "watchers": data.get("watchers_count", 0), "language": data.get("language"), "topics": data.get("topics", []), "license": data.get("license", {}).get("spdx_id") if data.get("license") else None, "default_branch": data.get("default_branch", "main"), "pushed_at": data.get("pushed_at"), "updated_at": data.get("updated_at"), "url": data["html_url"], "last_checked": datetime.now(timezone.utc).isoformat(), "health": health}


@router.get("/repositories/{owner}/{repo}/issues")
async def get_issues(owner: str, repo: str, labels: Optional[str] = Query(None), sort: str = Query("updated"), order: str = Query("desc"), page: int = Query(1, ge=1), per_page: int = Query(30, ge=1, le=100)):
    owner = owner.strip().strip("/")
    repo = repo.strip().strip("/")
    params = {"state": "open", "sort": sort, "direction": order, "page": page, "per_page": per_page}
    if labels: params["labels"] = labels
    data = await github_client.request(f"https://api.github.com/repos/{owner}/{repo}/issues", params)
    return {"repository": f"{owner}/{repo}", "page": page, "per_page": per_page, "last_checked": datetime.now(timezone.utc).isoformat(), "issues": [{"id": i["id"], "number": i["number"], "title": i["title"], "labels": [l["name"] for l in i.get("labels", [])], "comments": i["comments"], "created_at": i["created_at"], "url": i["html_url"], "author": {"login": i["user"]["login"], "avatar": i["user"]["avatar_url"]} if i.get("user") else None, "is_beginner_friendly": any(l.lower() in ["good first issue", "beginner", "easy"] for l in [lbl["name"] for lbl in i.get("labels", [])])} for i in (data or []) if "pull_request" not in i]}


@router.get("/repositories/{owner}/{repo}/similar")
async def similar_repos(owner: str, repo: str, limit: int = Query(3, ge=1, le=10)):
    owner = owner.strip().strip("/")
    repo = repo.strip().strip("/")
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
                similar.append({"id": r["id"], "full_name": r["full_name"], "description": (r.get("description") or "No description available.")[:120], "stars": r["stargazers_count"], "forks": r["forks_count"], "language": r.get("language"), "open_issues": r["open_issues_count"], "url": r["html_url"]})
    if len(similar) < limit and repo_language:
        needed = limit - len(similar)
        data = await github_client.request("https://api.github.com/search/repositories", {"q": f"language:{repo_language}", "sort": "stars", "per_page": needed + 1})
        if data:
            for r in data.get("items", []):
                if r["full_name"] == current["full_name"]: continue
                if any(s["full_name"] == r["full_name"] for s in similar): continue
                if len(similar) >= limit: break
                similar.append({"id": r["id"], "full_name": r["full_name"], "description": (r.get("description") or "No description available.")[:120], "stars": r["stargazers_count"], "forks": r["forks_count"], "language": r.get("language"), "open_issues": r["open_issues_count"], "url": r["html_url"]})
    return {"repository": f"{owner}/{repo}", "similar": similar[:limit], "total": len(similar)}


@router.get("/repositories/{owner}/{repo}/ai-summary")
async def ai_summary(owner: str, repo: str):
    owner = owner.strip().strip("/")
    repo = repo.strip().strip("/")
    data = await github_client.request(f"https://api.github.com/repos/{owner}/{repo}")
    if data is None: raise HTTPException(status_code=404, detail=f"Repository {owner}/{repo} not found")
    summary = ai_service.generate_repository_summary(data.get("full_name", f"{owner}/{repo}"), data.get("stargazers_count", 0), data.get("language", "Unknown"), data.get("description", ""), data.get("topics", []))
    return {"summary": summary, "repository": f"{owner}/{repo}"}


@router.get("/user/{username}")
async def get_user(username: str = Path(example="octocat")):
    username = username.strip().strip("/")
    data = await github_client.request(f"https://api.github.com/users/{username}")
    if data is None: raise HTTPException(status_code=404, detail=f"User {username} not found")
    return {"username": data["login"], "name": data.get("name"), "avatar": data.get("avatar_url"), "followers": data["followers"], "following": data.get("following", 0), "public_repos": data.get("public_repos", 0), "bio": data.get("bio"), "last_checked": datetime.now(timezone.utc).isoformat()}