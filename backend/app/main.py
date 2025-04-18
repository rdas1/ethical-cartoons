from fastapi import FastAPI, HTTPException, Path
from pydantic import BaseModel
from sqlalchemy import create_engine, Column, Integer, String, Enum
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from fastapi.middleware.cors import CORSMiddleware
import enum

# SQLite setup
engine = create_engine("sqlite:///responses.db")
SessionLocal = sessionmaker(bind=engine)
Base = declarative_base()

# Enum for scenarios
class Scenario(str, enum.Enum):
    trolley = "trolley"
    transplant = "transplant"

# Database model
class Response(Base):
    __tablename__ = "responses"
    id = Column(Integer, primary_key=True, index=True)
    scenario = Column(Enum(Scenario))
    decision = Column(String)

Base.metadata.create_all(bind=engine)

# Pydantic model
class ResponseIn(BaseModel):
    scenario: Scenario
    decision: str

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # or ["*"] for dev
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/submit/")
def submit_response(response: ResponseIn):
    db = SessionLocal()
    db_response = Response(scenario=response.scenario, decision=response.decision)
    db.add(db_response)
    db.commit()
    db.refresh(db_response)
    db.close()
    return {"message": "Response recorded", "id": db_response.id}

@app.get("/stats/{scenario}")
def get_stats(scenario: Scenario):
    db = SessionLocal()
    total = db.query(Response).filter(Response.scenario == scenario).count()
    sacrifice_count = db.query(Response).filter(Response.scenario == scenario, Response.decision == "sacrifice").count()
    spare_count = db.query(Response).filter(Response.scenario == scenario, Response.decision == "spare").count()
    db.close()
    if total == 0:
        return {
            "sacrifice": {"percent": 0.0, "count": 0},
            "spare": {"percent": 0.0, "count": 0},
            "total": 0
        }
    return {
        "sacrifice": {
            "percent": round(100 * sacrifice_count / total, 1),
            "count": sacrifice_count
        },
        "spare": {
            "percent": round(100 * spare_count / total, 1),
            "count": spare_count
        },
        "total": total
    }

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