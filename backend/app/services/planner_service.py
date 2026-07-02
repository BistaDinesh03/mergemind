""""
Daily Planner Service
Recommends issues based on available time and user preferences.
""""
from typing import Dict, List, Optional
from datetime import datetime
from sqlalchemy.orm import Session
from ..models.issue import Issue
from ..models.repository import Repository
from .scoring.opportunity_scorer import OpportunityScorer

class DailyPlannerService:
    """Generates daily contribution plans based on user's available time."""
    
    @staticmethod
    def get_daily_plan(
        db: Session,
        available_minutes: int = 60,
        skill_level: str = "intermediate",
        preferred_languages: Optional[List[str]] = None,
        max_issues: int = 5,
    ) -> Dict:
        """"
        Generate a daily plan of issues to work on.
        
        Args:
            db: Database session
            available_minutes: Time available in minutes
            skill_level: beginner, intermediate, advanced
            preferred_languages: Languages user prefers
            max_issues: Maximum issues to recommend
            
        Returns:
            Dictionary with recommended issues and plan summary
        """"
        available_hours = available_minutes / 60.0
        
        # Fetch analyzed issues ordered by opportunity score
        query = db.query(Issue).join(Repository).filter(
            Issue.state == "open",
            Issue.opportunity_score > 0
        )
        
        if preferred_languages:
            query = query.filter(Repository.language.in_(preferred_languages))
        
        # Filter by difficulty based on skill level
        if skill_level == "beginner":
            query = query.filter(Issue.is_beginner_friendly == True)
        elif skill_level == "intermediate":
            query = query.filter(Issue.difficulty.in_(["Easy", "Medium"]))
        
        issues = query.order_by(Issue.opportunity_score.desc()).limit(50).all()
        
        # Greedy algorithm: pick best issues that fit in time budget
        plan = []
        time_used_minutes = 0.0
        
        for issue in issues:
            if len(plan) >= max_issues:
                break
            
            estimated_hours = issue.estimated_hours or 2.0
            estimated_minutes = estimated_hours * 60
            
            # Allow 20% over budget to fit one more issue
            if time_used_minutes + estimated_minutes <= available_minutes * 1.2:
                plan.append({
                    "issue_id": issue.github_id,
                    "title": issue.title,
                    "repository": issue.repository.full_name if issue.repository else "Unknown",
                    "opportunity_score": issue.opportunity_score,
                    "merge_probability": issue.merge_probability,
                    "estimated_hours": estimated_hours,
                    "estimated_minutes": estimated_minutes,
                    "difficulty": issue.difficulty,
                    "skills_required": issue.skills_required,
                    "is_beginner_friendly": issue.is_beginner_friendly,
                    "url": issue.url,
                })
                time_used_minutes += estimated_minutes
        
        # Calculate plan stats
        total_estimated_hours = sum(p["estimated_hours"] for p in plan)
        avg_opportunity = sum(p["opportunity_score"] for p in plan) / len(plan) if plan else 0
        
        return {
            "available_time_minutes": available_minutes,
            "available_time_hours": round(available_hours, 1),
            "recommended_issues": plan,
            "total_issues": len(plan),
            "total_estimated_hours": round(total_estimated_hours, 1),
            "time_utilization_percent": round((time_used_minutes / available_minutes) * 100, 1) if available_minutes > 0 else 0,
            "average_opportunity_score": round(avg_opportunity, 1),
            "plan_quality": DailyPlannerService._rate_plan(plan, available_hours),
        }
    
    @staticmethod
    def _rate_plan(plan: List[Dict], available_hours: float) -> str:
        """Rate the quality of the generated plan."""
        if not plan:
            return "No suitable issues found. Try expanding your preferences."
        
        total_hours = sum(p["estimated_hours"] for p in plan)
        utilization = (total_hours / available_hours * 100) if available_hours > 0 else 0
        
        if utilization >= 80 and len(plan) >= 3:
            return "Excellent plan! Your time is well-utilized with high-quality issues."
        elif utilization >= 60 and len(plan) >= 2:
            return "Good plan. You have solid issues to work on."
        elif len(plan) >= 1:
            return "Decent plan. Consider adjusting your time or preferences for more options."
        else:
            return "Limited options found. Try broader search criteria."

    @staticmethod
    def get_quick_picks(db: Session, limit: int = 3) -> List[Dict]:
        """Get top 3 quick picks for the user."""
        issues = db.query(Issue).join(Repository).filter(
            Issue.state == "open",
            Issue.is_beginner_friendly == True,
            Issue.competing_prs == 0,
        ).order_by(Issue.opportunity_score.desc()).limit(limit).all()
        
        return [
            {
                "issue_id": issue.github_id,
                "title": issue.title,
                "repository": issue.repository.full_name if issue.repository else "Unknown",
                "opportunity_score": issue.opportunity_score,
                "estimated_hours": issue.estimated_hours,
                "difficulty": issue.difficulty,
                "url": issue.url,
            }
            for issue in issues
        ]
