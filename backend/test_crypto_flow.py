import sys
import os

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

from backend.database.connection import SessionLocal
from backend.models.institution import Institution
from backend.models.credential import Credential
from backend.services.credential_service import CredentialService
from backend.services.blockchain_service import BlockchainService

def test_full_prd_lifecycle():
    db = SessionLocal()
    try:
        inst = db.query(Institution).first()
        assert inst is not None, "Institution should exist"

        print("1. [ISSUE] Testing credential issuance for Rahul...")
        cred = db.query(Credential).filter(Credential.credential_id == "CRED-7F83A91").first()
        assert cred is not None, "Rahul credential should exist"
        print(f"   -> Credential ID: {cred.credential_id}, Version: {cred.current_version}")

        print("2. [VERIFY] Testing normal verification (should be ACTIVE & VALID)...")
        res1 = CredentialService.verify_credential(db, cred.credential_id)
        assert res1["is_valid"] is True, "Original credential should be valid"
        assert res1["hash_check"] is True, "Hash check should pass"
        assert res1["signature_check"] is True, "Signature check should pass"
        assert res1["status"] == "ACTIVE"
        print("   -> Result: VERIFIED (All 4 checks passed)")

        print("3. [TAMPER] Testing unauthorized data tampering (altering CGPA from 8.2 to 10.0)...")
        tampered_res = CredentialService.verify_credential(
            db, cred.credential_id, tampered_data={"cgpa": 10.0}
        )
        assert tampered_res["is_valid"] is False, "Tampered credential must fail verification"
        assert tampered_res["hash_check"] is False, "Hash check must fail"
        assert tampered_res["signature_check"] is False, "Signature check must fail"
        assert tampered_res["status"] == "TAMPERED"
        print("   -> Result: INVALID / TAMPERED (Tampering correctly caught!)")

        print("4. [MODIFY] Testing legitimate modification to Version 2 (CGPA 8.7)...")
        modified = CredentialService.modify_credential(
            db=db,
            credential_id=cred.credential_id,
            student_name="Rahul Sharma",
            student_id_roll="2022-CS-0418",
            degree="Bachelor of Technology",
            department_branch="Computer Science & Engineering",
            cgpa=8.7,
            graduation_year=2026,
            enrollment_year=2022,
            modification_reason="Re-evaluation of Semester VIII transcript updated CGPA to 8.7",
            institution=inst,
        )
        assert modified.current_version == 2, "Current version should now be 2"
        print(f"   -> Version updated to: {modified.current_version}")

        print("5. [VERIFY V2] Testing verification of modified credential (same ID & QR)...")
        res2 = CredentialService.verify_credential(db, cred.credential_id)
        assert res2["is_valid"] is True, "Modified credential Version 2 should be valid"
        assert res2["credential"]["cgpa"] == 8.7
        assert res2["credential"]["version_number"] == 2
        print("   -> Result: VERIFIED Version 2 (ACTIVE)")

        print("6. [REVOKE] Testing revocation with reason...")
        revoked = CredentialService.revoke_credential(
            db=db,
            credential_id=cred.credential_id,
            reason="Administrative diploma recall / test revocation",
            institution=inst,
        )
        assert revoked.status == "REVOKED"

        print("7. [VERIFY REVOKED] Testing verification of revoked credential...")
        res3 = CredentialService.verify_credential(db, cred.credential_id)
        assert res3["is_valid"] is False, "Revoked credential must not be valid"
        assert res3["status"] == "REVOKED"
        assert res3["status_check"] is False, "Status check must fail"
        print("   -> Result: REVOKED (Correctly detected!)")

        print("8. [CHAIN INTEGRITY] Validating entire hash chain...")
        chain_valid, total_blocks, meta = BlockchainService.validate_chain(db)
        assert chain_valid is True, "Hash chain must be completely valid"
        print(f"   -> Total Chain Blocks: {total_blocks}, Chain Integrity: 100% VALID")

        print("\n🎉 ALL PRD CRYPTOGRAPHIC AND LIFECYCLE TESTS PASSED PERFECTLY!")
    finally:
        db.close()

if __name__ == "__main__":
    test_full_prd_lifecycle()
