import time
from sqlalchemy import Column, Integer, String, Boolean, Float
from database import Base

class Whisper(Base):
    __tablename__ = "whispers"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    author_address = Column(String(64), index=True, nullable=False)
    message = Column(String(280), nullable=False)
    signature = Column(String(132), nullable=True)
    verified = Column(Boolean, default=False)
    timestamp = Column(Integer, default=lambda: int(time.time()))

class LapTime(Base):
    __tablename__ = "lap_times"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    wallet_address = Column(String(64), index=True, nullable=False)
    lap_time_seconds = Column(Float, nullable=False)
    drift_score = Column(Integer, default=0)
    created_at = Column(Integer, default=lambda: int(time.time()))

class BadgeClaimLog(Base):
    __tablename__ = "badge_claim_logs"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    wallet_address = Column(String(64), index=True, nullable=False)
    badge_id = Column(Integer, default=1)
    signature = Column(String(132), nullable=False)
    created_at = Column(Integer, default=lambda: int(time.time()))
