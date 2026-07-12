from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from typing import Optional
from ..services.ai_service import ai_service

router = APIRouter()

class ChatRequest(BaseModel):
    message: str = Field(..., min_length=1, max_length=2000)
    context: Optional[str] = None

class ChatResponse(BaseModel):
    response: str
    provider: str = "google-gemini"

@router.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    if not ai_service.enabled: raise HTTPException(status_code=503, detail="AI service is not configured")
    prompt = f"Context: {request.context}\n\nQuestion: {request.message}" if request.context else request.message
    response = ai_service.chat(prompt)
    if not response: raise HTTPException(status_code=502, detail="AI service returned empty response")
    return ChatResponse(response=response)

@router.get("/health")
async def ai_health():
    return ai_service.health_check()
