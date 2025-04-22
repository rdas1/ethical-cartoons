from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.db import get_db
from app.models.models import Comment
from app.schemas.comment import CommentCreate, CommentOut

router = APIRouter()

@router.post("/comments/", response_model=CommentOut)
def create_comment(comment: CommentCreate, db: Session = Depends(get_db)):
    db_comment = Comment(**comment.dict())
    db.add(db_comment)
    db.commit()
    db.refresh(db_comment)
    return db_comment

@router.get("/comments/", response_model=list[CommentOut])
def list_comments(module: str, discussion_topic: str, db: Session = Depends(get_db)):
    return db.query(Comment).filter_by(
        module=module,
        discussion_topic=discussion_topic
    ).order_by(Comment.timestamp.desc()).all()
