import { useState } from 'react';
import { User, Sparkles, Clock, ArrowRight, ShieldCheck, Zap } from 'lucide-react';
import { Participant, QuizSession } from '../types/quiz';
import { BackgroundCanvas } from './3d/BackgroundCanvas';
import { playClickSound } from '../utils/sound';

interface LobbyScreenProps {
  currentParticipant: Participant | null;
  onJoin: (name: string) => void;
  session: QuizSession;
  participants: Participant[];
  onBypassStart: () => void;
}

export function LobbyScreen({
  currentParticipant,
  onJoin,
  session,
  participants,
  onBypassStart,
}: LobbyScreenProps) {
  const [nameInput, setNameInput] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = nameInput.trim();
    if (!trimmed) {
      setError('Please provide your name to enter the simulation.');
      return;
    }
    setError('');
    playClickSound();
    onJoin(trimmed);
  };

  return (
    <div className="relative min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 sm:p-6 lg:p-8">
      {/* 3D Atmospheric Background */}
      <BackgroundCanvas />

      {/* Main Container */}
      <div className="w-full max-w-xl z-10">
        {!currentParticipant ? (
          /* State 1: Name Entry Screen */
          <div className="glass-panel-glow rounded-3xl p-8 sm:p-12 relative overflow-hidden text-center">
            {/* Ambient background blur pools */}
            <div className="absolute -top-20 -left-20 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-20 -right-20 w-48 h-48 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

            {/* Pill Tag */}
            <div className="flex justify-center mb-6">
              <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-[11px] font-mono tracking-widest uppercase bg-amber-400/10 text-amber-300 border border-amber-400/25">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                10 Architectural 3D Simulations
              </span>
            </div>

            {/* Editorial Title */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight font-display text-white mb-4 leading-tight">
              The AI Architecture <span className="gold-gradient-text">Odyssey</span>
            </h1>

            <p className="text-slate-300 text-sm sm:text-base max-w-md mx-auto mb-8 font-normal leading-relaxed">
              Explore the mathematical elegance of next-token prediction, tokenization, hallucinations, and foundation models through procedural 3D spaces.
            </p>

            {/* Join Form */}
            <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto">
              <div className="text-left">
                <label
                  htmlFor="participant-name"
                  className="block text-[11px] font-mono uppercase tracking-wider text-slate-400 mb-2 pl-1"
                >
                  Candidate Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    id="participant-name"
                    type="text"
                    value={nameInput}
                    onChange={(e) => {
                      setNameInput(e.target.value);
                      if (error) setError('');
                    }}
                    placeholder="e.g. Ada Lovelace"
                    autoComplete="name"
                    maxLength={32}
                    className="w-full pl-10 pr-4 py-3.5 rounded-2xl bg-slate-950/70 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400/80 focus:border-transparent transition-all shadow-inner"
                  />
                </div>
                {error && <p className="text-red-400 text-xs mt-2 pl-1">{error}</p>}
              </div>

              <button
                type="submit"
                className="w-full py-3.5 px-6 rounded-2xl font-bold text-slate-950 bg-gradient-to-r from-amber-300 via-amber-400 to-amber-500 hover:from-amber-200 hover:to-amber-400 shadow-xl shadow-amber-500/20 hover:shadow-amber-500/35 transform hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-center gap-2 text-sm cursor-pointer"
              >
                <span>Enter The Simulation</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            {/* Subtle Minimalist Specs */}
            <div className="mt-10 pt-6 border-t border-white/5 grid grid-cols-3 gap-2 text-center">
              <div>
                <p className="text-base font-bold font-mono text-amber-300">10</p>
                <p className="text-[11px] text-slate-400">Procedural Scenes</p>
              </div>
              <div>
                <p className="text-base font-bold font-mono text-teal-300">Confidential</p>
                <p className="text-[11px] text-slate-400">Hold Until Release</p>
              </div>
              <div>
                <p className="text-base font-bold font-mono text-sky-300">Real-Time</p>
                <p className="text-[11px] text-slate-400">Cross-Device Sync</p>
              </div>
            </div>
          </div>
        ) : (
          /* State 2: Registered In Lobby - Waiting for Host Screen */
          <div className="glass-panel-glow rounded-3xl p-8 sm:p-12 text-center relative overflow-hidden">
            {/* Minimalist Floating Radar Beacon */}
            <div className="relative w-24 h-24 mx-auto mb-6 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border border-amber-400/20 animate-radar" />
              <div className="absolute inset-2 rounded-full border border-teal-400/20 animate-ping opacity-25" />
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/25">
                <Clock className="w-7 h-7 text-slate-950" />
              </div>
            </div>

            {/* Waiting Status */}
            <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-[11px] font-mono tracking-wider bg-amber-400/10 text-amber-300 border border-amber-400/25 mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
              AWAITING HOST LAUNCH SIGNAL
            </span>

            <h2 className="text-2xl sm:text-3xl font-extrabold font-display text-white mb-2">
              Welcome, <span className="text-amber-300">{currentParticipant.name}</span>
            </h2>

            <p className="text-slate-300 text-sm max-w-sm mx-auto mb-8 font-normal leading-relaxed">
              Your profile is registered in the live session roster. When the host begins the trial, your viewport will transition automatically.
            </p>

            {/* Lobby Connected Candidates Roster */}
            <div className="bg-slate-950/60 rounded-2xl p-4 border border-white/5 mb-6 max-w-md mx-auto">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-3 pb-2 border-b border-white/5">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
                  Connected Candidates
                </span>
                <span className="font-mono text-amber-300 text-xs font-semibold">
                  {participants.length} Active
                </span>
              </div>

              <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto pr-1 justify-center">
                {participants.map((p) => (
                  <span
                    key={p.id}
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium border ${
                      p.id === currentParticipant.id
                        ? 'bg-amber-400/15 text-amber-200 border-amber-400/40 font-bold'
                        : 'bg-slate-900/80 text-slate-300 border-white/5'
                    }`}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-teal-400" />
                    {p.name} {p.id === currentParticipant.id && '(You)'}
                  </span>
                ))}
              </div>
            </div>

            {/* Solo Practice Bypass Button */}
            <div className="pt-2 flex flex-col items-center">
              <button
                onClick={() => {
                  playClickSound();
                  onBypassStart();
                }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900/60 hover:bg-slate-800 border border-white/10 text-xs text-slate-300 hover:text-white transition-all cursor-pointer group"
              >
                <Zap className="w-3.5 h-3.5 text-amber-400 group-hover:scale-110 transition-transform" />
                <span>Solo Practice (Begin Without Host)</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
