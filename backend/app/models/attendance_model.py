from sqlalchemy import Column, Integer, DateTime, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.models.base import Base

class Attendance(Base):
    __tablename__ = "attendance"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("students.id"))
    session_id = Column(Integer, ForeignKey("sessions.id"))
    timestamp = Column(DateTime(timezone=True), server_default=func.now())

    student = relationship("Student")
    session = relationship("Session")