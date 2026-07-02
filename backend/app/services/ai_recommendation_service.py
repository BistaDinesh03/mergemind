""""
AI Recommendation Service
Uses Ollama to generate intelligent recommendations and explanations.
""""
from typing import Dict, List, Optional
import json
from sqlalchemy.orm import Session
from .ollama_service import OllamaService
from .prompt_templates import PromptTemplates
from ..models.issue import Issue
from ..models.repository import Repository
from .scoring.opportunity_scorer import OpportunityScorer
from .scoring.merge_predictor import MergeProbabilityPredictor

class AIRecommendationService:
    """AI-powered recommendation and analysis service."""
    
    def __init__(self, ollama: OllamaService = None):
        self.ollama = ollama or OllamaService()
    
    async def analyze_issue_opportunity(
        self,
        issue_data: Dict,
        repo_data: Dict,
    ) -> Dict:
        """"
        Get AI analysis of why an issue is a good/bad opportunity.
        
        Returns:
            Dictionary with analysis and reasoning
        """"
        prompt = PromptTemplates.issue_analyzer(issue_data, repo_data)
        
        result = await self.ollama.generate(
            prompt=prompt,
            system_prompt=PromptTemplates.SYSTEM_PROMPT,
            temperature=0.3,
            max_tokens=300,
        )
        
        return {
            "ai_analysis": result.get("text", ""),
            "model": result.get("model", "unknown"),
            "issue_title": issue_data.get("title"),
            "repository": repo_data.get("full_name"),
        }
    
    async def get_pr_advice(
        self,
        issue_data: Dict,
        repo_data: Dict,
    ) -> Dict:
        """"
        Get AI advice for preparing a PR.
        
        Returns:
            Dictionary with preparation steps and tips
        """"
        prompt = PromptTemplates.pr_advisor(issue_data, repo_data)
        
        result = await self.ollama.generate(
            prompt=prompt,
            system_prompt=PromptTemplates.SYSTEM_PROMPT,
            temperature=0.4,
            max_tokens=250,
        )
        
        # Parse structured advice from response
        advice_text = result.get("text", "")
        
        # Extract actionable items
        action_items = []
        for line in advice_text.split("\n"):
            line = line.strip()
            if line and any(line.startswith(str(i)) for i in range(1, 10)):
                action_items.append(line)
        
        return {
            "advice": advice_text,
            "action_items": action_items[:5],
            "suggested_files": self._extract_file_suggestions(advice_text),
            "model": result.get("model", "unknown"),
        }
    
    async def predict_maintainer_behavior(
        self,
        repo_data: Dict,
    ) -> Dict:
        """"
        Predict maintainer behavior and preferences.
        
        Returns:
            Dictionary with behavior predictions
        """"
        prompt = PromptTemplates.maintainer_insights(repo_data)
        
        result = await self.ollama.generate(
            prompt=prompt,
            system_prompt=PromptTemplates.SYSTEM_PROMPT,
            temperature=0.5,
            max_tokens=250,
        )
        
        return {
            "prediction": result.get("text", ""),
            "repository": repo_data.get("full_name"),
            "model": result.get("model", "unknown"),
        }
    
    async def generate_daily_summary(
        self,
        user_stats: Dict,
        plan: List[Dict],
    ) -> Dict:
        """"
        Generate a motivational daily summary.
        
        Returns:
            Dictionary with summary text
        """"
        prompt = PromptTemplates.daily_summary(user_stats, plan)
        
        result = await self.ollama.generate(
            prompt=prompt,
            system_prompt="You are a supportive and motivating open source mentor.",
            temperature=0.7,
            max_tokens=200,
        )
        
        return {
            "summary": result.get("text", ""),
            "model": result.get("model", "unknown"),
        }
    
    async def recommend_skills(
        self,
        user_skills: List[str],
        db: Session,
    ) -> Dict:
        """"
        Recommend skills to learn based on market and opportunities.
        
        Returns:
            Dictionary with skill recommendations
        """"
        # Get available issues count
        available_issues = db.query(Issue).filter(
            Issue.state == "open",
            Issue.is_beginner_friendly == True,
        ).count()
        
        prompt = PromptTemplates.skill_recommendation(
            user_skills,
            [{"count": available_issues}],
        )
        
        result = await self.ollama.generate(
            prompt=prompt,
            system_prompt=PromptTemplates.SYSTEM_PROMPT,
            temperature=0.5,
            max_tokens=250,
        )
        
        return {
            "recommendations": result.get("text", ""),
            "current_skills": user_skills,
            "available_opportunities": available_issues,
            "model": result.get("model", "unknown"),
        }
    
    async def generate_portfolio_narrative(
        self,
        contributions: List[Dict],
        user_data: Dict,
    ) -> Dict:
        """"
        Generate a professional portfolio narrative.
        
        Returns:
            Dictionary with narrative text
        """"
        prompt = PromptTemplates.portfolio_narrative(contributions, user_data)
        
        result = await self.ollama.generate(
            prompt=prompt,
            system_prompt="You are a professional resume writer and career coach.",
            temperature=0.6,
            max_tokens=200,
        )
        
        return {
            "narrative": result.get("text", ""),
            "username": user_data.get("github_username"),
            "model": result.get("model", "unknown"),
        }
    
    def _extract_file_suggestions(self, text: str) -> List[str]:
        """Extract file path suggestions from AI response."""
        suggestions = []
        common_files = [
            "CONTRIBUTING.md", "README.md", "package.json",
            "tsconfig.json", "pyproject.toml", "Cargo.toml",
            ".github/workflows", "tests/", "src/", "docs/",
        ]
        
        for file in common_files:
            if file.lower() in text.lower():
                suggestions.append(file)
        
        return suggestions[:5]
