import sys
import os

# Add workspace root to sys.path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

from backend.database.connection import Base, engine, SessionLocal
from backend.models.institution import Institution
from backend.models.user import User
from backend.models.student import Student
from backend.models.discrepancy_report import DiscrepancyReport
from backend.services.crypto_service import CryptoService
from backend.services.credential_service import CredentialService

def seed_database():
    print("🌱 Initializing database schema...")
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    try:
        print("🏛️ Registering Stanford University Alliance with Ed25519 keys...")
        public_key_b64, private_key_pem = CryptoService.generate_ed25519_keypair()
        institution = Institution(
            institution_id="INST-STANFORD-01",
            name="Stanford University & Academic Alliance",
            code="STANFORD-AA",
            official_email="registrar@stanford.edu",
            domain="stanford.edu",
            address="450 Jane Stanford Way, Stanford, CA 94305",
            contact_number="+1 (650) 723-2045",
            public_key=public_key_b64,
            private_key_pem=private_key_pem,
            verified=True,
        )
        db.add(institution)
        db.commit()

        print("👤 Creating demo users...")
        users = [
            User(
                user_id="USR-ADMIN-01",
                name="Stanford Registrar Office",
                email="registrar@stanford.edu",
                password_hash="mock_hash_admin",
                role="INSTITUTE",
                institution_id="INST-STANFORD-01",
            ),
            User(
                user_id="USR-RAHUL-01",
                name="Rahul Sharma",
                email="rahul@student.edu",
                password_hash="mock_hash_student",
                role="STUDENT",
                student_id="STU-RAHUL-01",
            ),
            User(
                user_id="USR-EVELYN-02",
                name="Dr. Evelyn Vance",
                email="evelyn@stanford.edu",
                password_hash="mock_hash_student",
                role="STUDENT",
                student_id="STU-EVELYN-02",
            ),
            User(
                user_id="USR-EMP-01",
                name="Enterprise Recruiter (Google / Meta)",
                email="recruiter@techcorp.com",
                password_hash="mock_hash_employer",
                role="EMPLOYER",
            ),
        ]
        for u in users:
            db.add(u)
        db.commit()

        print("🎓 Registering student profiles...")
        students = [
            Student(
                student_id="STU-RAHUL-01",
                user_id="USR-RAHUL-01",
                name="Rahul Sharma",
                email="rahul@student.edu",
                roll_number="2022-CS-0418",
                department="Computer Science & Engineering",
                enrollment_year=2022,
            ),
            Student(
                student_id="STU-EVELYN-02",
                user_id="USR-EVELYN-02",
                name="Dr. Evelyn Vance",
                email="evelyn@stanford.edu",
                roll_number="PHD-2022-009",
                department="Computer Science & Cryptography",
                enrollment_year=2022,
            ),
        ]
        for s in students:
            db.add(s)
        db.commit()

        print("📜 Issuing authoritative demo credentials...")
        # 1. Rahul Sharma (matching PRD hackathon demo flow)
        CredentialService.issue_credential(
            db=db,
            student_name="Rahul Sharma",
            student_id_roll="2022-CS-0418",
            degree="Bachelor of Technology",
            department_branch="Computer Science & Engineering",
            cgpa=8.2,
            graduation_year=2026,
            enrollment_year=2022,
            institution=institution,
            classification="First Class with Distinction",
            major_specialization="Distributed Systems & Cryptography",
            custom_credential_id="CRED-7F83A91",
        )

        # 2. Dr. Evelyn Vance (matching PRD reference hero proof)
        CredentialService.issue_credential(
            db=db,
            student_name="Dr. Evelyn Vance",
            student_id_roll="PHD-2022-009",
            degree="Doctor of Philosophy",
            department_branch="Computer Science & Cryptography",
            cgpa=9.85,
            graduation_year=2026,
            enrollment_year=2022,
            institution=institution,
            classification="Summa Cum Laude",
            major_specialization="Tamper-Evident Ledger Architecture",
            custom_credential_id="CRED-9E24B10",
        )

        print("🚨 Seeding sample discrepancy report...")
        report = DiscrepancyReport(
            report_id="REP-2026-001",
            credential_id="CRED-7F83A91",
            reported_by="Rahul Sharma",
            reporter_role="Student",
            reason="CGPA Grade Correction",
            description="Final semester re-evaluation updated CGPA from 8.2 to 8.7 in university records.",
            status="PENDING",
        )
        db.add(report)
        db.commit()

        print("✅ Database successfully seeded with BlockCert demo records!")
    except Exception as e:
        print(f"❌ Seeding error: {e}")
        db.rollback()
        raise e
    finally:
        db.close()

if __name__ == "__main__":
    seed_database()
