from .auth import router as auth_router
from .institutions import router as institutions_router
from .credentials import router as credentials_router
from .verification import router as verification_router
from .reports import router as reports_router
from .student import router as student_router
from .blockchain import router as blockchain_router

__all__ = [
    "auth_router",
    "institutions_router",
    "credentials_router",
    "verification_router",
    "reports_router",
    "student_router",
    "blockchain_router",
]
