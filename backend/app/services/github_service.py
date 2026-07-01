import httpx
from typing import Optional, List, Dict, Any
from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from ..config import settings
import time

class GitHubAPIService:
    """Service for interacting with GitHub REST API."""
    
    BASE_URL = "https://api.github.com"
    
    def __init__(self, access_token: Optional[str] = None):
        self.access_token = access_token or settings.github_token
        self.client = httpx.Client(
            base_url=self.BASE_URL,
            headers={
                "Authorization": f"Bearer {self.access_token}",
                "Accept": "application/vnd.github.v3+json",
                "User-Agent": "MergeMind-OSINT/1.0",
            },
            timeout=30.0,
        )
        self.rate_limit_remaining = 5000
        self.rate_limit_reset = 0
    
    def _handle_rate_limit(self, response: httpx.Response) -> None:
        """Handle GitHub API rate limiting."""
        self.rate_limit_remaining = int(response.headers.get("X-RateLimit-Remaining", 0))
        self.rate_limit_reset = int(response.headers.get("X-RateLimit-Reset", 0))
        
        if response.status_code == 403 and self.rate_limit_remaining == 0:
            reset_time = datetime.fromtimestamp(self.rate_limit_reset)
            wait_seconds = (reset_time - datetime.now()).total_seconds()
            if wait_seconds > 0:
                print(f"Rate limit exceeded. Waiting {wait_seconds:.0f} seconds...")
                time.sleep(min(wait_seconds + 1, 60))  # Wait max 60 seconds
    
    def _paginate(self, url: str, params: Dict = None, max_pages: int = 10) -> List[Dict]:
        """Handle paginated API responses."""
        all_items = []
        page = 1
        
        while page <= max_pages:
            paginated_params = (params or {}).copy()
            paginated_params.update({"page": page, "per_page": 100})
            
            response = self.client.get(url, params=paginated_params)
            self._handle_rate_limit(response)
            
            if response.status_code != 200:
                break
            
            items = response.json()
            if not items:
                break
            
            all_items.extend(items)
            
            # Check if there are more pages
            if len(items) < 100:
                break
            
            page += 1
        
        return all_items
    
    def get_user_repositories(self, username: str = None) -> List[Dict]:
        """Fetch user's repositories."""
        if username:
            url = f"/users/{username}/repos"
        else:
            url = "/user/repos"
        
        return self._paginate(url, params={
            "sort": "updated",
            "direction": "desc",
            "type": "all",
        })
    
    def get_repository(self, full_name: str) -> Dict:
        """Fetch a single repository's details."""
        response = self.client.get(f"/repos/{full_name}")
        self._handle_rate_limit(response)
        
        if response.status_code == 200:
            return response.json()
        return {}
    
    def get_repository_issues(
        self,
        full_name: str,
        state: str = "open",
        labels: str = None,
        sort: str = "updated",
    ) -> List[Dict]:
        """Fetch issues for a repository."""
        params = {
            "state": state,
            "sort": sort,
            "direction": "desc",
        }
        if labels:
            params["labels"] = labels
        
        return self._paginate(f"/repos/{full_name}/issues", params=params)
    
    def get_issue(self, full_name: str, issue_number: int) -> Dict:
        """Fetch a single issue's details."""
        response = self.client.get(f"/repos/{full_name}/issues/{issue_number}")
        self._handle_rate_limit(response)
        
        if response.status_code == 200:
            return response.json()
        return {}
    
    def get_issue_comments(self, full_name: str, issue_number: int) -> List[Dict]:
        """Fetch comments for an issue."""
        return self._paginate(f"/repos/{full_name}/issues/{issue_number}/comments")
    
    def get_issue_timeline(self, full_name: str, issue_number: int) -> List[Dict]:
        """Fetch timeline events for an issue."""
        return self._paginate(
            f"/repos/{full_name}/issues/{issue_number}/timeline",
            params={"per_page": 100}
        )
    
    def get_pull_requests(self, full_name: str, state: str = "open") -> List[Dict]:
        """Fetch pull requests for a repository."""
        return self._paginate(f"/repos/{full_name}/pulls", params={
            "state": state,
            "sort": "updated",
            "direction": "desc",
        })
    
    def search_repositories(
        self,
        query: str,
        language: str = None,
        min_stars: int = 0,
        topic: str = None,
    ) -> List[Dict]:
        """Search for repositories."""
        q_parts = [query]
        
        if language:
            q_parts.append(f"language:{language}")
        if min_stars:
            q_parts.append(f"stars:>={min_stars}")
        if topic:
            q_parts.append(f"topic:{topic}")
        
        params = {
            "q": " ".join(q_parts),
            "sort": "stars",
            "order": "desc",
        }
        
        return self._paginate("/search/repositories", params=params, max_pages=5)
    
    def search_issues(
        self,
        query: str = "",
        labels: str = None,
        language: str = None,
        state: str = "open",
        is_issue: bool = True,
    ) -> List[Dict]:
        """Search for issues across GitHub."""
        q_parts = []
        
        if query:
            q_parts.append(query)
        if labels:
            q_parts.append(f"label:{labels}")
        if language:
            q_parts.append(f"language:{language}")
        if state:
            q_parts.append(f"state:{state}")
        if is_issue:
            q_parts.append("is:issue")
        
        # Default: look for good first issues
        if not q_parts:
            q_parts = ['label:"good first issue"', 'state:open', 'is:issue']
        
        params = {
            "q": " ".join(q_parts),
            "sort": "updated",
            "order": "desc",
        }
        
        return self._paginate("/search/issues", params=params, max_pages=5)
    
    def get_repository_contributors(self, full_name: str) -> List[Dict]:
        """Fetch contributors for a repository."""
        return self._paginate(f"/repos/{full_name}/contributors", params={"per_page": 100})
    
    def get_repository_languages(self, full_name: str) -> Dict[str, int]:
        """Fetch language breakdown for a repository."""
        response = self.client.get(f"/repos/{full_name}/languages")
        self._handle_rate_limit(response)
        
        if response.status_code == 200:
            return response.json()
        return {}
    
    def get_repository_commits(self, full_name: str, since_days: int = 30) -> List[Dict]:
        """Fetch recent commits for a repository."""
        since_date = (datetime.utcnow() - timedelta(days=since_days)).isoformat() + "Z"
        
        return self._paginate(f"/repos/{full_name}/commits", params={
            "since": since_date,
            "per_page": 100,
        })
    
    def check_file_exists(self, full_name: str, file_path: str) -> bool:
        """Check if a file exists in the repository."""
        response = self.client.get(f"/repos/{full_name}/contents/{file_path}")
        return response.status_code == 200
    
    def get_file_content(self, full_name: str, file_path: str) -> Optional[str]:
        """Fetch file content from repository."""
        response = self.client.get(f"/repos/{full_name}/contents/{file_path}")
        self._handle_rate_limit(response)
        
        if response.status_code == 200:
            import base64
            content = response.json().get("content", "")
            if content:
                return base64.b64decode(content).decode("utf-8")
        return None
    
    def close(self):
        """Close the HTTP client."""
        self.client.close()

# Factory function for dependency injection
def get_github_service(access_token: Optional[str] = None) -> GitHubAPIService:
    """Create a GitHubAPIService instance."""
    return GitHubAPIService(access_token=access_token)
