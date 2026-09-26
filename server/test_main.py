import pytest
from fastapi.testclient import TestClient
from web3 import Web3
from eth_account import Account
from eth_account.messages import encode_defunct
from main import app, REQUIRED_LANDMARKS, SERVER_SIGNER_ADDRESS

client = TestClient(app)

def test_health_check():
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert data["version"] == "8.5.0"
    assert data["server_signer"] == SERVER_SIGNER_ADDRESS

def test_landmarks_endpoint():
    response = client.get("/api/v1/landmarks")
    assert response.status_code == 200
    data = response.json()
    for lm in REQUIRED_LANDMARKS:
        assert lm in data

def test_issue_mint_signature_success():
    wallet = "0x71C8363837918a71018282823819283749818976"
    req_body = {
        "wallet_address": wallet,
        "visited_landmarks": list(REQUIRED_LANDMARKS),
        "badge_id": 1
    }
    response = client.post("/api/v1/issue-mint-signature", json=req_body)
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "approved"
    assert data["wallet"].lower() == wallet.lower()
    assert data["badge_id"] == 1
    assert "signature" in data
    assert data["server_signer"] == SERVER_SIGNER_ADDRESS

    # Verify ECDSA signature against server signer address
    checksum_wallet = Web3.to_checksum_address(wallet)
    message_hash = Web3.solidity_keccak(['address', 'uint256'], [checksum_wallet, 1])
    signable = encode_defunct(hexstr=message_hash.hex())
    recovered = Account.recover_message(signable, signature=data["signature"])
    assert recovered.lower() == SERVER_SIGNER_ADDRESS.lower()

def test_issue_mint_signature_missing_landmarks():
    req_body = {
        "wallet_address": "0x71C8363837918a71018282823819283749818976",
        "visited_landmarks": ["about_monument", "project_highway"],
        "badge_id": 1
    }
    response = client.post("/api/v1/issue-mint-signature", json=req_body)
    assert response.status_code == 400
    assert "Missing landmarks" in response.json()["detail"]

def test_claim_badge_alias():
    response = client.post("/api/claim-badge", json={
        "wallet_address": "0x71C8363837918a71018282823819283749818976",
        "visited_landmarks": list(REQUIRED_LANDMARKS),
        "badge_id": 1
    })
    assert response.status_code == 200
    data = response.json()
    assert data["eligible"] is True

def test_verify_whisper_eip191():
    # Generate test key and signature
    test_acc = Account.create()
    message = "Verifying EIP-191 message"
    signable = encode_defunct(text=message)
    signed = Account.sign_message(signable, private_key=test_acc.key)

    response = client.post("/api/v1/verify-whisper", json={
        "wallet_address": test_acc.address,
        "message": message,
        "signature": signed.signature.hex()
    })
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "verified"
    assert data["signer"].lower() == test_acc.address.lower()

def test_whisper_guestbook_sqlite():
    get_res = client.get("/api/v1/whispers")
    assert get_res.status_code == 200
    initial_count = get_res.json()["count"]

    post_res = client.post("/api/v1/whispers", json={
        "author_address": "0x000000000000000000000000000000000000dEaD",
        "message": "Persistent SQLite Guestbook Message!"
    })
    assert post_res.status_code == 200
    assert post_res.json()["status"] == "success"

    updated_res = client.get("/api/v1/whispers")
    assert updated_res.json()["count"] == initial_count + 1

def test_lap_time_leaderboard():
    post_res = client.post("/api/v1/lap-times", json={
        "wallet_address": "0x71C8363837918a71018282823819283749818976",
        "lap_time_seconds": 42.85,
        "drift_score": 1500
    })
    assert post_res.status_code == 200
    assert post_res.json()["status"] == "recorded"

    get_res = client.get("/api/v1/leaderboard")
    assert get_res.status_code == 200
    assert len(get_res.json()) >= 1
