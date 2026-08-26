from datetime import datetime
from sqlalchemy import Column, String, DateTime, ForeignKey
from backend.database.connection import Base

class User(Base):
    __tablename__ = "users"

    user_id = Column(String(50), primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    email = Column(String(255), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    role = Column(String(50), nullable=False)  # "INSTITUTE", "STUDENT", "EMPLOYER", "ADMIN"
    institution_id = Column(String(50), ForeignKey("institutions.institution_id"), nullable=True)
    student_id = Column(String(50), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
