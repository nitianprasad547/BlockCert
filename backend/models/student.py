from sqlalchemy import Column, String, Integer, ForeignKey
from backend.database.connection import Base

class Student(Base):
    __tablename__ = "students"

    student_id = Column(String(50), primary_key=True, index=True)
    user_id = Column(String(50), ForeignKey("users.user_id"), nullable=False)
    name = Column(String(255), nullable=False)
    email = Column(String(255), nullable=False)
    roll_number = Column(String(100), nullable=False)
    department = Column(String(255), nullable=False)
    enrollment_year = Column(Integer, nullable=False)
