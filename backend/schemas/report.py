from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class DiscrepancyReportCreate(BaseModel):
    credential_id: str
    reported_by: str
    reporter_role: Optional[str] = "Student"
    reason: str
    description: str

class DiscrepancyReportResolve(BaseModel):
    resolution_notes: str = Field(..., min_length=2)

class DiscrepancyReportResponse(BaseModel):
    report_id: str
    credential_id: str
    reported_by: str
    reporter_role: str
    reason: str
    description: str
    status: str
    resolution_notes: Optional[str] = None
    created_at: datetime
    resolved_at: Optional[datetime] = None

    class Config:
        from_attributes = True
