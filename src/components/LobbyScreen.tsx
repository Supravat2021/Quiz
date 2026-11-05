import { useState } from 'react';
import { User, Play, Sparkles, Clock, ArrowRight, ShieldCheck, Zap } from 'lucide-react';
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
      setError('Please enter your full name to join.');
      return;
    }
    setError('');
    playClickSound();
    onJoin(trimmed);
  };

  return (
    <div className="relative min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 sm:p-6 lg:p-8">
      {/* 3D Background Canvas */}
      <BackgroundCanvas />

      {/* Main Container */}
      <div className="w-full max-w-2xl z-10">
        {!currentParticipant ? (
          /* State 1: Name Entry Screen */
          <div className="glass-panel-glow rounded-3xl p-6 sm:p-10 border border-slate-700/60 shadow-2xl relative overflow-hidden">
            {/* Background ambient decorative blurs */}
            <div className="absolute -top-24 -left-24 w-52 h-52 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -right-24 w-52 h-52 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

            {/* Badge */}
            <div className="flex justify-center mb-6">
              <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono font-medium tracking-wide bg-amber-400/10 text-amber-300 border border-amber-400/30">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                10 PROCEDURAL 3D CHALLENGES
              </span>
            </div>

            {/* Heading */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-center tracking-tight text-white mb-4">
              Enter The <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-400 to-amber-500">3D AI Arena</span>
            </h1>

            <p className="text-center text-slate-300 text-sm sm:text-base max-w-lg mx-auto mb-8 leading-relaxed">
              Test your knowledge on LLMs, tokens, hallucinations, and prompt engineering with interactive real-time 3D simulations.
            </p>

            {/* Join Form */}
            <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto">
              <div>
                <label
                  htmlFor="participant-name"
                  className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2"
                >
                  Enter Your Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <User className="w-5 h-5" />
                  </div>
                  <input
                    id="participant-name"
                    type="text"
                    value={nameInput}
                    onChange={(e) => {
                      setNameInput(e.target.value);
                      if (error) setError('');
                    }}
                    placeholder="e.g. Geoffrey Hinton"
                    autoComplete="name"
                    maxLength={32}
                    className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-slate-900/90 border border-slate-700 text-white placeholder-slate-500 text-base focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all"
                  />
                </div>
                {error && <p className="text-red-400 text-xs mt-2 pl-1">{error}</p>}
              </div>

              <button
                type="submit"
                className="w-full py-3.5 px-6 rounded-xl font-bold text-slate-950 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 transform hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-center gap-2 text-base cursor-pointer"
              >
                <span>Join Quiz Lobby</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </form>

            {/* Feature quick specs */}
            <div className="mt-8 pt-6 border-t border-slate-800/80 grid grid-cols-3 gap-2 text-center">
              <div className="p-2">
                <p className="text-lg font-bold text-amber-400">10</p>
                <p className="text-[11px] text-slate-400 font-medium">Unique 3D Scenes</p>
              </div>
              <div className="p-2">
                <p className="text-lg font-bold text-cyan-400">+100</p>
                <p className="text-[11px] text-slate-400 font-medium">Pts + Speed Bonus</p>
              </div>
              <div className="p-2">
                <p className="text-lg font-bold text-indigo-400">Live</p>
                <p className="text-[11px] text-slate-400 font-medium">Dual-Mode Sync</p>
              </div>
            </div>
          </div>
        ) : (
          /* State 2: Registered In Lobby - Waiting for Host Screen */
          <div className="glass-panel-glow rounded-3xl p-6 sm:p-10 border border-slate-700/60 shadow-2xl text-center relative overflow-hidden">
            {/* Animated Pulsing Radar Beacon */}
            <div className="relative w-28 h-28 mx-auto mb-6 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border border-amber-400/40 animate-radar" />
              <div className="absolute inset-3 rounded-full border border-cyan-400/30 animate-ping opacity-30" />
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/30">
                <Clock className="w-8 h-8 text-slate-950 animate-pulse" />
              </div>
            </div>

            {/* Waiting Status */}
            <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-mono font-semibold bg-amber-400/10 text-amber-300 border border-amber-400/30 mb-3">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
              WAITING FOR HOST TO START THE QUIZ
            </span>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-2">
              Welcome, <span className="text-amber-400">{currentParticipant.name}</span>!
            </h2>

            <p className="text-slate-300 text-sm max-w-md mx-auto mb-8">
              You are locked in. When the quiz host starts the session from the Admin portal, your screen will automatically launch into Question 1.
            </p>

            {/* Lobby Roster Preview */}
            <div className="bg-slate-900/80 rounded-2xl p-4 border border-slate-800 mb-6 max-w-md mx-auto">
              <div className="flex items-center justify-between text-xs text-slate-400 font-medium mb-3 pb-2 border-b border-slate-800">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  Connected Participants
                </span>
                <span className="font-mono text-amber-400 font-bold">
                  {participants.length} Active
                </span>
              </div>

              <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto pr-1">
                {participants.map((p) => (
                  <span
                    key={p.id}
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium border ${
                      p.id === currentParticipant.id
                        ? 'bg-amber-400/20 text-amber-300 border-amber-400/50 font-bold'
                        : 'bg-slate-800/90 text-slate-300 border-slate-700/60'
                    }`}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
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
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800/90 hover:bg-slate-700/90 border border-slate-700 text-xs font-semibold text-slate-300 hover:text-white transition-all cursor-pointer group"
              >
                <Zap className="w-3.5 h-3.5 text-amber-400 group-hover:scale-110 transition-transform" />
                <span>Solo Practice Bypass (Start Without Host)</span>
              </button>
              <p className="text-[11px] text-slate-500 mt-2">
                Use bypass to test and preview the 3D quiz immediately on a single tab.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
