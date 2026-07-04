"""Production configuration with validation and security defaults."""
from pydantic_settings import BaseSettings
from pydantic import Field, field_validator
from typing import List

class Settings(BaseSettings):
    # Application
    app_name: str = "MergeMind"
    app_version: str = "1.0.0"
    environment: str = Field(default="development")
    debug: bool = False
    
    # Server
    host: str = "0.0.0.0"
    port: int = 8000
    
    # Database
    database_url: str = Field(default="sqlite:///./mergemind.db")
    
    @field_validator("database_url")
    @classmethod
    def validate_db(cls, v, info):
        env = info.data.get("environment", "development")
        if env == "production" and "sqlite" in v:
            raise ValueError("SQLite not allowed in production. Use PostgreSQL.")
        return v
    
    # GitHub
    github_token: str = ""
    github_client_id: str = ""
    github_client_secret: str = ""
    
    # Ollama
    ollama_host: str = "http://localhost:11434"
    ollama_model: str = "llama3.2:3b"
    
    # Security
    secret_key: str = Field(default="", min_length=32)
    access_token_expire_minutes: int = 30
    cors_origins: str = "http://localhost:3000"
    
    @property
    def cors_origins_list(self) -> List[str]:
        return [o.strip() for o in self.cors_origins.split(",")]
    
    # Rate Limiting
    rate_limit_per_minute: int = 60
    
    # Logging
    log_level: str = "INFO"
    
    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"

settings = Settings()