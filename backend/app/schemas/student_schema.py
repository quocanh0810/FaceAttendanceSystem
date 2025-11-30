from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class StudentBase(BaseModel):
    student_code: str
    full_name: str
    class_name: Optional[str] = None


class StudentCreate(StudentBase):
    """Schema khi tạo sinh viên mới"""
    pass


class StudentRead(StudentBase):
    id: int
    face_registered: bool
    created_at: datetime

    class Config:
        from_attributes = True