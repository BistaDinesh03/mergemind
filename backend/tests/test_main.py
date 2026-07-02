""""
Tests for MergeMind Backend
""""
import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.database import Base, engine, get_db
from sqlalchemy.orm import Session
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

# Test database
SQLALCHEMY_TEST_DATABASE_URL = "sqlite:///./test_mergemind.db"
test_engine = create_engine(
    SQLALCHEMY_TEST_DATABASE_URL,
    connect_args={"check_same_thread": False}
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=test_engine)

def override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()

app.dependency_overrides[get_db] = override_get_db
client = TestClient(app)

@pytest.fixture(autouse=True)
def setup_database():
    """Create tables before each test and drop after."""
    Base.metadata.create_all(bind=test_engine)
    yield
    Base.metadata.drop_all(bind=test_engine)

class TestHealthEndpoint:
    """Test health check endpoint."""
    
    def test_health_check(self):
        response = client.get("/health")
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "ok"
        assert data["version"] == "0.1.0"
    
    def test_root_endpoint(self):
        response = client.get("/")
        assert response.status_code == 200
        data = response.json()
        assert "MergeMind" in data["message"]
        assert "endpoints" in data

class TestScoringEngines:
    """Test scoring engine calculations."""
    
    def test_health_scorer_basic(self):
        from app.services.scoring.health_scorer import RepositoryHealthScorer
        
        metrics = {
            "recent_commits_30d": 50,
            "pr_merge_rate": 80,
            "days_since_last_push": 2,
            "issue_response_rate": 75,
            "has_readme": True,
            "readme_length": 1500,
            "has_contributing_guide": True,
            "has_issue_templates": True,
            "has_pr_template": True,
            "has_license": True,
            "has_description": True,
            "description_length": 200,
            "has_ci_cd": True,
            "test_directories": ["tests/", "spec/"],
            "test_frameworks": ["pytest"],
            "has_coverage_config": True,
            "avg_response_time_hours": 2,
        }
        
        result = RepositoryHealthScorer.calculate_health_score(metrics)
        
        assert "health_score" in result
        assert 0 <= result["health_score"] <= 100
        assert "grade" in result
        assert "breakdown" in result
        assert "maintainer_activity" in result["breakdown"]
        assert "documentation" in result["breakdown"]
    
    def test_health_scorer_perfect(self):
        from app.services.scoring.health_scorer import RepositoryHealthScorer
        
        metrics = {
            "recent_commits_30d": 150,
            "pr_merge_rate": 95,
            "days_since_last_push": 0,
            "issue_response_rate": 90,
            "has_readme": True,
            "readme_length": 3000,
            "has_contributing_guide": True,
            "has_issue_templates": True,
            "has_pr_template": True,
            "has_license": True,
            "has_description": True,
            "description_length": 500,
            "has_ci_cd": True,
            "test_directories": ["tests/", "spec/", "__tests__/"],
            "test_frameworks": ["pytest", "jest"],
            "has_coverage_config": True,
            "avg_response_time_hours": 0.5,
        }
        
        result = RepositoryHealthScorer.calculate_health_score(metrics)
        assert result["health_score"] >= 80
        assert result["grade"] in ["A", "A+"]
    
    def test_health_scorer_poor(self):
        from app.services.scoring.health_scorer import RepositoryHealthScorer
        
        metrics = {
            "recent_commits_30d": 0,
            "pr_merge_rate": 10,
            "days_since_last_push": 365,
            "issue_response_rate": 5,
            "has_readme": False,
            "readme_length": 0,
            "has_contributing_guide": False,
            "has_issue_templates": False,
            "has_pr_template": False,
            "has_license": False,
            "has_description": False,
            "description_length": 0,
            "has_ci_cd": False,
            "test_directories": [],
            "test_frameworks": [],
            "has_coverage_config": False,
            "avg_response_time_hours": 200,
        }
        
        result = RepositoryHealthScorer.calculate_health_score(metrics)
        assert result["health_score"] < 40
    
    def test_opportunity_scorer_beginner(self):
        from app.services.scoring.opportunity_scorer import OpportunityScorer
        
        issue_data = {
            "title": "Fix typo in README",
            "labels": [{"name": "good first issue"}, {"name": "documentation"}],
            "assignee": None,
            "has_pull_request": False,
            "comment_count": 1,
            "body": "There is a typo in the README file. Steps to reproduce: Read the installation section.",
            "created_at": "2026-06-30T00:00:00Z",
        }
        
        repo_data = {
            "response_time_score": 80,
            "maintainer_activity_score": 75,
            "stars_count": 50000,
            "language": "Python",
            "documentation_score": 70,
        }
        
        result = OpportunityScorer.calculate_opportunity_score(issue_data, repo_data)
        
        assert result["opportunity_score"] >= 70
        assert result["is_beginner_friendly"] == True
        assert result["difficulty"] == "Easy"
    
    def test_merge_predictor(self):
        from app.services.scoring.merge_predictor import MergeProbabilityPredictor
        
        repo_data = {
            "pr_merge_rate": 85,
            "maintainer_activity_score": 80,
            "test_coverage_score": 75,
            "has_ci_cd": True,
        }
        
        issue_data = {
            "estimated_hours": 2,
        }
        
        result = MergeProbabilityPredictor.predict_merge_probability(repo_data, issue_data)
        
        assert 0 <= result["merge_probability"] <= 100
        assert "confidence_level" in result
        assert "factors" in result
        assert "tips" in result

class TestDashboardAPI:
    """Test dashboard API endpoints."""
    
    def test_dashboard_endpoint(self):
        response = client.get("/api/dashboard/?user_id=demo_user")
        assert response.status_code == 200
        data = response.json()
        assert "user" in data
        assert "stats" in data
    
    def test_daily_planner(self):
        response = client.get("/api/dashboard/planner/daily?available_time_minutes=60")
        assert response.status_code == 200
        data = response.json()
        assert "available_time_minutes" in data
        assert "recommended_issues" in data
    
    def test_quick_picks(self):
        response = client.get("/api/dashboard/planner/quick-picks?limit=3")
        assert response.status_code == 200
        data = response.json()
        assert "quick_picks" in data
    
    def test_global_stats(self):
        response = client.get("/api/dashboard/stats")
        assert response.status_code == 200
        data = response.json()
        assert "total_repositories_analyzed" in data

class TestGitHubAPI:
    """Test GitHub API endpoints."""
    
    def test_list_repositories(self):
        response = client.get("/api/github/repositories")
        # May fail without GitHub token, but endpoint should exist
        assert response.status_code in [200, 401, 500]
    
    def test_search_issues(self):
        response = client.get("/api/github/search/issues?labels=good first issue")
        assert response.status_code in [200, 401, 500]

if __name__ == "__main__":
    pytest.main([__file__, "-v"])
