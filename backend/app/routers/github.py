from fastapi import APIRouter, Query
import httpx
from ..config import settings

router = APIRouter()

@router.get("/trending")
async def trending(language: str = "python"):
    headers = {"Authorization": f"Bearer {settings.github_token}", "User-Agent": "MergeMind"}
    async with httpx.AsyncClient() as c:
        r = await c.get("https://api.github.com/search/repositories", headers=headers, params={"q": f"language:{language}", "sort": "stars", "per_page": 5})
        return {"language": language, "repos": [{"name": i["full_name"], "stars": i["stargazers_count"]} for i in r.json().get("items", [])]}

@router.get("/user/{username}")
async def user(username: str):
    headers = {"Authorization": f"Bearer {settings.github_token}", "User-Agent": "MergeMind"}
    async with httpx.AsyncClient() as c:
        r = await c.get(f"https://api.github.com/users/{username}", headers=headers)
        u = r.json()
        return {"username": u["login"], "name": u.get("name"), "repos": u["public_repos"]}