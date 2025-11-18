from fastapi import FastAPI

from .config import settings
from .models.base import Base, engine
from .api import students

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.APP_NAME,
    version="0.1.0",
)


@app.get("/health")
def health_check():
    return {"status": "ok"}


app.include_router(
    students.router,
    prefix="/api/students",
    tags=["students"],
)