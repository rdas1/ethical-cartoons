from pydantic import BaseModel
from datetime import datetime

class CommentCreate(BaseModel):
    module: str
    discussion_topic: str
    text: str

class CommentOut(BaseModel):
    id: int
    module: str
    discussion_topic: str
    text: str
    timestamp: datetime

    class Config:
        orm_mode = True
