from fastapi import APIRouter
from app.api.routes import comments, responses, admin

router = APIRouter()

router.include_router(comments.router, prefix="/comments", tags=["comments"])
router.include_router(responses.router, tags=["responses"])  # no prefix; routes already prefixed
router.include_router(admin.router, prefix="/admin", tags=["admin"])

