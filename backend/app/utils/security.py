from itsdangerous import URLSafeTimedSerializer
import os
from fastapi import Depends


# Load SECRET_KEY securely
SECRET_KEY = os.environ.get("SECRET_KEY", "development-only-secret-key")
serializer = URLSafeTimedSerializer(SECRET_KEY)

# TEMP: Mock current admin user
def get_current_admin_user():
    # Replace this later with real auth (e.g., OAuth, sessions, etc.)
    class DummyAdmin:
        id = 1  # Fake admin ID
    return DummyAdmin()


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
