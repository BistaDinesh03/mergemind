""""
Prompt Templates for MergeMind AI
Engineered prompts for issue analysis, PR advising, and maintainer insights.
""""

class PromptTemplates:
    """Collection of prompt templates for different AI tasks."""
    
    # System prompt defining the AI's role
    SYSTEM_PROMPT = """You are MergeMind AI, an expert open source contribution advisor. 
You analyze GitHub issues and repositories to help developers find and succeed in their contributions.
Be concise, practical, and actionable. Always provide specific, useful advice.
Respond in JSON format when asked for structured data."""

    @staticmethod
    def issue_analyzer(issue_data: dict, repo_data: dict) -> str:
        """Prompt to analyze why an issue is a good/bad opportunity."""
        return f"""Analyze this GitHub issue as a contribution opportunity:

Repository: {repo_data.get('full_name', 'Unknown')}
Stars: {repo_data.get('stars_count', 0)}
Health Score: {repo_data.get('health_score', 'N/A')}/100
Language: {repo_data.get('language', 'Unknown')}

Issue Title: {issue_data.get('title', 'Untitled')}
Labels: {issue_data.get('labels', [])}
Difficulty: {issue_data.get('difficulty', 'Unknown')}
Estimated Hours: {issue_data.get('estimated_hours', 'N/A')}

Please provide:
1. Is this a good opportunity? (Yes/No with explanation)
2. What skills will the contributor gain?
3. What are the potential challenges?
4. What should the contributor check before starting?
5. Overall opportunity rating (1-10)

Keep your response under 200 words and be specific."""

    @staticmethod
    def pr_advisor(issue_data: dict, repo_data: dict) -> str:
        """Prompt to suggest PR preparation steps."""
        return f"""A developer wants to submit a PR for this issue. Provide preparation advice:

Issue: {issue_data.get('title', 'Untitled')}
Repository: {repo_data.get('full_name', 'Unknown')}
Has CONTRIBUTING.md: {repo_data.get('has_contributing_guide', False)}
Has CI/CD: {repo_data.get('has_ci_cd', False)}
Estimated PR size: {issue_data.get('estimated_hours', 2)} hours

Provide:
1. Top 3 files/folders to review before coding
2. Key patterns or conventions to follow
3. Testing requirements to check
4. PR description template suggestion
5. One specific tip for success

Be concise and actionable. Maximum 150 words."""

    @staticmethod
    def maintainer_insights(repo_data: dict) -> str:
        """Prompt to predict maintainer behavior."""
        return f"""Analyze this repository's maintainer behavior:

Repository: {repo_data.get('full_name', 'Unknown')}
Health Score: {repo_data.get('health_score', 'N/A')}/100
Response Time: {repo_data.get('avg_response_time_hours', 'N/A')} hours
PR Merge Rate: {repo_data.get('pr_merge_rate', 'N/A')}%
Recent Activity Score: {repo_data.get('maintainer_activity_score', 'N/A')}/100

Predict:
1. How responsive will maintainers be? (High/Medium/Low)
2. What type of PRs do they prefer? (Small/Large, Bug/Feature)
3. Best time to submit PR? (Based on activity patterns)
4. One thing to avoid in PRs to this repo
5. Merge probability estimate (percentage)

Keep it under 150 words."""

    @staticmethod
    def daily_summary(user_stats: dict, plan: list) -> str:
        """Prompt to generate daily contribution summary."""
        plan_text = "\n".join([
            f"- {p.get('title', 'Issue')} ({p.get('repository', 'Unknown')}) - Score: {p.get('opportunity_score', 0)}"
            for p in plan[:5]
        ])
        
        return f"""Generate a motivational daily summary for an open source contributor:

Stats:
- Merged PRs: {user_stats.get('merged_prs', 0)}
- Current Streak: {user_stats.get('current_streak', 0)} days
- Languages: {user_stats.get('languages_used', [])}

Today's Plan:
{plan_text if plan_text else 'No issues planned yet'}

Provide:
1. A motivational opening (1 sentence)
2. Key focus for today (what to prioritize)
3. Quick tip for success
4. Encouraging closing

Keep it friendly and under 100 words."""

    @staticmethod
    def skill_recommendation(user_skills: list, available_issues: list) -> str:
        """Prompt to recommend skills to develop."""
        return f"""Based on this developer's profile and available opportunities, 
recommend skills they should develop:

Current Skills: {user_skills}
Available Issues: {len(available_issues)} issues found

Provide:
1. Top 3 skills to learn next (based on market demand and opportunity availability)
2. Why each skill is valuable
3. How many beginner-friendly issues exist for each
4. Estimated learning time for basic proficiency

Be practical and data-driven. Maximum 150 words."""

    @staticmethod
    def portfolio_narrative(contributions: list, user_data: dict) -> str:
        """Prompt to generate a portfolio narrative."""
        contrib_text = "\n".join([
            f"- {c.get('repository', 'Unknown')}: {c.get('title', 'Issue')} ({c.get('status', 'Unknown')})"
            for c in contributions[:5]
        ])
        
        return f"""Write a professional portfolio narrative for this developer:

Name: {user_data.get('github_username', 'Developer')}
Total Contributions: {user_data.get('total_prs', 0)}
Repositories: {user_data.get('repositories_contributed', 0)}

Recent Contributions:
{contrib_text if contrib_text else 'No contributions yet'}

Write a 2-3 sentence professional summary highlighting:
1. Technical impact
2. Collaboration skills
3. Areas of expertise demonstrated

Make it suitable for a resume or LinkedIn profile."""
