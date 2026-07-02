from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .config import settings
from .database import engine, Base

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="MergeMind API",
    description="The AI-powered Open Source Intelligence Platform",
    version="0.1.0",
    docs_url="/docs",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
async def health_check():
    return {"status": "ok", "version": "0.1.0", "service": "MergeMind API"}

@app.get("/")
async def root():
    return {"message": "MergeMind API - The AI-powered Open Source Intelligence Platform", "docs": "/docs", "health": "/health"}

# Include routers
from .routers import auth, github, dashboard, assistant

app.include_router(auth.router, prefix="/auth", tags=["Authentication"])
app.include_router(github.router, prefix="/api/github", tags=["GitHub"])
app.include_router(dashboard.router, prefix="/api/dashboard", tags=["Dashboard"])
app.include_router(assistant.router, prefix="/api/assistant", tags=["AI Assistant"])