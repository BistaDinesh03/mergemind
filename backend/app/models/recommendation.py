from sqlalchemy import Column, Integer, String, DateTime, Boolean, JSON, Text, ForeignKey
from sqlalchemy.sql import func
from ..database import Base

class RecommendationHistory(Base):
    __tablename__ = 'recommendation_history'
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey('users.id'), index=True, nullable=False)
    issue_github_id = Column(Integer, index=True)
    issue_number = Column(Integer)
    issue_title = Column(String(500))
    repository_full_name = Column(String(200), index=True)
    overall_score = Column(Integer)
    difficulty_score = Column(Integer)
    merge_chance = Column(Integer)
    beginner_score = Column(Integer)
    repo_health = Column(Integer)
    was_viewed = Column(Boolean, default=False)
    was_clicked = Column(Boolean, default=False)
    was_contributed = Column(Boolean, default=False)
    verdict = Column(String(50))
    estimated_hours = Column(String(20))
    ai_reason = Column(Text)
    labels = Column(JSON, default=list)
    recommended_at = Column(DateTime, server_default=func.now())
    interacted_at = Column(DateTime)
