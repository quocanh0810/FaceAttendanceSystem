from sqlalchemy import Column, Integer, String, Boolean, DateTime
from sqlalchemy.sql import func
from app.models.base import Base


class Student(Base):
    __tablename__ = "students"

    id = Column(Integer, primary_key=True, index=True)
    student_code = Column(String(50), unique=True, index=True, nullable=False)
    full_name = Column(String(255), nullable=False)
    class_name = Column(String(100), nullable=True)
    face_registered = Column(Boolean, default=False) #check embedding
    created_at = Column(DateTime(timezone=True), server_default=func.now())