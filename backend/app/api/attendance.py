# app/api/attendance.py
from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    status,
    UploadFile,
    File,
    Form,
)
from sqlalchemy.orm import Session
import numpy as np
import cv2
import json

from app.models.base import SessionLocal
from app.models.student_model import Student
from app.schemas.attendance_schema import AttendanceCreate, AttendanceRead
from app.services.attendance_service import mark_attendance, get_attendance
from app.face_engine.embedder import get_face_embedding
from app.face_engine.matcher import find_best_match

router = APIRouter()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.post("/", response_model=AttendanceRead)
def mark_attendance_endpoint(
    data: AttendanceCreate,
    db: Session = Depends(get_db),
):
    return mark_attendance(db, data)


@router.get("/", response_model=list[AttendanceRead])
def list_attendance(db: Session = Depends(get_db)):
    return get_attendance(db)


@router.post("/recognize")
async def recognize_attendance(
    session_id: int = Form(...),
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
):
    image_bytes = await file.read()
    nparr = np.frombuffer(image_bytes, np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    if img is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot decode image",
        )

    emb = get_face_embedding(img)
    if emb is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No face detected in image",
        )

    students = (
        db.query(Student)
        .filter(Student.face_registered == True)
        .all()
    )

    candidates = []
    for s in students:
        if not s.face_embedding:
            continue
        try:
            emb_list = json.loads(s.face_embedding)
            sv_emb = np.array(emb_list, dtype=np.float32)
        except Exception:
            continue

        candidates.append((s.id, sv_emb))

    if not candidates:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No enrolled students in database",
        )

    best_id = find_best_match(
        target_emb=emb,
        candidates=candidates,
        threshold=0.6,
    )

    if best_id is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No matched student",
        )

    student = db.query(Student).get(best_id)
    if not student:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Matched student not found in DB",
        )

    attendance_data = AttendanceCreate(
        student_id=student.id,
        session_id=session_id,
    )
    attendance = mark_attendance(db, attendance_data)

    return {
        "matched": True,
        "student": {
            "id": student.id,
            "student_code": student.student_code,
            "full_name": student.full_name,
            "class_name": student.class_name,
        },
        "attendance": {
            "id": attendance.id,
            "session_id": attendance.session_id,
            "timestamp": attendance.timestamp,
        },
    }