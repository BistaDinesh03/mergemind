from fastapi import APIRouter
from pydantic import BaseModel
import httpx
from ..config import settings

router = APIRouter()

class ChatRequest(BaseModel):
    message: str

@router.post("/chat")
async def chat(request: ChatRequest):
    """Fast AI chat - responds in seconds"""
    try:
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.post(
                f"{settings.ollama_host}/api/generate",
                json={
                    "model": settings.ollama_model,
                    "prompt": f"Answer in 2-3 sentences max. Be direct.\n\nQuestion: {request.message}\n\nAnswer:",
                    "stream": False,
                    "options": {
                        "temperature": 0.7,
                        "num_predict": 150
                    }
                }
            )
            data = response.json()
            return {"response": data.get("response", "").strip(), "model": settings.ollama_model}
    except Exception as e:
        return {"response": f"AI is warming up. Try again in a moment.", "error": str(e)}

@router.post("/analyze-issue")
async def analyze_issue(request: ChatRequest):
    """Score an issue in seconds"""
    try:
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.post(
                f"{settings.ollama_host}/api/generate",
                json={
                    "model": settings.ollama_model,
                    "prompt": f"Score this issue 0-100 and give 1 tip:\n\n{request.message}\n\nSCORE:\nTIP:",
                    "stream": False,
                    "options": {"num_predict": 80}
                }
            )
            data = response.json()
            return {"analysis": data.get("response", "").strip()}
    except Exception as e:
        return {"error": str(e)}

@router.post("/pr-advice")
async def pr_advice(request: ChatRequest):
    """Get PR tips fast"""
    try:
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.post(
                f"{settings.ollama_host}/api/generate",
                json={
                    "model": settings.ollama_model,
                    "prompt": f"Give 3 short tips for this PR:\n\n{request.message}\n\n1.",
                    "stream": False,
                    "options": {"num_predict": 100}
                }
            )
            data = response.json()
            return {"advice": data.get("response", "").strip()}
    except Exception as e:
        return {"error": str(e)}

@router.get("/health")
async def health():
    return {"status": "ok", "model": settings.ollama_model}