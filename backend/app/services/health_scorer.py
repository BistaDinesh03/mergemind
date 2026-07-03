"""Repository Health Scoring Engine"""

from typing import Dict, List
from datetime import datetime, timezone

class HealthScorer:
    
    WEIGHTS = {"activity": 0.30, "community": 0.25, "maintenance": 0.25, "documentation": 0.20}
    
    @staticmethod
    def calculate(data: Dict) -> Dict:
        activity = HealthScorer._score_activity(data)
        community = HealthScorer._score_community(data)
        maintenance = HealthScorer._score_maintenance(data)
        documentation = HealthScorer._score_documentation(data)
        
        overall = round(min(
            activity["score"] * HealthScorer.WEIGHTS["activity"] +
            community["score"] * HealthScorer.WEIGHTS["community"] +
            maintenance["score"] * HealthScorer.WEIGHTS["maintenance"] +
            documentation["score"] * HealthScorer.WEIGHTS["documentation"], 100
        ))
        
        return {
            "overall": overall,
            "status": "Excellent" if overall >= 80 else "Good" if overall >= 60 else "Fair" if overall >= 40 else "Needs Work",
            "categories": {"activity": activity, "community": community, "maintenance": maintenance, "documentation": documentation},
            "summary": HealthScorer._summary(activity, community, maintenance, documentation),
            "recommendations": HealthScorer._recommendations(activity, community, maintenance, documentation)
        }
    
    @staticmethod
    def _score_activity(data: Dict) -> Dict:
        score = 30
        reasons = []
        
        pushed = data.get("pushed_at", "")
        if pushed:
            try:
                pushed_dt = datetime.fromisoformat(pushed.replace("Z", "+00:00"))
                days = (datetime.now(timezone.utc) - pushed_dt).days
                if days < 1: score += 40; reasons.append("Pushed today")
                elif days < 7: score += 30; reasons.append("Active this week")
                elif days < 30: score += 20; reasons.append("Active this month")
                elif days < 90: score += 10
                else: reasons.append("No recent pushes")
            except: pass
        
        stars = data.get("stargazers_count", 0)
        if stars > 50000: score += 20; reasons.append("Very popular")
        elif stars > 1000: score += 15
        elif stars > 100: score += 10
        
        if data.get("latest_release"): score += 10; reasons.append("Has releases")
        
        return {"score": min(score, 100), "label": "Activity", "icon": "activity", "reasons": reasons[:3]}
    
    @staticmethod
    def _score_community(data: Dict) -> Dict:
        score = 20
        reasons = []
        forks = data.get("forks_count", 0)
        if forks > 10000: score += 30; reasons.append(f"{forks:,} forks")
        elif forks > 1000: score += 25
        elif forks > 100: score += 15
        
        if data.get("has_discussions"): score += 20; reasons.append("Discussions enabled")
        if data.get("has_issues", True): score += 15
        watchers = data.get("watchers_count", 0)
        if watchers > 1000: score += 15
        
        return {"score": min(score, 100), "label": "Community", "icon": "community", "reasons": reasons[:3]}
    
    @staticmethod
    def _score_maintenance(data: Dict) -> Dict:
        score = 40
        reasons = []
        issues = data.get("open_issues_count", 0)
        if issues < 10: score += 30; reasons.append("Few open issues")
        elif issues < 50: score += 20
        else: score += 5; reasons.append(f"{issues} open issues")
        
        if not data.get("archived", False): score += 20
        else: score -= 30; reasons.append("Archived!")
        
        return {"score": min(score, 100), "label": "Maintenance", "icon": "maintenance", "reasons": reasons[:3]}
    
    @staticmethod
    def _score_documentation(data: Dict) -> Dict:
        score = 20
        reasons = []
        if data.get("description") and len(data.get("description", "")) > 50: score += 25; reasons.append("Good description")
        if data.get("has_wiki"): score += 20; reasons.append("Wiki enabled")
        if data.get("has_pages"): score += 15; reasons.append("GitHub Pages")
        if data.get("license"): score += 20; reasons.append("Has license")
        else: reasons.append("No license!")
        
        return {"score": min(score, 100), "label": "Documentation", "icon": "documentation", "reasons": reasons[:3]}
    
    @staticmethod
    def _summary(activity, community, maintenance, documentation) -> List[str]:
        s = []
        if activity["score"] >= 60: s.append("Active development")
        if community["score"] >= 60: s.append("Strong community")
        if maintenance["score"] >= 60: s.append("Well maintained")
        if documentation["score"] >= 60: s.append("Good documentation")
        return s or ["Needs improvement"]
    
    @staticmethod
    def _recommendations(activity, community, maintenance, documentation) -> List[str]:
        r = []
        if activity["score"] < 50: r.append("Check if project is still active")
        if documentation["score"] < 50: r.append("Read source code - docs are limited")
        return r or ["Great project for contribution!"]