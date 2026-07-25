"""Repository & Issue Scoring Engine — Transparent, explainable scores."""
from datetime import datetime, timezone


class BeginnerScorer:
    """Single score answering: Should a beginner contribute here? 0-100 with reasons."""
    
    @staticmethod
    def calculate(repo_data: dict, issues: list = None) -> dict:
        score = 0
        reasons = []
        
        # 1. Activity (0-25)
        pushed_at = repo_data.get("pushed_at", "")
        if pushed_at:
            try:
                pushed = datetime.fromisoformat(pushed_at.replace("Z", "+00:00"))
                days = (datetime.now(timezone.utc) - pushed).days
                if days < 7:
                    score += 25
                    reasons.append({"pass": True, "text": "Active maintainers — pushed this week"})
                elif days < 30:
                    score += 15
                    reasons.append({"pass": True, "text": "Somewhat active — pushed this month"})
                else:
                    reasons.append({"pass": False, "text": f"Last push {days} days ago"})
            except (ValueError, TypeError):
                reasons.append({"pass": False, "text": "Activity data unavailable"})
        else:
            reasons.append({"pass": False, "text": "No activity data"})
        
        # 2. Documentation (0-25)
        desc = repo_data.get("description", "") or ""
        has_license = repo_data.get("license")
        
        if len(desc) > 100:
            score += 15
            reasons.append({"pass": True, "text": "Detailed README"})
        elif desc:
            score += 8
            reasons.append({"pass": True, "text": "Has description"})
        else:
            reasons.append({"pass": False, "text": "No description"})
        
        if has_license:
            score += 10
            reasons.append({"pass": True, "text": "Open source licensed"})
        else:
            reasons.append({"pass": False, "text": "No license"})
        
        # 3. Beginner issues (0-25)
        beginner_count = 0
        if issues:
            beginner_count = sum(1 for i in issues if i.get("is_beginner_friendly"))
        
        if beginner_count >= 3:
            score += 25
            reasons.append({"pass": True, "text": f"{beginner_count} beginner-friendly issues"})
        elif beginner_count > 0:
            score += 15
            reasons.append({"pass": True, "text": f"{beginner_count} beginner issue(s)"})
        else:
            reasons.append({"pass": False, "text": "No beginner-friendly issues"})
        
        # 4. Community (0-15)
        stars = repo_data.get("stargazers_count", 0)
        if stars > 10000:
            score += 15
            reasons.append({"pass": True, "text": f"{stars:,} stars — large community"})
        elif stars > 100:
            score += 10
            reasons.append({"pass": True, "text": f"{stars:,} stars"})
        elif stars > 0:
            score += 5
            reasons.append({"pass": True, "text": "Small but growing"})
        else:
            reasons.append({"pass": False, "text": "No stars yet"})
        
        # 5. Setup ease (0-10)
        language = (repo_data.get("language") or "").lower()
        easy_langs = ["python", "javascript", "typescript", "ruby", "html", "css", "markdown"]
        if language in easy_langs:
            score += 10
            reasons.append({"pass": True, "text": f"{language.title()} — easy to set up"})
        elif language:
            score += 5
            reasons.append({"pass": True, "text": f"{language.title()} — moderate setup"})
        else:
            reasons.append({"pass": False, "text": "Language unknown"})
        
        final_score = min(100, score)
        verdict = (
            "Great for beginners!" if final_score >= 80 else
            "Good for beginners" if final_score >= 60 else
            "May be challenging" if final_score >= 40 else
            "Not beginner-friendly"
        )
        
        return {
            "score": final_score,
            "verdict": verdict,
            "reasons": reasons
        }


class HealthScorer:
    """Scores repository health across 4 dimensions from real GitHub data."""
    
    @staticmethod
    def calculate(data: dict) -> dict:
        stars = data.get("stargazers_count", 0)
        forks = data.get("forks_count", 0)
        open_issues = data.get("open_issues_count", 0)
        has_wiki = data.get("has_wiki", False)
        has_pages = data.get("has_pages", False)
        has_discussions = data.get("has_discussions", False)
        archived = data.get("archived", False)
        description = data.get("description", "") or ""
        license_info = data.get("license")
        pushed_at = data.get("pushed_at", "")

        activity_score, activity_reasons = HealthScorer._score_activity(stars, pushed_at, archived)
        doc_score, doc_reasons = HealthScorer._score_documentation(description, has_wiki, has_pages, license_info)
        community_score, community_reasons = HealthScorer._score_community(stars, forks, has_discussions)
        maintenance_score, maintenance_reasons = HealthScorer._score_maintenance(open_issues, archived)

        overall = round((activity_score + doc_score + community_score + maintenance_score) / 4)
        status = (
            "Excellent" if overall >= 80 else 
            "Good" if overall >= 60 else 
            "Fair" if overall >= 40 else 
            "Needs Work"
        )

        return {
            "overall": overall,
            "status": status,
            "categories": {
                "activity": {"score": activity_score, "label": "Activity", "reasons": activity_reasons},
                "documentation": {"score": doc_score, "label": "Documentation", "reasons": doc_reasons},
                "community": {"score": community_score, "label": "Community", "reasons": community_reasons},
                "maintenance": {"score": maintenance_score, "label": "Maintenance", "reasons": maintenance_reasons},
            },
            "summary": [r for r in [
                activity_reasons[0] if activity_score >= 60 else None,
                doc_reasons[0] if doc_score >= 60 else None,
                community_reasons[0] if community_score >= 60 else None,
                maintenance_reasons[0] if maintenance_score >= 60 else None
            ] if r] or ["Limited data available"],
            "recommendations": HealthScorer._recommendations(activity_score, doc_score, community_score, maintenance_score),
        }

    @staticmethod
    def _score_activity(stars: int, pushed_at: str, archived: bool) -> tuple:
        score = 40
        reasons = []
        if archived:
            return 10, ["Repository is archived"]
        if pushed_at:
            try:
                pushed = datetime.fromisoformat(pushed_at.replace("Z", "+00:00"))
                days = (datetime.now(timezone.utc) - pushed).days
                if days < 1:
                    score += 35
                    reasons.append("Pushed today — very active")
                elif days < 7:
                    score += 25
                    reasons.append("Last push within a week")
                elif days < 30:
                    score += 15
                    reasons.append("Active this month")
                elif days > 365:
                    score -= 20
                    reasons.append("No pushes in over a year")
            except (ValueError, TypeError):
                pass
        if stars > 100000:
            score += 20
        elif stars > 10000:
            score += 10
        return max(0, min(100, score)), reasons if reasons else ["Activity data unavailable"]

    @staticmethod
    def _score_documentation(description: str, has_wiki: bool, has_pages: bool, license_info: dict) -> tuple:
        score = 20
        reasons = []
        if description and len(description) > 100:
            score += 25
            reasons.append("Detailed description")
        elif description:
            score += 15
            reasons.append("Has description")
        if has_wiki:
            score += 15
            reasons.append("Wiki enabled")
        if has_pages:
            score += 10
            reasons.append("GitHub Pages enabled")
        if license_info:
            score += 15
            reasons.append(f"Licensed ({license_info.get('spdx_id', 'Yes') if isinstance(license_info, dict) else 'Yes'})")
        return min(100, score), reasons if reasons else ["Documentation data unavailable"]

    @staticmethod
    def _score_community(stars: int, forks: int, has_discussions: bool) -> tuple:
        score = 25
        reasons = []
        if stars > 50000:
            score += 30
            reasons.append(f"{stars:,} stars — large community")
        elif stars > 10000:
            score += 20
        elif stars > 1000:
            score += 10
        if forks > 10000:
            score += 15
        elif forks > 1000:
            score += 10
        if has_discussions:
            score += 10
            reasons.append("Discussions enabled")
        return min(100, score), reasons if reasons else ["Community data unavailable"]

    @staticmethod
    def _score_maintenance(open_issues: int, archived: bool) -> tuple:
        score = 35
        reasons = []
        if archived:
            return 10, ["Repository is archived"]
        if open_issues == 0:
            score += 30
            reasons.append("No open issues — well maintained")
        elif open_issues < 10:
            score += 25
            reasons.append(f"Only {open_issues} open issues")
        elif open_issues < 50:
            score += 15
        elif open_issues > 500:
            score -= 10
            reasons.append(f"{open_issues} open issues")
        return max(0, min(100, score)), reasons if reasons else ["Maintenance data unavailable"]

    @staticmethod
    def _recommendations(activity: int, docs: int, community: int, maintenance: int) -> list:
        recs = []
        if activity < 40:
            recs.append("Check if the project is still actively maintained")
        if docs < 40:
            recs.append("Documentation is limited — be prepared to read source code")
        if community < 40:
            recs.append("Small community — you may need to figure things out independently")
        if maintenance < 40:
            recs.append("Many open issues — look for ones with clear descriptions")
        return recs if recs else ["This project appears healthy and ready for contributors"]


class IssueScorer:
    """Scores an individual issue for beginner-friendliness."""
    
    @staticmethod
    def calculate(issue: dict, repo_data: dict) -> dict:
        labels = [l["name"].lower() if isinstance(l, dict) else l.lower() for l in issue.get("labels", [])]
        title = issue.get("title", "")
        body = issue.get("body", "") or ""
        
        beginner_score, beginner_reasons = IssueScorer._score_beginner(labels)
        activity_score, activity_reasons = IssueScorer._score_activity(repo_data)
        setup_score, setup_reasons = IssueScorer._score_setup(repo_data)
        freshness_score, freshness_reasons = IssueScorer._score_freshness(issue)
        clarity_score, clarity_reasons = IssueScorer._score_clarity(title, body, labels)
        
        overall = round(
            beginner_score * 0.30 +
            activity_score * 0.25 +
            setup_score * 0.10 +
            freshness_score * 0.15 +
            clarity_score * 0.20
        )
        
        return {
            "overall": overall,
            "verdict": "Highly Recommended" if overall >= 80 else "Recommended" if overall >= 60 else "Worth Considering",
            "factors": {
                "beginner": {"score": beginner_score, "label": "Beginner Friendly", "weight": "30%", "reasons": beginner_reasons},
                "activity": {"score": activity_score, "label": "Maintainer Activity", "weight": "25%", "reasons": activity_reasons},
                "clarity": {"score": clarity_score, "label": "Issue Clarity", "weight": "20%", "reasons": clarity_reasons},
                "freshness": {"score": freshness_score, "label": "Issue Freshness", "weight": "15%", "reasons": freshness_reasons},
                "setup": {"score": setup_score, "label": "Setup Difficulty", "weight": "10%", "reasons": setup_reasons},
            }
        }
    
    @staticmethod
    def _score_beginner(labels: list) -> tuple:
        score = 30
        reasons = []
        has_good_first = "good first issue" in labels
        has_help_wanted = "help wanted" in labels
        has_beginner = "beginner" in labels
        has_documentation = "documentation" in labels
        
        if has_good_first:
            score += 40
            reasons.append("Labeled 'good first issue'")
        elif has_beginner:
            score += 30
            reasons.append("Labeled 'beginner'")
        if has_help_wanted:
            score += 15
            reasons.append("Maintainers want help")
        if has_documentation:
            score += 10
            reasons.append("Documentation-related")
        if not reasons:
            reasons.append("No beginner labels found")
        return min(100, score), reasons
    
    @staticmethod
    def _score_activity(repo_data: dict) -> tuple:
        score = 40
        reasons = []
        pushed_at = repo_data.get("pushed_at", "")
        if pushed_at:
            try:
                pushed = datetime.fromisoformat(pushed_at.replace("Z", "+00:00"))
                days = (datetime.now(timezone.utc) - pushed).days
                if days < 1:
                    score += 40
                    reasons.append("Pushed today")
                elif days < 7:
                    score += 30
                    reasons.append("Active this week")
                elif days < 30:
                    score += 15
                    reasons.append("Active this month")
            except (ValueError, TypeError):
                pass
        return max(0, min(100, score)), reasons if reasons else ["Activity data unavailable"]
    
    @staticmethod
    def _score_setup(repo_data: dict) -> tuple:
        score = 50
        reasons = []
        language = (repo_data.get("language") or "").lower()
        easy_languages = ["python", "javascript", "typescript", "ruby", "html", "css", "markdown"]
        if language in easy_languages:
            score += 35
            reasons.append(f"{language.title()} — easy setup")
        elif language:
            score += 15
        return min(100, score), reasons if reasons else ["Setup difficulty unknown"]
    
    @staticmethod
    def _score_freshness(issue: dict) -> tuple:
        score = 50
        reasons = []
        created_at = issue.get("created_at", "")
        if created_at:
            try:
                created = datetime.fromisoformat(created_at.replace("Z", "+00:00"))
                days = (datetime.now(timezone.utc) - created).days
                if days < 1:
                    score += 30
                    reasons.append("Brand new issue")
                elif days < 7:
                    score += 20
                    reasons.append("Opened this week")
                elif days < 30:
                    score += 10
            except (ValueError, TypeError):
                pass
        comments = issue.get("comments", 0)
        if comments == 0:
            score += 20
            reasons.append("No comments yet — be the first")
        return max(0, min(100, score)), reasons if reasons else ["Freshness data unavailable"]
    
    @staticmethod
    def _score_clarity(title: str, body: str, labels: list) -> tuple:
        score = 30
        reasons = []
        if len(title) > 10:
            score += 15
            reasons.append("Clear title")
        if len(body) > 100:
            score += 25
            reasons.append("Detailed description")
        elif len(body) > 20:
            score += 10
        if len(labels) > 1:
            score += 15
            reasons.append("Well-labeled")
        if "bug" in labels:
            score += 15
            reasons.append("Bug — clear expected behavior")
        return min(100, score), reasons if reasons else ["Clarity data unavailable"]