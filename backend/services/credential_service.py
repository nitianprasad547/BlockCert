import json
import secrets
from datetime import datetime
from typing import Optional, Dict, Any, List
from sqlalchemy.orm import Session

from backend.models.credential import Credential
from backend.models.credential_version import CredentialVersion
from backend.models.institution import Institution
from backend.models.block import Block
from backend.models.verification_log import VerificationLog
from backend.services.crypto_service import CryptoService
from backend.services.blockchain_service import BlockchainService
from backend.services.qr_service import QRService

class CredentialService:
    @staticmethod
    def generate_credential_id() -> str:
        """Generates a permanent, sufficiently unpredictable Credential ID (e.g. CRED-7F83A91)."""
        suffix = secrets.token_hex(4).upper()[:7]
        return f"CRED-{suffix}"

    @classmethod
    def issue_credential(
        cls,
        db: Session,
        student_name: str,
        student_id_roll: str,
        degree: str,
        department_branch: str,
        cgpa: float,
        graduation_year: int,
        enrollment_year: int,
        institution: Institution,
        classification: Optional[str] = "First Class",
        major_specialization: Optional[str] = None,
        additional_notes: Optional[str] = None,
        custom_credential_id: Optional[str] = None,
    ) -> Credential:
        credential_id = custom_credential_id or cls.generate_credential_id()
        student_id = f"STU-{secrets.token_hex(3).upper()}"

        # 1. Structured Academic Record
        payload: Dict[str, Any] = {
            "student_name": student_name,
            "student_id_roll": student_id_roll,
            "degree": degree,
            "department_branch": department_branch,
            "cgpa": float(cgpa),
            "graduation_year": int(graduation_year),
            "enrollment_year": int(enrollment_year),
            "institution_id": institution.institution_id,
            "institution_name": institution.name,
            "classification": classification or "First Class",
            "major_specialization": major_specialization or "",
            "additional_notes": additional_notes or "",
            "issue_date": datetime.utcnow().strftime("%Y-%m-%d"),
        }

        # 2. Canonicalize & SHA-256 Hash
        canonical_str = CryptoService.canonicalize_data(payload)
        credential_hash = CryptoService.compute_sha256(canonical_str)

        # 3. Ed25519 Digital Signature using Institution Private Key
        digital_signature = CryptoService.sign_hash(credential_hash, institution.private_key_pem)

        # 4. Hash Chain Event (Block 1: ISSUE)
        BlockchainService.add_block(
            db=db,
            credential_id=credential_id,
            event_type="ISSUE",
            version=1,
            credential_hash=credential_hash,
            digital_signature=digital_signature,
        )

        # 5. Generate Permanent QR code data URL
        verification_url = f"https://blockcert.verify/verify/{credential_id}"
        qr_code_data_uri = QRService.generate_qr_data_uri(verification_url)

        # 6. Store Credential & CredentialVersion
        new_credential = Credential(
            credential_id=credential_id,
            student_id=student_id,
            institution_id=institution.institution_id,
            institution_name=institution.name,
            current_version=1,
            status="ACTIVE",
            qr_code_url=qr_code_data_uri,
        )
        db.add(new_credential)
        db.flush()

        new_version = CredentialVersion(
            version_id=f"VER-{credential_id}-01",
            credential_id=credential_id,
            version_number=1,
            student_name=student_name,
            roll_number=student_id_roll,
            degree=degree,
            department=department_branch,
            cgpa=float(cgpa),
            graduation_year=int(graduation_year),
            enrollment_year=int(enrollment_year),
            issuer_id=institution.institution_id,
            issuer_name=institution.name,
            credential_data_json=json.dumps(payload),
            credential_hash=credential_hash,
            digital_signature=digital_signature,
            status="ACTIVE",
        )
        db.add(new_version)
        db.commit()
        db.refresh(new_credential)
        return new_credential

    @classmethod
    def modify_credential(
        cls,
        db: Session,
        credential_id: str,
        student_name: str,
        student_id_roll: str,
        degree: str,
        department_branch: str,
        cgpa: float,
        graduation_year: int,
        enrollment_year: int,
        modification_reason: str,
        institution: Institution,
        classification: Optional[str] = None,
        major_specialization: Optional[str] = None,
    ) -> Credential:
        cred = db.query(Credential).filter(Credential.credential_id == credential_id).first()
        if not cred:
            raise ValueError(f"Credential {credential_id} not found")
        if cred.status == "REVOKED":
            raise ValueError("Cannot modify a revoked credential")

        next_version_num = cred.current_version + 1

        # Mark all previous versions as SUPERSEDED
        prev_versions = db.query(CredentialVersion).filter(
            CredentialVersion.credential_id == credential_id,
            CredentialVersion.status == "ACTIVE"
        ).all()
        for pv in prev_versions:
            pv.status = "SUPERSEDED"

        # Construct new payload
        payload: Dict[str, Any] = {
            "student_name": student_name,
            "student_id_roll": student_id_roll,
            "degree": degree,
            "department_branch": department_branch,
            "cgpa": float(cgpa),
            "graduation_year": int(graduation_year),
            "enrollment_year": int(enrollment_year),
            "institution_id": institution.institution_id,
            "institution_name": institution.name,
            "classification": classification or "First Class with Distinction",
            "major_specialization": major_specialization or "",
            "modification_reason": modification_reason,
            "issue_date": datetime.utcnow().strftime("%Y-%m-%d"),
        }

        canonical_str = CryptoService.canonicalize_data(payload)
        new_hash = CryptoService.compute_sha256(canonical_str)
        new_signature = CryptoService.sign_hash(new_hash, institution.private_key_pem)

        # Hash Chain Event (MODIFY)
        BlockchainService.add_block(
            db=db,
            credential_id=credential_id,
            event_type="MODIFY",
            version=next_version_num,
            credential_hash=new_hash,
            digital_signature=new_signature,
        )

        new_version = CredentialVersion(
            version_id=f"VER-{credential_id}-0{next_version_num}",
            credential_id=credential_id,
            version_number=next_version_num,
            student_name=student_name,
            roll_number=student_id_roll,
            degree=degree,
            department=department_branch,
            cgpa=float(cgpa),
            graduation_year=int(graduation_year),
            enrollment_year=int(enrollment_year),
            issuer_id=institution.institution_id,
            issuer_name=institution.name,
            credential_data_json=json.dumps(payload),
            credential_hash=new_hash,
            digital_signature=new_signature,
            status="ACTIVE",
            modification_reason=modification_reason,
        )
        db.add(new_version)

        cred.current_version = next_version_num
        cred.updated_at = datetime.utcnow()
        db.commit()
        db.refresh(cred)
        return cred

    @classmethod
    def revoke_credential(
        cls,
        db: Session,
        credential_id: str,
        reason: str,
        institution: Institution,
    ) -> Credential:
        cred = db.query(Credential).filter(Credential.credential_id == credential_id).first()
        if not cred:
            raise ValueError(f"Credential {credential_id} not found")

        cred.status = "REVOKED"
        cred.revocation_reason = reason
        cred.revoked_at = datetime.utcnow()
        cred.updated_at = datetime.utcnow()

        latest_version = db.query(CredentialVersion).filter(
            CredentialVersion.credential_id == credential_id,
            CredentialVersion.version_number == cred.current_version
        ).first()

        if latest_version:
            latest_version.status = "REVOKED"

        rev_signature = CryptoService.sign_hash(
            latest_version.credential_hash if latest_version else "REVOCATION",
            institution.private_key_pem
        )

        # Hash Chain Event (REVOKE)
        BlockchainService.add_block(
            db=db,
            credential_id=credential_id,
            event_type="REVOKE",
            version=cred.current_version,
            credential_hash=latest_version.credential_hash if latest_version else "REVOCATION",
            digital_signature=rev_signature,
        )

        db.commit()
        db.refresh(cred)
        return cred

    @classmethod
    def verify_credential(
        cls,
        db: Session,
        credential_id: str,
        tampered_data: Optional[Dict[str, Any]] = None,
        verifier_ip: Optional[str] = None,
    ) -> Dict[str, Any]:
        cred = db.query(Credential).filter(Credential.credential_id == credential_id).first()
        if not cred:
            # Log failed attempt
            log = VerificationLog(
                log_id=f"LOG-{secrets.token_hex(4).upper()}",
                credential_id=credential_id,
                result="NOT_FOUND",
                details="Credential ID not found in registry",
                verifier_ip=verifier_ip,
            )
            db.add(log)
            db.commit()

            return {
                "is_valid": False,
                "status": "NOT_FOUND",
                "credential_id": credential_id,
                "hash_check": False,
                "signature_check": False,
                "chain_check": False,
                "status_check": False,
                "checks": [
                    {
                        "id": "not_found",
                        "name": "Credential Lookup",
                        "description": "Locating credential on BlockCert registry",
                        "status": "FAILED",
                        "details": f"Credential ID '{credential_id}' does not exist on the platform ledger.",
                    }
                ],
                "timestamp": datetime.utcnow(),
                "verification_id": f"VERIFY-{secrets.token_hex(4).upper()}",
            }

        latest_version = db.query(CredentialVersion).filter(
            CredentialVersion.credential_id == credential_id,
            CredentialVersion.version_number == cred.current_version
        ).first()

        institution = db.query(Institution).filter(Institution.institution_id == cred.institution_id).first()
        raw_payload = json.loads(latest_version.credential_data_json)

        # 1. SHA-256 Hash Integrity Check
        if tampered_data:
            # Apply simulated tampering for demonstration
            test_payload = {**raw_payload, **tampered_data}
        else:
            test_payload = raw_payload

        calculated_canonical = CryptoService.canonicalize_data(test_payload)
        calculated_hash = CryptoService.compute_sha256(calculated_canonical)
        hash_matches = (calculated_hash == latest_version.credential_hash)

        # 2. Digital Signature Check (using institution's Ed25519 public key)
        signature_valid = False
        if institution and hash_matches:
            signature_valid = CryptoService.verify_signature(
                hash_hex=calculated_hash,
                signature_b64=latest_version.digital_signature,
                public_key_b64=institution.public_key,
            )

        # 3. Hash Chain Integrity Check
        chain_valid, total_blocks, chain_meta = BlockchainService.validate_chain(db)

        # 4. Status Check
        status_valid = (cred.status == "ACTIVE")

        # Overall validation state
        is_valid = hash_matches and signature_valid and chain_valid and status_valid
        final_status = "ACTIVE" if is_valid else ("TAMPERED" if not hash_matches or not signature_valid else cred.status)

        checks = [
            {
                "id": "hash_check",
                "name": "1. SHA-256 Hash Integrity Check",
                "description": "Recomputing canonical JSON hash from payload and comparing to stored block hash",
                "status": "PASSED" if hash_matches else "FAILED",
                "details": (
                    f"Calculated SHA-256 payload hash matches authoritative digest ({latest_version.credential_hash[:16]}...)."
                    if hash_matches
                    else f"Hash mismatch! Calculated SHA-256 ({calculated_hash[:16]}...) does not match stored hash ({latest_version.credential_hash[:16]}...). Data alteration detected!"
                ),
                "expected": latest_version.credential_hash,
                "actual": calculated_hash,
            },
            {
                "id": "sig_check",
                "name": "2. Ed25519 Digital Signature Check",
                "description": "Verifying signature with issuing institution's registered public key",
                "status": "PASSED" if signature_valid else "FAILED",
                "details": (
                    f"Cryptographic signature valid under {cred.institution_name} Ed25519 Public Key."
                    if signature_valid
                    else f"Signature verification failed! Digital signature is invalid for the provided data."
                ),
            },
            {
                "id": "chain_check",
                "name": "3. Hash-Chain Block Integrity Check",
                "description": "Verifying sequential block hash and previous hash linkage across the single-node chain",
                "status": "PASSED" if chain_valid else "FAILED",
                "details": (
                    f"Block sequence intact across all {total_blocks} blocks. Tamper-evident ledger confirmed."
                    if chain_valid
                    else f"Broken chain: {chain_meta.get('error')}"
                ),
            },
            {
                "id": "status_check",
                "name": "4. Credential Revocation & Status Check",
                "description": "Ensuring credential is in active standing and has not been revoked by the institution",
                "status": "PASSED" if status_valid else "FAILED",
                "details": (
                    f"Credential is in active standing (Version {latest_version.version_number})."
                    if status_valid
                    else f"Credential was REVOKED by the institution. Reason: {cred.revocation_reason or 'Administrative revocation'}."
                ),
            },
        ]

        # Log verification
        log = VerificationLog(
            log_id=f"LOG-{secrets.token_hex(4).upper()}",
            credential_id=credential_id,
            result=final_status,
            details=f"Hash: {hash_matches}, Sig: {signature_valid}, Chain: {chain_valid}, Status: {status_valid}",
            verifier_ip=verifier_ip,
        )
        db.add(log)
        db.commit()

        # Fetch blocks for this credential
        credential_blocks = db.query(Block).filter(Block.credential_id == credential_id).all()

        return {
            "is_valid": is_valid,
            "status": final_status,
            "credential_id": credential_id,
            "credential": {
                "version_id": latest_version.version_id,
                "credential_id": credential_id,
                "version_number": latest_version.version_number,
                "student_name": test_payload.get("student_name", latest_version.student_name),
                "roll_number": test_payload.get("student_id_roll", latest_version.roll_number),
                "degree": test_payload.get("degree", latest_version.degree),
                "department": test_payload.get("department_branch", latest_version.department),
                "cgpa": float(test_payload.get("cgpa", latest_version.cgpa)),
                "graduation_year": int(test_payload.get("graduation_year", latest_version.graduation_year)),
                "enrollment_year": int(test_payload.get("enrollment_year", latest_version.enrollment_year)),
                "issuer_id": latest_version.issuer_id,
                "issuer_name": latest_version.issuer_name,
                "credential_data": test_payload,
                "credential_hash": latest_version.credential_hash,
                "digital_signature": latest_version.digital_signature,
                "status": latest_version.status,
                "created_at": latest_version.created_at,
            },
            "institution": {
                "institution_id": institution.institution_id if institution else cred.institution_id,
                "name": institution.name if institution else cred.institution_name,
                "public_key": institution.public_key if institution else "",
                "verified": institution.verified if institution else True,
            },
            "hash_check": hash_matches,
            "signature_check": signature_valid,
            "chain_check": chain_valid,
            "status_check": status_valid,
            "checks": checks,
            "latest_block": {
                "block_id": credential_blocks[-1].block_id if credential_blocks else 1,
                "event_type": credential_blocks[-1].event_type if credential_blocks else "ISSUE",
                "block_hash": credential_blocks[-1].block_hash if credential_blocks else "",
            } if credential_blocks else None,
            "all_blocks": [
                {
                    "block_id": b.block_id,
                    "timestamp": b.timestamp,
                    "event_type": b.event_type,
                    "version": b.version,
                    "block_hash": b.block_hash,
                    "previous_hash": b.previous_hash,
                }
                for b in credential_blocks
            ],
            "timestamp": datetime.utcnow(),
            "verification_id": f"VERIFY-{secrets.token_hex(4).upper()}",
            "computed_hash": calculated_hash,
            "stored_hash": latest_version.credential_hash,
        }
