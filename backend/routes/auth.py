from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
import jwt
import secrets
import hashlib

from backend.database.connection import get_db
from backend.models.user import User
from backend.schemas.auth import LoginRequest, RegisterRequest, TokenResponse, UserResponse, VerifyEmailRequest

SECRET_KEY = "blockcert_super_secret_hackathon_key"
ALGORITHM = "HS256"

# Demo persona emails that bypass password validation
DEMO_EMAILS = {
    "registrar@stanford.edu",
    "rahul@student.edu",
    "recruiter@techcorp.com",
}

router = APIRouter(prefix="/auth", tags=["Authentication"])

def create_access_token(data: dict, expires_delta: timedelta = timedelta(days=7)):
    to_encode = data.copy()
    expire = datetime.utcnow() + expires_delta
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

def secrets_token(n: int) -> str:
    return secrets.token_hex(n).upper()

def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()

def _build_token_response(user: User, is_email_verified: bool = True, firebase_uid: str | None = None) -> dict:
    token = create_access_token({
        "sub": user.user_id,
        "email": user.email,
        "role": user.role,
        "institution_id": user.institution_id,
        "is_email_verified": is_email_verified,
        "firebase_uid": firebase_uid,
    })
    return {
        "user": UserResponse(
            user_id=user.user_id,
            name=user.name,
            email=user.email,
            role=user.role,
            institution_id=user.institution_id,
            student_id=user.student_id,
            is_email_verified=is_email_verified,
            firebase_uid=firebase_uid,
        ),
        "token": token,
    }

@router.post("/register", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
def register(req: RegisterRequest, db: Session = Depends(get_db)):
    """Register a new user account and return a JWT token immediately."""
    normalized_email = req.email.strip().lower()

    # Check duplicate email
    existing = db.query(User).filter(User.email == normalized_email).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="An account with this email already exists. Please sign in instead.",
        )

    role = (req.role or "INSTITUTE").upper()
    role_prefix = role[:3]
    user_id = f"USR-{role_prefix}-{secrets_token(4)}"

    # Assign institution_id for institute accounts — auto-create an Institution row
    institution_id = None
    if role == "INSTITUTE":
        from backend.models.institution import Institution
        from backend.services.crypto_service import CryptoService

        inst_name = req.name.strip()
        # Derive a safe code from the user's name, ensure uniqueness
        base_code = req.name.strip().replace(" ", "-").upper()[:16]
        code_suffix = secrets.token_hex(2).upper()
        inst_code_unique = f"{base_code}-{code_suffix}"

        public_key_b64, private_key_pem = CryptoService.generate_ed25519_keypair()
        institution_id = f"INST-{secrets_token(3)}"

        inst = Institution(
            institution_id=institution_id,
            name=inst_name,
            code=inst_code_unique,
            official_email=normalized_email,
            domain=normalized_email.split("@")[-1] if "@" in normalized_email else None,
            address=None,
            contact_number=None,
            public_key=public_key_b64,
            private_key_pem=private_key_pem,
            verified=True,
        )
        db.add(inst)
        db.flush()  # Ensure institution_id is available before user insert

    # Assign a unique student_id for student accounts
    student_id = None
    if role == "STUDENT":
        name_slug = req.name.replace(" ", "").upper()[:6]
        student_id = f"STU-{name_slug}-{secrets_token(2)}"

    user = User(
        user_id=user_id,
        name=req.name.strip(),
        email=normalized_email,
        password_hash=hash_password(req.password or "password123"),
        role=role,
        institution_id=institution_id,
        student_id=student_id,
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    return _build_token_response(user)

@router.post("/login", response_model=TokenResponse)
def login(req: LoginRequest, db: Session = Depends(get_db)):
    normalized_email = req.email.strip().lower() if req.email else ""
    user = db.query(User).filter(User.email == normalized_email).first()

    # If a real registered account is found (not a demo persona and not ephemeral),
    # validate the password hash.
    if user and user.password_hash != "mock_hash" and normalized_email not in DEMO_EMAILS and req.password:
        expected_hash = hash_password(req.password)
        if user.password_hash != expected_hash:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect password. Please try again.",
            )

    if not user:
        # Fall back to first matching role for demo personas
        if req.role:
            user = db.query(User).filter(User.role == req.role.upper()).first()

    if not user:
        # Auto-create an ephemeral demo user so no one gets locked out
        role_prefix = (req.role or "USR")[:3]
        user_id = f"USR-{role_prefix}-{secrets_token(3)}"
        user = User(
            user_id=user_id,
            name=req.name or ("Test " + (req.role.capitalize() if req.role else "User")),
            email=normalized_email or f"{user_id.lower()}@demo.blockcert.app",
            password_hash="mock_hash",
            role=(req.role or "INSTITUTE").upper(),
            institution_id="INST-STANFORD-01" if req.role == "INSTITUTE" else None,
            student_id="STU-RAHUL-01" if req.role == "STUDENT" else None,
        )
        db.add(user)
        db.commit()
        db.refresh(user)

    return _build_token_response(
        user,
        is_email_verified=req.is_email_verified if req.is_email_verified is not None else True,
        firebase_uid=req.firebase_uid,
    )

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
