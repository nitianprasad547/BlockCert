from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime

class CredentialDataPayload(BaseModel):
    student_name: str
    student_id_roll: str
    degree: str
    department_branch: str
    cgpa: float
    graduation_year: int
    enrollment_year: int
    institution_id: Optional[str] = None
    institution_name: Optional[str] = None
    classification: Optional[str] = None
    major_specialization: Optional[str] = None
    honors: Optional[str] = None
    issue_date: Optional[str] = None
    additional_notes: Optional[str] = None

class CredentialIssueRequest(BaseModel):
    student_name: str
    student_id_roll: str
    degree: str
    department_branch: str
    cgpa: float
    graduation_year: int
    enrollment_year: int
    classification: Optional[str] = "First Class"
    major_specialization: Optional[str] = None
    additional_notes: Optional[str] = None
    institution_id: Optional[str] = "INST-STANFORD-01"

class CredentialModifyRequest(BaseModel):
    student_name: str
    student_id_roll: str
    degree: str
    department_branch: str
    cgpa: float
    graduation_year: int
    enrollment_year: int
    classification: Optional[str] = "First Class with Distinction"
    major_specialization: Optional[str] = None
    modification_reason: str = Field(..., min_length=3, description="Reason for modifying historical record")

class CredentialRevokeRequest(BaseModel):
    reason: str = Field(..., min_length=3, description="Reason for revoking credential")

class CredentialVersionResponse(BaseModel):
    version_id: str
    credential_id: str
    version_number: int
    student_name: str
    roll_number: str
    degree: str
    department: str
    cgpa: float
    graduation_year: int
    enrollment_year: int
    issuer_id: str
    issuer_name: str
    credential_data: Dict[str, Any]
    credential_hash: str
    digital_signature: str
    status: str
    modification_reason: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True

class CredentialResponse(BaseModel):
    credential_id: str
    student_id: str
    institution_id: str
    institution_name: str
    current_version: int
    status: str
    latest_version: CredentialVersionResponse
    history: Optional[List[CredentialVersionResponse]] = None
    qr_code_url: Optional[str] = None
    revocation_reason: Optional[str] = None
    revoked_at: Optional[datetime] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
