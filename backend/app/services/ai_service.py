"""Unified AI Service — Google Gemini 2.5 Flash with real data."""
import logging
from google import genai
from ..config import settings

logger = logging.getLogger("mergemind")

class AIService:
    def __init__(self):
        self.client = genai.Client(api_key=settings.gemini_api_key)
        self.model = settings.gemini_model

    def _generate(self, prompt: str, max_tokens: int = 300) -> str:
        try:
            response = self.client.models.generate_content(
                model=self.model,
                contents=prompt,
                config=genai.types.GenerateContentConfig(max_output_tokens=max_tokens, temperature=0.4),
            )
            return response.text.strip() if response.text else ""
        except Exception as e:
            logger.error(f"Gemini API error: {str(e)}")
            return "AI analysis is currently unavailable. Please try again later."

    def generate_repository_summary(self, full_name: str, stars: int, language: str, description: str, topics: list = None) -> str:
        topic_str = ", ".join(topics) if topics else "none listed"
        prompt = f"""Summarize this GitHub repository in 2 sentences for a potential contributor:

Repository: {full_name}
Stars: {stars:,}
Language: {language}
Topics: {topic_str}
Description: {description[:300]}

Focus on what makes this project good for contributors and what a new contributor should know."""
        return self._generate(prompt, 200)

    def generate_ai_mentor(self, title: str, repo: str, difficulty: str, merge_chance: int, health_score: int, labels: list = None) -> str:
        label_str = ", ".join(labels) if labels else "none"
        prompt = f"""You are an AI mentor helping a developer decide whether to work on a GitHub issue. Give warm, encouraging advice in 2-3 sentences.

Issue: {title}
Repository: {repo}
Difficulty: {difficulty}
Merge probability: {merge_chance}%
Repository health: {health_score}/100
Labels: {label_str}

Be specific and actionable."""
        return self._generate(prompt, 200)

    def generate_recommendation_reason(self, title: str, repo: str, score: int, difficulty: str, labels: list = None) -> str:
        label_str = ", ".join(labels) if labels else "none"
        prompt = f"""Explain in one sentence why this GitHub issue was recommended:

Issue: {title}
Repository: {repo}
Score: {score}/100
Difficulty: {difficulty}
Labels: {label_str}

Be concise and encouraging."""
        return self._generate(prompt, 100)

    def chat(self, message: str) -> str:
        prompt = f"You are MergeMind AI, an open source contribution expert. Answer helpfully in 2-4 sentences.\n\nQuestion: {message}"
        return self._generate(prompt, 250)

    def analyze_issue(self, title: str, body: str, labels: list, repo: str, stars: int, health_score: int) -> str:
        label_str = ", ".join(labels) if labels else "none"
        prompt = f"""Analyze this GitHub issue for a contributor:

Repository: {repo} ({stars:,} stars, health: {health_score}/100)
Title: {title}
Description: {body[:500]}
Labels: {label_str}

Provide a 2-3 sentence analysis covering difficulty, beginner-friendliness, and one tip for success."""
        return self._generate(prompt, 200)


ai_service = AIService()