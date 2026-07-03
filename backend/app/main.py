"""MergeMind API - Production Entry Point"""

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from fastapi.responses import JSONResponse
from .config import settings
from .database import engine, Base
import logging
import time

# Configure logging
logging.basicConfig(
    level=getattr(logging, settings.log_level),
    format='{"time":"%(asctime)s","level":"%(levelname)s","message":"%(message)s"}' if settings.log_format == "json" else '%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger("mergemind")

# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.app_name,
    version=settings.app_version,
    docs_url="/docs" if settings.environment != "production" else None,
    redoc_url="/redoc" if settings.environment != "production" else None,
)

# Security Middleware
if settings.environment == "production":
    app.add_middleware(TrustedHostMiddleware, allowed_hosts=["mergemind.com", "*.mergemind.com", "localhost"])

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["Authorization", "Content-Type"],
)

# Request logging middleware
@app.middleware("http")
async def log_requests(request: Request, call_next):
    start = time.time()
    response = await call_next(request)
    duration = time.time() - start
    logger.info(f"{request.method} {request.url.path} {response.status_code} {duration:.3f}s")
    return response

# Security headers middleware
@app.middleware("http")
async def security_headers(request: Request, call_next):
    response = await call_next(request)
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["X-XSS-Protection"] = "1; mode=block"
    response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"
    response.headers["Content-Security-Policy"] = "default-src 'self'"
    return response

# Health check (no auth required)
@app.get("/health")
async def health():
    return {
        "status": "healthy",
        "version": settings.app_version,
        "environment": settings.environment,
        "timestamp": time.time()
    }

@app.get("/")
async def root():
    return {
        "app": settings.app_name,
        "version": settings.app_version,
        "environment": settings.environment
    }

# Import routers
from .routers.auth import router as auth_router
from .routers.github import router as github_router
from .routers.dashboard import router as dashboard_router
from .routers.assistant import router as assistant_router
from .routers.portfolio import router as portfolio_router
from .routers.scoring import router as scoring_router
from .routers.recommendations import router as rec_router

app.include_router(auth_router, prefix="/auth", tags=["Authentication"])
app.include_router(github_router, prefix="/api/github", tags=["GitHub"])
app.include_router(dashboard_router, prefix="/api/dashboard", tags=["Dashboard"])
app.include_router(assistant_router, prefix="/api/assistant", tags=["AI Assistant"])
app.include_router(portfolio_router, prefix="/api/portfolio", tags=["Portfolio"])
app.include_router(scoring_router, prefix="/api/scoring", tags=["AI Scoring"])
app.include_router(rec_router, prefix="/api/recommendations", tags=["Recommendations"])

# Global exception handler
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Unhandled error: {str(exc)}", exc_info=settings.debug)
    return JSONResponse(
        status_code=500,
        content={"error": "Internal server error" if not settings.debug else str(exc)}
    )