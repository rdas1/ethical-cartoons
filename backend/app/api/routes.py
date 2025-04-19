from fastapi import APIRouter, HTTPException, Path
from pydantic import BaseModel
from sqlalchemy.orm import joinedload
from app.db.db import SessionLocal
from app.models.models import Scenario, DecisionOption, Response, Module

router = APIRouter()

class ResponseIn(BaseModel):
    scenario: str
    decision: str
    session_id: str

def get_scenario_by_name(db, name: str) -> Scenario:
    scenario = db.query(Scenario).filter_by(name=name).first()
    if not scenario:
        raise HTTPException(status_code=404, detail=f"Scenario '{name}' not found")
    return scenario

@router.post("/submit/")
def submit_response(response: ResponseIn):
    db = SessionLocal()
    scenario_obj = get_scenario_by_name(db, response.scenario)
    option = db.query(DecisionOption).filter_by(scenario_id=scenario_obj.id, label=response.decision).first()
    if not option:
        db.close()
        raise HTTPException(status_code=400, detail="Invalid decision")

    existing = db.query(Response).filter(Response.scenario == scenario_obj, Response.session_id == response.session_id).first()
    if existing:
        existing.option = option
    else:
        existing = Response(scenario=scenario_obj, option=option, session_id=response.session_id)
        db.add(existing)

    db.commit()
    db.refresh(existing)
    db.close()
    return {"message": "Response recorded"}

@router.get("/stats/{scenario_name}")
def get_stats(scenario_name: str):
    db = SessionLocal()
    scenario = get_scenario_by_name(db, scenario_name)
    option_counts = {opt.label: db.query(Response).filter(Response.option_id == opt.id).count() for opt in scenario.options}
    total = sum(option_counts.values())
    stats = {label: {"percent": round(100 * count / total, 1), "count": count} for label, count in option_counts.items()} if total else {label: {"percent": 0.0, "count": 0} for label in option_counts}
    stats["total"] = total
    db.close()
    return stats

@router.delete("/response/{response_id}")
def delete_response(response_id: int = Path(...)):
    db = SessionLocal()
    response = db.query(Response).filter(Response.id == response_id).first()
    if not response:
        db.close()
        raise HTTPException(status_code=404, detail="Not found")
    db.delete(response)
    db.commit()
    db.close()
    return {"message": f"Response {response_id} deleted."}

@router.post("/reset/")
def reset_database():
    db = SessionLocal()
    db.query(Response).delete()
    db.commit()
    db.close()
    return {"message": "All responses deleted."}

@router.get("/last_decision/")
def get_last_decision(scenario_name: str, session_id: str):
    db = SessionLocal()
    scenario = get_scenario_by_name(db, scenario_name)
    response = db.query(Response).options(joinedload(Response.option)).filter(Response.scenario == scenario, Response.session_id == session_id).order_by(Response.id.desc()).first()
    db.close()
    return {"decision": response.option.label} if response else {"decision": None}

@router.get("/module_responses/{module_name}")
def get_module_responses(module_name: str, session_id: str):
    db = SessionLocal()
    module = db.query(Module).filter_by(name=module_name).first()
    if not module:
        db.close()
        raise HTTPException(status_code=404, detail="Module not found")
    responses = db.query(Response).join(Scenario).filter(Response.session_id == session_id, Scenario.module_id == module.id).all()
    result = {r.scenario.name: r.option.label for r in responses}
    db.close()
    return {"module": module_name, "responses": result}
