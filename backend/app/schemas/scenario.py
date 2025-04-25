# schemas/scenario.py
from pydantic import BaseModel
from typing import Optional, List, Literal

class DecisionOptionCreate(BaseModel):
    label: str
    description: Optional[str] = None

class ScenarioCreate(BaseModel):
    name: str
    module_id: int
    scenario_type: Literal['trolley', 'transplant', 'question']
    question_text: Optional[str] = None
    post_response_text: Optional[str] = None
    top_track_label: Optional[str] = None
    bottom_track_label: Optional[str] = None
    options: List[DecisionOptionCreate]  # <-- NEW
