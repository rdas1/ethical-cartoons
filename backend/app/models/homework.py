# app/models/homework.py

from sqlalchemy import JSON, Column, Integer, String, ForeignKey, Boolean, DateTime, UniqueConstraint
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
from app.models.models import Base

class AdminUser(Base):
    __tablename__ = "admin_users"
    id = Column(Integer, primary_key=True)
    email = Column(String, unique=True, nullable=False)
    name = Column(String, nullable=True)
    verified = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    homework_assignments = relationship("HomeworkAssignment", back_populates="admin_user")

class Student(Base):
    __tablename__ = "students"
    id = Column(Integer, primary_key=True)
    email = Column(String, unique=True, nullable=False)
    name = Column(String, nullable=True)  # Optional name field

    homework_participations = relationship("HomeworkParticipant", back_populates="student")

class HomeworkParticipant(Base):
    __tablename__ = "homework_participants"
    id = Column(Integer, primary_key=True)
    homework_id = Column(Integer, ForeignKey("homework_assignments.id"), nullable=False)
    student_id = Column(Integer, ForeignKey("students.id"), nullable=False)
    verified = Column(Boolean, default=False)

    homework = relationship("HomeworkAssignment", back_populates="participants")
    student = relationship("Student", back_populates="homework_participations")

    __table_args__ = (
        UniqueConstraint('homework_id', 'student_id', name='one_participation_per_student_per_homework'),
    )

class HomeworkAssignment(Base):
    __tablename__ = "homework_assignments"
    id = Column(Integer, primary_key=True)
    slug = Column(String, unique=True, nullable=False)
    title = Column(String, nullable=False)
    module_id = Column(Integer, ForeignKey("modules.id"), nullable=False)
    admin_id = Column(Integer, ForeignKey("admin_users.id"), nullable=False)
    allowed_domains = Column(JSON, nullable=True)
    created_at = Column(DateTime, default=datetime.now(timezone.utc))

    admin_user = relationship("AdminUser", back_populates="homework_assignments")
    participants = relationship("HomeworkParticipant", back_populates="homework", cascade="all, delete-orphan")