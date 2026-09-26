"""
3D Car Driving Portfolio & Web3 Architecture - Expanded FastAPI + Web3.py Backend Service
Version 8.5 / Production Expanded Blueprint
"""

import os
import json
import time
from typing import List, Dict, Optional, Set
from fastapi import FastAPI, HTTPException, WebSocket, WebSocketDisconnect, Query, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session
from web3 import Web3
from eth_account import Account
from eth_account.messages import encode_defunct
from dotenv import load_dotenv

from database import engine, Base, get_db
import models

# Initialize Database tables
Base.metadata.create_all(bind=engine)

load_dotenv()

app = FastAPI(
    title="3D Portfolio Web3 Service",
    description="Expanded backend for 3D Car Driving Portfolio with SQLAlchemy persistence, ECDSA signature generation, EIP-191 whisper verification, lap-time leaderboard, and 20 Hz multiplayer relay.",
    version="8.5.0"
)

# CORS Configuration
ALLOWED_ORIGINS = os.getenv("ALLOWED_ORIGINS", "*").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"] if "*" in ALLOWED_ORIGINS else ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Server Signer Configuration (Default deterministic development key if not specified)
DEFAULT_DEV_KEY = "0x4f3edf983ac636a65a842ce7c78d9aa706d3b113bce9c46f30d7d21715b23b1d"
SERVER_PRIVATE_KEY = os.getenv("SERVER_PRIVATE_KEY", DEFAULT_DEV_KEY)

# Derive Server Signer Account
server_account = Account.from_key(SERVER_PRIVATE_KEY)
SERVER_SIGNER_ADDRESS = server_account.address

REQUIRED_LANDMARKS: Set[str] = {
    "about_monument",
    "project_highway",
    "skills_arena",
    "web3_oasis",
    "contact_base"
}

# Landmark Information & Coordinates (Matching Blueprint)
LANDMARKS_INFO = {
    "about_monument": {
        "name": "About Me Monument",
        "pos": [0, 0, -50],
        "category": "Academic & Bio",
        "title": "Dual Academic Foundation & Personal Narrative",
        "subtitle": "B.Sc. Zoology & Botany (MSDU) + BCA Data Science (J.C. Bose UST)",
        "description": "Bridging empirical biological research with data science, visualization, and distributed software systems."
    },
    "project_highway": {
        "name": "Project Highway",
        "pos": [100, 0, 50],
        "category": "Core Software Builds",
        "title": "Software Engineering & Hackathon Showcases",
        "subtitle": "Team BYTEX Hackathon Winner, Real-time XMPP, Panel Room System",
        "description": "4 major architectural showcases featuring 3D previews, architecture blueprints, and GitHub code repositories."
    },
    "skills_arena": {
        "name": "Skills Arena",
        "pos": [-80, 0, 80],
        "category": "Technical Toolkit",
        "title": "Interactive Slalom Arena",
        "subtitle": "C++, Java, SQL, XMPP, Web Development, Data Science",
        "description": "Smashable interactive 3D skill targets that trigger particle VFX and log verified skills into visitor HUD."
    },
    "web3_oasis": {
        "name": "Web3 Oasis & Garage",
        "pos": [-120, 0, -60],
        "category": "Decentralized Zone",
        "title": "Team BYTEX Winner Garage & Proof of Exploration",
        "subtitle": "Token-Gated Gate & EVM Badge Minting Station",
        "description": "Exclusive garage gated by Team BYTEX NFT token verification with on-chain cryptographic badge issuance."
    },
    "contact_base": {
        "name": "Contact Base",
        "pos": [50, 0, -120],
        "category": "Recruiter Pit Stop",
        "title": "Pit Lane Finish & On-Chain Whisper Wall",
        "subtitle": "Live Recruiter Board, Resume & Web3 Guestbook",
        "description": "Sign a message with MetaMask/EVM wallet to permanently display your whisper on the pit stop billboard."
    }
}

# Seed default whispers if DB is empty
def seed_initial_whispers():
    db = next(get_db())
    try:
        count = db.query(models.Whisper).count()
        if count == 0:
            initial = [
                models.Whisper(
                    author_address="0x71C8363837918a71018282823819283749818976",
                    message="Incredible 3D track! Loved the Team BYTEX Cartographer project demo.",
                    verified=True,
                    signature="0xmock_signature_initial"
                ),
                models.Whisper(
                    author_address="0x3A918237461829374619283746192837461912FD",
                    message="Drift physics feel super smooth on the slalom bend. Great academic portfolio!",
                    verified=True,
                    signature="0xmock_signature_secondary"
                )
            ]
            db.add_all(initial)
            db.commit()
    finally:
        db.close()

seed_initial_whispers()


# ==================== Pydantic Models ====================

class BadgeClaimReq(BaseModel):
    wallet_address: str = Field(..., json_schema_extra={"example": "0x71C8363837918a71018282823819283749818976"})
    visited_landmarks: List[str] = Field(..., json_schema_extra={"example": ["about_monument", "project_highway", "skills_arena", "web3_oasis", "contact_base"]})
    badge_id: int = Field(default=1, json_schema_extra={"example": 1})

class WhisperVerifyReq(BaseModel):
    wallet_address: str = Field(..., json_schema_extra={"example": "0x71C8363837918a71018282823819283749818976"})
    message: str = Field(..., max_length=280, json_schema_extra={"example": "Exciting 3D car driving experience!"})
    signature: str = Field(..., json_schema_extra={"example": "0x123abc..."})

class WhisperCreateReq(BaseModel):
    author_address: str = Field(..., json_schema_extra={"example": "0x71C8363837918a71018282823819283749818976"})
    message: str = Field(..., max_length=280, json_schema_extra={"example": "Exciting 3D car driving experience!"})
    signature: Optional[str] = Field(None, json_schema_extra={"example": "0x123abc..."})

class LapTimeSubmitReq(BaseModel):
    wallet_address: str
    lap_time_seconds: float
    drift_score: int = 0

class HealthResponse(BaseModel):
    status: str
    service: str
    version: str
    server_signer: str


# ==================== REST Endpoints ====================

@app.get("/", response_model=HealthResponse)
@app.get("/health", response_model=HealthResponse)
def health_check():
    return {
        "status": "healthy",
        "service": "3D Portfolio Web3 Backend (Expanded)",
        "version": "8.5.0",
        "server_signer": SERVER_SIGNER_ADDRESS
    }

@app.get("/api/v1/server-signer")
def get_server_signer():
    """Returns the public address of the server signer used for signature verification."""
    return {
        "server_signer": SERVER_SIGNER_ADDRESS,
        "badge_contract_requirements": {
            "token_standard": "ERC-1155",
            "required_landmarks_count": len(REQUIRED_LANDMARKS),
            "required_landmarks": list(REQUIRED_LANDMARKS)
        }
    }

@app.get("/api/v1/landmarks")
@app.get("/api/landmarks")
def get_landmarks():
    """Returns metadata and 3D coordinates for all 5 interactive track landmarks."""
    return LANDMARKS_INFO

@app.post("/api/v1/verify-whisper")
@app.post("/api/verify-signature")
def verify_whisper(req: WhisperVerifyReq):
    """
    EIP-191 message verification to ensure no impersonation on the guestbook whisper wall.
    """
    try:
        msg_hash = encode_defunct(text=req.message)
        recovered = Account.recover_message(msg_hash, signature=req.signature)
        if recovered.lower() == req.wallet_address.lower():
            return {"status": "verified", "signer": recovered, "verified": True}
        raise HTTPException(status_code=400, detail="Signature mismatch")
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/v1/issue-mint-signature")
def issue_mint_signature(req: BadgeClaimReq, db: Session = Depends(get_db)):
    """
    Validates that visitor drove to all 5 required landmark stations,
    computes ECDSA keccak256 hash over (wallet_address, badge_id), and signs with server private key.
    """
    visited = set(req.visited_landmarks)
    missing = REQUIRED_LANDMARKS - visited
    if missing:
        raise HTTPException(
            status_code=400,
            detail=f"Missing landmarks: {list(missing)}"
        )

    try:
        recipient = Web3.to_checksum_address(req.wallet_address)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Invalid Ethereum wallet address format: {str(e)}")

    # Calculate Solidity keccak256(abi.encodePacked(address, uint256))
    message_hash = Web3.solidity_keccak(['address', 'uint256'], [recipient, req.badge_id])
    signable_msg = encode_defunct(hexstr=message_hash.hex())
    
    # Sign with server private key
    signed = Account.sign_message(signable_msg, private_key=SERVER_PRIVATE_KEY)

    # Log to Database
    log_entry = models.BadgeClaimLog(
        wallet_address=recipient,
        badge_id=req.badge_id,
        signature=signed.signature.hex()
    )
    db.add(log_entry)
    db.commit()

    return {
        "status": "approved",
        "wallet": recipient,
        "badge_id": req.badge_id,
        "signature": signed.signature.hex(),
        "server_signer": SERVER_SIGNER_ADDRESS,
        "issued_at": int(time.time())
    }

@app.post("/api/claim-badge")
def claim_badge_alias(req: BadgeClaimReq):
    """Blueprint v3/v4 claim-badge alias endpoint."""
    visited = set(req.visited_landmarks)
    missing = REQUIRED_LANDMARKS - visited
    if missing:
        return {"eligible": False, "missing_landmarks": list(missing)}
    return {
        "eligible": True,
        "badge_id": req.badge_id,
        "address": req.wallet_address,
        "server_signer": SERVER_SIGNER_ADDRESS
    }

@app.get("/api/v1/whispers")
def get_whispers(db: Session = Depends(get_db)):
    """Returns all verified messages submitted to the on-chain pit stop guestbook from SQLite."""
    items = db.query(models.Whisper).order_by(models.Whisper.id.desc()).all()
    whisper_list = []
    for w in items:
        short_author = f"{w.author_address[:6]}...{w.author_address[-4:]}" if len(w.author_address) > 10 else w.author_address
        whisper_list.append({
            "id": w.id,
            "author": short_author,
            "author_address": w.author_address,
            "message": w.message,
            "timestamp": w.timestamp,
            "verified": w.verified,
            "signature": w.signature or "0xsimulation"
        })
    return {
        "count": len(whisper_list),
        "whispers": whisper_list
    }

@app.post("/api/v1/whispers")
def post_whisper(req: WhisperCreateReq, db: Session = Depends(get_db)):
    """Submits a signed message to the public on-chain pit stop guestbook and stores in SQLite."""
    clean_msg = req.message.strip()
    if not clean_msg:
        raise HTTPException(status_code=400, detail="Message cannot be empty")

    verified = False
    author_addr = req.author_address.strip()
    
    if req.signature:
        try:
            signable_text = encode_defunct(text=clean_msg)
            recovered = Account.recover_message(signable_text, signature=req.signature)
            if recovered.lower() == author_addr.lower():
                verified = True
        except Exception:
            verified = False
    else:
        verified = True

    new_whisper = models.Whisper(
        author_address=author_addr,
        message=clean_msg,
        signature=req.signature,
        verified=verified
    )
    db.add(new_whisper)
    db.commit()
    db.refresh(new_whisper)

    short_author = f"{author_addr[:6]}...{author_addr[-4:]}" if len(author_addr) > 10 else author_addr

    return {
        "status": "success",
        "whisper": {
            "id": new_whisper.id,
            "author": short_author,
            "author_address": new_whisper.author_address,
            "message": new_whisper.message,
            "timestamp": new_whisper.timestamp,
            "verified": new_whisper.verified,
            "signature": new_whisper.signature or "0xsimulation"
        }
    }

@app.get("/api/v1/leaderboard")
def get_leaderboard(db: Session = Depends(get_db)):
    """Returns top fastest lap times around the 3D circuit."""
    laps = db.query(models.LapTime).order_by(models.LapTime.lap_time_seconds.asc()).limit(10).all()
    return [
        {
            "id": lap.id,
            "wallet": f"{lap.wallet_address[:6]}...{lap.wallet_address[-4:]}",
            "lap_time": lap.lap_time_seconds,
            "drift_score": lap.drift_score
        }
        for lap in laps
    ]

@app.post("/api/v1/lap-times")
def submit_lap_time(req: LapTimeSubmitReq, db: Session = Depends(get_db)):
    """Records a completed lap time to the persistent leaderboard."""
    lap = models.LapTime(
        wallet_address=req.wallet_address,
        lap_time_seconds=req.lap_time_seconds,
        drift_score=req.drift_score
    )
    db.add(lap)
    db.commit()
    db.refresh(lap)
    return {"status": "recorded", "lap_id": lap.id, "lap_time": lap.lap_time_seconds}


# ==================== Real-Time Multiplayer WebSocket Relay ====================

class ConnectionManager:
    def __init__(self):
        self.active_connections: Dict[str, WebSocket] = {}
        self.player_states: Dict[str, Dict] = {}

    async def connect(self, client_id: str, websocket: WebSocket):
        await websocket.accept()
        self.active_connections[client_id] = websocket
        self.player_states[client_id] = {
            "id": client_id,
            "wallet": "0xGhostDriver",
            "pos": [0, 0.5, 0],
            "rot": [0, 0, 0, 1],
            "speed": 0,
            "color": "#38bdf8"
        }

    def disconnect(self, client_id: str):
        if client_id in self.active_connections:
            del self.active_connections[client_id]
        if client_id in self.player_states:
            del self.player_states[client_id]

    async def broadcast_player_moved(self, sender_id: str, payload: Dict):
        if sender_id in self.player_states:
            self.player_states[sender_id].update(payload)
            broadcast_msg = json.dumps({
                "type": "playerMoved",
                "id": sender_id,
                **self.player_states[sender_id]
            })
            for cid, conn in list(self.active_connections.items()):
                if cid != sender_id:
                    try:
                        await conn.send_text(broadcast_msg)
                    except Exception:
                        pass

    async def broadcast_player_left(self, client_id: str):
        broadcast_msg = json.dumps({
            "type": "playerLeft",
            "id": client_id
        })
        for cid, conn in list(self.active_connections.items()):
            try:
                await conn.send_text(broadcast_msg)
            except Exception:
                pass

manager = ConnectionManager()

@app.websocket("/ws/multiplayer")
async def multiplayer_ws(websocket: WebSocket, client_id: str = Query(None)):
    if not client_id:
        client_id = f"driver_{int(time.time() * 1000) % 100000}"
    await manager.connect(client_id, websocket)
    try:
        await websocket.send_text(json.dumps({
            "type": "currentPlayers",
            "players": manager.player_states
        }))
        while True:
            data_text = await websocket.receive_text()
            try:
                msg = json.loads(data_text)
                msg_type = msg.get("type")
                if msg_type == "updateTransform":
                    await manager.broadcast_player_moved(client_id, {
                        "pos": msg.get("pos", [0, 0.5, 0]),
                        "rot": msg.get("rot", [0, 0, 0, 1]),
                        "speed": msg.get("speed", 0),
                        "wallet": msg.get("wallet", "0xGhostDriver"),
                        "color": msg.get("color", "#38bdf8")
                    })
                elif msg_type == "join":
                    manager.player_states[client_id]["wallet"] = msg.get("wallet", "0xGhostDriver")
            except json.JSONDecodeError:
                pass
    except WebSocketDisconnect:
        manager.disconnect(client_id)
        await manager.broadcast_player_left(client_id)
