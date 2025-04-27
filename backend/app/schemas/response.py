from pydantic import BaseModel
from typing import Optional

class ResponseIn(BaseModel):
    scenario: str
    decision: str
    session_id: str
    homework_participant_id: Optional[int] = None

class ResponseOut(BaseModel):
    message: str
