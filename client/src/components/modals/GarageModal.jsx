import React, { useState } from 'react';
import { X, ShieldCheck, ShieldAlert, Award, Key, CheckCircle, RefreshCw, Sparkles, ExternalLink } from 'lucide-react';
import confetti from 'canvas-confetti';
import { web3Service } from '../../utils/web3';
import { soundManager } from '../../utils/audio';
import { MintBadgeButton } from '../web3/MintBadgeButton';

export function GarageModal({
  isOpen,
  onClose,
  hasAccess,
  setHasAccess,
  walletAddress,
  onConnectWallet,
  visitedLandmarks = [],
}) {
  const [isMinting, setIsMinting] = useState(false);
  const [mintResult, setMintResult] = useState(null);
  const [mintError, setMintError] = useState(null);

  if (!isOpen) return null;

  const allStations = [
    { id: 'about_monument', label: '1. About Me Monument' },
    { id: 'project_highway', label: '2. Project Highway' },
    { id: 'skills_arena', label: '3. Skills Slalom Arena' },
    { id: 'web3_oasis', label: '4. Web3 Oasis & Garage' },
    { id: 'contact_base', label: '5. Contact Pit Stop' },
  ];

  const completedCount = allStations.filter(s => visitedLandmarks.includes(s.id)).length;
  const isAllExplored = completedCount >= 5;

  const handleClaimBadge = async () => {
    setIsMinting(true);
    setMintError(null);
    setMintResult(null);

    try {
      soundManager.playCheckpointChime();
      let activeWallet = walletAddress;
      if (!activeWallet) {
        const res = await onConnectWallet();
        activeWallet = res.account;
      }

      // 1. Request ECDSA cryptographic signature from FastAPI backend
      const signatureData = await web3Service.requestMintSignature(
        activeWallet,
        visitedLandmarks,
        1
      );

      // 2. Trigger Confetti celebration
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#00f0ff', '#ffd166', '#9d4edd', '#10b981']
      });

      setMintResult(signatureData);
    } catch (err) {
      setMintError(err.message || 'Error communicating with Web3 backend.');
    } finally {
      setIsMinting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl bg-slate-900 border border-amber-500/50 shadow-[0_0_50px_rgba(255,209,102,0.3)] p-6 md:p-8 text-slate-100 scanline">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-lg bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 border-b border-amber-500/30 pb-4 mb-6">
          <div className="p-3 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/40">
            <Award className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-400">
                STATION 4 // TOKEN-GATED ZONE
              </span>
              <span className="text-xs font-mono text-slate-400">Team BYTEX Winner Garage</span>
            </div>
            <h2 className="text-2xl font-black tracking-tight text-white mt-1">
              Web3 Oasis & Proof of Exploration
            </h2>
          </div>
        </div>

        {/* Token-Gated Status Card */}
        <div className={`p-5 rounded-xl border mb-6 transition-all ${
          hasAccess 
            ? 'bg-emerald-950/40 border-emerald-500/50' 
            : 'bg-rose-950/40 border-rose-500/50'
        }`}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-start gap-3">
              {hasAccess ? (
                <ShieldCheck className="w-6 h-6 text-emerald-400 mt-0.5" />
              ) : (
                <ShieldAlert className="w-6 h-6 text-rose-400 mt-0.5" />
              )}
              <div>
                <h4 className="text-sm font-bold text-white">
                  {hasAccess ? 'Access Granted: Team BYTEX Winner Pass Active' : 'Access Restricted: Token Gate Locked'}
                </h4>
                <p className="text-xs text-slate-300 mt-0.5">
                  {hasAccess
                    ? 'Your wallet holds the verified Team BYTEX Hackathon Credential.'
                    : 'Requires Team BYTEX Hackathon NFT (Contract: 0x89205A...c43e7) to enter.'}
                </p>
              </div>
            </div>

            {/* Toggle Pass Button for Demonstration */}
            <button
              onClick={() => setHasAccess(!hasAccess)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-colors whitespace-nowrap ${
                hasAccess
                  ? 'bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40'
                  : 'bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40'
              }`}
            >
              {hasAccess ? '✓ Pass Active (Click to Toggle)' : '⚡ Simulate Holding Pass'}
            </button>
          </div>
        </div>

        {/* Proof of Exploration Station Exploration Checklist */}
        <div className="p-5 rounded-xl bg-slate-950/80 border border-slate-800 mb-6">
          <div className="flex items-center justify-between mb-3 border-b border-slate-800 pb-2">
            <h4 className="text-xs font-mono font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
              <Key className="w-4 h-4 text-amber-400" />
              Exploration Telemetry ({completedCount}/5 Complete)
            </h4>
            <span className={`text-xs font-mono font-bold ${isAllExplored ? 'text-emerald-400' : 'text-amber-400'}`}>
              {isAllExplored ? '✓ READY TO MINT' : 'DRIVE TO REMAINING STATIONS'}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
            {allStations.map((station) => {
              const visited = visitedLandmarks.includes(station.id);
              return (
                <div
                  key={station.id}
                  className={`p-2.5 rounded-lg border text-xs font-mono flex items-center justify-between ${
                    visited
                      ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-300'
                      : 'bg-slate-900 border-slate-800 text-slate-500'
                  }`}
                >
                  <span>{station.label}</span>
                  {visited ? <CheckCircle className="w-4 h-4 text-emerald-400" /> : <span className="text-[10px]">UNVISITED</span>}
                </div>
              );
            })}
          </div>

          {/* Minting Action Section */}
          <div className="pt-2">
            <button
              onClick={handleClaimBadge}
              disabled={isMinting || !isAllExplored}
              className={`w-full py-3 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-lg ${
                isAllExplored
                  ? 'bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 cursor-pointer shadow-[0_0_20px_rgba(255,209,102,0.4)]'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
              }`}
            >
              {isMinting ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Requesting ECDSA Proof from FastAPI Backend...</span>
                </>
              ) : isAllExplored ? (
                <>
                  <Sparkles className="w-4 h-4 text-slate-950" />
                  <span>Claim On-Chain Proof of Exploration Badge (ERC-1155)</span>
                </>
              ) : (
                <span>Visit All 5 Landmarks to Unlock Badge Minting ({completedCount}/5)</span>
              )}
            </button>
          </div>

          {/* Error Message */}
          {mintError && (
            <div className="mt-3 p-3 rounded-lg bg-rose-950/50 border border-rose-500/50 text-rose-300 text-xs font-mono">
              ⚠️ {mintError}
            </div>
          )}

          {/* Success / Mint Signature Proof Output & On-Chain Mint Button */}
          {mintResult && (
            <div className="mt-4 p-4 rounded-xl bg-slate-900 border border-emerald-500/50 space-y-3 text-xs font-mono">
              <div className="flex items-center justify-between text-emerald-400 font-bold border-b border-emerald-500/30 pb-1">
                <span>🎉 SERVER SIGNATURE APPROVED!</span>
                <span className="text-[10px] bg-emerald-500/20 px-2 py-0.5 rounded">EIP-712 / ECDSA VERIFIED</span>
              </div>
              <p className="text-slate-300">
                <strong className="text-slate-400">Recipient Wallet:</strong> {mintResult.wallet}
              </p>
              <p className="text-slate-300">
                <strong className="text-slate-400">Token ID:</strong> ERC-1155 #{mintResult.badge_id} (Proof of Exploration)
              </p>
              <p className="text-slate-300">
                <strong className="text-slate-400">Server Signer:</strong> {mintResult.server_signer}
              </p>
              <div className="bg-black/50 p-2 rounded-lg border border-slate-800 overflow-x-auto">
                <span className="text-[10px] text-slate-500 block mb-1">ECDSA Cryptographic Signature:</span>
                <span className="text-[11px] text-cyan-300 break-all">{mintResult.signature}</span>
              </div>

              {/* On-Chain Mint Button Handshake */}
              <div className="pt-2">
                <MintBadgeButton
                  badgeId={mintResult.badge_id}
                  signature={mintResult.signature}
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="mt-6 pt-4 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm transition-colors shadow-lg"
          >
            Continue Driving 🏎️
          </button>
        </div>

      </div>
    </div>
  );
}
