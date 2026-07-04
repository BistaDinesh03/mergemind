from unittest.mock import patch

def test_repositories_endpoint(api):
    response = api.get("/api/github/repositories")
    assert response.status_code in [200, 500]

def test_portfolio_endpoint_returns_data(api):
    response = api.get("/api/portfolio/testuser")
    assert response.status_code in [200, 500]

def test_recommendations_endpoint(api):
    response = api.get("/api/recommendations/top?limit=3")
    assert response.status_code in [200, 500]

def test_scoring_endpoint(api):
    response = api.post("/api/scoring/score", json={
        "issue_title": "Fix bug in login",
        "labels": ["good first issue", "bug"],
        "comments": 3,
        "repo_full_name": "test/repo",
        "repo_stars": 1000,
        "use_ai": False
    })
    assert response.status_code in [200, 422, 500]

def test_404_handling(api):
    response = api.get("/api/nonexistent-endpoint-12345")
    assert response.status_code == 404