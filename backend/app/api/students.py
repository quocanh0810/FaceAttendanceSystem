from fastapi import APIRouter, Depends, HTTPException, status , File, UploadFile
from sqlalchemy.orm import Session
from typing import List
import numpy as np
import cv2

from app.face_engine.embedder import get_face_embedding
from app.services.student_service import (
    get_students,
    create_student,
    save_face_embedding,
    get_student_by_id,
)

from app.models.base import SessionLocal
from app.schemas.student_schema import StudentCreate, StudentRead

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
    

@router.post("/{student_id}/enroll-face", response_model=StudentRead)
async def enroll_student_face(
    student_id: int,
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
):
    # Kiểm tra student tồn tại chưa
    student = get_student_by_id(db, student_id)
    if not student:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Student not found",
        )

    # Đọc bytes ảnh
    image_bytes = await file.read()
    nparr = np.frombuffer(image_bytes, np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

    if img is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot decode image",
        )

    # Lấy embedding khuôn mặt
    emb = get_face_embedding(img)
    if emb is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No face detected in image",
        )

    # Lưu embedding vào DB
    try:
        updated_student = save_face_embedding(db, student_id, emb)
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        )

    return updated_student