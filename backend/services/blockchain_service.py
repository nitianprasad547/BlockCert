import hashlib
from datetime import datetime
from typing import List, Dict, Any, Tuple
from sqlalchemy.orm import Session
from backend.models.block import Block

GENESIS_PREVIOUS_HASH = "0000000000000000000000000000000000000000000000000000000000000000"

class BlockchainService:
    @staticmethod
    def calculate_block_hash(
        block_id: int,
        timestamp_str: str,
        credential_id: str,
        event_type: str,
        version: int,
        credential_hash: str,
        previous_hash: str,
        digital_signature: str,
    ) -> str:
        """Calculates the SHA-256 hash of a block's concatenated attributes."""
        payload = (
            f"{block_id}|{timestamp_str}|{credential_id}|{event_type}|"
            f"{version}|{credential_hash}|{previous_hash}|{digital_signature}"
        )
        return hashlib.sha256(payload.encode("utf-8")).hexdigest()

    @classmethod
    def add_block(
        cls,
        db: Session,
        credential_id: str,
        event_type: str,
        version: int,
        credential_hash: str,
        digital_signature: str,
        timestamp: datetime = None,
    ) -> Block:
        """Appends a new event block (ISSUE, MODIFY, REVOKE) to the tamper-evident hash chain."""
        timestamp = timestamp or datetime.utcnow()
        timestamp_str = timestamp.isoformat()

        # Fetch the last block in chain
        last_block = db.query(Block).order_by(Block.block_id.desc()).first()
        if last_block:
            next_id = last_block.block_id + 1
            previous_hash = last_block.block_hash
        else:
            next_id = 1
            previous_hash = GENESIS_PREVIOUS_HASH

        block_hash = cls.calculate_block_hash(
            block_id=next_id,
            timestamp_str=timestamp_str,
            credential_id=credential_id,
            event_type=event_type,
            version=version,
            credential_hash=credential_hash,
            previous_hash=previous_hash,
            digital_signature=digital_signature,
        )

        new_block = Block(
            block_id=next_id,
            timestamp=timestamp,
            credential_id=credential_id,
            event_type=event_type,
            version=version,
            credential_hash=credential_hash,
            previous_hash=previous_hash,
            block_hash=block_hash,
            digital_signature=digital_signature,
        )
        db.add(new_block)
        db.commit()
        db.refresh(new_block)
        return new_block

    @classmethod
    def validate_chain(cls, db: Session) -> Tuple[bool, int, Dict[str, Any]]:
        """Verifies the complete hash chain integrity from genesis block to tip."""
        blocks = db.query(Block).order_by(Block.block_id.asc()).all()
        if not blocks:
            return True, 0, {"message": "Chain is empty (valid)"}

        expected_prev_hash = GENESIS_PREVIOUS_HASH
        for b in blocks:
            # 1. Verify previous_hash link
            if b.previous_hash != expected_prev_hash:
                return False, len(blocks), {
                    "error": f"Broken chain link at Block #{b.block_id}. Expected prev_hash {expected_prev_hash}, got {b.previous_hash}.",
                    "tampered_block_id": b.block_id,
                }

            # 2. Verify self-hash integrity
            calculated_hash = cls.calculate_block_hash(
                block_id=b.block_id,
                timestamp_str=b.timestamp.isoformat(),
                credential_id=b.credential_id,
                event_type=b.event_type,
                version=b.version,
                credential_hash=b.credential_hash,
                previous_hash=b.previous_hash,
                digital_signature=b.digital_signature,
            )
            if calculated_hash != b.block_hash:
                return False, len(blocks), {
                    "error": f"Invalid block hash at Block #{b.block_id}. Data has been tampered with!",
                    "tampered_block_id": b.block_id,
                }

            expected_prev_hash = b.block_hash

        return True, len(blocks), {"latest_block_hash": blocks[-1].block_hash}
