import os
from typing import List, Optional, Dict
from fastapi import APIRouter, HTTPException, Depends, Path, Body, Request
from sqlalchemy.orm import Session
from app.db.db import get_db
from app.models.models import Module, Response
from app.models.homework import HomeworkAssignment, HomeworkParticipant, Student
from app.utils.security import serializer, get_current_admin_user
from itsdangerous import BadSignature, SignatureExpired
from pydantic import BaseModel, EmailStr
from app.utils.email import send_verification_email
from app.utils.constants import FRONTEND_BASE_URL

router = APIRouter()

class CreateHomeworkPayload(BaseModel):
    slug: str
    title: str
    module_name: str
    allowed_domains: Optional[List[str]] = None

class VerifyHomeworkPayload(BaseModel):
    email: EmailStr
    name: str = None  # Optional, but encouraged

class UpdateHomeworkPayload(BaseModel):
    title: Optional[str] = None
    module_name: Optional[str] = None
    allowed_domains: Optional[List[str]] = None

class RequestVerificationPayload(BaseModel):
    email: EmailStr

class VerifyTokenPayload(BaseModel):
    token: str


@router.post("/create")
def create_homework(
    *,
    request: Request,
    payload: CreateHomeworkPayload,
    db: Session = Depends(get_db)
):
    # ✅ Use the real educator authentication
    admin_user = get_current_admin_user(request, db)

    # Validate Module exists
    module = db.query(Module).filter_by(name=payload.module_name).first()
    if not module:
        raise HTTPException(status_code=400, detail=f"Module '{payload.module_name}' not found")

    # Check if HomeworkAssignment already exists
    existing = db.query(HomeworkAssignment).filter_by(slug=payload.slug).first()
    if existing:
        raise HTTPException(status_code=400, detail=f"Homework with slug '{payload.slug}' already exists")

    # Create HomeworkAssignment
    homework = HomeworkAssignment(
        slug=payload.slug,
        title=payload.title,
        module_id=module.id,
        allowed_domains=payload.allowed_domains or [],
        admin_id=admin_user.id  # ✅ ← THIS!
    )
    db.add(homework)
    db.commit()

    return {"message": "Homework created successfully", "slug": homework.slug}


@router.get("/{slug}")
def get_homework(
    slug: str = Path(...),
    db: Session = Depends(get_db),
):
    homework = db.query(HomeworkAssignment).filter_by(slug=slug).first()
    if not homework:
        raise HTTPException(status_code=404, detail="Homework not found")
    module_id = homework.module_id
    module = db.query(Module).filter_by(id=module_id).first()
    return {
        "slug": homework.slug,
        "title": homework.title,
        "module_name": module.name,
        "allowed_domains": homework.allowed_domains,
    }

@router.put("/{slug}")
def update_homework(
    slug: str = Path(...),
    payload: UpdateHomeworkPayload = None,
    db: Session = Depends(get_db),
):
    homework = db.query(HomeworkAssignment).filter_by(slug=slug).first()
    if not homework:
        raise HTTPException(status_code=404, detail="Homework not found")

    # Update fields if provided
    if payload.title:
        homework.title = payload.title
    if payload.module_name:
        module = db.query(Module).filter_by(name=payload.module_name).first()
        if not module:
            raise HTTPException(status_code=400, detail=f"Module '{payload.module_name}' not found")
        homework.module_id = module.id
    if payload.allowed_domains is not None:
        homework.allowed_domains = payload.allowed_domains

    db.commit()

    return {"message": "Homework updated successfully"}


@router.delete("/{slug}")
def delete_homework(
    slug: str = Path(...),
    db: Session = Depends(get_db),
):
    homework = db.query(HomeworkAssignment).filter_by(slug=slug).first()
    if not homework:
        raise HTTPException(status_code=404, detail="Homework not found")

    db.delete(homework)
    db.commit()

    return {"message": "Homework deleted successfully"}

@router.post("/{slug}/verify_token")
def verify_homework_token(
    slug: str = Path(...),
    payload: VerifyTokenPayload = None,
    db: Session = Depends(get_db),
):
    if not payload or not payload.token:
        raise HTTPException(status_code=400, detail="Missing token")

    # Decode token
    try:
        email = serializer.loads(payload.token, max_age=604800)  # 7 days
    except SignatureExpired:
        raise HTTPException(status_code=400, detail="Token expired")
    except BadSignature:
        raise HTTPException(status_code=400, detail="Invalid token")

    # Find the homework
    homework = db.query(HomeworkAssignment).filter_by(slug=slug).first()
    if not homework:
        raise HTTPException(status_code=404, detail="Homework not found")

    # Validate domain if necessary
    if homework.allowed_domains:
        domain = email.split('@')[-1]
        if domain not in homework.allowed_domains:
            raise HTTPException(status_code=403, detail="Email domain not allowed")

    # Find or create the Student
    student = db.query(Student).filter_by(email=email).first()
    if not student:
        student = Student(email=email)
        db.add(student)
        db.commit()
        db.refresh(student)

    # Find or create HomeworkParticipant
    participant = db.query(HomeworkParticipant).filter_by(
        homework_id=homework.id,
        student_id=student.id
    ).first()

    if not participant:
        participant = HomeworkParticipant(
            homework_id=homework.id,
            student_id=student.id,
            verified=True
        )
        db.add(participant)
    else:
        participant.verified = True

    db.commit()

    module = db.query(Module).filter_by(id=homework.module_id).first()
    if not module:
        raise HTTPException(status_code=404, detail="Module not found")

    return {
        "message": "Access granted",
        "student_id": student.id,
        "email": student.email,
        "name": student.name,
        "module_name": module.name,
    }

@router.post("/{slug}/request_verification_email")
def request_verification_email(
    slug: str = Path(...),
    payload: RequestVerificationPayload = Body(...),
    db: Session = Depends(get_db),
):
    email = payload.email

    # 1. Find homework
    homework = db.query(HomeworkAssignment).filter_by(slug=slug).first()
    if not homework:
        raise HTTPException(status_code=404, detail="Homework not found")

    # 2. Check allowed domain (if any)
    if homework.allowed_domains:
        domain = email.split("@")[-1]
        if domain not in homework.allowed_domains:
            raise HTTPException(status_code=403, detail="Email domain not allowed")

    # 3. Generate token
    token = serializer.dumps(email)

    # 4. Generate magic link
    magic_link = f"{FRONTEND_BASE_URL}/#/homework/{slug}?token={token}"

    # 5. "Send" email (for now, console log it)
    # print(f"[SIMULATED EMAIL TO {email}]")
    # print(f"Subject: Access Your Homework Assignment")
    # print(f"Body: Click the link to start: {magic_link}")

    # 5. Send email!
    send_verification_email(email, magic_link)

    return {"message": "Verification email sent"}

from app.utils.security import get_current_student  # 👈 import at top if you haven't yet

@router.get("/{slug}/participant_stats")
def get_homework_participant_stats(
    slug: str = Path(...),
    db: Session = Depends(get_db),
    request: Request = None,
):
    # ✅ Authenticate student
    student = get_current_student(request, db)

    # ✅ Find the homework assignment
    homework = db.query(HomeworkAssignment).filter_by(slug=slug).first()
    if not homework:
        raise HTTPException(status_code=404, detail="Homework assignment not found")

    # ✅ Check if student is a verified participant in this homework
    participant = db.query(HomeworkParticipant).filter_by(
        homework_id=homework.id,
        student_id=student.id,
        verified=True,
    ).first()

    if not participant:
        raise HTTPException(status_code=403, detail="You are not a participant in this homework")

    # ✅ Get all verified participants' student_ids
    participant_student_ids = [
        p.student_id for p in homework.participants if p.verified and p.student_id is not None
    ]

    if not participant_student_ids:
        return {"scenarios": {}}

    # ✅ Find scenarios under the same module
    scenarios = db.query(Module).filter_by(id=homework.module_id).first().scenarios

    stats = {}

    for scenario in scenarios:
        # Fetch all responses for this scenario by students in this homework
        responses = db.query(Response).filter(
            Response.scenario_id == scenario.id,
            Response.homework_participant_id.in_(
                db.query(HomeworkParticipant.id).filter(
                    HomeworkParticipant.student_id.in_(participant_student_ids),
                    HomeworkParticipant.homework_id == homework.id
                )
            )
        ).all()

        option_counts = {}
        for response in responses:
            label = response.option.label
            option_counts[label] = option_counts.get(label, 0) + 1

        total = sum(option_counts.values())

        if total > 0:
            stats[scenario.name] = {
                "options": {
                    label: {
                        "percent": round(100 * count / total, 1),
                        "count": count,
                    }
                    for label, count in option_counts.items()
                },
                "total_responses": total,
            }
        else:
            stats[scenario.name] = {
                "options": {},
                "total_responses": 0,
            }

    return {"scenarios": stats}
