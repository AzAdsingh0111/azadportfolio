import { ethers } from 'ethers';

// Default backend API URL
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// ERC-1155 PortfolioBadge ABI
export const PORTFOLIO_BADGE_ABI = [
  "function mintWithSignature(uint256 badgeId, bytes calldata signature) external",
  "function hasMinted(address user, uint256 badgeId) external view returns (bool)",
  "function balanceOf(address account, uint256 id) external view returns (uint256)",
  "function serverSigner() external view returns (address)",
  "event BadgeMinted(address indexed recipient, uint256 indexed badgeId)"
];

// Mock Team BYTEX NFT Address
export const TEAM_BYTEX_NFT_ADDRESS = "0x89205A3A3b2A69De6Dbf7f01ED13B2108B2c43e7";

export class Web3Service {
  constructor() {
    this.provider = null;
    this.signer = null;
    this.account = null;
    this.isSimulated = false;
    this.hasBytexPass = true; // By default enabled for visitors, can be toggled in UI
    this.mintedBadges = new Set();
  }

  async connectWallet() {
    if (typeof window !== 'undefined' && window.ethereum) {
      try {
        this.provider = new ethers.BrowserProvider(window.ethereum);
        const accounts = await this.provider.send("eth_requestAccounts", []);
        this.signer = await this.provider.getSigner();
        this.account = accounts[0];
        this.isSimulated = false;
        return {
          success: true,
          account: this.account,
          isSimulated: false
        };
      } catch (err) {
        console.warn("Wallet connection rejected, falling back to simulated mode:", err);
      }
    }

    // Fallback: Create or retrieve local persistent simulated Web3 identity
    return this.createSimulatedWallet();
  }

  createSimulatedWallet() {
    let savedKey = localStorage.getItem('bytex_sim_key');
    let wallet;
    if (savedKey) {
      wallet = new ethers.Wallet(savedKey);
    } else {
      wallet = ethers.Wallet.createRandom();
      localStorage.setItem('bytex_sim_key', wallet.privateKey);
    }

    this.signer = wallet;
    this.account = wallet.address;
    this.isSimulated = true;

    return {
      success: true,
      account: this.account,
      isSimulated: true
    };
  }

  async signMessage(message) {
    if (!this.signer) {
      await this.connectWallet();
    }
    return await this.signer.signMessage(message);
  }

  async requestMintSignature(walletAddress, visitedLandmarks, badgeId = 1) {
    const res = await fetch(`${API_BASE_URL}/api/v1/issue-mint-signature`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        wallet_address: walletAddress,
        visited_landmarks: visitedLandmarks,
        badge_id: badgeId
      })
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.detail || 'Failed to generate cryptographic badge signature');
    }

    return await res.json();
  }

  async fetchWhispers() {
    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/whispers`);
      if (res.ok) {
        const data = await res.json();
        return data.whispers;
      }
    } catch (e) {
      console.warn("Backend whisper fetch error, using local cached whispers:", e);
    }
    return [];
  }

  async postWhisper(message, signature = null) {
    const author = this.account || "0xVisitorAnonymous";
    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/whispers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          author_address: author,
          message: message,
          signature: signature
        })
      });
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {
      console.warn("Backend offline, simulating whisper post:", e);
    }

    return {
      status: "success",
      whisper: {
        id: Date.now(),
        author: `${author.slice(0, 6)}...${author.slice(-4)}`,
        author_address: author,
        message: message,
        timestamp: Math.floor(Date.now() / 1000),
        verified: true,
        signature: signature || "0xsimulated"
      }
    };
  }
}

export const web3Service = new Web3Service();
