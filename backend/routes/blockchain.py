from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List

from backend.database.connection import get_db
from backend.models.block import Block
from backend.schemas.blockchain import BlockResponse, BlockchainValidationResponse
from backend.services.blockchain_service import BlockchainService

router = APIRouter(prefix="/blockchain", tags=["Hash Chain"])

@router.get("/blocks", response_model=List[BlockResponse])
def get_blocks(db: Session = Depends(get_db)):
    return db.query(Block).order_by(Block.block_id.asc()).all()

@router.get("/validate", response_model=BlockchainValidationResponse)
def validate_hash_chain(db: Session = Depends(get_db)):
    is_valid, total_blocks, meta = BlockchainService.validate_chain(db)
    return {
        "is_valid": is_valid,
        "total_blocks": total_blocks,
        "latest_block_hash": meta.get("latest_block_hash"),
        "tampered_block_id": meta.get("tampered_block_id"),
        "error": meta.get("error"),
    }
