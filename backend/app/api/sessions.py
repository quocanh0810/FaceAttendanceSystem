from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.models.base import SessionLocal
from app.schemas.session_schema import SessionCreate, SessionRead
from app.services.session_service import create_session, get_sessions

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/", response_model=SessionRead)
def create_session_endpoint(data: SessionCreate, db: Session = Depends(get_db)):
    return create_session(db, data)

@router.get("/", response_model=list[SessionRead])
def list_sessions(db: Session = Depends(get_db)):
    return get_sessions(db)