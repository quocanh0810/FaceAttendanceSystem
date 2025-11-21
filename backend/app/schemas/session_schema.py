from pydantic import BaseModel
from datetime import datetime

class SessionBase(BaseModel):
    class_id: int
    topic: str | None = None

class SessionCreate(SessionBase):
    pass

class SessionRead(SessionBase):
    id: int
    start_time: datetime

    class Config:
        from_attributes = True