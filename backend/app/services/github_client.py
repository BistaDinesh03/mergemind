"""
Unified GitHub API client with retry, rate-limit handling, and pagination.
All GitHub API calls in MergeMind MUST use this client.
"""
import time
import logging
from typing import Optional, AsyncGenerator
import httpx
from fastapi import HTTPException
from ..config import settings

logger = logging.getLogger("mergemind.github")

# Retry configuration
MAX_RETRIES = 3
RETRY_DELAY = 1.0  # seconds
RATE_LIMIT_BUFFER = 10  # requests to leave unused


class GitHubClient:
    """
    Single reusable GitHub API client.
    
    Features:
    - Connection pooling (single httpx client instance)
    - Automatic retry on 5xx errors
    - Follows redirects (301, 302)
    - Rate limit awareness
    - Request timeout
    - Consistent error responses
    - Pagination support
    """
    
    def __init__(self):
        self._client: Optional[httpx.AsyncClient] = None
        self._rate_limit_remaining = 5000
        self._rate_limit_reset = 0
    
    async def _get_client(self) -> httpx.AsyncClient:
        """Get or create the httpx client with connection pooling."""
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
        """Parse rate limit headers from response."""
        remaining = response.headers.get("X-RateLimit-Remaining")
        reset = response.headers.get("X-RateLimit-Reset")
        
        if remaining is not None:
            self._rate_limit_remaining = int(remaining)
        if reset is not None:
            self._rate_limit_reset = int(reset)
    
    def _wait_for_rate_limit(self):
        """Wait if rate limit is approaching."""
        if self._rate_limit_remaining <= RATE_LIMIT_BUFFER:
            wait_time = max(self._rate_limit_reset - time.time(), 0) + 1
            if wait_time > 0:
                logger.warning(f"Rate limit approaching, waiting {wait_time:.0f}s")
                time.sleep(min(wait_time, 60))  # Cap at 60 seconds
    
    async def request(
        self,
        url: str,
        params: dict = None,
        retries: int = MAX_RETRIES
    ) -> dict:
        """
        Make a GitHub API request with retry logic.
        
        Args:
            url: Full GitHub API URL
            params: Query parameters
            retries: Number of retry attempts
        
        Returns:
            Parsed JSON response
        
        Raises:
            HTTPException with appropriate status code
        """
        client = await self._get_client()
        last_error = None
        
        for attempt in range(retries + 1):
            try:
                self._wait_for_rate_limit()
                
                response = await client.get(url, params=params)
                self._update_rate_limit(response)
                
                # Success
                if response.status_code == 200:
                    return response.json()
                
                # Redirect (shouldn't happen with follow_redirects=True, but safety check)
                if response.status_code in (301, 302, 307, 308):
                    redirect_url = response.headers.get("Location", "")
                    logger.warning(f"Redirect to {redirect_url}")
                    if attempt < retries:
                        continue
                    raise HTTPException(status_code=502, detail="GitHub API redirect loop")
                
                # Rate limited
                if response.status_code == 429:
                    retry_after = int(response.headers.get("Retry-After", 60))
                    logger.warning(f"Rate limited, waiting {retry_after}s")
                    if attempt < retries:
                        time.sleep(retry_after)
                        continue
                    raise HTTPException(
                        status_code=429,
                        detail="GitHub rate limit exceeded. Please try again later."
                    )
                
                # Not found
                if response.status_code == 404:
                    return None
                
                # Auth error
                if response.status_code == 401:
                    raise HTTPException(
                        status_code=502,
                        detail="GitHub authentication failed. Check API token."
                    )
                
                # Server error — retry
                if response.status_code >= 500 and attempt < retries:
                    wait = RETRY_DELAY * (2 ** attempt)  # exponential backoff
                    logger.warning(f"GitHub 5xx, retry {attempt+1}/{retries} after {wait}s")
                    time.sleep(wait)
                    continue
                
                # Other error
                raise HTTPException(
                    status_code=502,
                    detail=f"GitHub API error: {response.status_code}"
                )
                
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
        
        # All retries exhausted
        raise HTTPException(
            status_code=502,
            detail=last_error or "GitHub API unavailable after retries"
        )
    
    async def paginate(
        self,
        url: str,
        params: dict = None,
        per_page: int = 30,
        max_pages: int = 5
    ) -> AsyncGenerator[dict, None]:
        """
        Paginate through GitHub API results.
        
        Args:
            url: GitHub API endpoint
            params: Base query parameters
            per_page: Results per page
            max_pages: Maximum pages to fetch
        
        Yields:
            Each page of results as a dict
        """
        if params is None:
            params = {}
        params["per_page"] = per_page
        
        for page in range(1, max_pages + 1):
            params["page"] = page
            data = await self.request(url, params=params, retries=1)
            
            if data is None:
                break
            
            yield data
            
            # Stop if fewer results than per_page (last page)
            if isinstance(data, list) and len(data) < per_page:
                break
            if isinstance(data, dict) and len(data.get("items", [])) < per_page:
                break
    
    async def close(self):
        """Close the HTTP client connection pool."""
        if self._client:
            await self._client.aclose()
            self._client = None


# Global singleton instance
github_client = GitHubClient()