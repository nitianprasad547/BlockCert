from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
import jwt
import secrets

from backend.database.connection import get_db
from backend.models.user import User
from backend.schemas.auth import LoginRequest, TokenResponse, UserResponse, VerifyEmailRequest

SECRET_KEY = "blockcert_super_secret_hackathon_key"
ALGORITHM = "HS256"

router = APIRouter(prefix="/auth", tags=["Authentication"])

def create_access_token(data: dict, expires_delta: timedelta = timedelta(days=7)):
    to_encode = data.copy()
    expire = datetime.utcnow() + expires_delta
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

def secrets_token(n: int) -> str:
    return secrets.token_hex(n).upper()

@router.post("/login", response_model=TokenResponse)
def login(req: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == req.email).first()
    if not user:
        # Check if role matches quick persona
        if req.role == "INSTITUTE":
            user = db.query(User).filter(User.role == "INSTITUTE").first()
        elif req.role == "STUDENT":
            user = db.query(User).filter(User.role == "STUDENT").first()
        elif req.role == "EMPLOYER":
            user = db.query(User).filter(User.role == "EMPLOYER").first()

    if not user:
        # Create a dynamic user for testing
        role_prefix = req.role[:3] if req.role else "USR"
        user_id = f"USR-{role_prefix}-{secrets_token(3)}"
        user = User(
            user_id=user_id,
            name="Test " + (req.role.capitalize() if req.role else "User"),
            email=req.email,
            password_hash="mock_hash",
            role=req.role or "INSTITUTE",
            institution_id="INST-STANFORD-01" if req.role == "INSTITUTE" else None,
            student_id="STU-RAHUL-01" if req.role == "STUDENT" else None,
        )
        db.add(user)
        db.commit()
        db.refresh(user)

    token = create_access_token({
        "sub": user.user_id,
        "email": user.email,
        "role": user.role,
        "institution_id": user.institution_id,
        "is_email_verified": req.is_email_verified if req.is_email_verified is not None else True,
        "firebase_uid": req.firebase_uid,
    })

    return {
        "user": UserResponse(
            user_id=user.user_id,
            name=user.name,
            email=user.email,
            role=user.role,
            institution_id=user.institution_id,
            student_id=user.student_id,
            is_email_verified=req.is_email_verified if req.is_email_verified is not None else True,
            firebase_uid=req.firebase_uid,
        ),
        "token": token,
    }

@router.post("/verify-email")
def verify_email(req: VerifyEmailRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == req.email).first()
    if not user:
        return {"status": "success", "email": req.email, "is_verified": req.is_verified}
    return {
        "status": "success",
        "email": user.email,
        "user_id": user.user_id,
        "is_verified": req.is_verified,
    }
