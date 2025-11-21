from sqlalchemy import Column, Integer, DateTime, ForeignKey, String
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.models.base import Base

class Session(Base):
    __tablename__ = "sessions"

    id = Column(Integer, primary_key=True, index=True)
    class_id = Column(Integer, ForeignKey("classes.id"))
    topic = Column(String(255), nullable=True)
    start_time = Column(DateTime(timezone=True), server_default=func.now())

    class_obj = relationship("Class")