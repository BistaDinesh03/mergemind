from fastapi import APIRouter, HTTPException, Depends, Request
from fastapi.responses import JSONResponse
from typing import Optional
import httpx
from ..config import settings

router = APIRouter()


async def get_current_user(request: Request) -> str:
    """
    Extract authenticated GitHub username from request.
    Checks headers and cookies set by NextAuth.
    """
    # X-GitHub-User header (set by frontend from session)
    github_user = request.headers.get("X-GitHub-User", "").strip()
    if github_user:
        return github_user
    
    # Try NextAuth session cookie
    session_token = (
        request.cookies.get("next-auth.session-token") or
        request.cookies.get("__Secure-next-auth.session-token")
    )
    
    if session_token:
        # The frontend passes the username, so we trust the header approach.
        # In production, validate the session token with NextAuth.
        pass
    
    raise HTTPException(status_code=401, detail="Authentication required")


async def get_optional_user(request: Request) -> Optional[str]:
    """Get current user if authenticated, None otherwise."""
    try:
        return await get_current_user(request)
    except HTTPException:
        return None


@router.get("/me")
async def me(request: Request):
    """Return the authenticated user, or 401 if not logged in."""
    try:
        user = await get_current_user(request)
        return {"username": user, "authenticated": True}
    except HTTPException:
        return JSONResponse(
            status_code=401,
            content={"authenticated": False, "detail": "Not authenticated"}
        )