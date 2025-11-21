from sqlalchemy import Column, Integer, String
from app.models.base import Base

class Class(Base):
    __tablename__ = "classes"

    id = Column(Integer, primary_key=True, index=True)
    class_code = Column(String(50), unique=True, index=True)
    class_name = Column(String(255))