"""Production configuration with startup validation."""
import sys
from pydantic_settings import BaseSettings
from typing import List, Optional

class Settings(BaseSettings):
    app_name: str = "MergeMind"
    app_version: str = "1.0.0"
    environment: str = "development"
    debug: bool = False
    
    host: str = "0.0.0.0"
    port: int = 8000
    
    database_url: str = "sqlite:///./mergemind.db"
    
    github_token: Optional[str] = None
    github_client_id: Optional[str] = None
    github_client_secret: Optional[str] = None
    
    ollama_host: str = "http://localhost:11434"
    ollama_model: str = "llama3.2:3b"
    
    secret_key: str = "dev-secret-key-change-in-production-at-least-32-chars"
    access_token_expire_minutes: int = 30
    
    cors_origins: str = "http://localhost:3000"
    
    @property
    def cors_origins_list(self) -> List[str]:
        return [o.strip() for o in self.cors_origins.split(",")]
    
    log_level: str = "INFO"
    
    def validate_production(self):
        """Validate required settings for production."""
        errors = []
        if self.environment == "production":
            if not self.github_token:
                errors.append("GITHUB_TOKEN is required in production")
            if not self.github_client_id:
                errors.append("GITHUB_CLIENT_ID is required in production")
            if not self.github_client_secret:
                errors.append("GITHUB_CLIENT_SECRET is required in production")
            if self.secret_key == "dev-secret-key-change-in-production-at-least-32-chars":
                errors.append("SECRET_KEY must be changed from the default value in production")
            if "sqlite" in self.database_url:
                errors.append("DATABASE_URL must use PostgreSQL in production, not SQLite")
            if "localhost" in self.cors_origins:
                errors.append("CORS_ORIGINS must not include localhost in production")
        if errors:
            for e in errors:
                print(f"[CONFIG ERROR] {e}", file=sys.stderr)
            sys.exit(1)
    
    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"

settings = Settings()

# Validate on import
if settings.environment == "production":
    settings.validate_production()