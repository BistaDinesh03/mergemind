"""MergeMind API — Production Entry Point"""
import logging
import sys
import time
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from .config import settings
from .database import engine, Base

logging.basicConfig(
    level=getattr(logging, settings.log_level),
    format='{"time":"%(asctime)s","level":"%(levelname)s","message":"%(message)s"}',
    stream=sys.stdout,
)
logger = logging.getLogger("mergemind")

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.app_name,
    version=settings.app_version,
    docs_url="/docs" if settings.environment != "production" else None,
)

# CORS — Production-restricted
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["GET", "POST"],
    allow_headers=["Authorization", "Content-Type"],
)

# Rate limiting middleware (in-memory, per-IP)
rate_limit_store = {}
RATE_LIMIT = 60
RATE_WINDOW = 60

@app.middleware("http")
async def rate_limit_middleware(request: Request, call_next):
    if settings.environment == "production":
        client_ip = request.client.host if request.client else "unknown"
        now = time.time()
        window_start = now - RATE_WINDOW
        
        if client_ip in rate_limit_store:
            rate_limit_store[client_ip] = [t for t in rate_limit_store[client_ip] if t > window_start]
        else:
            rate_limit_store[client_ip] = []
        
        if len(rate_limit_store[client_ip]) >= RATE_LIMIT:
            return JSONResponse(status_code=429, content={"error": "Too many requests. Please wait."})
        
        rate_limit_store[client_ip].append(now)
    
    return await call_next(request)

# Request logging
@app.middleware("http")
async def log_requests(request: Request, call_next):
    start = time.time()
    response = await call_next(request)
    logger.info(f"{request.method} {request.url.path} {response.status_code} {round(time.time()-start,3)}s")
    return response

# Security headers
@app.middleware("http")
async def security_headers(request: Request, call_next):
    response = await call_next(request)
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["X-XSS-Protection"] = "1; mode=block"
    response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
    response.headers["Permissions-Policy"] = "camera=(), microphone=(), geolocation=()"
    if settings.environment == "production":
        response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"
    return response

# Error handler — 401 for auth errors
@app.exception_handler(Exception)
async def global_handler(request: Request, exc: Exception):
    logger.error(f"Unhandled error: {str(exc)}")
    if "401" in str(exc) or "unauthorized" in str(exc).lower():
        return JSONResponse(status_code=401, content={"error": "Authentication required", "message": "Your session may have expired. Please reconnect."})
    return JSONResponse(status_code=500, content={"error": "Internal server error" if settings.environment == "production" else str(exc)})

@app.get("/health")
async def health():
    return {
        "status": "healthy",
        "version": settings.app_version,
        "environment": settings.environment,
        "timestamp": time.time(),
    }

@app.get("/")
async def root():
    return {"app": settings.app_name, "version": settings.app_version}

# Routers
from .routers.auth import router as auth_router
from .routers.github import router as github_router
from .routers.dashboard import router as dashboard_router
from .routers.assistant import router as assistant_router
from .routers.portfolio import router as portfolio_router
from .routers.scoring import router as scoring_router
from .routers.recommendations import router as rec_router

app.include_router(auth_router, prefix="/auth", tags=["Auth"])
app.include_router(github_router, prefix="/api/github", tags=["GitHub"])
app.include_router(dashboard_router, prefix="/api/dashboard", tags=["Dashboard"])
app.include_router(assistant_router, prefix="/api/assistant", tags=["AI"])
app.include_router(portfolio_router, prefix="/api/portfolio", tags=["Portfolio"])
app.include_router(scoring_router, prefix="/api/scoring", tags=["Scoring"])
app.include_router(rec_router, prefix="/api/recommendations", tags=["Recommendations"])