from sqlalchemy.orm import Session
from app.models.attendance_model import Attendance
from app.schemas.attendance_schema import AttendanceCreate

def mark_attendance(db: Session, data: AttendanceCreate):
    exists = db.query(Attendance).filter(
        Attendance.student_id == data.student_id,
        Attendance.session_id == data.session_id
    ).first()

    if exists:
        return exists

    a = Attendance(
        student_id=data.student_id,
        session_id=data.session_id,
    )
    db.add(a)
    db.commit()
    db.refresh(a)
    return a

def get_attendance(db: Session):
    return db.query(Attendance).all()