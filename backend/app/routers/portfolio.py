from fastapi import APIRouter, HTTPException, Depends, Query
from fastapi.responses import HTMLResponse
from sqlalchemy.orm import Session
from ..database import get_db
from ..services.portfolio_service import PortfolioService

router = APIRouter()

@router.get("/{username}")
async def get_portfolio(
    username: str,
    format: str = Query(default="json", description="Response format: json or html"),
    db: Session = Depends(get_db),
):
    """"
    Generate a portfolio for a GitHub username.
    
    Args:
        username: GitHub username
        format: Response format (json or html)
    """"
    try:
        portfolio = PortfolioService.generate_portfolio(db, username)
        
        if "error" in portfolio:
            raise HTTPException(status_code=404, detail=portfolio["error"])
        
        if format == "html":
            html = PortfolioService.generate_html_portfolio(portfolio)
            return HTMLResponse(content=html)
        
        return portfolio
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/{username}/stats")
async def get_portfolio_stats(
    username: str,
    db: Session = Depends(get_db),
):
    """Get portfolio stats only."""
    try:
        portfolio = PortfolioService.generate_portfolio(db, username)
        
        if "error" in portfolio:
            raise HTTPException(status_code=404, detail=portfolio["error"])
        
        return {
            "username": username,
            "stats": portfolio.get("stats", {}),
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
