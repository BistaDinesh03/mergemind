from fastapi import APIRouter, HTTPException
from ..services.portfolio_service import PortfolioService

router = APIRouter()


@router.get("/{username}")
async def get_portfolio(username: str):
    """
    Get GitHub portfolio for the given username.
    No fallback — returns 404 if user not found.
    """
    username = username.strip().strip("/")

    if not username:
        raise HTTPException(status_code=400, detail="Username is required")

    service = PortfolioService()
    data = await service.get_portfolio(username)

    if not data:
        raise HTTPException(status_code=404, detail=f"GitHub user '{username}' not found")

    return data