"""Dashboard router — requires authentication."""
from fastapi import APIRouter, Request, HTTPException
from ..services.dashboard_service import DashboardService
from .auth import get_current_user

router = APIRouter()


@router.get("")
async def get_dashboard(request: Request):
    """
    Get personalized dashboard for the authenticated user.
    Returns 401 if not authenticated.
    """
    username = await get_current_user(request)
    service = DashboardService()
    return await service.get_dashboard(username)