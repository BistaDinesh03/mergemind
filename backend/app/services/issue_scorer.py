"""AI-Powered Issue Scoring Service - Modular, extensible scoring engine."""

from typing import Dict, List, Optional, Callable
from dataclasses import dataclass, field
import httpx
import json
from ..config import settings

@dataclass
class ScoringFactor:
    """A single scoring factor that can be registered."""
    name: str
    weight: float  # 0-1, all weights should sum to 1
    score_func: Callable
    description: str

class IssueScorer:
    """Scores GitHub issues across multiple dimensions. Extensible via register_factor()."""
    
    def __init__(self):
        self.factors: List[ScoringFactor] = []
        self._register_default_factors()
    
    def _register_default_factors(self):
        """Register all default scoring factors."""
        self.register_factor(ScoringFactor("difficulty", 0.20, self._score_difficulty, "How hard is this issue to solve?"))
        self.register_factor(ScoringFactor("time_estimate", 0.15, self._score_time, "Estimated hours to complete"))
        self.register_factor(ScoringFactor("merge_probability", 0.20, self._score_merge, "Likelihood of PR being accepted"))
        self.register_factor(ScoringFactor("beginner_friendly", 0.20, self._score_beginner, "How suitable for new contributors"))
        self.register_factor(ScoringFactor("repo_activity", 0.15, self._score_repo_activity, "How active is the repository"))
        self.register_factor(ScoringFactor("issue_clarity", 0.10, self._score_clarity, "How well is the issue described"))
    
    def register_factor(self, factor: ScoringFactor):
        """Register a new scoring factor. Use this to extend the scorer."""
        self.factors.append(factor)
    
    def score(self, issue_data: Dict, repo_data: Dict = None) -> Dict:
        """Score an issue across all registered factors."""
        
        results = {}
        total_score = 0
        
        for factor in self.factors:
            score_result = factor.score_func(issue_data, repo_data)
            results[factor.name] = {
                "score": score_result["score"],
                "weight": factor.weight,
                "weighted": round(score_result["score"] * factor.weight, 1),
                "label": score_result.get("label", factor.name.replace("_", " ").title()),
                "reason": score_result.get("reason", ""),
                "icon": score_result.get("icon", "help-circle")
            }
            total_score += score_result["score"] * factor.weight
        
        overall = round(total_score)
        
        return {
            "overall_score": overall,
            "verdict": self._get_verdict(overall),
            "factors": results,
            "summary": self._generate_summary(results),
            "recommendation": self._get_recommendation(overall, results)
        }
    
    async def score_with_ai(self, issue_data: Dict, repo_data: Dict = None) -> Dict:
        """Enhance scoring with AI analysis."""
        
        # Get base scores
        base_result = self.score(issue_data, repo_data)
        
        # Build prompt for AI
        prompt = f"""Analyze this GitHub issue for a contributor:
        
Issue: {issue_data.get('title', 'Unknown')}
Labels: {', '.join(issue_data.get('labels', []))}
Comments: {issue_data.get('comments', 0)}
Repository: {repo_data.get('full_name', 'Unknown') if repo_data else 'Unknown'}
Stars: {repo_data.get('stars', 0) if repo_data else 0}

Provide a JSON response with:
- difficulty: "easy", "medium", or "hard"
- estimated_hours: number
- merge_chance: "high", "medium", or "low"  
- why: one sentence explaining the score
- tip: one actionable tip for the contributor

Respond ONLY with valid JSON."""

        try:
            async with httpx.AsyncClient(timeout=60) as client:
                r = await client.post(
                    f"{settings.ollama_host}/api/generate",
                    json={
                        "model": settings.ollama_model,
                        "prompt": prompt,
                        "stream": False,
                        "options": {"num_predict": 200, "temperature": 0.3}
                    }
                )
                ai_response = r.json().get("response", "").strip()
                
                # Try to parse JSON from AI response
                try:
                    ai_data = json.loads(ai_response)
                    base_result["ai_analysis"] = ai_data
                    base_result["ai_raw"] = ai_response
                except:
                    base_result["ai_analysis"] = {"raw": ai_response}
                    base_result["ai_raw"] = ai_response
                
        except Exception as e:
            base_result["ai_error"] = str(e)
        
        return base_result
    
    def _score_difficulty(self, issue: Dict, repo: Dict = None) -> Dict:
        """Score based on issue difficulty indicators."""
        score = 50
        labels = [l.lower() for l in issue.get("labels", [])]
        
        if "good first issue" in labels or "easy" in labels:
            score = 90; reason = "Labeled as easy/good first issue"
        elif "hard" in labels or "difficult" in labels or "expert" in labels:
            score = 20; reason = "Labeled as difficult"
        elif "medium" in labels:
            score = 60; reason = "Labeled as medium difficulty"
        else:
            body_len = len(issue.get("body", ""))
            if body_len > 500: score = 40; reason = "Long description suggests complexity"
            elif body_len > 200: score = 60; reason = "Moderate description length"
            else: score = 70; reason = "Short, focused issue"
        
        return {"score": score, "label": "Difficulty", "reason": reason, "icon": "thermometer"}
    
    def _score_time(self, issue: Dict, repo: Dict = None) -> Dict:
        """Estimate time to complete."""
        labels = [l.lower() for l in issue.get("labels", [])]
        
        if "good first issue" in labels or "documentation" in labels:
            score = 85; reason = "Estimated 1-2 hours"
        elif "bug" in labels and "small" in str(issue.get("body", "")).lower():
            score = 70; reason = "Estimated 2-4 hours"
        elif "feature" in labels:
            score = 40; reason = "Features typically take 4-8 hours"
        elif "hard" in labels:
            score = 25; reason = "May take 8+ hours"
        else:
            score = 60; reason = "Estimated 2-4 hours"
        
        return {"score": score, "label": "Time Estimate", "reason": reason, "icon": "clock"}
    
    def _score_merge(self, issue: Dict, repo: Dict = None) -> Dict:
        """Score merge probability."""
        score = 60
        reasons = []
        
        assignees = issue.get("assignees", [])
        if len(assignees) > 0:
            score -= 20; reasons.append("Already assigned")
        
        comments = issue.get("comments", 0)
        if comments > 10:
            score -= 10; reasons.append("Many comments (may indicate complexity)")
        elif comments > 0:
            score += 10; reasons.append("Active discussion")
        
        if repo:
            stars = repo.get("stars", 0)
            if stars > 10000: score += 15; reasons.append("Popular, well-maintained repo")
        
        if not reasons:
            reasons.append("Average merge likelihood")
        
        return {"score": min(score, 100), "label": "Merge Chance", "reason": "; ".join(reasons), "icon": "git-merge"}
    
    def _score_beginner(self, issue: Dict, repo: Dict = None) -> Dict:
        """Score beginner friendliness."""
        score = 30
        labels = [l.lower() for l in issue.get("labels", [])]
        reasons = []
        
        if "good first issue" in labels:
            score += 50; reasons.append("Explicitly 'good first issue'")
        if "beginner" in labels or "easy" in labels:
            score += 25; reasons.append("Beginner-friendly label")
        if "help wanted" in labels:
            score += 15; reasons.append("Help wanted")
        if "documentation" in labels:
            score += 20; reasons.append("Documentation work")
        
        body = issue.get("body", "").lower()
        if "steps to reproduce" in body or "how to" in body:
            score += 10; reasons.append("Clear instructions in description")
        
        if not reasons:
            reasons.append("Not specifically marked for beginners")
        
        return {"score": min(score, 100), "label": "Beginner Friendly", "reason": "; ".join(reasons), "icon": "smile"}
    
    def _score_repo_activity(self, issue: Dict, repo: Dict = None) -> Dict:
        """Score based on repository activity."""
        if not repo:
            return {"score": 50, "label": "Repo Activity", "reason": "No repository data", "icon": "activity"}
        
        score = 50
        stars = repo.get("stars", 0)
        pushed = repo.get("pushed_at", "")
        
        if stars > 50000: score += 25
        elif stars > 10000: score += 15
        elif stars > 1000: score += 10
        
        if pushed:
            from datetime import datetime, timezone
            try:
                pushed_dt = datetime.fromisoformat(pushed.replace("Z", "+00:00"))
                days = (datetime.now(timezone.utc) - pushed_dt).days
                if days < 1: score += 15
                elif days < 7: score += 10
            except: pass
        
        reason = "Active repository" if score > 60 else "Moderate activity" if score > 40 else "Low activity"
        return {"score": min(score, 100), "label": "Repo Activity", "reason": reason, "icon": "activity"}
    
    def _score_clarity(self, issue: Dict, repo: Dict = None) -> Dict:
        """Score how well the issue is described."""
        score = 40
        body = issue.get("body", "")
        reasons = []
        
        if len(body) > 300: score += 30; reasons.append("Detailed description")
        elif len(body) > 100: score += 20; reasons.append("Adequate description")
        else: reasons.append("Short description")
        
        if "steps to reproduce" in body.lower(): score += 15; reasons.append("Has reproduction steps")
        if "expected" in body.lower(): score += 10; reasons.append("Has expected behavior")
        
        title = issue.get("title", "")
        if len(title) > 20: score += 5; reasons.append("Descriptive title")
        
        return {"score": min(score, 100), "label": "Issue Clarity", "reason": "; ".join(reasons), "icon": "file-text"}
    
    def _get_verdict(self, score: int) -> str:
        if score >= 80: return "Highly Recommended"
        if score >= 65: return "Recommended"
        if score >= 50: return "Worth Considering"
        if score >= 35: return "Proceed with Caution"
        return "Not Recommended"
    
    def _generate_summary(self, results: Dict) -> List[str]:
        summary = []
        for name, data in results.items():
            if data["score"] >= 70:
                summary.append(f"Strong {data['label'].lower()}: {data['reason']}")
        return summary[:3] if summary else ["Mixed scores - review details carefully"]
    
    def _get_recommendation(self, overall: int, results: Dict) -> str:
        if overall >= 80:
            return "This is an excellent issue to work on. High chance of success!"
        elif overall >= 65:
            return "Good opportunity. Consider starting soon before someone else picks it up."
        elif overall >= 50:
            return "Decent issue but review the factors below before committing."
        else:
            return "This issue may be challenging. Consider finding a more beginner-friendly alternative."


# Singleton instance
issue_scorer = IssueScorer()