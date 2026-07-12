"""Production monitoring — health checks, startup validation, structured logging."""
import time
import logging
from datetime import datetime, timezone
import httpx
from sqlalchemy import text
from .config import settings
from .database import SessionLocal

logger = logging.getLogger("mergemind.monitoring")


class HealthChecker:
    """Runs all health checks and returns structured results."""
    
    def __init__(self):
        self.checks: dict = {}
        self.start_time = time.time()
    
    async def check_github(self) -> dict:
        try:
            headers = {"Authorization": f"Bearer {settings.github_token}", "Accept": "application/vnd.github.v3+json", "User-Agent": "MergeMind/HealthCheck"}
            async with httpx.AsyncClient(timeout=10) as client:
                response = await client.get("https://api.github.com/rate_limit", headers=headers)
                if response.status_code == 200:
                    data = response.json()
                    core = data.get("resources", {}).get("core", {})
                    search = data.get("resources", {}).get("search", {})
                    return {"status": "healthy", "rate_limit": {"core_remaining": core.get("remaining", "unknown"), "core_limit": core.get("limit", "unknown"), "search_remaining": search.get("remaining", "unknown"), "search_limit": search.get("limit", "unknown"), "resets_at": datetime.fromtimestamp(core.get("reset", 0), tz=timezone.utc).isoformat() if core.get("reset") else "unknown"}}
                elif response.status_code == 401:
                    return {"status": "unhealthy", "error": "Invalid GitHub token"}
                elif response.status_code == 403:
                    return {"status": "degraded", "error": "GitHub API rate limited"}
                else:
                    return {"status": "degraded", "error": f"GitHub returned {response.status_code}"}
        except httpx.TimeoutException:
            return {"status": "unhealthy", "error": "GitHub API timed out"}
        except httpx.ConnectError:
            return {"status": "unhealthy", "error": "Cannot connect to GitHub API"}
        except Exception as e:
            return {"status": "unhealthy", "error": str(e)[:100]}
    
    async def check_gemini(self) -> dict:
        if not settings.gemini_api_key:
            return {"status": "disabled", "error": "GEMINI_API_KEY not configured"}
        try:
            async with httpx.AsyncClient(timeout=10) as http_client:
                response = await http_client.post(f"https://generativelanguage.googleapis.com/v1beta/models/{settings.gemini_model}:generateContent", params={"key": settings.gemini_api_key}, json={"contents": [{"parts": [{"text": "Hi"}]}], "generationConfig": {"maxOutputTokens": 1}})
                if response.status_code == 200:
                    return {"status": "healthy", "model": settings.gemini_model, "provider": "google-gemini"}
                elif response.status_code == 429:
                    return {"status": "degraded", "error": "Gemini rate limited"}
                else:
                    return {"status": "unhealthy", "error": f"Gemini returned {response.status_code}"}
        except Exception as e:
            return {"status": "unhealthy", "error": str(e)[:100]}
    
    def check_database(self) -> dict:
        try:
            db = SessionLocal()
            db.execute(text("SELECT 1"))
            db.close()
            return {"status": "healthy", "url": settings.database_url.split("://")[0] if settings.database_url else "sqlite", "tables": self._get_table_count()}
        except Exception as e:
            return {"status": "unhealthy", "error": str(e)[:100]}
    
    def _get_table_count(self) -> int:
        try:
            from .database import Base
            return len(Base.metadata.tables)
        except Exception:
            return 0
    
    async def run_all(self) -> dict:
        import asyncio
        github_check, gemini_check = await asyncio.gather(self.check_github(), self.check_gemini())
        db_check = self.check_database()
        statuses = [github_check.get("status"), gemini_check.get("status"), db_check.get("status")]
        if "unhealthy" in statuses and "healthy" not in statuses:
            overall = "unhealthy"
        elif "degraded" in statuses or "disabled" in statuses or "unhealthy" in statuses:
            overall = "degraded"
        else:
            overall = "healthy"
        uptime_seconds = int(time.time() - self.start_time)
        return {"status": overall, "version": settings.app_version, "environment": settings.environment, "uptime_seconds": uptime_seconds, "timestamp": datetime.now(timezone.utc).isoformat(), "services": {"github": github_check, "gemini": gemini_check, "database": db_check}}


health_checker = HealthChecker()


class StartupValidator:
    """Validates all required services are available on startup."""
    
    @staticmethod
    def validate_all() -> list[str]:
        warnings = settings.validate_startup()
        try:
            db = SessionLocal()
            db.execute(text("SELECT 1"))
            db.close()
            logger.info("Database connection: OK")
        except Exception as e:
            if settings.is_production:
                raise RuntimeError(f"Database connection failed: {e}")
            warnings.append(f"Database connection failed: {e}")
        return warnings


class RequestLogger:
    """Structured request/response logging."""
    
    @staticmethod
    def log_request(method: str, path: str, client_ip: str, user_agent: str = ""):
        logger.info("Incoming request", extra={"type": "request", "method": method, "path": path, "client_ip": client_ip, "user_agent": user_agent[:100] if user_agent else ""})
    
    @staticmethod
    def log_response(method: str, path: str, status_code: int, duration_ms: float):
        level = "error" if status_code >= 500 else "warning" if status_code >= 400 else "info"
        getattr(logger, level)(f"{method} {path} -> {status_code} ({duration_ms:.0f}ms)", extra={"type": "response", "method": method, "path": path, "status_code": status_code, "duration_ms": round(duration_ms, 1)})
    
    @staticmethod
    def log_error(method: str, path: str, error_type: str, error_message: str, status_code: int = 500):
        logger.error(f"Error: {error_type} — {error_message[:200]}", extra={"type": "error", "method": method, "path": path, "error_type": error_type, "error_message": error_message[:200], "status_code": status_code})