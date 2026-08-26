from datetime import datetime
from sqlalchemy import Column, String, DateTime, Boolean, Text
from backend.database.connection import Base

class Institution(Base):
    __tablename__ = "institutions"

    institution_id = Column(String(50), primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    code = Column(String(50), nullable=False, unique=True)
    official_email = Column(String(255), nullable=False)
    domain = Column(String(255), nullable=True)
    address = Column(String(500), nullable=True)
    contact_number = Column(String(50), nullable=True)
    public_key = Column(Text, nullable=False)
    private_key_pem = Column(Text, nullable=False)  # Server-side secure storage only! Never exposed to frontend!
    verified = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
