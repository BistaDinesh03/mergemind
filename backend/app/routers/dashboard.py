from fastapi import APIRouter, Depends, HTTPException, Request
from ..services.dashboard_service import DashboardService
from .auth import get_current_user

router = APIRouter()


@router.get("/dashboard")
async def get_dashboard(request: Request):
    """
    Get personalized dashboard for the authenticated user.
    Requires authentication.
    """
    username = await get_current_user(request)
    service = DashboardService()
    return await service.get_dashboard(username)