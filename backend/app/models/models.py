from sqlalchemy import Column, Integer, String, ForeignKey, UniqueConstraint, DateTime, Text, Boolean
from sqlalchemy.orm import relationship, declarative_base
from datetime import datetime, timezone

Base = declarative_base()

class Module(Base):
    __tablename__ = "modules"
    id = Column(Integer, primary_key=True)
    name = Column(String, unique=True, nullable=False)
    scenarios = relationship("Scenario", back_populates="module")

class Scenario(Base):
    __tablename__ = "scenarios"
    id = Column(Integer, primary_key=True)
    name = Column(String, unique=True, nullable=False)
    module_id = Column(Integer, ForeignKey("modules.id"))
    module = relationship("Module", back_populates="scenarios")
    question_text = Column(Text, nullable=True)
    post_response_text = Column(Text, nullable=True)
    scenario_type = Column(String, nullable=False)  # 'trolley', 'transplant', 'question'
    top_track_label = Column(String, nullable=True)
    bottom_track_label = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    responses = relationship("Response", back_populates="scenario")
    options = relationship("DecisionOption", back_populates="scenario", cascade="all, delete-orphan")

class DecisionOption(Base):
    __tablename__ = "decision_options"
    id = Column(Integer, primary_key=True)
    scenario_id = Column(Integer, ForeignKey("scenarios.id"), nullable=False)
    label = Column(String, nullable=False)
    description = Column(String, nullable=True)
    scenario = relationship("Scenario", back_populates="options")
    __table_args__ = (UniqueConstraint("scenario_id", "label", name="unique_option_per_scenario"),)

from sqlalchemy import Column, Integer, ForeignKey, String, UniqueConstraint
from sqlalchemy.orm import relationship

class Response(Base):
    __tablename__ = "responses"
    id = Column(Integer, primary_key=True)
    scenario_id = Column(Integer, ForeignKey("scenarios.id"))
    option_id   = Column(Integer, ForeignKey("decision_options.id"))
    session_id  = Column(String, index=True)

    homework_participant_id = Column(
        Integer,
        ForeignKey("homework_participants.id"),
        nullable=True
    )

    scenario = relationship("Scenario", back_populates="responses")
    option   = relationship("DecisionOption")

    __table_args__ = (
        UniqueConstraint("scenario_id", "session_id", name="unique_response_per_session"),
    )


class DiscussionThread(Base):
    __tablename__ = "discussion_threads"

    id = Column(Integer, primary_key=True)
    slug = Column(String, unique=True, nullable=False)
    title = Column(String, nullable=True)

    comments = relationship("Comment", back_populates="thread", cascade="all, delete-orphan")


class Comment(Base):
    __tablename__ = "comments"

    id = Column(Integer, primary_key=True)
    thread_id = Column(Integer, ForeignKey("discussion_threads.id"))
    parent_id = Column(Integer, ForeignKey("comments.id"), nullable=True)
    text = Column(String, nullable=False)
    session_id = Column(String, index=True)
    # created_at = Column(DateTime, default=datetime.utcnow)

    agree_count = Column(Integer, default=0)
    disagree_count = Column(Integer, default=0)

    parent = relationship("Comment", remote_side=[id], back_populates="replies")
    replies = relationship("Comment", back_populates="parent", cascade="all, delete-orphan")

    thread = relationship("DiscussionThread", back_populates="comments")

    edited = Column(Boolean, default=False)
    updated_at = Column(DateTime, nullable=True)

    name = Column(String, nullable=True)
    is_anonymous = Column(Boolean, default=False)

    homework_participant_id = Column(
        Integer,
        ForeignKey("homework_participants.id"),
        nullable=True
    )

class CommentReaction(Base):
    __tablename__ = "comment_reactions"
    id = Column(Integer, primary_key=True)
    comment_id = Column(Integer, ForeignKey("comments.id"))
    session_id = Column(String, index=True)
    reaction = Column(String)  # "agree" or "disagree"

    __table_args__ = (
        UniqueConstraint("comment_id", "session_id", name="one_reaction_per_comment_per_session"),
    )
