"""Repository Health Scoring Engine — Real data analysis."""

class HealthScorer:
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

        # Activity score
        activity_score = 50
        if stars > 50000: activity_score += 25
        elif stars > 1000: activity_score += 15
        if pushed_at:
            from datetime import datetime, timezone
            try:
                pushed = datetime.fromisoformat(pushed_at.replace("Z", "+00:00"))
                days = (datetime.now(timezone.utc) - pushed).days
                if days < 1: activity_score += 25
                elif days < 7: activity_score += 15
                elif days < 30: activity_score += 10
                elif days > 365: activity_score -= 20
            except: pass
        if archived: activity_score -= 30
        activity_score = max(0, min(100, activity_score))

        # Documentation score
        doc_score = 30
        if description and len(description) > 50: doc_score += 25
        elif description: doc_score += 15
        if has_wiki: doc_score += 15
        if has_pages: doc_score += 10
        if license_info: doc_score += 20
        doc_score = min(100, doc_score)

        # Community score
        community_score = 30
        if stars > 100000: community_score += 30
        elif stars > 10000: community_score += 25
        elif stars > 1000: community_score += 15
        if forks > 10000: community_score += 20
        elif forks > 1000: community_score += 10
        if has_discussions: community_score += 10
        community_score = min(100, community_score)

        # Maintenance score
        maintenance_score = 40
        if open_issues == 0: maintenance_score += 25
        elif open_issues < 10: maintenance_score += 20
        elif open_issues < 50: maintenance_score += 15
        elif open_issues > 500: maintenance_score -= 10
        if not archived: maintenance_score += 20
        maintenance_score = max(0, min(100, maintenance_score))

        overall = round((activity_score + doc_score + community_score + maintenance_score) / 4)
        status = "Excellent" if overall >= 80 else "Good" if overall >= 60 else "Fair" if overall >= 40 else "Needs Work"

        return {
            "overall": overall,
            "status": status,
            "categories": {
                "activity": {"score": activity_score, "label": "Activity", "icon": "activity", "reasons": self._reasons_activity(stars, pushed_at, archived)},
                "documentation": {"score": doc_score, "label": "Documentation", "icon": "documentation", "reasons": self._reasons_docs(description, has_wiki, license_info)},
                "community": {"score": community_score, "label": "Community", "icon": "community", "reasons": self._reasons_community(stars, forks, has_discussions)},
                "maintenance": {"score": maintenance_score, "label": "Maintenance", "icon": "maintenance", "reasons": self._reasons_maintenance(open_issues, archived)},
            },
            "summary": self._summary(activity_score, doc_score, community_score, maintenance_score),
            "recommendations": self._recommendations(activity_score, doc_score, community_score, maintenance_score),
        }

    @staticmethod
    def _reasons_activity(stars, pushed_at, archived):
        reasons = []
        if stars > 10000: reasons.append("Very popular project")
        if archived: reasons.append("Repository is archived")
        return reasons or ["Activity data unavailable"]

    @staticmethod
    def _reasons_docs(description, has_wiki, license_info):
        reasons = []
        if description and len(description) > 50: reasons.append("Good description")
        if has_wiki: reasons.append("Wiki enabled")
        if license_info: reasons.append(f"License: {license_info.get('spdx_id', 'Present')}" if isinstance(license_info, dict) else "Has license")
        return reasons or ["Documentation data unavailable"]

    @staticmethod
    def _reasons_community(stars, forks, has_discussions):
        reasons = []
        if stars > 1000: reasons.append(f"{stars:,} stars")
        if forks > 1000: reasons.append(f"{forks:,} forks")
        if has_discussions: reasons.append("Discussions enabled")
        return reasons or ["Community data unavailable"]

    @staticmethod
    def _reasons_maintenance(open_issues, archived):
        reasons = []
        if open_issues < 10: reasons.append("Few open issues")
        elif open_issues > 500: reasons.append(f"{open_issues} open issues")
        if not archived: reasons.append("Active project")
        return reasons or ["Maintenance data unavailable"]

    @staticmethod
    def _summary(activity, docs, community, maintenance):
        s = []
        if activity >= 60: s.append("Active development")
        if docs >= 60: s.append("Good documentation")
        if community >= 60: s.append("Strong community")
        if maintenance >= 60: s.append("Well maintained")
        return s or ["Limited data available"]

    @staticmethod
    def _recommendations(activity, docs, community, maintenance):
        r = []
        if activity < 40: r.append("Check if project is still active")
        if docs < 40: r.append("Documentation is limited")
        if community < 40: r.append("Small community")
        if maintenance < 40: r.append("Many open issues")
        return r or ["Project appears healthy"]