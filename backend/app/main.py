"""MergeMind API — Production Entry Point with monitoring."""
import logging
import sys
import time
from fastapi import FastAPI, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware
from fastapi.responses import JSONResponse
from .config import settings
from .database import engine, Base, init_db
from .monitoring import health_checker, StartupValidator, RequestLogger

logging.basicConfig(
    level=getattr(logging, settings.log_level),
    format='{"time":"%(asctime)s","level":"%(levelname)s","logger":"%(name)s","message":"%(message)s"}',
    stream=sys.stdout,
)
logger = logging.getLogger("mergemind")

logger.info("Starting MergeMind...")

try:
    startup_warnings = settings.validate_startup()
    for warning in startup_warnings:
        logger.warning(f"Startup: {warning}")
except SystemExit:
    raise

init_db()
logger.info("Database tables initialized")

app = FastAPI(
    title=settings.app_name,
    version=settings.app_version,
    docs_url="/docs" if not settings.is_production else None,
    redoc_url=None,
)

app.add_middleware(GZipMiddleware, minimum_size=500)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["GET", "POST"],
    allow_headers=["Authorization", "Content-Type", "X-GitHub-User"],
)

rate_limit_store: dict = {}
RATE_LIMIT = settings.rate_limit_requests
RATE_WINDOW = settings.rate_limit_window

@app.middleware("http")
async def rate_limit_middleware(request: Request, call_next):
    if settings.rate_limit_enabled:
        client_ip = request.client.host if request.client else "unknown"
        now = time.time()
        window_start = now - RATE_WINDOW
        if client_ip not in rate_limit_store:
            rate_limit_store[client_ip] = []
        rate_limit_store[client_ip] = [t for t in rate_limit_store[client_ip] if t > window_start]
        if len(rate_limit_store[client_ip]) >= RATE_LIMIT:
            logger.warning(f"Rate limit exceeded for {client_ip}")
            return JSONResponse(status_code=429, content={"error": "Too many requests", "retry_after": RATE_WINDOW})
        rate_limit_store[client_ip].append(now)
    return await call_next(request)

@app.middleware("http")
async def security_headers(request: Request, call_next):
    response = await call_next(request)
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["X-XSS-Protection"] = "1; mode=block"
    response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
    response.headers["Permissions-Policy"] = "camera=(), microphone=(), geolocation=()"
    response.headers["Cache-Control"] = "no-store"
    if settings.is_production:
        response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"
    return response

@app.middleware("http")
async def log_requests(request: Request, call_next):
    client_ip = request.client.host if request.client else "unknown"
    user_agent = request.headers.get("User-Agent", "")
    RequestLogger.log_request(request.method, request.url.path, client_ip, user_agent)
    start = time.time()
    try:
        response = await call_next(request)
        duration_ms = (time.time() - start) * 1000
        RequestLogger.log_response(request.method, request.url.path, response.status_code, duration_ms)
        return response
    except Exception as exc:
        duration_ms = (time.time() - start) * 1000
        RequestLogger.log_error(request.method, request.url.path, type(exc).__name__, str(exc), 500)
        raise

@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):
    RequestLogger.log_error(request.method, request.url.path, type(exc).__name__, exc.detail, exc.status_code)
    return JSONResponse(status_code=exc.status_code, content={"detail": exc.detail, "type": type(exc).__name__})

@app.exception_handler(Exception)
async def global_handler(request: Request, exc: Exception):
    RequestLogger.log_error(request.method, request.url.path, type(exc).__name__, str(exc), 500)
    return JSONResponse(status_code=500, content={"detail": "Internal server error" if settings.is_production else str(exc)[:200], "type": type(exc).__name__})

@app.get("/health")
async def health():
    return await health_checker.run_all()

@app.get("/health/live")
async def liveness():
    return {"status": "alive"}

@app.get("/health/ready")
async def readiness():
    db_check = health_checker.check_database()
    return {"status": "ready" if db_check["status"] == "healthy" else "not_ready", "database": db_check["status"]}

@app.get("/")
async def root():
    return {"app": settings.app_name, "version": settings.app_version}

from .routers.auth import router as auth_router
from .routers.github import router as github_router
from .routers.dashboard import router as dashboard_router
from .routers.assistant import router as assistant_router
from .routers.portfolio import router as portfolio_router
from .routers.scoring import router as scoring_router
from .routers.recommendations import router as rec_router
from .routers.history import router as history_router

app.include_router(auth_router, prefix="/auth", tags=["Auth"])
app.include_router(github_router, prefix="/api/github", tags=["GitHub"])
app.include_router(dashboard_router, prefix="/api/dashboard", tags=["Dashboard"])
app.include_router(assistant_router, prefix="/api/assistant", tags=["AI"])
app.include_router(portfolio_router, prefix="/api/portfolio", tags=["Portfolio"])
app.include_router(scoring_router, prefix="/api/scoring", tags=["Scoring"])
app.include_router(rec_router, prefix="/api/recommendations", tags=["Recommendations"])
app.include_router(history_router, prefix="/api/history", tags=["History"])