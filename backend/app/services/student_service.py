from sqlalchemy.orm import Session
from typing import List
from app.models.student_model import Student
from app.schemas.student_schema import StudentCreate, StudentRead

import json
from typing import List, Optional


def get_student_by_id(db: Session, student_id: int) -> Optional[Student]:
    return db.query(Student).filter(Student.id == student_id).first()


def save_face_embedding(db: Session, student_id: int, embedding) -> Student:
    """
    Lưu embedding (numpy array) vào Student.face_embedding (JSON string)
    và set face_registered = True.
    """
    student = get_student_by_id(db, student_id)
    if not student:
        raise ValueError("Student not found")

    if embedding is None:
        raise ValueError("No face detected in image")

    emb_list = embedding.tolist()
    student.face_embedding = json.dumps(emb_list)
    student.face_registered = True

    db.add(student)
    db.commit()
    db.refresh(student)
    return student


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