"""Production configuration with startup validation."""
import sys
from pydantic_settings import BaseSettings
from typing import List


class Settings(BaseSettings):
    """Application settings with strict validation."""
    
    app_name: str = "MergeMind"
    app_version: str = "1.0.0"
    environment: str = "development"
    debug: bool = False
    
    host: str = "0.0.0.0"
    port: int = 8000
    
    # GitHub
    github_token: str = ""
    github_client_id: str = ""
    github_client_secret: str = ""
    
    # Gemini AI
    gemini_api_key: str = ""
    gemini_model: str = "gemini-2.5-flash"
    gemini_timeout: int = 30
    
    # Security
    secret_key: str = ""
    nextauth_secret: str = ""
    cors_origins: str = "http://localhost:3000"
    
    # Database
    database_url: str = ""
    
    # Rate limiting
    rate_limit_enabled: bool = True
    rate_limit_requests: int = 100
    rate_limit_window: int = 60
    
    # Logging
    log_level: str = "INFO"
    
    @property
    def cors_origins_list(self) -> List[str]:
        """Parse CORS origins from comma-separated string."""
        origins = [o.strip() for o in self.cors_origins.split(",") if o.strip()]
        if not origins:
            origins = ["http://localhost:3000"]
        return origins
    
    @property
    def is_production(self) -> bool:
        return self.environment == "production"
    
    def validate_startup(self) -> List[str]:
        """
        Validate all required settings on startup.
        
        In production: raises SystemExit with clear error message.
        In development: returns warnings list.
        """
        errors = []
        warnings = []
        
        # Required in all environments
        if not self.github_token:
            warnings.append("GITHUB_TOKEN is not set — rate limits will be lower")
        
        # Required in production
        if self.is_production:
            # Secret key is mandatory
            if not self.secret_key and not self.nextauth_secret:
                errors.append(
                    "SECRET_KEY or NEXTAUTH_SECRET is required in production.\n"
                    "Set it in your .env file or environment variables.\n"
                    "Example: SECRET_KEY=your-secret-key-at-least-32-chars"
                )
            
            # Secret key must be strong
            if self.secret_key and len(self.secret_key) < 32 and not self.nextauth_secret:
                errors.append(
                    "SECRET_KEY must be at least 32 characters long.\n"
                    f"Current length: {len(self.secret_key)}"
                )
            
            # Database required
            if not self.database_url:
                errors.append(
                    "DATABASE_URL is required in production.\n"
                    "Example: DATABASE_URL=postgresql://user:pass@host:5432/db"
                )
            
            # CORS must be specific
            if self.cors_origins == "http://localhost:3000":
                errors.append(
                    "CORS_ORIGINS must be set to your production domain.\n"
                    "Example: CORS_ORIGINS=https://your-app.vercel.app"
                )
        
        # Handle errors
        if errors:
            error_message = "\n\n" + "=" * 60 + "\n"
            error_message += " STARTUP FAILED — Missing required configuration\n"
            error_message += "=" * 60 + "\n\n"
            for i, error in enumerate(errors, 1):
                error_message += f"  [{i}] {error}\n\n"
            error_message += "=" * 60 + "\n"
            error_message += " Add these to your .env file or environment variables.\n"
            error_message += "=" * 60 + "\n"
            
            sys.stderr.write(error_message)
            raise SystemExit(1)
        
        return warnings
    
    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        extra = "ignore"


settings = Settings()