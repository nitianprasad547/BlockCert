from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime

class InstitutionCreate(BaseModel):
    name: str
    code: str
    official_email: EmailStr
    domain: Optional[str] = None
    address: Optional[str] = None
    contact_number: Optional[str] = None

class InstitutionResponse(BaseModel):
    institution_id: str
    name: str
    code: str
    official_email: str
    domain: Optional[str] = None
    address: Optional[str] = None
    contact_number: Optional[str] = None
    public_key: str
    verified: bool
    created_at: datetime

    class Config:
        from_attributes = True
