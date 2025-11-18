from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.models.base import SessionLocal
from app.schemas.student_schema import StudentCreate, StudentRead
from app.services.student_service import get_students, create_student

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.get("/", response_model=List[StudentRead])
def list_students(db: Session = Depends(get_db)):
    return get_students(db)


@router.post(
    "/",
    response_model=StudentRead,
    status_code=status.HTTP_201_CREATED,
)
def create_student_endpoint(data: StudentCreate, db: Session = Depends(get_db)):
    try:
        student = create_student(db, data)
        return student
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        )