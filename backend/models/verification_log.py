from datetime import datetime
from sqlalchemy import Column, String, DateTime, Boolean, Text
from backend.database.connection import Base

class VerificationLog(Base):
    __tablename__ = "verification_logs"

    log_id = Column(String(50), primary_key=True, index=True)
    credential_id = Column(String(50), nullable=False, index=True)
    timestamp = Column(DateTime, default=datetime.utcnow)
    result = Column(String(50), nullable=False)  # "VERIFIED", "INVALID", "REVOKED", "NOT_FOUND"
    details = Column(Text, nullable=True)
    verifier_ip = Column(String(100), nullable=True)
