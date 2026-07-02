from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.exceptions import RequestValidationError
from starlette.exceptions import HTTPException as StarletteHTTPException
from .config import settings
from .database import engine, Base
from .error_handler import (
    http_exception_handler,
    validation_exception_handler,
    general_exception_handler,
    log_request_middleware,
)

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="MergeMind API",
    description="The AI-powered Open Source Intelligence Platform",
    version="0.1.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

# Register exception handlers
app.add_exception_handler(StarletteHTTPException, http_exception_handler)
app.add_exception_handler(RequestValidationError, validation_exception_handler)
app.add_exception_handler(Exception, general_exception_handler)

# Request logging middleware
app.middleware("http")(log_request_middleware)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
async def health_check():
    return {
        "status": "ok",
        "version": "0.1.0",
        "service": "MergeMind API",
    }

@app.get("/")
async def root():
    return {
        "message": "MergeMind API - The AI-powered Open Source Intelligence Platform",
        "docs": "/docs",
        "health": "/health",
        "endpoints": {
            "auth": "/auth",
            "github": "/api/github",
            "dashboard": "/api/dashboard",
            "assistant": "/api/assistant",
            "portfolio": "/api/portfolio",
        }
    }

# Import and include routers
from .routers import auth, github, dashboard, assistant, portfolio
app.include_router(auth.router, prefix="/auth", tags=["Authentication"])
app.include_router(github.router, prefix="/api/github", tags=["GitHub"])
app.include_router(dashboard.router, prefix="/api/dashboard", tags=["Dashboard"])
app.include_router(assistant.router, prefix="/api/assistant", tags=["AI Assistant"])
app.include_router(portfolio.router, prefix="/api/portfolio", tags=["Portfolio"])
