from itsdangerous import URLSafeTimedSerializer
import os
from fastapi import Request, HTTPException, Depends
from app.models.homework import AdminUser
from sqlalchemy.orm import Session


# Load SECRET_KEY securely
SECRET_KEY = os.environ.get("SECRET_KEY", "development-only-secret-key")
serializer = URLSafeTimedSerializer(SECRET_KEY)

def get_current_admin_user(request: Request, db: Session) -> AdminUser:
    auth_header = request.headers.get("Authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing or invalid token")
    token = auth_header.split("Bearer ")[-1]

    try:
        email = serializer.loads(token)
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid or expired token")

    admin = db.query(AdminUser).filter_by(email=email).first()
    if not admin or not admin.verified:
        raise HTTPException(status_code=403, detail="Educator not verified")

    return admin

def generate_homework_link(email: str, slug: str, base_url: str) -> str:
    """
    Generate a secure homework access link for a student.
    
    Args:
        email (str): Student's email address.
        slug (str): Homework assignment slug.
        base_url (str): Base URL of the frontend site, e.g., "https://ethical-playground.org"
        
    Returns:
        str: Fully formed URL with token
    """
    token = serializer.dumps(email)  # Securely sign the email
    link = f"{base_url}/homework/{slug}?token={token}"
    return link
