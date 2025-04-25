from sqlalchemy.orm import Session
from app.models.models import Scenario

def get_or_create_scenario(db: Session, scenario_name: str) -> Scenario:
    scenario = db.query(Scenario).filter_by(name=scenario_name).first()
    if not scenario:
        scenario = Scenario(name=scenario_name)
        db.add(scenario)
        db.commit()
        db.refresh(scenario)
    return scenario