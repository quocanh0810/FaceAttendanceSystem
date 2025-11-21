from fastapi import FastAPI

from .config import settings
from .models.base import Base, engine
from .api import students, classes, sessions, attendance
from . import models  # 🔥 dòng này rất quan trọng

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.APP_NAME,
    version="0.1.0",
)

@app.get("/health")
def health_check():
    return {"status": "ok"}

app.include_router(students.router, prefix="/api/students", tags=["students"])
app.include_router(classes.router, prefix="/api/classes", tags=["classes"])
app.include_router(sessions.router, prefix="/api/sessions", tags=["sessions"])
app.include_router(attendance.router, prefix="/api/attendance", tags=["attendance"])