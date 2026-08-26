from fastapi import APIRouter, Depends, Request
from sqlalchemy.orm import Session
from typing import Dict, Any

from backend.database.connection import get_db
from backend.schemas.verification import VerificationResponse, SimulateTamperRequest
from backend.services.credential_service import CredentialService

router = APIRouter(prefix="/verify", tags=["Verification"])

@router.get("/{credential_id}", response_model=VerificationResponse)
def verify_credential_public(
    credential_id: str,
    request: Request,
    db: Session = Depends(get_db)
):
    client_ip = request.client.host if request.client else "unknown"
    result = CredentialService.verify_credential(
        db=db,
        credential_id=credential_id,
        tampered_data=None,
        verifier_ip=client_ip,
    )
    return result

@router.post("/simulate-tamper", response_model=VerificationResponse)
def simulate_tamper(
    req: SimulateTamperRequest,
    request: Request,
    db: Session = Depends(get_db)
):
    client_ip = request.client.host if request.client else "unknown"
    result = CredentialService.verify_credential(
        db=db,
        credential_id=req.credential_id,
        tampered_data=req.tampered_data,
        verifier_ip=client_ip,
    )
    return result
