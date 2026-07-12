"""
Authentication router — validates NextAuth session tokens.
Never trusts X-GitHub-User header without token verification.
"""
import hashlib
import hmac
import json
import base64
import time
from fastapi import APIRouter, HTTPException, Request
from fastapi.responses import JSONResponse
from ..config import settings

router = APIRouter(tags=["Authentication"])


def _verify_nextauth_token(token: str) -> dict | None:
    """Verify a NextAuth JWT session token. Format: header.payload.signature."""
    try:
        parts = token.split(".")
        if len(parts) != 3:
            return None
        header_b64, payload_b64, signature_b64 = parts
        jwt_secret = settings.nextauth_secret or settings.secret_key or "merge-mind-dev-secret"
        secret = jwt_secret.encode()
        signing_input = f"{header_b64}.{payload_b64}"
        expected_sig = base64.urlsafe_b64encode(hmac.new(secret, signing_input.encode(), hashlib.sha256).digest()).rstrip(b"=").decode()
        if not hmac.compare_digest(signature_b64, expected_sig):
            return None
        payload = payload_b64 + "=" * (4 - len(payload_b64) % 4)
        decoded = base64.urlsafe_b64decode(payload)
        data = json.loads(decoded)
        exp = data.get("exp", 0)
        if exp and time.time() > exp:
            return None
        return data
    except Exception:
        return None


def _extract_username_from_session(session_data: dict) -> str | None:
    """Extract GitHub username from NextAuth session data."""
    if not session_data:
        return None
    username = session_data.get("name")
    if username and isinstance(username, str) and username.strip():
        return username.strip()
    username = session_data.get("login") or session_data.get("preferred_username")
    if username and isinstance(username, str) and username.strip():
        return username.strip()
    return None


async def get_current_user(request: Request) -> str:
    """
    Extract and VERIFY the authenticated GitHub username.
    
    Priority:
    1. NextAuth session cookie (JWT) — cryptographically verified
    2. Authorization Bearer token
    3. X-GitHub-User header ONLY if matching verified session
    
    NEVER trusts X-GitHub-User header alone.
    """
    session_token = request.cookies.get("next-auth.session-token") or request.cookies.get("__Secure-next-auth.session-token")
    if session_token:
        session_data = _verify_nextauth_token(session_token)
        if session_data:
            username = _extract_username_from_session(session_data)
            if username:
                return username
    auth_header = request.headers.get("Authorization", "")
    if auth_header.startswith("Bearer "):
        token = auth_header.replace("Bearer ", "")
        session_data = _verify_nextauth_token(token)
        if session_data:
            username = _extract_username_from_session(session_data)
            if username:
                return username
    github_user_header = request.headers.get("X-GitHub-User", "").strip()
    if github_user_header and session_token:
        session_data = _verify_nextauth_token(session_token)
        if session_data:
            session_username = _extract_username_from_session(session_data)
            if session_username and session_username.lower() == github_user_header.lower():
                return session_username
    raise HTTPException(status_code=401, detail="Authentication required. Please sign in with GitHub.")


async def get_optional_user(request: Request) -> str | None:
    """Get current user if authenticated, None otherwise."""
    try:
        return await get_current_user(request)
    except HTTPException:
        return None


@router.get(
    "/me",
    summary="Get current authenticated user",
    description="Returns the currently logged-in GitHub user from the NextAuth session. Returns 401 if not authenticated.",
    responses={
        200: {
            "description": "Authenticated user",
            "content": {"application/json": {"example": {"username": "octocat", "authenticated": True, "method": "nextauth-jwt"}}}
        },
        401: {
            "description": "Not authenticated",
            "content": {"application/json": {"example": {"authenticated": False, "detail": "Not authenticated. Please sign in with GitHub."}}}
        }
    }
)
async def me(request: Request):
    """Return authenticated user or 401."""
    try:
        user = await get_current_user(request)
        return {"username": user, "authenticated": True, "method": "nextauth-jwt"}
    except HTTPException:
        return JSONResponse(status_code=401, content={"authenticated": False, "detail": "Not authenticated. Please sign in with GitHub."})