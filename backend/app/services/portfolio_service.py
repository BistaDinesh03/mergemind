""""
Portfolio Generator Service
Creates shareable portfolio from user's contributions.
""""
from typing import Dict, List, Optional
from datetime import datetime
from sqlalchemy.orm import Session
from ..models.user import User
from ..models.repository import Repository
from ..models.issue import Issue
from ..models.contribution import Contribution, ContributionStatus

class PortfolioService:
    """Generates professional portfolio from contribution history."""
    
    @staticmethod
    def generate_portfolio(db: Session, username: str) -> Dict:
        """"
        Generate a complete portfolio for a user.
        
        Args:
            db: Database session
            username: GitHub username
            
        Returns:
            Dictionary with formatted portfolio data
        """"
        user = db.query(User).filter(User.github_username == username).first()
        if not user:
            return {"error": "User not found"}
        
        # Get all merged contributions
        contributions = db.query(Contribution).filter(
            Contribution.user_id == user.id,
            Contribution.status == ContributionStatus.MERGED.value
        ).order_by(Contribution.merged_at.desc()).all()
        
        # Format contributions
        formatted_contributions = []
        languages_used = set()
        repos_contributed = set()
        
        for contrib in contributions:
            issue = db.query(Issue).filter(Issue.id == contrib.issue_id).first()
            if not issue:
                continue
            
            repo = db.query(Repository).filter(Repository.id == issue.repository_id).first()
            if repo:
                repos_contributed.add(repo.full_name)
                if repo.language:
                    languages_used.add(repo.language)
            
            formatted_contributions.append({
                "title": issue.title,
                "repository": repo.full_name if repo else "Unknown",
                "language": repo.language if repo else None,
                "difficulty": issue.difficulty,
                "skills_demonstrated": issue.skills_required,
                "merged_at": contrib.merged_at.isoformat() if contrib.merged_at else None,
                "url": issue.url,
                "pr_url": contrib.pr_url,
            })
        
        # Calculate stats
        total_prs = len(formatted_contributions)
        
        # Timeline
        timeline = PortfolioService._build_timeline(formatted_contributions)
        
        # Skills summary
        skills_summary = PortfolioService._summarize_skills(formatted_contributions)
        
        # Impact score
        impact_score = PortfolioService._calculate_impact(
            formatted_contributions, list(repos_contributed), list(languages_used)
        )
        
        return {
            "username": username,
            "avatar_url": user.avatar_url,
            "member_since": user.created_at.isoformat() if user.created_at else None,
            "stats": {
                "total_merged_prs": total_prs,
                "repositories_contributed": len(repos_contributed),
                "languages_used": sorted(list(languages_used)),
                "repositories_list": sorted(list(repos_contributed)),
                "impact_score": impact_score,
            },
            "skills_summary": skills_summary,
            "contributions": formatted_contributions,
            "timeline": timeline,
            "generated_at": datetime.utcnow().isoformat(),
            "share_url": f"https://mergemind.dev/portfolio/{username}",
        }
    
    @staticmethod
    def generate_html_portfolio(portfolio_data: Dict) -> str:
        """Generate HTML version of portfolio."""
        user = portfolio_data
        stats = user.get("stats", {})
        skills = user.get("skills_summary", [])
        contributions = user.get("contributions", [])
        
        html = f"""<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{user.get('username')} - MergeMind Portfolio</title>
    <style>
        body {{
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            max-width: 900px;
            margin: 0 auto;
            padding: 40px 20px;
            background: #0f172a;
            color: #e2e8f0;
        }}
        .header {{
            text-align: center;
            margin-bottom: 40px;
        }}
        .avatar {{
            width: 100px;
            height: 100px;
            border-radius: 50%;
            border: 3px solid #3b82f6;
            margin-bottom: 16px;
        }}
        h1 {{
            font-size: 2.5em;
            margin: 0;
            background: linear-gradient(135deg, #3b82f6, #10b981);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }}
        .stats {{
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 16px;
            margin-bottom: 40px;
        }}
        .stat-card {{
            background: #1e293b;
            padding: 20px;
            border-radius: 12px;
            text-align: center;
            border: 1px solid #334155;
        }}
        .stat-value {{
            font-size: 2em;
            font-weight: bold;
            color: #3b82f6;
        }}
        .skills {{
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
            margin-bottom: 30px;
        }}
        .skill-tag {{
            background: #1e293b;
            padding: 6px 14px;
            border-radius: 20px;
            font-size: 0.9em;
            border: 1px solid #334155;
        }}
        .contribution {{
            background: #1e293b;
            padding: 20px;
            border-radius: 12px;
            margin-bottom: 16px;
            border: 1px solid #334155;
        }}
        .contribution h3 {{
            margin: 0 0 8px 0;
            color: #60a5fa;
        }}
        .meta {{
            color: #94a3b8;
            font-size: 0.9em;
        }}
        .footer {{
            text-align: center;
            margin-top: 60px;
            color: #64748b;
            font-size: 0.9em;
        }}
    </style>
</head>
<body>
    <div class="header">
        {f'<img src="{user.get("avatar_url")}" class="avatar" alt="Avatar">' if user.get('avatar_url') else ''}
        <h1>{user.get('username', 'Developer')}</h1>
        <p>Open Source Contributor | Member since {user.get('member_since', 'N/A')[:10]}</p>
    </div>
    
    <div class="stats">
        <div class="stat-card">
            <div class="stat-value">{stats.get('total_merged_prs', 0)}</div>
            <div>Merged PRs</div>
        </div>
        <div class="stat-card">
            <div class="stat-value">{stats.get('repositories_contributed', 0)}</div>
            <div>Repositories</div>
        </div>
        <div class="stat-card">
            <div class="stat-value">{stats.get('languages_used', [])|length}</div>
            <div>Languages</div>
        </div>
        <div class="stat-card">
            <div class="stat-value">{stats.get('impact_score', 0)}%</div>
            <div>Impact Score</div>
        </div>
    </div>
    
    <h2>Skills Demonstrated</h2>
    <div class="skills">
        {''.join(f'<span class="skill-tag">{s.get("skill", "")} ({s.get("count", 0)})</span>' for s in skills[:10])}
    </div>
    
    <h2>Contributions ({len(contributions)})</h2>
    {''.join(f'''
    <div class="contribution">
        <h3>{c.get('title', 'Untitled')}</h3>
        <p class="meta">
            {c.get('repository', 'Unknown')} • {c.get('language', 'N/A')} • {c.get('difficulty', 'N/A')}
        </p>
        <p class="meta">Merged: {c.get('merged_at', 'N/A')[:10] if c.get('merged_at') else 'N/A'}</p>
    </div>
    ''' for c in contributions[:20])}
    
    <div class="footer">
        <p>Generated by <strong>MergeMind</strong> - The AI-powered Open Source Intelligence Platform</p>
    </div>
</body>
</html>"""
        
        return html
    
    @staticmethod
    def _build_timeline(contributions: List[Dict]) -> List[Dict]:
        """Build a timeline of contributions by month."""
        timeline = {}
        
        for contrib in contributions:
            if contrib.get("merged_at"):
                month_key = contrib["merged_at"][:7]  # YYYY-MM
                if month_key not in timeline:
                    timeline[month_key] = {
                        "month": month_key,
                        "count": 0,
                        "repositories": set(),
                    }
                timeline[month_key]["count"] += 1
                timeline[month_key]["repositories"].add(contrib.get("repository", ""))
        
        return sorted(
            [{"month": v["month"], "count": v["count"], 
              "repositories": len(v["repositories"])}
             for v in timeline.values()],
            key=lambda x: x["month"],
            reverse=True,
        )
    
    @staticmethod
    def _summarize_skills(contributions: List[Dict]) -> List[Dict]:
        """Summarize skills from contributions."""
        skills = {}
        
        for contrib in contributions:
            for skill in contrib.get("skills_demonstrated", []):
                skills[skill] = skills.get(skill, 0) + 1
        
        return sorted(
            [{"skill": k, "count": v} for k, v in skills.items()],
            key=lambda x: x["count"],
            reverse=True,
        )
    
    @staticmethod
    def _calculate_impact(
        contributions: List[Dict],
        repositories: List[str],
        languages: List[str],
    ) -> int:
        """Calculate impact score (0-100)."""
        score = 0
        
        # Number of contributions (max 40 points)
        pr_count = len(contributions)
        score += min(pr_count * 4, 40)
        
        # Repository diversity (max 30 points)
        repo_count = len(repositories)
        score += min(repo_count * 5, 30)
        
        # Language diversity (max 20 points)
        lang_count = len(languages)
        score += min(lang_count * 4, 20)
        
        # Consistency bonus (max 10 points)
        if pr_count > 20:
            score += 10
        elif pr_count > 10:
            score += 5
        
        return min(100, score)
