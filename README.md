# 3D Interactive Web3 Car Driving Portfolio & System Architecture

[![Version](https://img.shields.io/badge/version-8.0.0-cyan.svg)](https://github.com/azadsingh)
[![EVM](https://img.shields.io/badge/EVM-Solidity%200.8.20-purple.svg)](https://soliditylang.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-Python%203.10%2B-emerald.svg)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/React%2018-Three.js%20%2F%20R3F-blue.svg)](https://threejs.org/)

An interactive 3D Web3 car driving portfolio application. Visitors navigate a virtual vehicle across a circuit track to explore academic milestones, software projects, and interactive skill arenas, featuring EVM smart contract verification, server-signed ECDSA badge claims, token-gated secret zones, and real-time multiplayer ghost cars.

---

## 🏎️ Key Subsystems & Architecture

| Layer | Technology | Key Responsibilities |
| :--- | :--- | :--- |
| **3D Graphics & Engine** | Three.js / React Three Fiber | Real-time WebGL rendering, custom neon shaders, dynamic lighting, particles, camera follow lerp |
| **Vehicle Physics** | Custom Arcade Physics / Raycast Dynamics | Wheel suspension springs, lateral tire friction drift mechanics, acceleration, braking, nitro boost |
| **Web3 Integration** | Ethers.js / Wagmi / MetaMask / Viem | Browser wallet connection, cryptographic message signing, ERC-1155 on-chain minting |
| **Backend API** | Python FastAPI + Web3.py + eth-account | Server-side ECDSA keccak256 signature generation, landmark exploration validation, whisper guestbook |
| **Smart Contract** | Solidity 0.8.20 (`PortfolioBadge.sol`) | ERC-1155 Multi-Token contract with server-signature mint verification |
| **Multiplayer Relay** | WebSockets (20 Hz) + Slerp / Lerp | Real-time position broadcasting and holographic ghost cars |

---

## 🗺️ 5 Landmark Trigger Stations

```
                     [ STATION 4: Web3 Oasis & Garage ] (-120, 0, -60)
                                      ▲
                                      │
  [ STATION 1: About Me Monument ] (0, 0, -50) ──► [ STATION 2: Project Highway ] (100, 0, 50)
                                      ▲                              │
                                      │                              ▼
  [ STATION 5: Contact Base ] (50, 0, -120) ◄─── [ STATION 3: Skills Slalom Arena ] (-80, 0, 80)
```

1. **Station 1: About Me Monument `(0, 0, -50)`**
   - Central rotating compass monolith with dual degree academic timeline:
     - **B.Sc. in Zoology & Botany** (MSDU University, 2022–2024): Empirical scientific research, ecology, and taxonomy.
     - **BCA in Data Science** (J.C. Bose Institute of Science & Technology, 2024–2027): Data analysis, visualization, statistical modeling, algorithms.
2. **Station 2: Project Highway `(100, 0, 50)`**
   - 4 Interactive 3D Holographic Billboards showcasing:
     - **Cartographer (Team BYTEX)**: 4th Position Winner at the International Hackathon 2026 (JNTUH Hyderabad).
     - **Panel Room Conference Meeting System**: Automated room scheduling & low-latency WebSocket sync.
     - **XMPP Server Real-Time Communication Architecture**: Asynchronous XML stanza routing matrix.
     - **Full-Stack Web Development Showcase**: High-performance WebGL dashboards and tools.
3. **Station 3: Skills Slalom Arena `(-80, 0, 80)`**
   - Smashable 3D glowing skill cubes/orbs (C++, Java, SQL, HTML/CSS, XMPP, Data Analysis, Data Visualization, Laboratory Research). Colliding unlocks skill tokens into the visitor's verified capability ledger.
4. **Station 4: Web3 Oasis & Garage `(-120, 0, -60)`**
   - Team BYTEX Winner's Garage with a dynamic token-gated energy barrier. Checks wallet for Team BYTEX NFT credential and issues server-signed EVM Proof of Exploration ERC-1155 badge.
5. **Station 5: Contact Base & Pit Stop `(50, 0, -120)`**
   - Recruiter pit station and **On-Chain Cryptographic Whisper Wall / Guestbook** where visitors sign messages with their Web3 wallet.

---

## 🚀 Quick Start Guide

### 1. Python FastAPI Backend
```bash
cd server
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```
- API Docs: `http://localhost:8000/docs`
- Health: `http://localhost:8000/health`

### 2. Frontend React 3D Application
```bash
cd client
npm install
npm run dev
```
- Open `http://localhost:5173` in your browser.

### 3. Smart Contracts (Hardhat)
```bash
cd contracts
npx hardhat test
```

---

## 🔐 ECDSA Cryptographic Minting Security Flow

1. Visitor drives and triggers all 5 landmark checkpoints.
2. Client sends `POST /api/v1/issue-mint-signature` with `{ wallet_address, visited_landmarks, badge_id }`.
3. Backend validates that all 5 landmarks are present:
   ```python
   REQUIRED = {"about_monument", "project_highway", "skills_arena", "web3_oasis", "contact_base"}
   if REQUIRED - set(req.visited_landmarks):
       raise HTTPException(status_code=400, detail="Missing required landmarks")
   ```
4. Backend computes the Solidity message hash:
   ```python
   message_hash = Web3.solidity_keccak(['address', 'uint256'], [recipient, badge_id])
   signed = Account.sign_message(encode_defunct(hexstr=message_hash.hex()), private_key=SERVER_PRIVATE_KEY)
   ```
5. Solidity contract validates signature during `mintWithSignature`:
   ```solidity
   bytes32 msgHash = keccak256(abi.encodePacked(msg.sender, badgeId));
   bytes32 ethSignedHash = ECDSA.toEthSignedMessageHash(msgHash);
   require(ECDSA.recover(ethSignedHash, signature) == serverSigner, "Invalid signature");
   ```
