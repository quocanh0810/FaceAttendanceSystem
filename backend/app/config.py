from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    APP_NAME: str = "Face Attendance System"
    DB_URL: str = "sqlite:///./face_attendance.db"
    FACE_THRESHOLD: float = 0.6

    class Config:
        env_file = ".env"


settings = Settings()