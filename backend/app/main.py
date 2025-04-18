from fastapi import FastAPI, HTTPException, Path
from pydantic import BaseModel
from sqlalchemy import create_engine, Column, Integer, String, Enum, UniqueConstraint, ForeignKey
from sqlalchemy.orm import sessionmaker, relationship, declarative_base, joinedload
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional
import enum

# SQLite setup
engine = create_engine("sqlite:///responses.db")
SessionLocal = sessionmaker(bind=engine)
Base = declarative_base()

class DecisionOption(Base):
    __tablename__ = "decision_options"
    id = Column(Integer, primary_key=True)
    scenario_id = Column(Integer, ForeignKey("scenarios.id"), nullable=False)
    label = Column(String, nullable=False)  # e.g., "pullTheLever"
    description = Column(String, nullable=True)  # optional

    scenario = relationship("Scenario", back_populates="options")

    __table_args__ = (UniqueConstraint("scenario_id", "label", name="unique_option_per_scenario"),)

class Scenario(Base):
    __tablename__ = "scenarios"
    id = Column(Integer, primary_key=True)
    name = Column(String, unique=True, nullable=False)
    module_id = Column(Integer, ForeignKey("modules.id"))

    module = relationship("Module", back_populates="scenarios")
    responses = relationship("Response", back_populates="scenario")
    options = relationship("DecisionOption", back_populates="scenario", cascade="all, delete-orphan")

class Response(Base):
    __tablename__ = "responses"
    id = Column(Integer, primary_key=True)
    scenario_id = Column(Integer, ForeignKey("scenarios.id"))
    option_id = Column(Integer, ForeignKey("decision_options.id"))
    session_id = Column(String, index=True)

    scenario = relationship("Scenario", back_populates="responses")
    option = relationship("DecisionOption")

    __table_args__ = (
        UniqueConstraint("scenario_id", "session_id", name="unique_response_per_session"),
    )


class Module(Base):
    __tablename__ = "modules"
    id = Column(Integer, primary_key=True)
    name = Column(String, unique=True, nullable=False)

    scenarios = relationship("Scenario", back_populates="module")


Base.metadata.create_all(bind=engine)
def seed_data():
    db = SessionLocal()

    # Create or get module
    intro = db.query(Module).filter_by(name="IntroModule").first()
    if not intro:
        intro = Module(name="IntroModule")
        db.add(intro)
        db.commit()
        db.refresh(intro)

    default_options = {
        "trolley": ["pullTheLever", "doNothing"],
        "transplant": ["sacrifice", "spare"]
    }

    for scenario_name, options in default_options.items():
        scenario = db.query(Scenario).filter_by(name=scenario_name).first()
        if not scenario:
            scenario = Scenario(name=scenario_name, module=intro)
            db.add(scenario)
            db.commit()
            db.refresh(scenario)
        if scenario:
            for label in options:
                existing = db.query(DecisionOption).filter_by(scenario_id=scenario.id, label=label).first()
                if not existing:
                    db.add(DecisionOption(scenario=scenario, label=label))


    db.commit()
    db.close()

seed_data()


# Pydantic model
class ResponseIn(BaseModel):
    scenario: str
    decision: str
    session_id: str

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # or ["*"] for dev
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_scenario_by_name(db, name: str) -> Scenario:
    scenario = db.query(Scenario).filter_by(name=name).first()
    if not scenario:
        raise HTTPException(status_code=404, detail=f"Scenario '{name}' not found")
    return scenario

@app.post("/submit/")
def submit_response(response: ResponseIn):
    db = SessionLocal()

    scenario_obj = get_scenario_by_name(db, response.scenario)

    option = db.query(DecisionOption).filter_by(
        scenario_id=scenario_obj.id, label=response.decision
    ).first()
    if not option:
        db.close()
        raise HTTPException(
            status_code=400,
            detail=f"Invalid decision '{response.decision}' for scenario '{response.scenario}'"
        )

    existing = db.query(Response).filter(
        Response.scenario == scenario_obj,
        Response.session_id == response.session_id
    ).first()

    if existing:
        existing.option = option
    else:
        existing = Response(
            scenario=scenario_obj,
            option=option,
            session_id=response.session_id
        )
        db.add(existing)

    db.commit()
    db.refresh(existing)
    db.close()
    return {"message": "Response recorded"}


@app.get("/stats/{scenario_name}")
def get_stats(scenario_name: str):
    db = SessionLocal()
    scenario = get_scenario_by_name(db, scenario_name)

    option_counts = {
        opt.label: db.query(Response).filter(Response.option_id == opt.id).count()
        for opt in scenario.options
    }

    total = sum(option_counts.values())

    if total == 0:
        return {label: {"percent": 0.0, "count": 0} for label in option_counts} | {"total": 0}

    stats = {
        label: {
            "percent": round(100 * count / total, 1),
            "count": count
        }
        for label, count in option_counts.items()
    }
    stats["total"] = total
    return stats



@app.delete("/response/{response_id}")
def delete_response(response_id: int = Path(...)):
    db = SessionLocal()
    response = db.query(Response).filter(Response.id == response_id).first()
    if not response:
        db.close()
        raise HTTPException(status_code=404, detail="Response not found")
    db.delete(response)
    db.commit()
    db.close()
    return {"message": f"Response {response_id} deleted."}

@app.post("/reset/")
def reset_database():
    db = SessionLocal()
    db.query(Response).delete()
    db.commit()
    db.close()
    return {"message": "All responses deleted."}

@app.get("/last_decision/")
def get_last_decision(scenario_name: str, session_id: str):
    db = SessionLocal()
    scenario = get_scenario_by_name(db, scenario_name)

    response = (
        db.query(Response)
        .options(joinedload(Response.option))  # ✅ Eager-load the `option` relationship
        .filter(Response.scenario == scenario, Response.session_id == session_id)
        .order_by(Response.id.desc())
        .first()
    )

    result = {"decision": response.option.label} if response else {"decision": None}
    db.close()
    return result

@app.get("/module_responses/{module_name}")
def get_module_responses(module_name: str, session_id: str):
    db = SessionLocal()
    module = db.query(Module).filter_by(name=module_name).first()
    if not module:
        db.close()
        raise HTTPException(status_code=404, detail=f"Module '{module_name}' not found")

    responses = (
        db.query(Response)
        .join(Scenario)
        .filter(Response.session_id == session_id)
        .filter(Scenario.module_id == module.id)
        .all()
    )

    results = {
        r.scenario.name: r.option.label
        for r in responses
    }

    db.close()
    return {
        "module": module_name,
        "responses": results
    }

