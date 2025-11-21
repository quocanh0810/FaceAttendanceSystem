from sqlalchemy.orm import Session
from app.models.class_model import Class
from app.schemas.class_schema import ClassCreate

def create_class(db: Session, data: ClassCreate):
    existing = db.query(Class).filter(Class.class_code == data.class_code).first()
    if existing:
        raise ValueError("Class code already exists")

    c = Class(
        class_code=data.class_code,
        class_name=data.class_name
    )
    db.add(c)
    db.commit()
    db.refresh(c)
    return c

def get_classes(db: Session):
    return db.query(Class).all()