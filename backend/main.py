import os
import sys
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

# Add root directory to sys.path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

from backend.database.connection import Base, engine, SessionLocal
from backend.database.seed import seed_database
from backend.models.institution import Institution
from backend.routes import (
    auth_router,
    institutions_router,
    credentials_router,
    verification_router,
    reports_router,
    student_router,
    blockchain_router,
)

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Auto-initialize DB and seed if empty
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        inst_count = db.query(Institution).count()
        if inst_count == 0:
            print("Database empty. Auto-seeding BlockCert demo records...")
            seed_database()
    except Exception as e:
        print(f"Startup DB check error: {e}")
    finally:
        db.close()
    yield

app = FastAPI(
    title="BlockCert API",
    description="Blockchain-Based Academic Credential Verification Platform REST API",
    version="1.0.0",
    lifespan=lifespan,
)

# CORS configuration for Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount all API routers
app.include_router(auth_router, prefix="/api")
app.include_router(institutions_router, prefix="/api")
app.include_router(credentials_router, prefix="/api")
app.include_router(verification_router, prefix="/api")
app.include_router(reports_router, prefix="/api")
app.include_router(student_router, prefix="/api")
app.include_router(blockchain_router, prefix="/api")

@app.get("/")
def root():
    return {
        "platform": "BlockCert",
        "description": "Blockchain-Based Academic Credential Verification Platform",
        "status": "online",
        "version": "1.0.0",
        "docs_url": "/docs",
    }

@app.get("/api/health")
def health():
    return {"status": "healthy", "service": "blockcert-backend"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.main:app", host="127.0.0.1", port=8000, reload=True)
