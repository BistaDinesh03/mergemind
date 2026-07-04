from app.services.health_scorer import HealthScorer
from app.services.issue_scorer import issue_scorer

def test_health_scorer_excellent_repo():
    data = {
        "stargazers_count": 100000,
        "forks_count": 10000,
        "watchers_count": 5000,
        "subscribers_count": 1000,
        "open_issues_count": 5,
        "has_issues": True,
        "has_wiki": True,
        "has_pages": True,
        "has_discussions": True,
        "archived": False,
        "description": "A very well maintained and popular project with excellent documentation",
        "license": {"spdx_id": "MIT"},
        "topics": ["python", "web", "api", "framework", "async"],
        "pushed_at": "2026-07-05T00:00:00Z",
        "latest_release": {"tag": "1.0.0"}
    }
    result = HealthScorer.calculate(data)
    assert result["overall"] >= 70
    assert result["status"] in ["Excellent", "Good"]

def test_health_scorer_poor_repo():
    data = {
        "stargazers_count": 5,
        "forks_count": 1,
        "watchers_count": 3,
        "subscribers_count": 0,
        "open_issues_count": 50,
        "has_issues": False,
        "has_wiki": False,
        "has_pages": False,
        "has_discussions": False,
        "archived": True,
        "description": "",
        "license": None,
        "topics": [],
        "pushed_at": "2025-01-01T00:00:00Z",
        "latest_release": None
    }
    result = HealthScorer.calculate(data)
    assert result["overall"] < 50
    assert result["status"] in ["Fair", "Needs Work", "Poor"]

def test_issue_scorer_good_first_issue():
    issue = {
        "title": "Fix typo in README",
        "body": "There is a typo in the installation section. Steps to reproduce: read the docs.",
        "labels": ["good first issue", "documentation"],
        "comments": 1,
        "assignees": []
    }
    repo = {
        "full_name": "fastapi/fastapi",
        "stars": 100000,
        "pushed_at": "2026-07-05T00:00:00Z"
    }
    result = issue_scorer.score(issue, repo)
    assert result["overall_score"] >= 70
    assert result["factors"]["difficulty"]["score"] >= 80

def test_issue_scorer_hard_issue():
    issue = {
        "title": "Refactor entire authentication system",
        "body": "Need to rewrite the auth module.",
        "labels": ["hard", "expert"],
        "comments": 15,
        "assignees": [{"login": "dev1"}]
    }
    repo = {
        "full_name": "unknown/repo",
        "stars": 10,
        "pushed_at": "2025-01-01T00:00:00Z"
    }
    result = issue_scorer.score(issue, repo)
    assert result["overall_score"] < 70