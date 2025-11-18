from sqlalchemy.orm import Session
from typing import List
from app.models.student_model import Student
from app.schemas.student_schema import StudentCreate, StudentRead


def get_students(db: Session) -> List[Student]:
    return db.query(Student).order_by(Student.created_at.desc()).all()


def create_student(db: Session, data: StudentCreate) -> Student:
    # Check trùng student_code
    existing = db.query(Student).filter(Student.student_code == data.student_code).first()
    if existing:
        raise ValueError("Student code already exists")

    student = Student(
        student_code=data.student_code,
        full_name=data.full_name,
        class_name=data.class_name,
    )
    db.add(student)
    db.commit()
    db.refresh(student)
    return student