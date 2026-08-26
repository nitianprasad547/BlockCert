from datetime import datetime
from sqlalchemy import Column, Integer, String, DateTime, Text
from backend.database.connection import Base

class Block(Base):
    __tablename__ = "blocks"

    block_id = Column(Integer, primary_key=True, autoincrement=True, index=True)
    timestamp = Column(DateTime, default=datetime.utcnow, nullable=False)
    credential_id = Column(String(50), nullable=False, index=True)
    event_type = Column(String(50), nullable=False)  # "ISSUE", "MODIFY", "REVOKE"
    version = Column(Integer, nullable=False)
    credential_hash = Column(String(64), nullable=False)
    previous_hash = Column(String(64), nullable=False)
    block_hash = Column(String(64), nullable=False, unique=True, index=True)
    digital_signature = Column(Text, nullable=False)
