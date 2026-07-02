""""
Repository Health Scoring Engine
Evaluates repositories on maintainer activity, documentation, test coverage, and response time.
""""
from typing import Dict, List, Optional, Tuple
from datetime import datetime, timedelta
import math

class RepositoryHealthScorer:
    """"
    Scores repository health on a 0-100 scale with category breakdowns.
    
    Weights:
    - Maintainer Activity: 40%
    - Documentation: 25%
    - Test Coverage: 20%
    - Response Time: 15%
    """"
    
    WEIGHTS = {
        "maintainer_activity": 0.40,
        "documentation": 0.25,
        "test_coverage": 0.20,
        "response_time": 0.15,
    }
    
    @staticmethod
    def calculate_health_score(metrics: Dict) -> Dict:
        """"
        Calculate overall health score from individual metrics.
        
        Args:
            metrics: Dictionary containing repository metrics
            
        Returns:
            Dictionary with scores and breakdown
        """"
        maintainer = RepositoryHealthScorer._score_maintainer_activity(metrics)
        documentation = RepositoryHealthScorer._score_documentation(metrics)
        test_coverage = RepositoryHealthScorer._score_test_coverage(metrics)
        response_time = RepositoryHealthScorer._score_response_time(metrics)
        
        # Weighted average
        health_score = (
            maintainer * RepositoryHealthScorer.WEIGHTS["maintainer_activity"] +
            documentation * RepositoryHealthScorer.WEIGHTS["documentation"] +
            test_coverage * RepositoryHealthScorer.WEIGHTS["test_coverage"] +
            response_time * RepositoryHealthScorer.WEIGHTS["response_time"]
        )
        
        # Calculate trust score (maintainer + documentation average)
        trust_score = (maintainer + documentation) / 2
        
        return {
            "health_score": round(health_score, 2),
            "maintainer_activity_score": round(maintainer, 2),
            "documentation_score": round(documentation, 2),
            "test_coverage_score": round(test_coverage, 2),
            "response_time_score": round(response_time, 2),
            "trust_score": round(trust_score, 2),
            "grade": RepositoryHealthScorer._get_grade(health_score),
            "breakdown": {
                "maintainer_activity": {
                    "score": round(maintainer, 2),
                    "weight": "40%",
                    "interpretation": RepositoryHealthScorer._interpret_maintainer(maintainer),
                },
                "documentation": {
                    "score": round(documentation, 2),
                    "weight": "25%",
                    "interpretation": RepositoryHealthScorer._interpret_documentation(documentation),
                },
                "test_coverage": {
                    "score": round(test_coverage, 2),
                    "weight": "20%",
                    "interpretation": RepositoryHealthScorer._interpret_test_coverage(test_coverage),
                },
                "response_time": {
                    "score": round(response_time, 2),
                    "weight": "15%",
                    "interpretation": RepositoryHealthScorer._interpret_response_time(response_time),
                },
            },
        }
    
    @staticmethod
    def _score_maintainer_activity(metrics: Dict) -> float:
        """"
        Score maintainer activity based on recent commits, PR merges, and issue responses.
        
        Factors:
        - Commits in last 30 days
        - PR merge frequency
        - Issue response rate
        - Last push date
        """"
        score = 50.0
        
        # Recent commits (max 40 points)
        recent_commits = metrics.get("recent_commits_30d", 0)
        if recent_commits > 100:
            score += 40
        elif recent_commits > 50:
            score += 35
        elif recent_commits > 20:
            score += 25
        elif recent_commits > 10:
            score += 15
        elif recent_commits > 5:
            score += 8
        elif recent_commits > 0:
            score += 3
        else:
            score -= 20
        
        # PR merge rate (max 20 points)
        pr_merge_rate = metrics.get("pr_merge_rate", 0)
        if pr_merge_rate > 90:
            score += 20
        elif pr_merge_rate > 70:
            score += 15
        elif pr_merge_rate > 50:
            score += 10
        elif pr_merge_rate > 30:
            score += 5
        
        # Days since last push (max 15 points)
        last_push_days = metrics.get("days_since_last_push", 365)
        if last_push_days < 1:
            score += 15
        elif last_push_days < 3:
            score += 12
        elif last_push_days < 7:
            score += 8
        elif last_push_days < 14:
            score += 5
        elif last_push_days < 30:
            score += 2
        elif last_push_days > 180:
            score -= 15
        
        # Issue response rate (max 25 points)
        response_rate = metrics.get("issue_response_rate", 0)
        if response_rate > 80:
            score += 25
        elif response_rate > 60:
            score += 18
        elif response_rate > 40:
            score += 10
        elif response_rate > 20:
            score += 5
        else:
            score -= 10
        
        return max(0, min(100, score))
    
    @staticmethod
    def _score_documentation(metrics: Dict) -> float:
        """"
        Score documentation quality.
        
        Checks:
        - README presence and quality
        - CONTRIBUTING.md
        - Issue/PR templates
        - License file
        - Wiki/Pages
        """"
        score = 0.0
        
        # README (40 points)
        if metrics.get("has_readme"):
            score += 25
            readme_length = metrics.get("readme_length", 0)
            if readme_length > 2000:
                score += 15
            elif readme_length > 1000:
                score += 10
            elif readme_length > 500:
                score += 5
        
        # Contributing guide (25 points)
        if metrics.get("has_contributing_guide"):
            score += 25
        
        # Issue templates (15 points)
        if metrics.get("has_issue_templates"):
            score += 10
        if metrics.get("has_pr_template"):
            score += 5
        
        # License (10 points)
        if metrics.get("has_license"):
            score += 10
        
        # Description (10 points)
        if metrics.get("has_description"):
            desc_length = metrics.get("description_length", 0)
            if desc_length > 100:
                score += 10
            elif desc_length > 50:
                score += 5
        
        return min(100, score)
    
    @staticmethod
    def _score_test_coverage(metrics: Dict) -> float:
        """"
        Score test coverage based on test file detection and CI/CD setup.
        """"
        score = 0.0
        
        # CI/CD configuration (40 points)
        if metrics.get("has_ci_cd"):
            score += 40
        
        # Test directories (30 points)
        test_dirs = metrics.get("test_directories", [])
        if len(test_dirs) > 2:
            score += 30
        elif len(test_dirs) > 0:
            score += 20
        
        # Test frameworks detected (20 points)
        test_frameworks = metrics.get("test_frameworks", [])
        if len(test_frameworks) > 1:
            score += 20
        elif len(test_frameworks) > 0:
            score += 10
        
        # Coverage config (10 points)
        if metrics.get("has_coverage_config"):
            score += 10
        
        return min(100, score)
    
    @staticmethod
    def _score_response_time(metrics: Dict) -> float:
        """"
        Score based on average issue/PR response time.
        """"
        avg_response_hours = metrics.get("avg_response_time_hours", 168)  # Default 1 week
        
        if avg_response_hours < 1:
            return 95
        elif avg_response_hours < 4:
            return 88
        elif avg_response_hours < 8:
            return 80
        elif avg_response_hours < 24:
            return 70
        elif avg_response_hours < 48:
            return 55
        elif avg_response_hours < 72:
            return 40
        elif avg_response_hours < 168:  # 1 week
            return 25
        else:
            return 10
    
    @staticmethod
    def _get_grade(score: float) -> str:
        """Convert numeric score to letter grade."""
        if score >= 90:
            return "A+"
        elif score >= 80:
            return "A"
        elif score >= 70:
            return "B"
        elif score >= 60:
            return "C"
        elif score >= 50:
            return "D"
        else:
            return "F"
    
    @staticmethod
    def _interpret_maintainer(score: float) -> str:
        if score >= 80:
            return "Excellent - Very active maintainers, quick responses"
        elif score >= 60:
            return "Good - Regular activity and responses"
        elif score >= 40:
            return "Fair - Some activity but may be slow"
        else:
            return "Poor - Low activity, may be abandoned"
    
    @staticmethod
    def _interpret_documentation(score: float) -> str:
        if score >= 80:
            return "Excellent - Comprehensive guides and templates"
        elif score >= 60:
            return "Good - Basic documentation present"
        elif score >= 40:
            return "Fair - Some docs but missing key pieces"
        else:
            return "Poor - Minimal documentation"
    
    @staticmethod
    def _interpret_test_coverage(score: float) -> str:
        if score >= 80:
            return "Excellent - Strong CI/CD and test suite"
        elif score >= 60:
            return "Good - Tests exist with CI setup"
        elif score >= 40:
            return "Fair - Some tests, basic CI"
        else:
            return "Poor - Limited or no testing"
    
    @staticmethod
    def _interpret_response_time(score: float) -> str:
        if score >= 80:
            return "Excellent - Responses within hours"
        elif score >= 60:
            return "Good - Responses within a day"
        elif score >= 40:
            return "Fair - Responses within a few days"
        else:
            return "Poor - Slow response times"
