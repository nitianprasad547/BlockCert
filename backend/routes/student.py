from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional

from backend.database.connection import get_db
from backend.models.credential import Credential
from backend.models.credential_version import CredentialVersion
from backend.schemas.credential import CredentialResponse
from backend.routes.credentials import build_credential_response

router = APIRouter(prefix="/student", tags=["Student Portal"])

@router.get("/scorecard/{credential_id}", response_model=CredentialResponse)
def get_student_scorecard(credential_id: str, db: Session = Depends(get_db)):
    clean_id = credential_id.strip().upper()
    cred = db.query(Credential).filter(Credential.credential_id == clean_id).first()
    if not cred:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"No academic scorecard found on the ledger for Credential ID: {clean_id}"
        )
    return build_credential_response(cred, db, include_history=True)

@router.get("/credentials", response_model=List[CredentialResponse])
def get_student_credentials(
    student_id: Optional[str] = None,
    credential_id: Optional[str] = None,
    student_name: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(Credential)
    has_filter = False

    if credential_id and credential_id.strip():
        query = query.filter(Credential.credential_id == credential_id.strip().upper())
        has_filter = True
    elif student_id and student_id.strip():
        query = query.filter(Credential.student_id == student_id.strip())
        has_filter = True
    elif student_name and student_name.strip():
        matched_cred_ids = [
            cv.credential_id for cv in db.query(CredentialVersion).filter(
                CredentialVersion.student_name.ilike(f"%{student_name.strip()}%")
            ).all()
        ]
        if matched_cred_ids:
            query = query.filter(Credential.credential_id.in_(matched_cred_ids))
            has_filter = True
        else:
            return []

    if not has_filter:
        # Enforce strict student privacy: Never return other students' credentials
        return []

    creds = query.order_by(Credential.created_at.desc()).all()
    return [build_credential_response(c, db, include_history=True) for c in creds]
