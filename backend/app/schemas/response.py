from pydantic import BaseModel

class ResponseIn(BaseModel):
    scenario: str
    decision: str
    session_id: str

class ResponseOut(BaseModel):
    message: str
