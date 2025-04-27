from fastapi import APIRouter
from app.api.routes import comments, responses, admin, homework, educators

router = APIRouter()

router.include_router(comments.router, prefix="/comments", tags=["comments"])
router.include_router(responses.router, tags=["responses"])  # no prefix; routes already prefixed
router.include_router(admin.router, prefix="/admin", tags=["admin"])
router.include_router(homework.router, prefix="/homework", tags=["homework"])
router.include_router(educators.router, prefix="/educators", tags=["educators"])

