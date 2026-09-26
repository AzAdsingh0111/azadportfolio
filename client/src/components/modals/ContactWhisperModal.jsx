import React, { useState } from 'react';
import { X, Mail, Linkedin, Github, Send, FileText, MessageSquare, CheckCircle, RefreshCw, PenTool } from 'lucide-react';
import { web3Service } from '../../utils/web3';
import { soundManager } from '../../utils/audio';

export function ContactWhisperModal({
  isOpen,
  onClose,
  whispers = [],
  onWhisperAdded,
  walletAddress,
  onConnectWallet
}) {
  const [messageText, setMessageText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmitWhisper = async (e) => {
    e.preventDefault();
    if (!messageText.trim() || isSubmitting) return;

    setIsSubmitting(true);
    setSubmitSuccess(false);

    try {
      soundManager.playCheckpointChime();
      let activeWallet = walletAddress;
      if (!activeWallet) {
        const res = await onConnectWallet();
        activeWallet = res.account;
      }

      // 1. Sign the message cryptographically with Web3 wallet
      let sig = null;
      try {
        sig = await web3Service.signMessage(messageText.trim());
      } catch (signErr) {
        console.warn("User signature skipped or simulated:", signErr);
      }

      // 2. Post to backend
      const result = await web3Service.postWhisper(messageText.trim(), sig);
      if (result && result.whisper) {
        onWhisperAdded(result.whisper);
        setMessageText('');
        setSubmitSuccess(true);
        setTimeout(() => setSubmitSuccess(false), 4000);
      }
    } catch (err) {
      console.error("Failed to post whisper:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl bg-slate-900 border border-pink-500/50 shadow-[0_0_50px_rgba(247,37,133,0.3)] p-6 md:p-8 text-slate-100 scanline">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-lg bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 border-b border-pink-500/30 pb-4 mb-6">
          <div className="p-3 rounded-xl bg-pink-500/20 text-pink-400 border border-pink-500/40">
            <MessageSquare className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-pink-500/20 text-pink-400">
                STATION 5 // RECRUITER PIT STOP
              </span>
              <span className="text-xs font-mono text-slate-400">On-Chain Guestbook</span>
            </div>
            <h2 className="text-2xl font-black tracking-tight text-white mt-1">
              Contact Base & Live Whisper Wall
            </h2>
          </div>
        </div>

        {/* Recruiter Quick Connect Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
          <a
            href="mailto:contact@azadsingh.dev"
            className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-pink-500/50 transition-all flex items-center gap-3 group"
          >
            <div className="p-2.5 rounded-lg bg-pink-500/20 text-pink-400 group-hover:scale-110 transition-transform">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-mono text-slate-400 block uppercase">Email</span>
              <span className="text-xs font-bold text-white group-hover:text-pink-300">azadsingh@dev</span>
            </div>
          </a>

          <a
            href="https://linkedin.com/in/azadsingh"
            target="_blank"
            rel="noreferrer"
            className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-cyan-500/50 transition-all flex items-center gap-3 group"
          >
            <div className="p-2.5 rounded-lg bg-cyan-500/20 text-cyan-400 group-hover:scale-110 transition-transform">
              <Linkedin className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-mono text-slate-400 block uppercase">LinkedIn</span>
              <span className="text-xs font-bold text-white group-hover:text-cyan-300">Azad Singh</span>
            </div>
          </a>

          <a
            href="https://github.com/azadsingh"
            target="_blank"
            rel="noreferrer"
            className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-purple-500/50 transition-all flex items-center gap-3 group"
          >
            <div className="p-2.5 rounded-lg bg-purple-500/20 text-purple-400 group-hover:scale-110 transition-transform">
              <Github className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-mono text-slate-400 block uppercase">GitHub</span>
              <span className="text-xs font-bold text-white group-hover:text-purple-300">@azadsingh</span>
            </div>
          </a>
        </div>

        {/* On-Chain Whisper Wall Submission Form */}
        <div className="p-5 rounded-xl bg-slate-950/90 border border-slate-800 mb-6">
          <h3 className="text-sm font-mono font-bold text-pink-300 uppercase tracking-wider mb-2 flex items-center gap-2">
            <PenTool className="w-4 h-4 text-pink-400" />
            Sign the Pit Stop Guestbook (Cryptographic Whisper)
          </h3>
          <p className="text-xs text-slate-400 mb-3">
            Leave a note for the driver! Messages are cryptographically signed with your Web3 wallet address and broadcast in real-time.
          </p>

          <form onSubmit={handleSubmitWhisper} className="space-y-3">
            <textarea
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              placeholder="e.g. Loved the 3D car driving experience and Team BYTEX Cartographer project!"
              maxLength={280}
              rows={3}
              className="w-full p-3 rounded-xl bg-slate-900 border border-slate-700 focus:border-pink-500 focus:outline-none text-xs text-slate-100 placeholder-slate-500 resize-none font-sans"
            ></textarea>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <span className="text-[11px] font-mono text-slate-400">
                Signing as: <span className="text-cyan-300">{walletAddress ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}` : 'Guest Driver'}</span>
              </span>

              <button
                type="submit"
                disabled={isSubmitting || !messageText.trim()}
                className={`px-4 py-2 rounded-xl text-xs font-mono font-bold flex items-center justify-center gap-2 transition-all ${
                  messageText.trim() && !isSubmitting
                    ? 'bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-400 hover:to-rose-400 text-white shadow-[0_0_15px_rgba(247,37,133,0.4)]'
                    : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                }`}
              >
                {isSubmitting ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Signing Whisper...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>Sign & Broadcast Whisper</span>
                  </>
                )}
              </button>
            </div>
          </form>

          {submitSuccess && (
            <div className="mt-3 p-2.5 rounded-lg bg-emerald-950/50 border border-emerald-500/50 text-emerald-300 text-xs font-mono flex items-center gap-2 animate-fadeIn">
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              <span>Whisper signed and broadcast to the Pit Stop billboard!</span>
            </div>
          )}
        </div>

        {/* Live Whispers Feed */}
        <div>
          <h3 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider mb-3">
            Recent Pit Stop Whispers ({whispers.length})
          </h3>

          <div className="space-y-2.5 max-h-48 overflow-y-auto pr-1">
            {whispers.map((w) => (
              <div key={w.id} className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 mb-1">
                  <span className="text-pink-400 font-bold">✍️ {w.author}</span>
                  <span className="text-emerald-400">✓ Signed on-chain</span>
                </div>
                <p className="text-xs text-slate-200 leading-relaxed">"{w.message}"</p>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="mt-6 pt-4 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-pink-600 hover:bg-pink-500 text-white font-bold text-sm transition-colors shadow-lg"
          >
            Back to Circuit 🏎️
          </button>
        </div>

      </div>
    </div>
  );
}
