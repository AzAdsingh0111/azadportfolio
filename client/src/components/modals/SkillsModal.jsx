import React from 'react';
import { X, Target, CheckCircle2, Zap, Flame, Code, Database, Globe, BarChart3, FlaskConical } from 'lucide-react';
import { INITIAL_SKILLS } from '../canvas/landmarks/SkillsArena';

export function SkillsModal({ isOpen, onClose, collectedSkills = [] }) {
  if (!isOpen) return null;

  const totalSkills = INITIAL_SKILLS.length;
  const collectedCount = collectedSkills.length;
  const progressPercent = Math.round((collectedCount / totalSkills) * 100);

  const categories = [
    { name: 'Core Languages', icon: Code, color: 'text-cyan-400', skills: ['cpp', 'java', 'sql'] },
    { name: 'Web & Distributed', icon: Globe, color: 'text-purple-400', skills: ['html_css', 'xmpp'] },
    { name: 'Data Science & Lab', icon: FlaskConical, color: 'text-emerald-400', skills: ['data_analysis', 'data_viz', 'bio_research'] },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl bg-slate-900 border border-emerald-500/50 shadow-[0_0_50px_rgba(16,185,129,0.3)] p-6 md:p-8 text-slate-100 scanline">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-lg bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 border-b border-emerald-500/30 pb-4 mb-6">
          <div className="p-3 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
            <Target className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400">
                STATION 3 // SKILLS ARENA
              </span>
              <span className="text-xs font-mono text-slate-400">Verified Capability Ledger</span>
            </div>
            <h2 className="text-2xl font-black tracking-tight text-white mt-1">
              Technical Toolkit & Slalom Stats
            </h2>
          </div>
        </div>

        {/* Arena Slalom Progress Banner */}
        <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-950/50 to-slate-900 border border-emerald-500/40 mb-6">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Flame className="w-5 h-5 text-amber-400 animate-bounce" />
              <span className="text-xs font-mono font-bold text-white uppercase">Arena Collision Verification</span>
            </div>
            <span className="text-xs font-mono font-bold text-emerald-400">
              {collectedCount} / {totalSkills} Unlocked ({progressPercent}%)
            </span>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden p-0.5">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-cyan-400 rounded-full transition-all duration-500 shadow-[0_0_12px_#10b981]"
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
          <p className="text-[11px] font-mono text-slate-400 mt-2">
            💡 Drive your car into the glowing floating orbs on the slalom track to unlock skill tokens!
          </p>
        </div>

        {/* Skill Category Breakdown */}
        <div className="space-y-5">
          {categories.map((cat, idx) => {
            const Icon = cat.icon;
            const categorySkills = INITIAL_SKILLS.filter(s => cat.skills.includes(s.id));

            return (
              <div key={idx} className="p-4 rounded-xl bg-slate-950/70 border border-slate-800">
                <div className="flex items-center gap-2 mb-3">
                  <Icon className={`w-4 h-4 ${cat.color}`} />
                  <h3 className="text-sm font-mono font-bold text-white uppercase tracking-wider">{cat.name}</h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {categorySkills.map(skill => {
                    const isUnlocked = collectedSkills.includes(skill.id);
                    return (
                      <div
                        key={skill.id}
                        className={`p-3 rounded-xl border transition-all flex items-center justify-between ${
                          isUnlocked
                            ? 'bg-emerald-950/30 border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.2)]'
                            : 'bg-slate-900/50 border-slate-800 opacity-60'
                        }`}
                      >
                        <div>
                          <h4 className="text-xs font-bold text-white">{skill.name}</h4>
                          <span className="text-[10px] font-mono text-slate-400">{skill.category}</span>
                        </div>
                        {isUnlocked ? (
                          <span className="flex items-center gap-1 text-[10px] font-mono font-bold text-emerald-400 px-1.5 py-0.5 rounded bg-emerald-500/20">
                            <CheckCircle2 className="w-3 h-3" /> VERIFIED
                          </span>
                        ) : (
                          <span className="text-[10px] font-mono text-slate-500">LOCKED</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer Actions */}
        <div className="mt-6 pt-4 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm transition-colors shadow-lg"
          >
            Back to Race Track 🏎️
          </button>
        </div>

      </div>
    </div>
  );
}
