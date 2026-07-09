from fastapi import APIRouter
from pydantic import BaseModel
from ..services.ai_service import ai_service

router = APIRouter()

class ChatRequest(BaseModel):
    message: str

@router.post("/chat")
async def chat(request: ChatRequest):
    response = ai_service.chat(request.message)
    return {"response": response, "model": "gemini-2.5-flash"}

@router.get("/health")
async def health():
    return {"status": "ok", "provider": "google-gemini", "model": "gemini-2.5-flash"}