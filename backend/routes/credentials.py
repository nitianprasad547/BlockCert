import json
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from backend.database.connection import get_db
from backend.models.credential import Credential
from backend.models.credential_version import CredentialVersion
from backend.models.institution import Institution
from backend.schemas.credential import (
    CredentialIssueRequest,
    CredentialModifyRequest,
    CredentialRevokeRequest,
    CredentialResponse,
    CredentialVersionResponse,
)
from backend.services.credential_service import CredentialService

router = APIRouter(prefix="/credentials", tags=["Credentials"])

def build_credential_response(cred: Credential, db: Session, include_history: bool = True) -> CredentialResponse:
    latest_ver = db.query(CredentialVersion).filter(
        CredentialVersion.credential_id == cred.credential_id,
        CredentialVersion.version_number == cred.current_version
    ).first()

    if not latest_ver:
        # Fallback to any version
        latest_ver = db.query(CredentialVersion).filter(
            CredentialVersion.credential_id == cred.credential_id
        ).order_by(CredentialVersion.version_number.desc()).first()

    history_list = []
    if include_history:
        all_vers = db.query(CredentialVersion).filter(
            CredentialVersion.credential_id == cred.credential_id
        ).order_by(CredentialVersion.version_number.asc()).all()
        for v in all_vers:
            history_list.append(
                CredentialVersionResponse(
                    version_id=v.version_id,
                    credential_id=v.credential_id,
                    version_number=v.version_number,
                    student_name=v.student_name,
                    roll_number=v.roll_number,
                    degree=v.degree,
                    department=v.department,
                    cgpa=v.cgpa,
                    graduation_year=v.graduation_year,
                    enrollment_year=v.enrollment_year,
                    issuer_id=v.issuer_id,
                    issuer_name=v.issuer_name,
                    credential_data=json.loads(v.credential_data_json),
                    credential_hash=v.credential_hash,
                    digital_signature=v.digital_signature,
                    status=v.status,
                    modification_reason=v.modification_reason,
                    created_at=v.created_at,
                )
            )

    latest_ver_response = CredentialVersionResponse(
        version_id=latest_ver.version_id,
        credential_id=latest_ver.credential_id,
        version_number=latest_ver.version_number,
        student_name=latest_ver.student_name,
        roll_number=latest_ver.roll_number,
        degree=latest_ver.degree,
        department=latest_ver.department,
        cgpa=latest_ver.cgpa,
        graduation_year=latest_ver.graduation_year,
        enrollment_year=latest_ver.enrollment_year,
        issuer_id=latest_ver.issuer_id,
        issuer_name=latest_ver.issuer_name,
        credential_data=json.loads(latest_ver.credential_data_json),
        credential_hash=latest_ver.credential_hash,
        digital_signature=latest_ver.digital_signature,
        status=latest_ver.status,
        modification_reason=latest_ver.modification_reason,
        created_at=latest_ver.created_at,
    )

    return CredentialResponse(
        credential_id=cred.credential_id,
        student_id=cred.student_id,
        institution_id=cred.institution_id,
        institution_name=cred.institution_name,
        current_version=cred.current_version,
        status=cred.status,
        latest_version=latest_ver_response,
        history=history_list,
        qr_code_url=cred.qr_code_url,
        revocation_reason=cred.revocation_reason,
        revoked_at=cred.revoked_at,
        created_at=cred.created_at,
        updated_at=cred.updated_at,
    )

@router.post("", response_model=CredentialResponse, status_code=status.HTTP_201_CREATED)
def issue_credential(req: CredentialIssueRequest, db: Session = Depends(get_db)):
    institution_id = req.institution_id or "INST-STANFORD-01"
    inst = db.query(Institution).filter(Institution.institution_id == institution_id).first()
    if not inst:
        inst = db.query(Institution).first()
    if not inst:
        raise HTTPException(status_code=400, detail="No registered institution available for issuance")

    cred = CredentialService.issue_credential(
        db=db,
        student_name=req.student_name,
        student_id_roll=req.student_id_roll,
        degree=req.degree,
        department_branch=req.department_branch,
        cgpa=req.cgpa,
        graduation_year=req.graduation_year,
        enrollment_year=req.enrollment_year,
        institution=inst,
        classification=req.classification,
        major_specialization=req.major_specialization,
        additional_notes=req.additional_notes,
    )
    return build_credential_response(cred, db)

@router.get("", response_model=List[CredentialResponse])
def list_credentials(db: Session = Depends(get_db)):
    creds = db.query(Credential).order_by(Credential.created_at.desc()).all()
    return [build_credential_response(c, db, include_history=False) for c in creds]

@router.get("/{id}", response_model=CredentialResponse)
def get_credential(id: str, db: Session = Depends(get_db)):
    cred = db.query(Credential).filter(Credential.credential_id == id).first()
    if not cred:
        raise HTTPException(status_code=404, detail="Credential not found")
    return build_credential_response(cred, db, include_history=True)

@router.get("/{id}/history", response_model=List[CredentialVersionResponse])
def get_credential_history(id: str, db: Session = Depends(get_db)):
    cred = db.query(Credential).filter(Credential.credential_id == id).first()
    if not cred:
        raise HTTPException(status_code=404, detail="Credential not found")
    
    versions = db.query(CredentialVersion).filter(
        CredentialVersion.credential_id == id
    ).order_by(CredentialVersion.version_number.asc()).all()

    return [
        CredentialVersionResponse(
            version_id=v.version_id,
            credential_id=v.credential_id,
            version_number=v.version_number,
            student_name=v.student_name,
            roll_number=v.roll_number,
            degree=v.degree,
            department=v.department,
            cgpa=v.cgpa,
            graduation_year=v.graduation_year,
            enrollment_year=v.enrollment_year,
            issuer_id=v.issuer_id,
            issuer_name=v.issuer_name,
            credential_data=json.loads(v.credential_data_json),
            credential_hash=v.credential_hash,
            digital_signature=v.digital_signature,
            status=v.status,
            modification_reason=v.modification_reason,
            created_at=v.created_at,
        )
        for v in versions
    ]

@router.post("/{id}/modify", response_model=CredentialResponse)
def modify_credential(id: str, req: CredentialModifyRequest, db: Session = Depends(get_db)):
    cred = db.query(Credential).filter(Credential.credential_id == id).first()
    if not cred:
        raise HTTPException(status_code=404, detail="Credential not found")
    if cred.status == "REVOKED":
        raise HTTPException(status_code=400, detail="Cannot modify a revoked credential")

    inst = db.query(Institution).filter(Institution.institution_id == cred.institution_id).first()
    if not inst:
        raise HTTPException(status_code=400, detail="Issuing institution missing")

    updated_cred = CredentialService.modify_credential(
        db=db,
        credential_id=id,
        student_name=req.student_name,
        student_id_roll=req.student_id_roll,
        degree=req.degree,
        department_branch=req.department_branch,
        cgpa=req.cgpa,
        graduation_year=req.graduation_year,
        enrollment_year=req.enrollment_year,
        modification_reason=req.modification_reason,
        institution=inst,
        classification=req.classification,
        major_specialization=req.major_specialization,
    )
    return build_credential_response(updated_cred, db)

@router.post("/{id}/revoke", response_model=CredentialResponse)
def revoke_credential(id: str, req: CredentialRevokeRequest, db: Session = Depends(get_db)):
    cred = db.query(Credential).filter(Credential.credential_id == id).first()
    if not cred:
        raise HTTPException(status_code=404, detail="Credential not found")

    inst = db.query(Institution).filter(Institution.institution_id == cred.institution_id).first()
    if not inst:
        raise HTTPException(status_code=400, detail="Issuing institution missing")

    revoked_cred = CredentialService.revoke_credential(
        db=db,
        credential_id=id,
        reason=req.reason,
        institution=inst,
    )
    return build_credential_response(revoked_cred, db)
