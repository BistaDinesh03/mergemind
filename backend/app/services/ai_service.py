"""
Unified AI Service — Google Gemini 2.5 Flash.
Evidence-based summaries only. Never hallucinates.
"""
import hashlib
import logging
import time
from typing import Optional
from google import genai
from google.genai import types
from ..config import settings

logger = logging.getLogger("mergemind.ai")

CACHE_TTL = 600


class AIService:
    """AI service that summarizes data — never invents it."""
    
    def __init__(self):
        self.client = None
        self.model = settings.gemini_model
        self.enabled = False
        self._cache: dict = {}
        self._cache_times: dict = {}
        
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
        raw = f"{prompt}:{max_tokens}:{self.model}"
        return hashlib.sha256(raw.encode()).hexdigest()
    
    def _cache_get(self, key: str) -> Optional[str]:
        if key in self._cache:
            if time.time() - self._cache_times.get(key, 0) < CACHE_TTL:
                return self._cache[key]
            del self._cache[key]
            del self._cache_times[key]
        return None
    
    def _cache_set(self, key: str, value: str):
        if len(self._cache) > 500:
            oldest = min(self._cache_times, key=lambda k: self._cache_times[k])
            del self._cache[oldest]
            del self._cache_times[oldest]
        self._cache[key] = value
        self._cache_times[key] = time.time()
    
    def _generate(self, prompt: str, max_tokens: int = 300, retry: bool = True) -> str:
        if not self.enabled:
            return ""
        
        cache_key = self._cache_key(prompt, max_tokens)
        cached = self._cache_get(cache_key)
        if cached is not None:
            return cached
        
        for attempt in range(2):
            try:
                response = self.client.models.generate_content(
                    model=self.model,
                    contents=prompt,
                    config=types.GenerateContentConfig(
                        max_output_tokens=max_tokens,
                        temperature=0.2,
                        top_p=0.9,
                    ),
                )
                
                text = response.text.strip() if response.text else ""
                
                if text and not self._is_hallucinated(text):
                    self._cache_set(cache_key, text)
                    return text
                    
            except Exception as e:
                logger.error(f"Gemini attempt {attempt+1} failed: {str(e)[:100]}")
                if attempt == 0 and retry:
                    time.sleep(1)
                else:
                    return ""
        
        return ""
    
    def _is_hallucinated(self, text: str) -> bool:
        markers = [
            "I don't have access to",
            "I cannot access",
            "I am unable to",
            "As an AI",
            "I can't",
            "I do not have",
            "I'm not able",
        ]
        for marker in markers:
            if marker.lower() in text.lower():
                return True
        return False
    
    def generate_repository_summary(self, full_name: str, stars: int, language: str, description: str, topics: list = None) -> str:
        facts = []
        facts.append(f"{full_name} is a {language or 'code'} repository")
        facts.append(f"{stars:,} stars")
        if description:
            facts.append(description[:150])
        
        evidence = " | ".join(facts)
        
        if not self.enabled:
            return evidence
        
        topic_str = ", ".join(topics) if topics else "none"
        
        prompt = f"""Summarize this repository using ONLY the data provided. Do not add opinions, praise, or speculation.
Stick to observable facts from the data below. Never say "well-documented" unless docs are confirmed.
Never say "active community" unless activity data proves it.

Data:
- Repository: {full_name}
- Stars: {stars:,}
- Language: {language}
- Topics: {topic_str}
- Description: {description[:300]}

Write exactly 2 factual sentences. No filler words like "great", "excellent", "amazing"."""
        
        result = self._generate(prompt, max_tokens=200)
        return result if result else evidence
    
    def generate_ai_mentor(self, title: str, repo: str, difficulty: str, merge_chance: int, health_score: int, labels: list = None) -> str:
        label_str = ", ".join(labels) if labels else "none"
        
        if not self.enabled:
            return f"Issue in {repo}: '{title}'. Difficulty: {difficulty}. Labels: {label_str}. Repository health: {health_score}/100."
        
        prompt = f"""Give ONE specific, actionable tip for this GitHub issue. Base it on the data provided.
Do NOT say "this is a great opportunity" or give generic encouragement.
Focus on what the contributor should actually DO.

Issue: {title}
Repository: {repo}
Difficulty: {difficulty}
Labels: {label_str}

Example good response: "Start by reading the CONTRIBUTING.md file, then look at similar closed PRs for patterns."
Example bad response: "This is a great first issue with clear requirements!" """
        
        result = self._generate(prompt, max_tokens=150)
        return result if result else f"Review the issue description and labels ({label_str}) before starting. Check for a CONTRIBUTING.md file in the repository."
    
    def generate_recommendation_reason(self, title: str, repo: str, score: int, difficulty: str, labels: list = None) -> str:
        label_str = ", ".join(labels) if labels else "none"
        
        if not self.enabled:
            return f"Scored {score}/100. Difficulty: {difficulty}. Labels: {label_str}."
        
        prompt = f"""Explain in one sentence why this issue was recommended. Reference specific labels or data.
Be specific. Mention actual labels if they exist.

Issue: {title}
Repository: {repo}
Score: {score}/100
Difficulty: {difficulty}
Labels: {label_str}

Example: "Labeled 'good first issue' and 'documentation' — a focused task with clear scope."
Example: "Scored {score}/100 due to active maintainers and beginner-friendly labeling." """
        
        result = self._generate(prompt, max_tokens=100)
        return result if result else f"Labels: {label_str}. Score: {score}/100."
    
    def chat(self, message: str) -> str:
        prompt = f"""You are an open source contribution expert. Answer in 2-3 practical sentences.
Focus on actionable steps, not motivation or encouragement.

Question: {message}"""
        
        result = self._generate(prompt, max_tokens=250)
        return result if result else "I'm having trouble answering that. Try asking about specific repositories or issues."
    
    def analyze_issue(self, title: str, body: str, labels: list, repo: str, stars: int, health_score: int) -> str:
        if not self.enabled:
            label_str = ", ".join(labels) if labels else "none"
            return f"Issue: {title}. Repository: {repo} ({stars:,} stars). Labels: {label_str}. {(body or '')[:200]}"
        
        prompt = f"""Summarize this GitHub issue in 2-3 sentences. Describe what the issue asks for.
Stick to the actual issue text. Do not add opinions about difficulty or suitability.

Repository: {repo}
Title: {title}
Description: {body[:500]}
Labels: {', '.join(labels) if labels else 'none'}"""
        
        result = self._generate(prompt, max_tokens=200)
        if result:
            return result
        
        label_str = ", ".join(labels) if labels else "none"
        return f"Issue: {title}. Labels: {label_str}. {(body or '')[:200]}"
    
    def mentor_guide(self, issue_title: str, issue_body: str, repo_name: str, language: str, labels: list) -> str:
        """Generate a beginner-friendly walkthrough of what the issue is asking."""
        label_str = ", ".join(labels) if labels else "none"
        
        if not self.enabled:
            return f"This issue in {repo_name} is about: {issue_title}. Read the issue description carefully before starting."
        
        prompt = f"""Explain this GitHub issue to a first-time contributor in plain English. 
Use simple language. Define any technical terms. Give one specific tip to get started.

Repository: {repo_name}
Language: {language}
Issue: {issue_title}
Description: {issue_body[:500]}
Labels: {label_str}

Format:
1. What this issue is about (1 sentence in plain English)
2. Key terms explained (if any technical words)
3. One specific tip to start"""
        
        result = self._generate(prompt, max_tokens=200)
        if result:
            return result
        return f"Issue in {repo_name}: {issue_title}. Labels: {label_str}. Read the description and check for a CONTRIBUTING.md file."
    
    def health_check(self) -> dict:
        return {
            "provider": "google-gemini",
            "model": self.model,
            "enabled": self.enabled,
            "cache_size": len(self._cache),
            "status": "healthy" if self.enabled else "disabled"
        }


ai_service = AIService()