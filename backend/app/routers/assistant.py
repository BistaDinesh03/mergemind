from fastapi import APIRouter
from pydantic import BaseModel
import httpx
from ..config import settings

router = APIRouter()

class ChatRequest(BaseModel):
    message: str

class ScoreRequest(BaseModel):
    issue_title: str
    repo: str
    labels: str = ""

@router.post("/chat")
async def chat(req: ChatRequest):
    try:
        async with httpx.AsyncClient(timeout=60) as c:
            r = await c.post(f"{settings.ollama_host}/api/generate", json={
                "model": settings.ollama_model,
                "prompt": f"Answer in 2-3 sentences:\n\n{req.message}",
                "stream": False,
                "options": {"num_predict": 150}
            })
            return {"response": r.json().get("response", "").strip()}
    except:
        return {"response": "AI not available right now"}

@router.post("/score-issue")
async def score_issue(req: ScoreRequest):
    """Score an issue 0-100 with AI analysis"""
    prompt = f"""Analyze this GitHub issue:
    
Repository: {req.repo}
Title: {req.issue_title}
Labels: {req.labels}

Give:
SCORE: (0-100)
DIFFICULTY: (Easy/Medium/Hard)
TIME: (hours)
WHY: (one sentence)"""
    
    try:
        async with httpx.AsyncClient(timeout=60) as c:
            r = await c.post(f"{settings.ollama_host}/api/generate", json={
                "model": settings.ollama_model,
                "prompt": prompt,
                "stream": False,
                "options": {"num_predict": 150}
            })
            return {"analysis": r.json().get("response", "").strip(), "repo": req.repo, "issue": req.issue_title}
    except:
        return {"error": "Scoring unavailable"}

@router.get("/health")
async def health():
    try:
        async with httpx.AsyncClient(timeout=5) as c:
            r = await c.get(f"{settings.ollama_host}/api/tags")
            return {"status": "connected" if r.status_code == 200 else "error"}
    except:
        return {"status": "disconnected"}