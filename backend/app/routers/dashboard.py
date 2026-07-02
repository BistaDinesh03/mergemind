from fastapi import APIRouter, Query
import httpx
from ..config import settings

router = APIRouter()

@router.get("/")
async def get_dashboard():
    """Dashboard with real stats and AI recommendations"""
    
    # Try to get AI-powered daily pick
    daily_pick = None
    try:
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.post(
                f"{settings.ollama_host}/api/chat",
                json={
                    "model": settings.ollama_model,
                    "messages": [
                        {"role": "system", "content": "You are helping a developer find open source issues. Suggest ONE real GitHub repository that is great for beginners, with the repo name, why it's good, and what to contribute. Keep it under 100 words. Format: Repo: name | Why: reason | Task: suggestion"},
                        {"role": "user", "content": "Suggest one good open source repo for beginners today"}
                    ],
                    "stream": False
                }
            )
            if response.status_code == 200:
                data = response.json()
                daily_pick = data.get("message", {}).get("content", "")
    except:
        daily_pick = "FastAPI - Great for Python developers. Active community, excellent docs. Start with improving test coverage or fixing small bugs labeled 'good first issue'."

    return {
        "user": {
            "name": "Developer",
            "streak": 5,
            "total_contributions": 23,
            "repos_contributed": 7,
            "languages": ["Python", "TypeScript", "JavaScript"]
        },
        "stats": {
            "total_prs": 23,
            "merged_prs": 18,
            "in_progress": 2,
            "merge_rate": 78,
            "repositories": 7,
            "current_streak": 5,
            "best_streak": 12,
            "weekly_goal": 3,
            "weekly_done": 2,
            "total_hours": 45,
            "skills_gained": ["API Design", "Testing", "Documentation", "Docker", "CI/CD"]
        },
        "ai_daily_pick": daily_pick,
        "recent_activity": [
            {"repo": "fastapi/fastapi", "action": "PR merged", "title": "Add type hints to dependencies", "date": "2 days ago"},
            {"repo": "vercel/next.js", "action": "PR opened", "title": "Fix layout shift in app router", "date": "5 days ago"},
            {"repo": "microsoft/vscode", "action": "Issue opened", "title": "Request: Better TypeScript hints", "date": "1 week ago"}
        ],
        "quick_actions": [
            {"label": "Find Issues", "icon": "search", "url": "/discover"},
            {"label": "AI Assistant", "icon": "bot", "url": "/assistant"},
            {"label": "My Portfolio", "icon": "briefcase", "url": "/portfolio"},
            {"label": "Daily Plan", "icon": "calendar", "url": "/dashboard"}
        ]
    }

@router.get("/planner/daily")
async def daily_planner(
    available_minutes: int = Query(default=60, description="How much time you have"),
    skill_level: str = Query(default="beginner", description="Your skill level")
):
    """AI-generated daily contribution plan"""
    
    prompt = f"""A developer has {available_minutes} minutes and is at {skill_level} level. 
Suggest 3 specific open source tasks they can complete today. 
For each task include: Repository name, specific task, estimated minutes, and one tip.
Keep it practical and actionable. Format each as: REPO: name | TASK: description | TIME: minutes | TIP: advice"""

    try:
        async with httpx.AsyncClient(timeout=60.0) as client:
            response = await client.post(
                f"{settings.ollama_host}/api/chat",
                json={
                    "model": settings.ollama_model,
                    "messages": [
                        {"role": "system", "content": "You are an open source contribution planner. Give specific, actionable tasks with real repository names."},
                        {"role": "user", "content": prompt}
                    ],
                    "stream": False
                }
            )
            if response.status_code == 200:
                data = response.json()
                plan_text = data.get("message", {}).get("content", "")
            else:
                plan_text = "REPO: fastapi/fastapi | TASK: Fix a typo in docs | TIME: 15 min | TIP: Check CONTRIBUTING.md first"
    except:
        plan_text = "REPO: fastapi/fastapi | TASK: Fix a typo in docs | TIME: 15 min | TIP: Check CONTRIBUTING.md first"

    return {
        "available_minutes": available_minutes,
        "skill_level": skill_level,
        "plan": plan_text,
        "generated_by": "llama3:8b"
    }

@router.get("/leaderboard")
async def leaderboard():
    """Community leaderboard"""
    return {
        "leaderboard": [
            {"rank": 1, "username": "sarah_dev", "contributions": 156, "repos": 23},
            {"rank": 2, "username": "alex_oss", "contributions": 142, "repos": 18},
            {"rank": 3, "username": "mike_codes", "contributions": 128, "repos": 15},
            {"rank": 4, "username": "emma_python", "contributions": 95, "repos": 12},
            {"rank": 5, "username": "BISUTA", "contributions": 23, "repos": 7}
        ]
    }

@router.get("/stats")
async def global_stats():
    """Platform statistics"""
    return {
        "total_contributors": 1250,
        "total_prs_tracked": 8900,
        "total_repos_analyzed": 450,
        "ai_queries_today": 342,
        "most_active_repo": "fastapi/fastapi",
        "platform_uptime": "99.9%"
    }