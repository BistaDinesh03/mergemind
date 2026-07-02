""""
Dashboard Service
Aggregates user statistics and dashboard data.
""""
from typing import Dict, List, Optional
from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from sqlalchemy import func
from ..models.user import User
from ..models.repository import Repository
from ..models.issue import Issue
from ..models.contribution import Contribution, ContributionStatus

class DashboardService:
    """Aggregates dashboard statistics for users."""
    
    @staticmethod
    def get_user_dashboard(db: Session, user_id: str) -> Dict:
        """"
        Get complete dashboard data for a user.
        
        Args:
            db: Database session
            user_id: User's ID
            
        Returns:
            Dictionary with all dashboard stats
        """"
        # Get user
        user = db.query(User).filter(User.id == user_id).first()
        if not user:
            return {"error": "User not found"}
        
        # Contribution stats
        total_prs = db.query(Contribution).filter(
            Contribution.user_id == user_id
        ).count()
        
        merged_prs = db.query(Contribution).filter(
            Contribution.user_id == user_id,
            Contribution.status == ContributionStatus.MERGED.value
        ).count()
        
        in_progress = db.query(Contribution).filter(
            Contribution.user_id == user_id,
            Contribution.status == ContributionStatus.IN_PROGRESS.value
        ).count()
        
        # Repositories contributed to
        repos_contributed = db.query(Contribution).join(Issue).join(Repository).filter(
            Contribution.user_id == user_id,
            Contribution.status == ContributionStatus.MERGED.value
        ).distinct(Repository.id).count()
        
        # Languages used
        languages = db.query(Repository.language).join(Issue).join(Contribution).filter(
            Contribution.user_id == user_id,
            Contribution.status == ContributionStatus.MERGED.value,
            Repository.language.isnot(None)
        ).distinct().all()
        language_list = [lang[0] for lang in languages if lang[0]]
        
        # Current streak
        current_streak = DashboardService._calculate_streak(db, user_id)
        
        # Recent contributions
        recent = db.query(Contribution).filter(
            Contribution.user_id == user_id
        ).order_by(Contribution.started_at.desc()).limit(5).all()
        
        recent_contributions = []
        for contrib in recent:
            issue = db.query(Issue).filter(Issue.id == contrib.issue_id).first()
            repo = db.query(Repository).filter(Repository.id == issue.repository_id).first() if issue else None
            
            recent_contributions.append({
                "contribution_id": contrib.id,
                "issue_title": issue.title if issue else "Unknown",
                "repository": repo.full_name if repo else "Unknown",
                "status": contrib.status,
                "started_at": contrib.started_at.isoformat() if contrib.started_at else None,
                "merged_at": contrib.merged_at.isoformat() if contrib.merged_at else None,
            })
        
        # Weekly stats
        week_ago = datetime.utcnow() - timedelta(days=7)
        weekly_contributions = db.query(Contribution).filter(
            Contribution.user_id == user_id,
            Contribution.started_at >= week_ago
        ).count()
        
        # Skills gained
        skills = DashboardService._extract_skills(db, user_id)
        
        # Top repositories by opportunity
        top_repos = db.query(Repository).filter(
            Repository.health_score > 50
        ).order_by(Repository.health_score.desc()).limit(3).all()
        
        top_repositories = [
            {
                "full_name": repo.full_name,
                "health_score": repo.health_score,
                "stars": repo.stars_count,
                "language": repo.language,
            }
            for repo in top_repos
        ]
        
        return {
            "user": {
                "id": user.id,
                "github_username": user.github_username,
                "avatar_url": user.avatar_url,
                "member_since": user.created_at.isoformat() if user.created_at else None,
            },
            "stats": {
                "total_prs": total_prs,
                "merged_prs": merged_prs,
                "in_progress": in_progress,
                "merge_rate": round((merged_prs / total_prs * 100), 1) if total_prs > 0 else 0,
                "repositories_contributed": repos_contributed,
                "languages_used": language_list,
                "languages_count": len(language_list),
                "current_streak": current_streak,
                "weekly_contributions": weekly_contributions,
                "skills_gained": skills,
            },
            "recent_contributions": recent_contributions,
            "top_repositories": top_repositories,
            "last_updated": datetime.utcnow().isoformat(),
        }
    
    @staticmethod
    def _calculate_streak(db: Session, user_id: str) -> int:
        """Calculate current contribution streak in days."""
        contributions = db.query(Contribution).filter(
            Contribution.user_id == user_id
        ).order_by(Contribution.started_at.desc()).all()
        
        if not contributions:
            return 0
        
        streak = 0
        current_date = datetime.utcnow().date()
        
        for contrib in contributions:
            if contrib.started_at:
                contrib_date = contrib.started_at.date()
                days_diff = (current_date - contrib_date).days
                
                if days_diff == streak:
                    streak += 1
                elif days_diff == streak + 1:
                    streak += 1
                else:
                    break
        
        return streak
    
    @staticmethod
    def _extract_skills(db: Session, user_id: str) -> List[Dict]:
        """Extract skills from merged contributions."""
        skills_dict = {}
        
        contributions = db.query(Contribution).join(Issue).filter(
            Contribution.user_id == user_id,
            Contribution.status == ContributionStatus.MERGED.value
        ).all()
        
        for contrib in contributions:
            issue = db.query(Issue).filter(Issue.id == contrib.issue_id).first()
            if issue and issue.skills_required:
                for skill in issue.skills_required:
                    if skill in skills_dict:
                        skills_dict[skill] += 1
                    else:
                        skills_dict[skill] = 1
        
        return [
            {"skill": skill, "count": count}
            for skill, count in sorted(skills_dict.items(), key=lambda x: x[1], reverse=True)
        ]
    
    @staticmethod
    def get_leaderboard(db: Session, limit: int = 10) -> List[Dict]:
        """Get top contributors leaderboard."""
        results = db.query(
            User.github_username,
            User.avatar_url,
            func.count(Contribution.id).label("total_contributions")
        ).join(Contribution).filter(
            Contribution.status == ContributionStatus.MERGED.value
        ).group_by(User.id).order_by(
            func.count(Contribution.id).desc()
        ).limit(limit).all()
        
        return [
            {
                "username": row[0],
                "avatar_url": row[1],
                "total_contributions": row[2],
                "rank": i + 1,
            }
            for i, row in enumerate(results)
        ]
