from datetime import datetime
from sqlalchemy import Column, String, Integer, Float, DateTime, ForeignKey, Text
from backend.database.connection import Base

class CredentialVersion(Base):
    __tablename__ = "credential_versions"

    version_id = Column(String(50), primary_key=True, index=True)
    credential_id = Column(String(50), ForeignKey("credentials.credential_id"), nullable=False, index=True)
    version_number = Column(Integer, nullable=False)
    student_name = Column(String(255), nullable=False)
    roll_number = Column(String(100), nullable=False)
    degree = Column(String(255), nullable=False)
    department = Column(String(255), nullable=False)
    cgpa = Column(Float, nullable=False)
    graduation_year = Column(Integer, nullable=False)
    enrollment_year = Column(Integer, nullable=False)
    issuer_id = Column(String(50), nullable=False)
    issuer_name = Column(String(255), nullable=False)
    credential_data_json = Column(Text, nullable=False)
    credential_hash = Column(String(64), nullable=False)  # SHA-256
    digital_signature = Column(Text, nullable=False)     # Ed25519 signature
    status = Column(String(50), default="ACTIVE")        # "ACTIVE", "SUPERSEDED", "REVOKED"
    modification_reason = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
