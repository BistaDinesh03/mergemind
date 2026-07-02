""""
Opportunity Scoring Engine
Scores issues based on difficulty, maintainer responsiveness, competition, and learning value.
""""
from typing import Dict, List, Optional
from datetime import datetime, timedelta

class OpportunityScorer:
    """"
    Scores issues on a 0-100 scale for contribution opportunity.
    
    Weights:
    - Difficulty Match: 25%
    - Maintainer Responsiveness: 20%
    - Competition Level: 20%
    - Beginner Friendliness: 15%
    - Estimated Effort: 10%
    - Career Value: 10%
    """"
    
    WEIGHTS = {
        "difficulty_match": 0.25,
        "maintainer_responsiveness": 0.20,
        "competition": 0.20,
        "beginner_friendly": 0.15,
        "effort": 0.10,
        "career_value": 0.10,
    }
    
    @staticmethod
    def calculate_opportunity_score(
        issue_data: Dict,
        repo_data: Dict,
        user_skills: Optional[List[str]] = None,
    ) -> Dict:
        """"
        Calculate opportunity score for an issue.
        
        Args:
            issue_data: Issue metadata (labels, comments, assignee, etc.)
            repo_data: Repository health and metadata
            user_skills: User's known skills for matching
            
        Returns:
            Dictionary with scores and reasoning
        """"
        difficulty = OpportunityScorer._score_difficulty_match(issue_data, user_skills)
        responsiveness = OpportunityScorer._score_maintainer_responsiveness(repo_data)
        competition = OpportunityScorer._score_competition(issue_data)
        beginner = OpportunityScorer._score_beginner_friendly(issue_data)
        effort = OpportunityScorer._score_effort(issue_data)
        career = OpportunityScorer._score_career_value(repo_data, issue_data)
        
        opportunity_score = (
            difficulty * OpportunityScorer.WEIGHTS["difficulty_match"] +
            responsiveness * OpportunityScorer.WEIGHTS["maintainer_responsiveness"] +
            competition * OpportunityScorer.WEIGHTS["competition"] +
            beginner * OpportunityScorer.WEIGHTS["beginner_friendly"] +
            effort * OpportunityScorer.WEIGHTS["effort"] +
            career * OpportunityScorer.WEIGHTS["career_value"]
        )
        
        # Estimate hours
        estimated_hours = OpportunityScorer._estimate_hours(issue_data)
        
        # Determine difficulty level
        difficulty_level = OpportunityScorer._determine_difficulty(issue_data)
        
        return {
            "opportunity_score": round(opportunity_score, 2),
            "estimated_hours": estimated_hours,
            "difficulty": difficulty_level,
            "skills_required": OpportunityScorer._extract_skills(issue_data, repo_data),
            "is_beginner_friendly": OpportunityScorer._is_beginner_friendly(issue_data),
            "competing_prs": OpportunityScorer._count_competing_prs(issue_data),
            "breakdown": {
                "difficulty_match": round(difficulty, 2),
                "maintainer_responsiveness": round(responsiveness, 2),
                "competition": round(competition, 2),
                "beginner_friendly": round(beginner, 2),
                "effort": round(effort, 2),
                "career_value": round(career, 2),
            },
            "recommendation": OpportunityScorer._get_recommendation(opportunity_score),
        }
    
    @staticmethod
    def _score_difficulty_match(issue_data: Dict, user_skills: List[str] = None) -> float:
        """Score how well the issue matches user's skill level."""
        score = 50.0
        
        labels = OpportunityScorer._get_labels(issue_data)
        
        # Easy issues are great for beginners
        if any(l in labels for l in ["good first issue", "easy", "beginner"]):
            score += 30
        
        # Hard issues for experienced users
        if any(l in labels for l in ["hard", "expert", "advanced"]):
            if user_skills and len(user_skills) > 5:
                score += 20
            else:
                score -= 10
        
        # Skill match bonus
        if user_skills:
            matching_skills = set(s.lower() for s in user_skills) & set(labels)
            score += min(len(matching_skills) * 10, 20)
        
        return max(0, min(100, score))
    
    @staticmethod
    def _score_maintainer_responsiveness(repo_data: Dict) -> float:
        """Score based on how responsive maintainers are."""
        response_score = repo_data.get("response_time_score", 50)
        activity_score = repo_data.get("maintainer_activity_score", 50)
        
        return (response_score + activity_score) / 2
    
    @staticmethod
    def _score_competition(issue_data: Dict) -> float:
        """Score based on competition level (fewer competitors = higher score)."""
        score = 80.0  # Start optimistic
        
        # Has assignee
        if issue_data.get("assignee"):
            score -= 30
        
        # Has linked PR
        if issue_data.get("has_pull_request"):
            score -= 25
        
        # Many comments (might indicate competition)
        comments = issue_data.get("comment_count", 0)
        if comments > 10:
            score -= 20
        elif comments > 5:
            score -= 10
        
        # Age of issue (older might mean less competition but also less active)
        created_at = issue_data.get("created_at")
        if created_at:
            if isinstance(created_at, str):
                created_at = datetime.fromisoformat(created_at.replace("Z", "+00:00"))
            days_old = (datetime.utcnow() - created_at.replace(tzinfo=None)).days
            if days_old > 90:
                score -= 15
            elif days_old < 7:
                score += 10
        
        return max(0, min(100, score))
    
    @staticmethod
    def _score_beginner_friendly(issue_data: Dict) -> float:
        """Score how beginner-friendly the issue is."""
        score = 30.0
        labels = OpportunityScorer._get_labels(issue_data)
        
        if "good first issue" in labels:
            score += 50
        if any(l in labels for l in ["beginner", "beginner-friendly", "easy"]):
            score += 30
        if "documentation" in labels:
            score += 20
        if any(l in labels for l in ["help wanted", "up-for-grabs"]):
            score += 15
        
        # Has clear instructions
        body = issue_data.get("body", "")
        if body and len(body) > 200:
            score += 10
        if "steps to reproduce" in body.lower() or "how to contribute" in body.lower():
            score += 10
        
        return min(100, score)
    
    @staticmethod
    def _score_effort(issue_data: Dict) -> float:
        """Score based on estimated effort (lower effort = higher score)."""
        estimated_hours = OpportunityScorer._estimate_hours(issue_data)
        
        if estimated_hours <= 1:
            return 95
        elif estimated_hours <= 2:
            return 85
        elif estimated_hours <= 4:
            return 70
        elif estimated_hours <= 8:
            return 50
        elif estimated_hours <= 16:
            return 30
        else:
            return 15
    
    @staticmethod
    def _score_career_value(repo_data: Dict, issue_data: Dict) -> float:
        """Score the career/learning value of contributing."""
        score = 40.0
        
        # Popular repository
        stars = repo_data.get("stars_count", 0)
        if stars > 50000:
            score += 30
        elif stars > 10000:
            score += 25
        elif stars > 1000:
            score += 15
        elif stars > 100:
            score += 5
        
        # In-demand language
        language = repo_data.get("language", "").lower()
        high_demand_langs = ["python", "typescript", "rust", "go", "javascript"]
        if language in high_demand_langs:
            score += 20
        
        # Has good documentation (easier to learn from)
        if repo_data.get("documentation_score", 0) > 60:
            score += 10
        
        return min(100, score)
    
    @staticmethod
    def _estimate_hours(issue_data: Dict) -> float:
        """Estimate hours required to complete the issue."""
        labels = OpportunityScorer._get_labels(issue_data)
        
        if any(l in labels for l in ["good first issue", "easy", "trivial"]):
            return 1.5
        elif any(l in labels for l in ["medium", "moderate"]):
            return 4.0
        elif any(l in labels for l in ["hard", "difficult", "complex"]):
            return 8.0
        
        # Default based on body length
        body = issue_data.get("body", "")
        if len(body) > 1000:
            return 6.0
        elif len(body) > 500:
            return 4.0
        elif len(body) > 200:
            return 2.5
        
        return 2.0
    
    @staticmethod
    def _determine_difficulty(issue_data: Dict) -> str:
        """Determine difficulty level."""
        labels = OpportunityScorer._get_labels(issue_data)
        
        if any(l in labels for l in ["good first issue", "easy", "beginner", "trivial"]):
            return "Easy"
        elif any(l in labels for l in ["hard", "difficult", "expert", "complex"]):
            return "Hard"
        else:
            return "Medium"
    
    @staticmethod
    def _is_beginner_friendly(issue_data: Dict) -> bool:
        """Check if issue is beginner-friendly."""
        labels = OpportunityScorer._get_labels(issue_data)
        return any(l in labels for l in [
            "good first issue", "beginner", "beginner-friendly",
            "easy", "documentation", "help wanted"
        ])
    
    @staticmethod
    def _count_competing_prs(issue_data: Dict) -> int:
        """Count competing PRs."""
        count = 0
        if issue_data.get("assignee"):
            count += 1
        if issue_data.get("has_pull_request"):
            count += 1
        return count
    
    @staticmethod
    def _extract_skills(issue_data: Dict, repo_data: Dict) -> List[str]:
        """Extract required skills from issue and repo."""
        skills = []
        labels = OpportunityScorer._get_labels(issue_data)
        
        # Language skill
        language = repo_data.get("language")
        if language:
            skills.append(language)
        
        # Label-based skills
        skill_labels = {
            "python": "Python",
            "javascript": "JavaScript",
            "typescript": "TypeScript",
            "rust": "Rust",
            "go": "Go",
            "java": "Java",
            "ruby": "Ruby",
            "documentation": "Technical Writing",
            "testing": "Testing",
            "design": "UI/UX Design",
            "devops": "DevOps",
            "database": "Database",
            "api": "API Development",
            "security": "Security",
        }
        
        for label in labels:
            if label in skill_labels:
                skills.append(skill_labels[label])
        
        return list(set(skills)) if skills else [language or "General"]
    
    @staticmethod
    def _get_labels(issue_data: Dict) -> List[str]:
        """Extract labels from issue data."""
        labels = issue_data.get("labels", [])
        if isinstance(labels, list):
            return [
                l["name"].lower() if isinstance(l, dict) else str(l).lower()
                for l in labels
            ]
        return []
    
    @staticmethod
    def _get_recommendation(score: float) -> str:
        """Get human-readable recommendation."""
        if score >= 85:
            return "Strongly Recommended - Excellent opportunity!"
        elif score >= 70:
            return "Recommended - Good chance of success"
        elif score >= 55:
            return "Worth Considering - Review details carefully"
        elif score >= 40:
            return "Proceed with Caution - Some concerns"
        else:
            return "Not Recommended - Better opportunities available"
