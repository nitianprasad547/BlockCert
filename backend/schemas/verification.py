from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from datetime import datetime

class VerificationCheckItem(BaseModel):
    id: str
    name: str
    description: str
    status: str  # "PASSED", "FAILED", "WARNING"
    details: str
    expected: Optional[str] = None
    actual: Optional[str] = None

class VerificationResponse(BaseModel):
    is_valid: bool
    status: str  # "ACTIVE", "REVOKED", "TAMPERED", "NOT_FOUND"
    credential_id: str
    credential: Optional[Dict[str, Any]] = None
    institution: Optional[Dict[str, Any]] = None
    hash_check: bool
    signature_check: bool
    chain_check: bool
    status_check: bool
    checks: List[VerificationCheckItem]
    latest_block: Optional[Dict[str, Any]] = None
    all_blocks: Optional[List[Dict[str, Any]]] = None
    timestamp: datetime
    verification_id: str
    computed_hash: Optional[str] = None
    stored_hash: Optional[str] = None

class SimulateTamperRequest(BaseModel):
    credential_id: str
    tampered_data: Dict[str, Any]
