import React, { useState } from 'react';
import { X, ExternalLink, Github, Layers, Trophy, Network, Server, Monitor, Code2, ArrowRight } from 'lucide-react';

const PROJECTS = [
  {
    id: 'cartographer',
    name: 'Cartographer',
    subtitle: 'Hidden Location & Vibe Mapping Platform',
    category: 'Hackathon Champion',
    badge: '🏆 4th Position - Int. Hackathon 2026 (JNTUH Hyderabad)',
    year: '2026',
    team: 'Team BYTEX',
    description: 'An intelligent spatial discovery engine that uncovers obscure cultural landmarks, hidden spots, and ambient vibe scores using geospatial clustering algorithms and real-time community verification.',
    highlights: [
      'Engineered geospatial point-of-interest clustering for crowd density and mood telemetry',
      'Designed zero-latency vibe mapping and location verification engine',
      'Awarded 4th place among hundreds of international competing teams at JNTUH Hyderabad'
    ],
    techStack: ['Python', 'FastAPI', 'C++', 'Data Visualization', 'React', 'Spatial Algorithms', 'Web3 Proofs'],
    githubUrl: 'https://github.com/AzAdsingh0111',
    liveUrl: '#',
    architecture: 'Mobile/Web Client ──► FastAPI Vibe Engine ──► Spatial Clustering (C++) ──► Community Ledger'
  },
  {
    id: 'panel-room',
    name: 'Panel Room Conference Meeting System',
    subtitle: 'Enterprise Room Orchestration & Video Sync',
    category: 'Enterprise Software',
    badge: 'ENTERPRISE SCALE',
    year: '2025 – 2026',
    description: 'A robust meeting room orchestration platform built for automated scheduling, active participant telemetry, role-based meeting rooms, and synchronized digital whiteboard collaboration.',
    highlights: [
      'Multi-room automated conflict resolution and scheduling engine',
      'Sub-50ms WebSocket room state replication and participant heartbeat monitor',
      'Integrated meeting summaries and cryptographic attendee verification'
    ],
    techStack: ['Java', 'SQL', 'WebSockets', 'React', 'Tailwind CSS', 'Docker'],
    githubUrl: 'https://github.com/AzAdsingh0111',
    liveUrl: '#',
    architecture: 'React Conference UI ──► Java Backend Gateway ──► SQL Database + Redis Sync Cache'
  },
  {
    id: 'xmpp-server',
    name: 'XMPP Server Real-Time Architecture',
    subtitle: 'Distributed Instant Messaging & Pub-Sub Gateway',
    category: 'Distributed Systems',
    badge: 'CORE PROTOCOL',
    year: '2025',
    description: 'High-throughput XMPP (Extensible Messaging and Presence Protocol) implementation designed for resilient bidirectional real-time XML stream routing and federated messaging nodes.',
    highlights: [
      'Custom stanza router processing thousands of concurrent user state broadcasts',
      'Asynchronous TLS socket multiplexer with low memory footprint',
      'Robust roster presence management and offline message spooling'
    ],
    techStack: ['C++', 'Java', 'XMPP Protocol', 'TCP/IP Sockets', 'Concurrency', 'SQL'],
    githubUrl: 'https://github.com/AzAdsingh0111',
    liveUrl: '#',
    architecture: 'Client XMPP Stanzas ──► TCP Socket Reactor ──► XML Parser ──► Routing Matrix'
  },
  {
    id: 'web-showcase',
    name: 'Full-Stack Web Development Showcase',
    subtitle: 'Modern WebGL & Interactive Applications',
    category: 'Web Applications',
    badge: 'PRODUCTION READY',
    year: '2025 – Present',
    description: 'A portfolio of high-performance web applications, featuring WebGL 3D driving mechanics, interactive data visualization dashboards, and modern decentralized Web3 interfaces.',
    highlights: [
      'Arcade vehicle physics engine with custom shader visual FX',
      'Smart contract integration with server-side ECDSA cryptographic authorization',
      'Pixel-perfect responsive cyberpunk glassmorphism design system'
    ],
    techStack: ['React', 'Three.js / R3F', 'Vite', 'Tailwind CSS', 'Wagmi / Ethers', 'Python FastAPI'],
    githubUrl: 'https://github.com/AzAdsingh0111',
    liveUrl: '#',
    architecture: 'React 18 + R3F ──► Web Audio API ──► FastAPI REST / WS ──► EVM Smart Contracts'
  }
];

export function ProjectsModal({ isOpen, onClose }) {
  const [selectedId, setSelectedId] = useState('cartographer');
  if (!isOpen) return null;

  const currentProject = PROJECTS.find(p => p.id === selectedId) || PROJECTS[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl bg-slate-900 border border-purple-500/50 shadow-[0_0_50px_rgba(157,78,221,0.3)] p-6 md:p-8 text-slate-100 scanline">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-lg bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 border-b border-purple-500/30 pb-4 mb-6">
          <div className="p-3 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/40">
            <Layers className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-purple-500/20 text-purple-400">
                STATION 2 // PROJECT HIGHWAY
              </span>
              <span className="text-xs font-mono text-slate-400">4 Core Engineering Builds</span>
            </div>
            <h2 className="text-2xl font-black tracking-tight text-white mt-1">
              Software Architecture & Project Showcase
            </h2>
          </div>
        </div>

        {/* Project Selector Tabs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-6">
          {PROJECTS.map((proj) => {
            const isSelected = proj.id === selectedId;
            return (
              <button
                key={proj.id}
                onClick={() => setSelectedId(proj.id)}
                className={`p-3 rounded-xl text-left transition-all border ${
                  isSelected
                    ? 'bg-purple-900/40 border-purple-400 text-white shadow-[0_0_15px_rgba(157,78,221,0.3)]'
                    : 'bg-slate-800/60 border-slate-700 text-slate-400 hover:text-slate-200 hover:border-slate-600'
                }`}
              >
                <span className="text-[10px] font-mono font-bold block text-purple-400">{proj.year}</span>
                <span className="text-xs font-bold block truncate mt-0.5">{proj.name}</span>
              </button>
            );
          })}
        </div>

        {/* Selected Project Deep Dive Card */}
        <div className="p-6 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-5">
          {/* Title & Badge */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-slate-800 pb-4">
            <div>
              <span className="text-xs font-mono font-bold px-2.5 py-1 rounded bg-amber-400/20 text-amber-300 border border-amber-400/30 inline-block mb-1.5">
                {currentProject.badge}
              </span>
              <h3 className="text-xl font-bold text-white">{currentProject.name}</h3>
              <p className="text-xs text-purple-300 font-mono mt-0.5">{currentProject.subtitle}</p>
            </div>

            <div className="flex items-center gap-2">
              <a
                href={currentProject.githubUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-mono font-bold text-slate-200 transition-colors"
              >
                <Github className="w-4 h-4" />
                <span>GitHub Code</span>
              </a>
            </div>
          </div>

          {/* Description */}
          <p className="text-sm text-slate-300 leading-relaxed">
            {currentProject.description}
          </p>

          {/* Architecture Pipeline Flow */}
          <div className="p-3.5 rounded-xl bg-slate-900 border border-purple-500/20">
            <span className="text-[11px] font-mono font-bold text-purple-400 block mb-1.5 uppercase">
              ⚡ System Architecture Topology
            </span>
            <code className="text-xs text-cyan-300 font-mono block bg-black/50 p-2.5 rounded-lg overflow-x-auto">
              {currentProject.architecture}
            </code>
          </div>

          {/* Key Engineering Highlights */}
          <div>
            <h4 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider mb-2">
              Engineering Achievements
            </h4>
            <ul className="space-y-1.5">
              {currentProject.highlights.map((h, i) => (
                <li key={i} className="text-xs text-slate-300 flex items-start gap-2">
                  <span className="text-purple-400 mt-0.5">▪</span>
                  <span>{h}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Tech Stack Pills */}
          <div>
            <h4 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider mb-2">
              Technologies & Toolkit
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {currentProject.techStack.map((tech) => (
                <span
                  key={tech}
                  className="px-2.5 py-1 rounded-md bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-mono font-semibold"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="mt-6 pt-4 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-sm transition-colors shadow-lg"
          >
            Drive to Next Landmark 🏎️
          </button>
        </div>

      </div>
    </div>
  );
}
