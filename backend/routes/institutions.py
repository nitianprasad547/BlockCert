from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
import secrets

from backend.database.connection import get_db
from backend.models.institution import Institution
from backend.schemas.institution import InstitutionCreate, InstitutionResponse
from backend.services.crypto_service import CryptoService

router = APIRouter(prefix="/institutions", tags=["Institutions"])

@router.post("", response_model=InstitutionResponse, status_code=status.HTTP_201_CREATED)
def register_institution(req: InstitutionCreate, db: Session = Depends(get_db)):
    existing = db.query(Institution).filter(
        (Institution.code == req.code) | (Institution.official_email == req.official_email)
    ).first()
    if existing:
        raise HTTPException(status_code=400, detail="Institution code or email already registered")

    public_key_b64, private_key_pem = CryptoService.generate_ed25519_keypair()
    institution_id = f"INST-{req.code.upper()[:8]}-{secrets.token_hex(2).upper()}"

    inst = Institution(
        institution_id=institution_id,
        name=req.name,
        code=req.code,
        official_email=req.official_email,
        domain=req.domain,
        address=req.address,
        contact_number=req.contact_number,
        public_key=public_key_b64,
        private_key_pem=private_key_pem,
        verified=True,
    )
    db.add(inst)
    db.commit()
    db.refresh(inst)
    return inst

@router.get("", response_model=List[InstitutionResponse])
def list_institutions(db: Session = Depends(get_db)):
    return db.query(Institution).all()

@router.get("/{id}", response_model=InstitutionResponse)
def get_institution(id: str, db: Session = Depends(get_db)):
    inst = db.query(Institution).filter(Institution.institution_id == id).first()
    if not inst:
        raise HTTPException(status_code=404, detail="Institution not found")
    return inst
