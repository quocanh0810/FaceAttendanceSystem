from pydantic import BaseModel

class ClassBase(BaseModel):
    class_code: str
    class_name: str

class ClassCreate(ClassBase):
    pass

class ClassRead(ClassBase):
    id: int
    class Config:
        from_attributes = True