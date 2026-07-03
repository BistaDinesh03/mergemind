from fastapi import APIRouter
import httpx
from ..config import settings
from pydantic import BaseModel
router = APIRouter()
class ChatRequest(BaseModel):
    message: str
@router.post("/chat")
async def chat(req: ChatRequest):
    async with httpx.AsyncClient(timeout=30) as c:
        r = await c.post(f"{settings.ollama_host}/api/generate", json={"model": settings.ollama_model, "prompt": req.message, "stream": False})
        return {"response": r.json().get("response", "")}
@router.get("/health")
async def health(): return {"status": "ok"}