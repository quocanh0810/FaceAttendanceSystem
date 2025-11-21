from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.models.base import SessionLocal
from app.schemas.class_schema import ClassCreate, ClassRead
from app.services.class_service import create_class, get_classes

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/", response_model=ClassRead)
def create_class_endpoint(data: ClassCreate, db: Session = Depends(get_db)):
    try:
        return create_class(db, data)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/", response_model=list[ClassRead])
def list_classes(db: Session = Depends(get_db)):
    return get_classes(db)