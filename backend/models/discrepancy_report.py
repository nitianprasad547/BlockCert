from datetime import datetime
from sqlalchemy import Column, String, DateTime, Text
from backend.database.connection import Base

class DiscrepancyReport(Base):
    __tablename__ = "discrepancy_reports"

    report_id = Column(String(50), primary_key=True, index=True)
    credential_id = Column(String(50), nullable=False, index=True)
    reported_by = Column(String(255), nullable=False)
    reporter_role = Column(String(50), default="Student")
    reason = Column(String(255), nullable=False)
    description = Column(Text, nullable=False)
    status = Column(String(50), default="PENDING")  # "PENDING", "UNDER_REVIEW", "RESOLVED", "DISMISSED"
    resolution_notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    resolved_at = Column(DateTime, nullable=True)
