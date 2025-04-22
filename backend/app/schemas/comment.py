from typing import List, Optional
from pydantic import BaseModel
from datetime import datetime

class CommentIn(BaseModel):
    text: str
    session_id: str
    user_name: Optional[str] = None
    is_anonymous: bool = True

class CommentOut(BaseModel):
    id: int
    text: str
    parent_id: Optional[int]
    session_id: str
    created_at: datetime
    agree_count: int
    disagree_count: int
    replies: List["CommentOut"] = []  # Ensure it's a list

    model_config = {
        "from_attributes": True
    }
CommentOut.update_forward_refs()

class ReactionIn(BaseModel):
    session_id: str

