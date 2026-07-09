"""Production configuration."""
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
    
    gemini_api_key: Optional[str] = None
    gemini_model: str = "gemini-2.5-flash"
    gemini_timeout: int = 30
    
    secret_key: str = "dev-secret-key-change-in-production"
    access_token_expire_minutes: int = 30
    
    cors_origins: str = "http://localhost:3000"
    
    @property
    def cors_origins_list(self) -> List[str]:
        return [o.strip() for o in self.cors_origins.split(",")]
    
    log_level: str = "INFO"
    
    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        extra = "ignore"

settings = Settings()