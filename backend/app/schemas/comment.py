from typing import List, Optional
from pydantic import BaseModel
from datetime import datetime

class CommentIn(BaseModel):
    text: str
    session_id: str
    name: Optional[str] = None
    is_anonymous: bool = False

class CommentOut(BaseModel):
    id: int
    text: str
    name: Optional[str]
    is_anonymous: bool
    created_at: datetime
    edited: bool = False
    updated_at: Optional[datetime] = None
    parent_id: Optional[int] = None
    agree_count: int
    disagree_count: int
    user_reaction: Optional[str] = None
    replies: List["CommentOut"] = []

    model_config = {
        "from_attributes": True
    }
CommentOut.update_forward_refs()

class ReactionIn(BaseModel):
    session_id: str

