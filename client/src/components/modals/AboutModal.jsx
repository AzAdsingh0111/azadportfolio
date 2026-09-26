import React from 'react';
import { X, GraduationCap, Award, BookOpen, Dna, Database, Terminal, CheckCircle2 } from 'lucide-react';

export function AboutModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl bg-slate-900 border border-cyan-500/50 shadow-[0_0_50px_rgba(0,240,255,0.3)] p-6 md:p-8 text-slate-100 scanline">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-lg bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 border-b border-cyan-500/30 pb-4 mb-6">
          <div className="p-3 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/40">
            <GraduationCap className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-400">
                STATION 1 // CANDIDATE PROFILE
              </span>
              <span className="text-xs font-mono text-slate-400">Dual Degree Foundation</span>
            </div>
            <h2 className="text-2xl font-black tracking-tight text-white mt-1">
              About Me & Academic Journey
            </h2>
          </div>
        </div>

        {/* Personal Bio Narrative */}
        <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700 mb-6">
          <h3 className="text-sm font-mono font-bold text-cyan-300 uppercase tracking-wider mb-2 flex items-center gap-2">
            <Terminal className="w-4 h-4 text-cyan-400" />
            Engineering Philosophy
          </h3>
          <p className="text-sm leading-relaxed text-slate-300">
            A versatile developer blending an empirical scientific mindset with data science and robust software architecture. 
            Trained in rigorous biological research and statistical modeling, I build reliable, high-performance distributed systems, 
            spatial mapping platforms, and interactive WebGL experiences.
          </p>
        </div>

        {/* Academic Dual Foundation Timeline */}
        <h3 className="text-base font-bold text-white mb-3 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-purple-400" />
          Academic Dual Foundation
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {/* Degree 1: B.Sc. Zoology & Botany */}
          <div className="p-5 rounded-xl bg-gradient-to-br from-slate-900 to-emerald-950/40 border border-emerald-500/30 hover:border-emerald-500/60 transition-all">
            <div className="flex items-center justify-between mb-2">
              <span className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400">
                <Dna className="w-5 h-5" />
              </span>
              <span className="text-xs font-mono font-bold px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-300">
                2022 – 2024
              </span>
            </div>
            <h4 className="text-base font-bold text-white">B.Sc. in Zoology & Botany</h4>
            <p className="text-xs font-mono text-emerald-400 mt-0.5">MSDU University</p>
            <p className="text-xs text-slate-300 mt-2.5 leading-relaxed">
              Biological sciences, ecology, taxonomy, empirical research methodology, and analytical laboratory practices. Developed strong scientific hypothesis testing and investigative rigor.
            </p>
          </div>

          {/* Degree 2: BCA Data Science */}
          <div className="p-5 rounded-xl bg-gradient-to-br from-slate-900 to-cyan-950/40 border border-cyan-500/30 hover:border-cyan-500/60 transition-all">
            <div className="flex items-center justify-between mb-2">
              <span className="p-2 rounded-lg bg-cyan-500/20 text-cyan-400">
                <Database className="w-5 h-5" />
              </span>
              <span className="text-xs font-mono font-bold px-2.5 py-1 rounded bg-cyan-500/20 text-cyan-300">
                2024 – 2027
              </span>
            </div>
            <h4 className="text-base font-bold text-white">BCA in Data Science</h4>
            <p className="text-xs font-mono text-cyan-400 mt-0.5">J.C. Bose Institute of Science & Technology</p>
            <p className="text-xs text-slate-300 mt-2.5 leading-relaxed">
              Data analysis, programming algorithms, data visualization, statistical modeling, database systems (SQL), and enterprise software engineering.
            </p>
          </div>
        </div>

        {/* Hackathon Achievement Highlights */}
        <div className="p-5 rounded-xl bg-gradient-to-r from-amber-950/40 via-purple-950/30 to-slate-900 border border-amber-500/40">
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-lg bg-amber-500/20 text-amber-400 mt-0.5">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300">
                  INTERNATIONAL HACKATHON 2026
                </span>
                <span className="text-xs font-bold text-emerald-400">🏆 4th Position Winner</span>
              </div>
              <h4 className="text-base font-bold text-white mt-1">
                Team BYTEX — "Cartographer" Hidden Place & Vibe Finder
              </h4>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                Organized by JNTUH College of Engineering, Hyderabad. Built spatial mapping algorithms for hidden location discovery, crowd-vibe scoring, and decentralized verification.
              </p>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="mt-6 pt-4 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm transition-colors shadow-lg"
          >
            Continue Circuit Drive 🏎️
          </button>
        </div>

      </div>
    </div>
  );
}
