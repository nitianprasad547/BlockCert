from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class BlockResponse(BaseModel):
    block_id: int
    timestamp: datetime
    credential_id: str
    event_type: str
    version: int
    credential_hash: str
    previous_hash: str
    block_hash: str
    digital_signature: str

    class Config:
        from_attributes = True

class BlockchainValidationResponse(BaseModel):
    is_valid: bool
    total_blocks: int
    latest_block_hash: Optional[str] = None
    tampered_block_id: Optional[int] = None
    error: Optional[str] = None
