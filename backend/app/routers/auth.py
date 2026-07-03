from fastapi import APIRouter
router = APIRouter()
@router.get("/github/login")
async def login(): return {"url": "https://github.com/login/oauth/authorize"}
@router.post("/github/callback")
async def callback(): return {"status": "ok"}
@router.get("/me")
async def me(): return {"user": "demo"}