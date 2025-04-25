from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, selectinload
from app.db.db import get_db
from app.models.models import Comment, CommentReaction, DiscussionThread, Module, Scenario
from app.schemas.comment import CommentIn, CommentOut, ReactionIn
from typing import List

router = APIRouter()

@router.get("/{slug}")
def get_comments(slug: str, db: Session = Depends(get_db)):
    thread = db.query(DiscussionThread).filter_by(slug=slug).first()
    if not thread:
        raise HTTPException(status_code=404, detail="Discussion thread not found")
    comments = db.query(Comment).filter_by(thread_id=thread.id).order_by(Comment.updated_at.desc()).all()
    return {"comments": comments}

@router.post("/{slug}")
def post_comment(slug: str, comment_in: CommentIn, db: Session = Depends(get_db)):
    thread = db.query(DiscussionThread).filter_by(slug=slug).first()
    if not thread:
        raise HTTPException(status_code=404, detail="Discussion thread not found")
    comment = Comment(text=comment_in.text, session_id=comment_in.session_id, name=comment_in.name if not comment_in.is_anonymous else None, is_anonymous=comment_in.is_anonymous, thread_id=thread.id)
    db.add(comment)
    db.commit()
    db.refresh(comment)
    return comment

@router.put("/{slug}/{comment_id}", response_model=CommentOut)
def update_comment(comment_id: int, comment_in: CommentIn, db: Session = Depends(get_db)):
    comment = db.query(Comment).filter_by(id=comment_id).first()
    if not comment:
        raise HTTPException(status_code=404, detail="Comment not found")

    comment.text = comment_in.text
    comment.edited = True
    comment.updated_at = datetime.utcnow()

    db.commit()
    db.refresh(comment)
    return comment

@router.delete("/{slug}/{comment_id}")
def delete_comment(comment_id: int, db: Session = Depends(get_db)):
    comment = db.query(Comment).filter_by(id=comment_id).first()
    if not comment:
        raise HTTPException(status_code=404, detail="Comment not found")

    db.delete(comment)
    db.commit()
    return {"message": "Comment deleted"}


@router.post("/{slug}/reply/{parent_id}", response_model=CommentOut)
def reply_to_comment(slug: str, parent_id: int, comment_in: CommentIn, db: Session = Depends(get_db)):
    thread = db.query(DiscussionThread).filter_by(slug=slug).first()
    if not thread:
        raise HTTPException(status_code=404, detail="Discussion thread not found")
    

    parent = (
        db.query(Comment)
        .options(selectinload(Comment.replies))
        .filter(Comment.id == parent_id)
        .first()
    )
    if not parent:
        raise HTTPException(status_code=404, detail="Parent comment not found")

    reply = Comment(
        text=comment_in.text,
        session_id=comment_in.session_id,
        name=comment_in.name if not comment_in.is_anonymous else None,
        is_anonymous=comment_in.is_anonymous,
        thread_id=thread.id,
        parent_id=parent_id,
    )
    db.add(reply)
    db.commit()
    db.refresh(reply)

    return CommentOut.from_orm(reply)

@router.post("/{slug}/react/{comment_id}/{reaction}")
def react_to_comment(slug: str, comment_id: int, reaction: str, data: ReactionIn, db: Session = Depends(get_db)):
    comment = db.query(Comment).filter_by(id=comment_id).first()
    if not comment:
        raise HTTPException(status_code=404, detail="Comment not found")
    session_id = data.session_id

    # Prevent duplicate reactions
    existing = db.query(CommentReaction).filter_by(comment_id=comment_id, session_id=session_id).first()
    if existing:
        return {"message": "Already reacted"}

    # Add reaction
    if reaction == "agree":
        comment.agree_count += 1
    elif reaction == "disagree":
        comment.disagree_count += 1
    else:
        raise HTTPException(status_code=400, detail="Invalid reaction")

    db.add(CommentReaction(comment_id=comment_id, session_id=session_id, reaction=reaction))
    db.commit()
    return {"message": f"{reaction.capitalize()} recorded"}