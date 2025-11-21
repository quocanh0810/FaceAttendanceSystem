from sqlalchemy.orm import Session
from app.models.session_model import Session
from app.schemas.session_schema import SessionCreate

def create_session(db: Session, data: SessionCreate):
    session = Session(
        class_id=data.class_id,
        topic=data.topic
    )
    db.add(session)
    db.commit()
    db.refresh(session)
    return session

def get_sessions(db: Session):
    return db.query(Session).all()