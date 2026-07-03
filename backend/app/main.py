from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="MergeMind", version="0.3.0", docs_url="/docs")

app.add_middleware(CORSMiddleware, allow_origins=["http://localhost:3000"], allow_credentials=True, allow_methods=["*"], allow_headers=["*"])

@app.get("/health")
async def health(): return {"status": "ok", "version": "0.3.0"}

@app.get("/")
async def root(): return {"app": "MergeMind", "docs": "/docs"}

from .routers.auth import router as a
from .routers.github import router as g
from .routers.dashboard import router as d
from .routers.assistant import router as ai
from .routers.portfolio import router as p

app.include_router(a, prefix="/auth", tags=["Auth"])
app.include_router(g, prefix="/api/github", tags=["GitHub"])
app.include_router(d, prefix="/api/dashboard", tags=["Dashboard"])
app.include_router(ai, prefix="/api/assistant", tags=["AI"])
app.include_router(p, prefix="/api/portfolio", tags=["Portfolio"])