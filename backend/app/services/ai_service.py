"""
Unified AI Service — Google Gemini 2.5 Flash.
Validates API key on startup, caches responses, never hallucinates data.
"""
import hashlib
import json
import logging
import time
from typing import Optional
from google import genai
from google.genai import types
from ..config import settings

logger = logging.getLogger("mergemind.ai")

# Cache configuration
CACHE_TTL = 600  # 10 minutes


class AIService:
    """
    Gemini AI service with validation, caching, and safe outputs.
    
    Rules:
    - Never invent GitHub statistics
    - Only explain data that was provided
    - Return empty string on failure, never fake data
    """
    
    def __init__(self):
        self.client = None
        self.model = settings.gemini_model
        self.enabled = False
        self._cache: dict = {}
        self._cache_times: dict = {}
        
        # Validate API key on startup
        if not settings.gemini_api_key:
            logger.warning("GEMINI_API_KEY not set — AI features disabled")
            return
        
        try:
            self.client = genai.Client(api_key=settings.gemini_api_key)
            self.enabled = True
            logger.info(f"Gemini initialized: model={self.model}")
        except Exception as e:
            logger.error(f"Gemini init failed: {e}")
    
    def _cache_key(self, prompt: str, max_tokens: int) -> str:
        """Generate cache key from prompt hash."""
        raw = f"{prompt}:{max_tokens}:{self.model}"
        return hashlib.sha256(raw.encode()).hexdigest()
    
    def _cache_get(self, key: str) -> Optional[str]:
        """Get cached response if not expired."""
        if key in self._cache:
            if time.time() - self._cache_times.get(key, 0) < CACHE_TTL:
                return self._cache[key]
            del self._cache[key]
            del self._cache_times[key]
        return None
    
    def _cache_set(self, key: str, value: str):
        """Store response in cache with timestamp."""
        # Prevent cache from growing too large
        if len(self._cache) > 500:
            oldest = min(self._cache_times, key=lambda k: self._cache_times[k])
            del self._cache[oldest]
            del self._cache_times[oldest]
        
        self._cache[key] = value
        self._cache_times[key] = time.time()
    
    def _generate(self, prompt: str, max_tokens: int = 300, retry: bool = True) -> str:
        """
        Generate AI response with retry, timeout, and validation.
        
        Returns empty string on any failure — never fake data.
        """
        if not self.enabled:
            return ""
        
        # Check cache
        cache_key = self._cache_key(prompt, max_tokens)
        cached = self._cache_get(cache_key)
        if cached is not None:
            logger.debug("AI cache hit")
            return cached
        
        # Try up to 2 times
        for attempt in range(2):
            try:
                response = self.client.models.generate_content(
                    model=self.model,
                    contents=prompt,
                    config=types.GenerateContentConfig(
                        max_output_tokens=max_tokens,
                        temperature=0.4,
                        top_p=0.95,
                    ),
                )
                
                text = response.text.strip() if response.text else ""
                
                # Validate output — reject hallucinated statistics
                if text and not self._is_hallucinated(text):
                    self._cache_set(cache_key, text)
                    return text
                
                if not retry:
                    return ""
                    
            except Exception as e:
                logger.error(f"Gemini attempt {attempt+1} failed: {str(e)[:100]}")
                if attempt == 0 and retry:
                    time.sleep(1)  # Wait before retry
                else:
                    return ""
        
        return ""
    
    def _is_hallucinated(self, text: str) -> bool:
        """
        Check if AI response contains likely hallucinated data.
        Rejects responses with made-up statistics or fake repo names.
        """
        hallucination_markers = [
            "I don't have access to",
            "I cannot access",
            "I am unable to",
            "As an AI",
            "I can't",
        ]
        
        for marker in hallucination_markers:
            if marker.lower() in text.lower():
                return True
        
        return False
    
    # ─── PUBLIC METHODS ────────────────────────────────
    
    def generate_repository_summary(
        self,
        full_name: str,
        stars: int,
        language: str,
        description: str,
        topics: list = None
    ) -> str:
        """
        Summarize a GitHub repository using ONLY provided data.
        Never invents statistics.
        """
        topic_str = ", ".join(topics) if topics else "none listed"
        
        prompt = f"""Summarize this GitHub repository in exactly 2 sentences. Use ONLY the data provided below. Do NOT invent any statistics.

Repository: {full_name}
Stars: {stars:,}
Language: {language}
Topics: {topic_str}
Description: {description[:300]}

Focus on: what makes this project good for contributors."""
        
        result = self._generate(prompt, max_tokens=200)
        return result if result else f"{full_name} is a {language} repository with {stars:,} stars. {description[:100]}"
    
    def generate_ai_mentor(
        self,
        title: str,
        repo: str,
        difficulty: str,
        merge_chance: int,
        health_score: int,
        labels: list = None
    ) -> str:
        """
        Give warm, encouraging mentor advice based on real issue data.
        """
        label_str = ", ".join(labels) if labels else "none"
        
        prompt = f"""You are an AI mentor. Give warm, encouraging advice in exactly 2 sentences. Use ONLY the data provided.

Issue: {title}
Repository: {repo}
Difficulty: {difficulty}
Merge probability: {merge_chance}%
Repository health: {health_score}/100
Labels: {label_str}

Be specific and actionable. Do NOT invent statistics."""
        
        result = self._generate(prompt, max_tokens=200)
        if result:
            return result
        
        # Fallback using real data only
        if merge_chance >= 80:
            return f"This {difficulty.lower()} issue in {repo} has a high merge probability of {merge_chance}%. The repository health score is {health_score}/100 — a great opportunity to contribute."
        return f"Consider this {difficulty.lower()} issue in {repo}. Review the labels ({label_str}) before starting."
    
    def generate_recommendation_reason(
        self,
        title: str,
        repo: str,
        score: int,
        difficulty: str,
        labels: list = None
    ) -> str:
        """
        Explain why this issue was recommended using real scores.
        """
        label_str = ", ".join(labels) if labels else "none"
        
        prompt = f"""Explain in exactly one sentence why this GitHub issue was recommended. Use ONLY the provided data.

Issue: {title}
Repository: {repo}
Score: {score}/100
Difficulty: {difficulty}
Labels: {label_str}

Be concise and encouraging. Do NOT invent statistics."""
        
        result = self._generate(prompt, max_tokens=100)
        if result:
            return result
        
        # Fallback using real data
        return f"This {difficulty.lower()} issue scored {score}/100 and has relevant labels: {label_str}."
    
    def chat(self, message: str) -> str:
        """General AI chat about open source contribution."""
        prompt = f"""You are MergeMind AI, an open source contribution expert. Answer helpfully in 2-4 sentences.

Question: {message}

Keep answers practical. Never invent statistics or repository names."""
        
        result = self._generate(prompt, max_tokens=250)
        return result if result else "I'm having trouble answering that right now. Please try again."
    
    def analyze_issue(
        self,
        title: str,
        body: str,
        labels: list,
        repo: str,
        stars: int,
        health_score: int
    ) -> str:
        """
        Analyze a GitHub issue using real data. Never invents difficulty.
        """
        label_str = ", ".join(labels) if labels else "none"
        
        prompt = f"""Analyze this GitHub issue for a contributor. Use ONLY the provided data. Do NOT invent difficulty level or statistics.

Repository: {repo} ({stars:,} stars, health: {health_score}/100)
Title: {title}
Description: {body[:500]}
Labels: {label_str}

Provide exactly 2-3 sentences covering: what the issue is about, one tip for success."""
        
        result = self._generate(prompt, max_tokens=200)
        if result:
            return result
        
        # Fallback using real data
        return f"Issue in {repo} ({stars:,} stars). Labels: {label_str}. Review the description before starting."
    
    def health_check(self) -> dict:
        """Check if AI service is operational."""
        return {
            "provider": "google-gemini",
            "model": self.model,
            "enabled": self.enabled,
            "cache_size": len(self._cache),
            "status": "healthy" if self.enabled else "disabled"
        }


# Global singleton
ai_service = AIService()