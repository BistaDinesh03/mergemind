from fastapi import APIRouter, HTTPException, Depends, Query
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from typing import Optional, List
from pydantic import BaseModel
from ..database import get_db
from ..services.ollama_service import OllamaService, get_ollama_service
from ..services.ai_recommendation_service import AIRecommendationService
from ..services.prompt_templates import PromptTemplates
import json

router = APIRouter()

class ChatRequest(BaseModel):
    message: str
    context: Optional[dict] = None
    repository: Optional[str] = None
    issue_id: Optional[int] = None

class ChatResponse(BaseModel):
    response: str
    action_items: Optional[List[str]] = None
    model: str

@router.post("/chat", response_model=ChatResponse)
async def chat_with_assistant(
    request: ChatRequest,
    ollama: OllamaService = Depends(get_ollama_service),
    db: Session = Depends(get_db),
):
    """"
    Chat with the AI assistant about contribution opportunities.
    
    Context can include repository and issue information for better responses.
    """"
    try:
        # Build context-aware system prompt
        system_prompt = PromptTemplates.SYSTEM_PROMPT
        
        if request.context:
            context_str = json.dumps(request.context, indent=2)
            system_prompt += f"\n\nCurrent Context:\n{context_str}"
        
        if request.repository:
            system_prompt += f"\n\nFocus Repository: {request.repository}"
        
        # Generate response
        result = await ollama.generate(
            prompt=request.message,
            system_prompt=system_prompt,
            temperature=0.7,
            max_tokens=400,
        )
        
        # Extract action items from response
        action_items = []
        response_text = result.get("text", "")
        
        for line in response_text.split("\n"):
            line = line.strip()
            if line and (line.startswith("-") or line.startswith("•") or 
                        any(line.startswith(f"{i}.") for i in range(1, 10))):
                action_items.append(line.lstrip("-•123456789. "))
        
        return ChatResponse(
            response=response_text,
            action_items=action_items[:5] if action_items else None,
            model=result.get("model", "unknown"),
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/chat/stream")
async def chat_stream(
    request: ChatRequest,
    ollama: OllamaService = Depends(get_ollama_service),
):
    """Stream chat responses for real-time AI interaction."""
    system_prompt = PromptTemplates.SYSTEM_PROMPT
    
    if request.context:
        context_str = json.dumps(request.context, indent=2)
        system_prompt += f"\n\nContext:\n{context_str}"
    
    async def generate():
        async for token in ollama.generate_stream(
            prompt=request.message,
            system_prompt=system_prompt,
        ):
            yield f"data: {json.dumps({'token': token})}\n\n"
        yield "data: [DONE]\n\n"
    
    return StreamingResponse(
        generate(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
        },
    )

@router.get("/analyze-issue")
async def analyze_issue(
    repository: str = Query(..., description="Repository full name"),
    issue_title: str = Query(..., description="Issue title"),
    issue_labels: Optional[str] = Query(default="", description="Comma-separated labels"),
    ollama: OllamaService = Depends(get_ollama_service),
    db: Session = Depends(get_db),
):
    """Get AI analysis of an issue as a contribution opportunity."""
    try:
        from ..models.repository import Repository
        
        # Get repository data
        repo = db.query(Repository).filter(Repository.full_name == repository).first()
        
        issue_data = {
            "title": issue_title,
            "labels": issue_labels.split(",") if issue_labels else [],
            "difficulty": "Unknown",
            "estimated_hours": 2,
        }
        
        repo_data = {
            "full_name": repository,
            "stars_count": repo.stars_count if repo else 0,
            "health_score": repo.health_score if repo else 50,
            "language": repo.language if repo else "Unknown",
            "has_contributing_guide": repo.has_contributing_guide if repo else False,
            "has_ci_cd": repo.has_ci_cd if repo else False,
            "maintainer_activity_score": repo.maintainer_activity_score if repo else 50,
        }
        
        ai_service = AIRecommendationService(ollama)
        analysis = await ai_service.analyze_issue_opportunity(issue_data, repo_data)
        
        return analysis
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/pr-advice")
async def get_pr_advice(
    repository: str = Query(..., description="Repository full name"),
    issue_title: str = Query(..., description="Issue title"),
    ollama: OllamaService = Depends(get_ollama_service),
    db: Session = Depends(get_db),
):
    """Get AI advice for preparing a PR."""
    try:
        from ..models.repository import Repository
        
        repo = db.query(Repository).filter(Repository.full_name == repository).first()
        
        issue_data = {
            "title": issue_title,
            "estimated_hours": 2,
        }
        
        repo_data = {
            "full_name": repository,
            "has_contributing_guide": repo.has_contributing_guide if repo else False,
            "has_ci_cd": repo.has_ci_cd if repo else False,
            "has_readme": repo.has_readme if repo else False,
        }
        
        ai_service = AIRecommendationService(ollama)
        advice = await ai_service.get_pr_advice(issue_data, repo_data)
        
        return advice
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/daily-summary")
async def get_daily_summary(
    ollama: OllamaService = Depends(get_ollama_service),
    db: Session = Depends(get_db),
):
    """Generate an AI-powered daily contribution summary."""
    try:
        from ..services.planner_service import DailyPlannerService
        
        user_stats = {
            "merged_prs": 0,
            "current_streak": 0,
            "languages_used": [],
        }
        
        plan_result = DailyPlannerService.get_daily_plan(db, available_minutes=60)
        
        ai_service = AIRecommendationService(ollama)
        summary = await ai_service.generate_daily_summary(
            user_stats,
            plan_result.get("recommended_issues", []),
        )
        
        return summary
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/models")
async def list_models(
    ollama: OllamaService = Depends(get_ollama_service),
):
    """List available Ollama models."""
    try:
        models = await ollama.list_models()
        return {"models": models, "count": len(models)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
