from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session
from pydantic import BaseModel, EmailStr
from app.db.db import get_db
from app.models.homework import AdminUser, HomeworkAssignment
from app.utils.security import serializer
from app.utils.email import send_email
from app.utils.constants import FRONTEND_BASE_URL
from app.models.models import Module

router = APIRouter()

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