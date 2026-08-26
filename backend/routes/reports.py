import secrets
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from backend.database.connection import get_db
from backend.models.discrepancy_report import DiscrepancyReport
from backend.schemas.report import (
    DiscrepancyReportCreate,
    DiscrepancyReportResolve,
    DiscrepancyReportResponse,
)

router = APIRouter(tags=["Discrepancy Reports"])

@router.post("/reports", response_model=DiscrepancyReportResponse, status_code=status.HTTP_201_CREATED)
def submit_report(req: DiscrepancyReportCreate, db: Session = Depends(get_db)):
    report_id = f"REP-{secrets.token_hex(4).upper()}"
    report = DiscrepancyReport(
        report_id=report_id,
        credential_id=req.credential_id,
        reported_by=req.reported_by,
        reporter_role=req.reporter_role or "Student",
        reason=req.reason,
        description=req.description,
        status="PENDING",
    )
    db.add(report)
    db.commit()
    db.refresh(report)
    return report

@router.get("/institution/reports", response_model=List[DiscrepancyReportResponse])
def get_institution_reports(db: Session = Depends(get_db)):
    return db.query(DiscrepancyReport).order_by(DiscrepancyReport.created_at.desc()).all()

@router.patch("/reports/{id}/resolve", response_model=DiscrepancyReportResponse)
def resolve_report(id: str, req: DiscrepancyReportResolve, db: Session = Depends(get_db)):
    report = db.query(DiscrepancyReport).filter(DiscrepancyReport.report_id == id).first()
    if not report:
        raise HTTPException(status_code=404, detail="Discrepancy report not found")

    report.status = "RESOLVED"
    report.resolution_notes = req.resolution_notes
    report.resolved_at = datetime.utcnow()
    db.commit()
    db.refresh(report)
    return report
