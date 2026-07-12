"""Portfolio router with pagination support."""
from fastapi import APIRouter, HTTPException, Query, Path
from ..services.portfolio_service import PortfolioService

router = APIRouter(tags=["Portfolio"])


@router.get(
    "/{username}",
    summary="Get GitHub user portfolio",
    description="Returns a GitHub user's profile information and paginated repository list. Includes follower count, repo count, and language stats.",
    responses={
        200: {
            "description": "Portfolio data with paginated repositories",
            "content": {"application/json": {"example": {
                "username": "octocat", "name": "The Octocat", "bio": "GitHub mascot",
                "avatar": "https://avatars.githubusercontent.com/u/583231?v=4",
                "followers": 5000, "following": 10, "public_repos": 30,
                "page": 1, "per_page": 30, "total_pages": 1,
                "repositories": [{"name": "octocat/Hello-World", "stars": 100, "forks": 50, "language": "Python", "description": "My first repo", "url": "https://github.com/octocat/Hello-World", "is_fork": False}]
            }}}
        },
        404: {"description": "User not found"},
        400: {"description": "Invalid username"}
    }
)
async def get_portfolio(
    username: str = Path(description="GitHub username", example="octocat"),
    page: int = Query(1, ge=1, description="Page number for repository pagination"),
    per_page: int = Query(30, ge=1, le=100, description="Number of repositories per page")
):
    username = username.strip().strip("/")
    if not username:
        raise HTTPException(status_code=400, detail="Username is required")
    service = PortfolioService()
    data = await service.get_portfolio(username, page=page, per_page=per_page)
    if not data:
        raise HTTPException(status_code=404, detail=f"GitHub user '{username}' not found")
    return data