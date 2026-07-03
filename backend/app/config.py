"""Production-ready configuration with validation."""

from pydantic_settings import BaseSettings
from pydantic import Field, validator
from typing import Optional

class Settings(BaseSettings):
    # Application
    app_name: str = "MergeMind"
    app_version: str = "1.0.0"
    environment: str = Field(default="development", pattern="^(development|staging|production)$")
    debug: bool = False
    
    # Server
    host: str = "0.0.0.0"
    port: int = 8000
    
    # Database
    database_url: str = Field(default="sqlite:///./mergemind.db")
    
    @validator("database_url")
    def validate_database_url(cls, v, values):
        env = values.get("environment", "development")
        if env == "production" and "sqlite" in v:
            raise ValueError("SQLite not allowed in production. Use PostgreSQL.")
        return v
    
    # GitHub
    github_token: str = Field(default="", min_length=1)
    github_client_id: str = ""
    github_client_secret: str = ""
    
    # Ollama AI
    ollama_host: str = "http://localhost:11434"
    ollama_model: str = "llama3.2:3b"
    ollama_timeout: int = 60
    
    # Security
    secret_key: str = Field(default="", min_length=32)
    access_token_expire_minutes: int = 30
    allowed_origins: str = "http://localhost:3000"
    
    # Rate Limiting
    github_rate_limit_per_hour: int = 5000
    api_rate_limit_per_minute: int = 60
    
    # Logging
    log_level: str = Field(default="INFO", pattern="^(DEBUG|INFO|WARNING|ERROR)$")
    log_format: str = "json"  # json or text
    
    # CORS
    cors_origins: list[str] = ["http://localhost:3000"]
    
    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        case_sensitive = False

settings = Settings()