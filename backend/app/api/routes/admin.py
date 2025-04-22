from fastapi import APIRouter, HTTPException, Path, Depends
from sqlalchemy.orm import Session
from app.db.db import get_db
from app.models.models import Response

router = APIRouter()

@router.delete("/response/{response_id}")
def delete_response(response_id: int = Path(...), db: Session = Depends(get_db)):
    response = db.query(Response).filter(Response.id == response_id).first()
    if not response:
        raise HTTPException(status_code=404, detail="Not found")
    db.delete(response)
    db.commit()
    return {"message": f"Response {response_id} deleted."}

@router.post("/reset")
def reset_database(db: Session = Depends(get_db)):
    db.query(Response).delete()
    db.commit()
    return {"message": "All responses deleted."}
