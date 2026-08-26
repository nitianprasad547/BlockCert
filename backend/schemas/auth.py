from pydantic import BaseModel
from typing import Optional

class LoginRequest(BaseModel):
    email: str
    password: Optional[str] = "password123"
    role: Optional[str] = "INSTITUTE"
    is_email_verified: Optional[bool] = True
    firebase_uid: Optional[str] = None

class UserResponse(BaseModel):
    user_id: str
    name: str
    email: str
    role: str
    institution_id: Optional[str] = None
    student_id: Optional[str] = None
    is_email_verified: Optional[bool] = True
    firebase_uid: Optional[str] = None

class TokenResponse(BaseModel):
    user: UserResponse
    token: str

class VerifyEmailRequest(BaseModel):
    email: str
    is_verified: bool = True
