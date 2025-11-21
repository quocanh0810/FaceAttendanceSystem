from pydantic import BaseModel
from datetime import datetime

class AttendanceCreate(BaseModel):
    student_id: int
    session_id: int

class AttendanceRead(BaseModel):
    id: int
    student_id: int
    session_id: int
    timestamp: datetime

    class Config:
        from_attributes = True