from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.models.base import SessionLocal
from app.schemas.attendance_schema import AttendanceCreate, AttendanceRead
from app.services.attendance_service import mark_attendance, get_attendance

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/", response_model=AttendanceRead)
def mark_attendance_endpoint(data: AttendanceCreate, db: Session = Depends(get_db)):
    return mark_attendance(db, data)

@router.get("/", response_model=list[AttendanceRead])
def list_attendance(db: Session = Depends(get_db)):
    return get_attendance(db)