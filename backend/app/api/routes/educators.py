from fastapi import APIRouter, Depends, HTTPException, Path, Request
from sqlalchemy.orm import Session
from pydantic import BaseModel, EmailStr
from app.db.db import get_db
from app.models.homework import AdminUser, HomeworkAssignment, HomeworkParticipant
from app.utils.security import get_current_admin_user, serializer
from app.utils.email import send_email
from app.utils.constants import FRONTEND_BASE_URL
from app.models.models import Module, Response, Scenario

router = APIRouter()

# FRONTEND_BASE_URL = "http://localhost:5173/ethical-cartoons"  # TODO: Adjust for production

class RequestAdminLoginPayload(BaseModel):
    email: EmailStr

class VerifyAdminTokenPayload(BaseModel):
    token: str

@router.post("/request_login")
def request_admin_login(payload: RequestAdminLoginPayload, db: Session = Depends(get_db)):
    email = payload.email.lower()

    # Find or create admin user
    admin = db.query(AdminUser).filter_by(email=email).first()
    if not admin:
        admin = AdminUser(email=email)
        db.add(admin)
        db.commit()
        db.refresh(admin)

    token = serializer.dumps(email)
    magic_link = f"{FRONTEND_BASE_URL}/#/educators/verify?token={token}"  # <-- adjust for prod

    send_email(
        to_email=email,
        subject="Your Educator Login Link",
        html_content=f"Click here to access your dashboard: <a href='{magic_link}'>Access Dashboard</a>"
    )

    return {"message": "Magic login link sent"}

@router.post("/verify_login")
def verify_admin_login(payload: VerifyAdminTokenPayload, db: Session = Depends(get_db)):
    try:
        email = serializer.loads(payload.token)  # 1 hour validity
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid or expired token")

    admin = db.query(AdminUser).filter_by(email=email).first()
    if not admin:
        raise HTTPException(status_code=404, detail="Admin user not found")

    admin.verified = True
    db.commit()

    return {
        "id": admin.id,
        "email": admin.email,
        "name": admin.name,
    }

@router.get("/homeworks")
def list_homeworks(
    request: Request,  # ✅ inject Request
    db: Session = Depends(get_db)
):
    # ✅ Get the Authorization token from the header
    auth_header = request.headers.get("Authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing or invalid token")
    token = auth_header.split("Bearer ")[-1]

    # ✅ Decode educator token
    try:
        email = serializer.loads(token)
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid or expired token")

    admin = db.query(AdminUser).filter_by(email=email).first()
    if not admin or not admin.verified:
        raise HTTPException(status_code=403, detail="Educator not verified")

    # ✅ Fetch homeworks
    homeworks = db.query(HomeworkAssignment).filter_by(admin_id=admin.id).order_by(HomeworkAssignment.created_at.desc()).all()
    modules = db.query(Module).filter(HomeworkAssignment.module_id.in_([hw.module_id for hw in homeworks])).all()
    module_names = {module.id: module.name for module in modules}
    module_names["Unknown"] = "Unknown Module"  # Fallback for unknown module IDs

    return {
        "homeworks": [
            {
                "slug": hw.slug,
                "title": hw.title,
                "module_name": module_names.get(hw.module_id, "Unknown"),
                "created_at": hw.created_at.isoformat(),
            }
            for hw in homeworks
        ]
    }

@router.get("/homework/{slug}/details")
def get_homework_details(
    slug: str = Path(...),
    db: Session = Depends(get_db),
    request: Request = None,
):
    # ✅ Authenticate educator
    admin_user = get_current_admin_user(request, db)

    # ✅ Find the homework assignment
    homework = db.query(HomeworkAssignment).filter_by(slug=slug).first()
    if not homework:
        raise HTTPException(status_code=404, detail="Homework assignment not found")
    
    # ✅ Authorization check: must be the same admin
    if homework.admin_id != admin_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to access this homework")

    module = db.query(Module).filter_by(id=homework.module_id).first()
    if not module:
        module = None

    # ✅ Fetch participants
    participants = db.query(HomeworkParticipant).filter_by(homework_id=homework.id).all()

    # ✅ Prepare response
    return {
        "slug": homework.slug,
        "title": homework.title,
        "module_name": module.name if module else "Unknown Module",
        "allowed_domains": homework.allowed_domains,
        "created_at": homework.created_at.isoformat(),
        "participants": [
            {
                "email": p.student.email,
                "name": p.student.name,
                "verified": p.verified
            }
            for p in participants
            if p.student  # safety check
        ]
    }

@router.get("/homework/{slug}/stats")
def get_homework_stats(
    slug: str = Path(...),
    db: Session = Depends(get_db),
    request: Request = None,
):
    # ✅ Authenticate educator
    admin_user = get_current_admin_user(request, db)

    # ✅ Find the homework assignment
    homework = db.query(HomeworkAssignment).filter_by(slug=slug).first()
    if not homework:
        raise HTTPException(status_code=404, detail="Homework assignment not found")
    
    # ✅ Authorization check
    if homework.admin_id != admin_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to access this homework")

    # ✅ Get all verified participants' student_ids
    participant_student_ids = [
        p.student_id for p in homework.participants if p.verified and p.student_id is not None
    ]

    if not participant_student_ids:
        return {"scenarios": {}}

    # ✅ Find scenarios under the same module
    scenarios = db.query(Scenario).filter_by(module_id=homework.module_id).all()

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
    