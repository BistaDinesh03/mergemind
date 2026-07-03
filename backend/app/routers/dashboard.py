from fastapi import APIRouter
router = APIRouter()
@router.get("/")
async def dashboard(): return {"stats": {"prs": 23, "streak": 5}}
@router.get("/stats")
async def stats(): return {"contributors": 1250}