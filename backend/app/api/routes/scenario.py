from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from db.db import get_db
from models import Scenario, Module
from schemas.scenario import ScenarioCreate
from app.models import DecisionOption

router = APIRouter()

@router.post("/admin/scenarios/", response_model=dict)
def create_scenario(scenario: ScenarioCreate, db: Session = Depends(get_db)):
    existing = db.query(Scenario).filter(Scenario.name == scenario.name).first()
    if existing:
        raise HTTPException(status_code=400, detail="Scenario with that name already exists")

    module = db.query(Module).filter(Module.id == scenario.module_id).first()
    if not module:
        raise HTTPException(status_code=400, detail="Module not found")

    new_scenario = Scenario(
        name=scenario.name,
        module_id=scenario.module_id,
        question_text=scenario.question_text,
        post_response_text=scenario.post_response_text,
    )
    db.add(new_scenario)
    db.flush()  # <-- Important: get new_scenario.id without committing yet

    # Now create the DecisionOptions
    for opt in scenario.options:
        new_option = DecisionOption(
            scenario_id=new_scenario.id,
            label=opt.label,
            description=opt.description,
        )
        db.add(new_option)

    db.commit()
    db.refresh(new_scenario)

    return {"id": new_scenario.id}
