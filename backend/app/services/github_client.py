"""
Unified GitHub API client with retry, rate-limit handling, pagination, and caching.
"""
import time
import logging
from typing import Optional, AsyncGenerator
import httpx
from fastapi import HTTPException
from ..config import settings

logger = logging.getLogger("mergemind.github")

MAX_RETRIES = 3
RETRY_DELAY = 1.0
RATE_LIMIT_BUFFER = 10

_cache: dict = {}
CACHE_TTL = 300  # 5 minutes


class GitHubClient:
    
    def __init__(self):
        self._client: Optional[httpx.AsyncClient] = None
        self._rate_limit_remaining = 5000
        self._rate_limit_reset = 0
        self._last_fetch_time: dict = {}
    
    async def _get_client(self) -> httpx.AsyncClient:
        if self._client is None:
            self._client = httpx.AsyncClient(
                timeout=30,
                follow_redirects=True,
                limits=httpx.Limits(max_connections=10, max_keepalive_connections=5),
                headers={
                    "Authorization": f"Bearer {settings.github_token}",
                    "Accept": "application/vnd.github.v3+json",
                    "User-Agent": "MergeMind/1.0"
                }
            )
        return self._client
    
    def _update_rate_limit(self, response: httpx.Response):
        remaining = response.headers.get("X-RateLimit-Remaining")
        reset = response.headers.get("X-RateLimit-Reset")
        if remaining is not None:
            self._rate_limit_remaining = int(remaining)
        if reset is not None:
            self._rate_limit_reset = int(reset)
    
    def _wait_for_rate_limit(self):
        if self._rate_limit_remaining <= RATE_LIMIT_BUFFER:
            wait_time = max(self._rate_limit_reset - time.time(), 0) + 1
            if wait_time > 0:
                logger.warning(f"Rate limit approaching, waiting {wait_time:.0f}s")
                time.sleep(min(wait_time, 60))
    
    def get_last_fetch_time(self, url: str) -> Optional[str]:
        """Get the timestamp when this URL was last fetched from GitHub."""
        cache_key = f"{url}"
        if cache_key in _cache:
            _, timestamp = _cache[cache_key]
            return timestamp
        return None
    
    async def request(self, url: str, params: dict = None, retries: int = MAX_RETRIES, use_cache: bool = True) -> dict:
        cache_key = f"{url}:{str(params)}"
        
        if use_cache and cache_key in _cache:
            entry, timestamp = _cache[cache_key]
            if time.time() - timestamp < CACHE_TTL:
                return entry
        
        client = await self._get_client()
        last_error = None
        
        for attempt in range(retries + 1):
            try:
                self._wait_for_rate_limit()
                response = await client.get(url, params=params)
                self._update_rate_limit(response)
                
                if response.status_code == 200:
                    data = response.json()
                    if use_cache:
                        _cache[cache_key] = (data, time.time())
                        if len(_cache) > 200:
                            oldest = min(_cache, key=lambda k: _cache[k][1])
                            del _cache[oldest]
                    return data
                
                if response.status_code == 429:
                    retry_after = int(response.headers.get("Retry-After", 60))
                    logger.warning(f"Rate limited, waiting {retry_after}s")
                    if attempt < retries:
                        time.sleep(retry_after)
                        continue
                    raise HTTPException(status_code=429, detail="GitHub rate limit exceeded")
                
                if response.status_code == 404:
                    return None
                
                if response.status_code == 401:
                    raise HTTPException(status_code=502, detail="GitHub authentication failed")
                
                if response.status_code >= 500 and attempt < retries:
                    wait = RETRY_DELAY * (2 ** attempt)
                    logger.warning(f"GitHub 5xx, retry {attempt+1}/{retries} after {wait}s")
                    time.sleep(wait)
                    continue
                
                raise HTTPException(status_code=502, detail=f"GitHub API error: {response.status_code}")
                
            except httpx.TimeoutException:
                last_error = "GitHub API request timed out"
                if attempt < retries:
                    time.sleep(RETRY_DELAY)
                    continue
            except httpx.ConnectError:
                last_error = "Cannot connect to GitHub API"
                if attempt < retries:
                    time.sleep(RETRY_DELAY * 2)
                    continue
        
        raise HTTPException(status_code=502, detail=last_error or "GitHub API unavailable after retries")
    
    async def paginate(self, url: str, params: dict = None, per_page: int = 30, max_pages: int = 5) -> AsyncGenerator[dict, None]:
        if params is None:
            params = {}
        params["per_page"] = per_page
        for page in range(1, max_pages + 1):
            params["page"] = page
            data = await self.request(url, params=params, retries=1, use_cache=False)
            if data is None:
                break
            yield data
            if isinstance(data, list) and len(data) < per_page:
                break
            if isinstance(data, dict) and len(data.get("items", [])) < per_page:
                break
    
    async def close(self):
        if self._client:
            await self._client.aclose()
            self._client = None


github_client = GitHubClient()