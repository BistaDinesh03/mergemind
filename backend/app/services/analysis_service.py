from typing import Dict, List, Optional
from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from .github_service import GitHubAPIService
from ..models.repository import Repository
from ..models.issue import Issue
import json

class RepositoryAnalysisService:
    """Service for analyzing repositories and caching results."""
    
    def __init__(self, db: Session, github_service: GitHubAPIService):
        self.db = db
        self.github = github_service
    
    def analyze_repository(self, full_name: str) -> Dict:
        """Analyze a repository and cache results in database."""
        print(f"Analyzing repository: {full_name}")
        
        # Fetch repository data
        repo_data = self.github.get_repository(full_name)
        if not repo_data:
            return {"error": "Repository not found"}
        
        # Check if repository exists in DB
        db_repo = self.db.query(Repository).filter(
            Repository.full_name == full_name
        ).first()
        
        if not db_repo:
            db_repo = Repository(
                github_id=repo_data.get("id"),
                full_name=repo_data.get("full_name"),
                description=repo_data.get("description"),
                url=repo_data.get("html_url"),
                language=repo_data.get("language"),
                stars_count=repo_data.get("stargazers_count", 0),
                forks_count=repo_data.get("forks_count", 0),
                open_issues_count=repo_data.get("open_issues_count", 0),
            )
            self.db.add(db_repo)
        
        # Analyze repository health indicators
        health_data = self._analyze_repository_health(full_name, repo_data)
        
        # Update repository scores
        db_repo.health_score = health_data["health_score"]
        db_repo.maintainer_activity_score = health_data["maintainer_activity_score"]
        db_repo.documentation_score = health_data["documentation_score"]
        db_repo.test_coverage_score = health_data["test_coverage_score"]
        db_repo.avg_response_time_hours = health_data["avg_response_time_hours"]
        db_repo.trust_score = health_data["trust_score"]
        
        # Metadata checks
        db_repo.has_contributing_guide = self.github.check_file_exists(full_name, "CONTRIBUTING.md")
        db_repo.has_readme = self.github.check_file_exists(full_name, "README.md")
        db_repo.has_issue_templates = self.github.check_file_exists(full_name, ".github/ISSUE_TEMPLATE")
        db_repo.has_ci_cd = self._check_ci_cd(full_name)
        
        last_commit = repo_data.get("pushed_at")
        if last_commit:
            db_repo.last_commit_date = datetime.fromisoformat(last_commit.replace("Z", "+00:00"))
        
        db_repo.last_analyzed = datetime.utcnow()
        self.db.commit()
        self.db.refresh(db_repo)
        
        return {
            "repository": db_repo,
            "health_data": health_data,
        }
    
    def _analyze_repository_health(self, full_name: str, repo_data: Dict) -> Dict:
        """Calculate repository health scores."""
        
        # 1. Maintainer Activity Score (40%)
        maintainer_score = self._calculate_maintainer_activity(full_name, repo_data)
        
        # 2. Documentation Score (25%)
        doc_score = self._calculate_documentation_score(full_name)
        
        # 3. Test Coverage Score (20%)
        test_score = self._calculate_test_coverage_score(full_name)
        
        # 4. Response Time Score (15%)
        response_score = self._calculate_response_time_score(full_name)
        
        # Overall health score (weighted average)
        health_score = (
            maintainer_score * 0.40 +
            doc_score * 0.25 +
            test_score * 0.20 +
            response_score * 0.15
        )
        
        return {
            "health_score": round(health_score, 2),
            "maintainer_activity_score": round(maintainer_score, 2),
            "documentation_score": round(doc_score, 2),
            "test_coverage_score": round(test_score, 2),
            "avg_response_time_hours": round(24 - (response_score / 100 * 24), 1),
            "trust_score": round((maintainer_score + doc_score) / 2, 2),
        }
    
    def _calculate_maintainer_activity(self, full_name: str, repo_data: Dict) -> float:
        """Score maintainer activity based on recent commits and PR merges."""
        score = 50.0  # Start at neutral
        
        # Check recent commits
        recent_commits = self.github.get_repository_commits(full_name, since_days=30)
        if len(recent_commits) > 50:
            score += 40
        elif len(recent_commits) > 20:
            score += 30
        elif len(recent_commits) > 5:
            score += 15
        elif len(recent_commits) > 0:
            score += 5
        else:
            score -= 20  # No recent activity
        
        # Check if recently pushed
        pushed_at = repo_data.get("pushed_at")
        if pushed_at:
            pushed_date = datetime.fromisoformat(pushed_at.replace("Z", "+00:00"))
            days_since_push = (datetime.utcnow() - pushed_date.replace(tzinfo=None)).days
            
            if days_since_push < 1:
                score += 10
            elif days_since_push < 7:
                score += 5
            elif days_since_push > 90:
                score -= 15
        
        return max(0, min(100, score))
    
    def _calculate_documentation_score(self, full_name: str) -> float:
        """Score repository documentation quality."""
        score = 0.0
        
        # README check
        if self.github.check_file_exists(full_name, "README.md"):
            score += 40
            # Check if README is substantial
            readme_content = self.github.get_file_content(full_name, "README.md")
            if readme_content and len(readme_content) > 500:
                score += 10
        
        # Contributing guide
        if self.github.check_file_exists(full_name, "CONTRIBUTING.md"):
            score += 25
        
        # Issue templates
        if self.github.check_file_exists(full_name, ".github/ISSUE_TEMPLATE"):
            score += 15
        
        # License
        if self.github.check_file_exists(full_name, "LICENSE") or self.github.check_file_exists(full_name, "LICENSE.md"):
            score += 10
        
        return min(100, score)
    
    def _calculate_test_coverage_score(self, full_name: str) -> float:
        """Score test coverage based on test file detection."""
        score = 0.0
        
        # Check for test directories/files
        languages = self.github.get_repository_languages(full_name)
        
        for lang in languages.keys():
            lang_lower = lang.lower()
            if lang_lower in ["python", "javascript", "typescript"]:
                score += 10
            elif lang_lower in ["java", "go", "rust", "ruby"]:
                score += 8
        
        # Check for CI/CD configs
        if self._check_ci_cd(full_name):
            score += 40
        
        # Check for common test directories
        test_indicators = [
            "tests/", "test/", "__tests__/", "spec/",
            "pytest.ini", "jest.config.js", "vitest.config.ts",
            ".github/workflows/test", ".github/workflows/ci"
        ]
        
        for indicator in test_indicators:
            if self.github.check_file_exists(full_name, indicator):
                score += 10
                break
        
        return min(100, score)
    
    def _calculate_response_time_score(self, full_name: str) -> float:
        """Score based on issue response time."""
        score = 50.0
        
        # Sample recent issues
        issues = self.github.get_repository_issues(full_name, state="all")[:20]
        
        if not issues:
            return 50.0
        
        response_times = []
        for issue in issues:
            created = issue.get("created_at")
            if created:
                created_date = datetime.fromisoformat(created.replace("Z", "+00:00"))
                
                # Check for comments
                comments = self.github.get_issue_comments(full_name, issue["number"])
                if comments:
                    first_comment = comments[0].get("created_at")
                    if first_comment:
                        first_comment_date = datetime.fromisoformat(first_comment.replace("Z", "+00:00"))
                        response_time = (first_comment_date - created_date).total_seconds() / 3600
                        response_times.append(response_time)
        
        if response_times:
            avg_response = sum(response_times) / len(response_times)
            if avg_response < 1:
                score = 95
            elif avg_response < 4:
                score = 85
            elif avg_response < 12:
                score = 70
            elif avg_response < 24:
                score = 55
            elif avg_response < 72:
                score = 35
            else:
                score = 15
        else:
            score = 30  # No responses found
        
        return score
    
    def _check_ci_cd(self, full_name: str) -> bool:
        """Check if repository has CI/CD configuration."""
        ci_files = [
            ".github/workflows",
            ".travis.yml",
            "circle.yml",
            "Jenkinsfile",
            ".gitlab-ci.yml",
            "azure-pipelines.yml",
        ]
        
        for ci_file in ci_files:
            if self.github.check_file_exists(full_name, ci_file):
                return True
        return False
    
    def fetch_and_analyze_issues(self, full_name: str, labels: List[str] = None) -> List[Dict]:
        """Fetch issues for a repository and store analysis."""
        repo = self.db.query(Repository).filter(Repository.full_name == full_name).first()
        if not repo:
            repo_result = self.analyze_repository(full_name)
            repo = repo_result.get("repository")
        
        if not repo:
            return []
        
        # Fetch issues with good first issue labels
        good_labels = labels or ["good first issue", "help wanted", "beginner-friendly", "easy"]
        all_issues = []
        
        for label in good_labels:
            issues = self.github.get_repository_issues(full_name, labels=label)
            all_issues.extend(issues)
        
        analyzed_issues = []
        for issue_data in all_issues:
            # Check if issue exists in DB
            db_issue = self.db.query(Issue).filter(
                Issue.github_id == issue_data["id"]
            ).first()
            
            if not db_issue:
                db_issue = Issue(
                    github_id=issue_data["id"],
                    repository_id=repo.id,
                    title=issue_data.get("title", ""),
                    body=issue_data.get("body", ""),
                    url=issue_data.get("html_url", ""),
                    state=issue_data.get("state", "open"),
                    labels=[l["name"] for l in issue_data.get("labels", [])],
                    comment_count=issue_data.get("comments", 0),
                )
                self.db.add(db_issue)
            
            # Analyze issue
            analysis = self._analyze_issue(issue_data, repo)
            
            db_issue.opportunity_score = analysis["opportunity_score"]
            db_issue.merge_probability = analysis["merge_probability"]
            db_issue.estimated_hours = analysis["estimated_hours"]
            db_issue.difficulty = analysis["difficulty"]
            db_issue.skills_required = analysis["skills_required"]
            db_issue.is_beginner_friendly = analysis["is_beginner_friendly"]
            db_issue.competing_prs = analysis["competing_prs"]
            db_issue.last_analyzed = datetime.utcnow()
            
            analyzed_issues.append(db_issue)
        
        self.db.commit()
        return analyzed_issues
    
    def _analyze_issue(self, issue_data: Dict, repo: Repository) -> Dict:
        """Analyze an individual issue for opportunity scoring."""
        labels = [l["name"].lower() if isinstance(l, dict) else l.lower() 
                  for l in issue_data.get("labels", [])]
        
        # Difficulty assessment
        is_easy = any(l in labels for l in ["good first issue", "easy", "beginner-friendly", "beginner"])
        is_hard = any(l in labels for l in ["hard", "difficult", "expert", "advanced"])
        
        difficulty = "Easy" if is_easy else ("Hard" if is_hard else "Medium")
        
        # Beginner friendliness
        is_beginner = is_easy or "good first issue" in labels or "documentation" in labels
        
        # Competing PRs
        has_pr = any("pull" in str(l).lower() for l in labels)
        assignee = issue_data.get("assignee")
        
        competing_prs = 0
        if has_pr:
            competing_prs += 1
        if assignee:
            competing_prs += 1
        
        # Opportunity score calculation
        opportunity_score = 50.0
        
        if is_beginner:
            opportunity_score += 25
        if difficulty == "Easy":
            opportunity_score += 15
        if not has_pr and not assignee:
            opportunity_score += 20
        if repo.health_score > 60:
            opportunity_score += 10
        if repo.documentation_score > 50:
            opportunity_score += 10
        
        opportunity_score = min(100, opportunity_score)
        
        # Merge probability
        merge_prob = 50.0
        if repo.maintainer_activity_score > 60:
            merge_prob += 20
        if repo.health_score > 70:
            merge_prob += 15
        if not competing_prs:
            merge_prob += 15
        
        merge_prob = min(100, merge_prob)
        
        # Estimate hours
        estimated_hours = 2.0
        if difficulty == "Easy":
            estimated_hours = 1.5
        elif difficulty == "Hard":
            estimated_hours = 6.0
        
        # Skills required
        skills = []
        repo_lang = repo.language
        if repo_lang:
            skills.append(repo_lang)
        
        for label in labels:
            if label in ["python", "javascript", "typescript", "rust", "go", "java", "ruby"]:
                skills.append(label.capitalize())
            elif label in ["documentation", "docs"]:
                skills.append("Technical Writing")
            elif label in ["testing", "tests"]:
                skills.append("Testing")
        
        return {
            "opportunity_score": round(opportunity_score, 2),
            "merge_probability": round(merge_prob, 2),
            "estimated_hours": estimated_hours,
            "difficulty": difficulty,
            "skills_required": list(set(skills)) if skills else [repo_lang or "General"],
            "is_beginner_friendly": is_beginner,
            "competing_prs": competing_prs,
        }
