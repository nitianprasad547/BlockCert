from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List, Optional

from backend.database.connection import get_db
from backend.models.credential import Credential
from backend.schemas.credential import CredentialResponse
from backend.routes.credentials import build_credential_response

router = APIRouter(prefix="/student", tags=["Student Portal"])

@router.get("/credentials", response_model=List[CredentialResponse])
def get_student_credentials(student_id: Optional[str] = None, db: Session = Depends(get_db)):
    query = db.query(Credential)
    if student_id:
        query = query.filter(Credential.student_id == student_id)
    creds = query.order_by(Credential.created_at.desc()).all()
    return [build_credential_response(c, db, include_history=True) for c in creds]
