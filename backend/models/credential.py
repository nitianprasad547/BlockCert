from datetime import datetime
from sqlalchemy import Column, String, Integer, DateTime, ForeignKey, Text
from backend.database.connection import Base

class Credential(Base):
    __tablename__ = "credentials"

    credential_id = Column(String(50), primary_key=True, index=True)  # Permanent ID (CRED-7F83A91)
    student_id = Column(String(50), nullable=False)
    institution_id = Column(String(50), ForeignKey("institutions.institution_id"), nullable=False)
    institution_name = Column(String(255), nullable=False)
    current_version = Column(Integer, default=1)
    status = Column(String(50), default="ACTIVE")  # "ACTIVE", "REVOKED"
    qr_code_url = Column(Text, nullable=True)
    revocation_reason = Column(Text, nullable=True)
    revoked_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
