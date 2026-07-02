""""
Merge Probability Predictor
Predicts the likelihood of a PR being merged based on historical data and repository health.
""""
from typing import Dict, List, Optional
from datetime import datetime, timedelta
import math

class MergeProbabilityPredictor:
    """"
    Predicts merge probability on a 0-100 scale.
    
    Factors:
    - Repository historical merge rate
    - PR size (files changed, lines)
    - Maintainer recent activity
    - Test existence
    - Previous contributor success
    """"
    
    FACTORS = {
        "historical_merge_rate": 0.30,
        "pr_size": 0.25,
        "maintainer_activity": 0.20,
        "tests_present": 0.15,
        "contributor_history": 0.10,
    }
    
    @staticmethod
    def predict_merge_probability(
        repo_data: Dict,
        issue_data: Dict,
        contributor_data: Optional[Dict] = None,
    ) -> Dict:
        """"
        Predict the probability of a PR being merged.
        
        Args:
            repo_data: Repository metrics
            issue_data: Issue details
            contributor_data: Contributor's history (optional)
            
        Returns:
            Dictionary with probability and factors
        """"
        historical = MergeProbabilityPredictor._factor_historical_rate(repo_data)
        pr_size = MergeProbabilityPredictor._factor_pr_size(issue_data)
        activity = MergeProbabilityPredictor._factor_maintainer_activity(repo_data)
        tests = MergeProbabilityPredictor._factor_tests(repo_data)
        history = MergeProbabilityPredictor._factor_contributor_history(contributor_data)
        
        merge_probability = (
            historical * MergeProbabilityPredictor.FACTORS["historical_merge_rate"] +
            pr_size * MergeProbabilityPredictor.FACTORS["pr_size"] +
            activity * MergeProbabilityPredictor.FACTORS["maintainer_activity"] +
            tests * MergeProbabilityPredictor.FACTORS["tests_present"] +
            history * MergeProbabilityPredictor.FACTORS["contributor_history"]
        )
        
        return {
            "merge_probability": round(merge_probability, 2),
            "confidence_level": MergeProbabilityPredictor._confidence_level(merge_probability),
            "factors": {
                "historical_merge_rate": round(historical, 2),
                "pr_size_estimate": round(pr_size, 2),
                "maintainer_activity": round(activity, 2),
                "tests_present": round(tests, 2),
                "contributor_history": round(history, 2),
            },
            "tips": MergeProbabilityPredictor._get_tips(merge_probability, repo_data),
        }
    
    @staticmethod
    def _factor_historical_rate(repo_data: Dict) -> float:
        """Score based on historical PR merge rate."""
        merge_rate = repo_data.get("pr_merge_rate", 50)
        
        if merge_rate > 90:
            return 95
        elif merge_rate > 75:
            return 85
        elif merge_rate > 60:
            return 70
        elif merge_rate > 40:
            return 50
        elif merge_rate > 20:
            return 30
        else:
            return 15
    
    @staticmethod
    def _factor_pr_size(issue_data: Dict) -> float:
        """Score based on estimated PR size (smaller = better)."""
        estimated_hours = issue_data.get("estimated_hours", 4)
        
        if estimated_hours <= 1:
            return 90
        elif estimated_hours <= 2:
            return 80
        elif estimated_hours <= 4:
            return 65
        elif estimated_hours <= 8:
            return 45
        else:
            return 25
    
    @staticmethod
    def _factor_maintainer_activity(repo_data: Dict) -> float:
        """Score based on recent maintainer activity."""
        activity_score = repo_data.get("maintainer_activity_score", 50)
        return activity_score
    
    @staticmethod
    def _factor_tests(repo_data: Dict) -> float:
        """Score based on test infrastructure."""
        test_score = repo_data.get("test_coverage_score", 50)
        has_ci = repo_data.get("has_ci_cd", False)
        
        if has_ci and test_score > 60:
            return 90
        elif has_ci:
            return 75
        elif test_score > 40:
            return 50
        else:
            return 25
    
    @staticmethod
    def _factor_contributor_history(contributor_data: Optional[Dict]) -> float:
        """Score based on contributor's history with this repo."""
        if not contributor_data:
            return 50  # Neutral for new contributors
        
        previous_merges = contributor_data.get("previous_merges_in_repo", 0)
        total_contributions = contributor_data.get("total_contributions", 0)
        
        if previous_merges > 5:
            return 90
        elif previous_merges > 2:
            return 80
        elif previous_merges > 0:
            return 70
        elif total_contributions > 10:
            return 60
        elif total_contributions > 0:
            return 50
        else:
            return 40
    
    @staticmethod
    def _confidence_level(probability: float) -> str:
        """Get confidence level description."""
        if probability >= 80:
            return "High"
        elif probability >= 60:
            return "Medium"
        elif probability >= 40:
            return "Low"
        else:
            return "Very Low"
    
    @staticmethod
    def _get_tips(probability: float, repo_data: Dict) -> List[str]:
        """Generate tips to improve merge chances."""
        tips = []
        
        if probability < 50:
            tips.append("Start with a smaller, focused PR")
            tips.append("Read CONTRIBUTING.md carefully before starting")
        
        if repo_data.get("has_ci_cd"):
            tips.append("Ensure all tests pass before submitting")
        
        if repo_data.get("documentation_score", 0) < 50:
            tips.append("Ask clarifying questions in the issue comments")
        
        if not tips:
            tips.append("Follow standard PR template if available")
            tips.append("Reference this issue in your PR description")
        
        return tips
