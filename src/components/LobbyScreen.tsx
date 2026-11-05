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
      setError('Please enter your name to join the game!');
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
          <div className="glass-panel-glow rounded-3xl p-8 sm:p-12 relative overflow-hidden text-center border-2 border-purple-500/30">
            {/* Ambient Background Light Flares */}
            <div className="absolute -top-24 -left-24 w-52 h-52 bg-pink-500/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -right-24 w-52 h-52 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none" />

            {/* Playful Tag */}
            <div className="flex justify-center mb-6">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-md shadow-pink-500/25">
                <Sparkles className="w-3.5 h-3.5" />
                10 Interactive 3D Stages
              </span>
            </div>

            {/* Vibrant Title */}
            <h1 className="text-4xl sm:text-5xl font-black tracking-tight font-display text-white mb-4 leading-tight">
              AI Trivia <span className="gradient-text-fun">Arena 3D</span>
            </h1>

            <p className="text-slate-200 text-base max-w-md mx-auto mb-8 font-medium leading-relaxed">
              Step into 10 colorful 3D simulations. Guess next tokens, identify hallucinations, and climb the live leaderboard!
            </p>

            {/* Join Form */}
            <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto">
              <div className="text-left">
                <label
                  htmlFor="participant-name"
                  className="block text-xs font-bold uppercase tracking-wider text-pink-300 mb-2 pl-1"
                >
                  Your Player Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <User className="w-5 h-5 text-purple-400" />
                  </div>
                  <input
                    id="participant-name"
                    type="text"
                    value={nameInput}
                    onChange={(e) => {
                      setNameInput(e.target.value);
                      if (error) setError('');
                    }}
                    placeholder="Enter your nickname..."
                    autoComplete="name"
                    maxLength={28}
                    className="w-full pl-11 pr-4 py-4 rounded-2xl bg-[#110e28] border-2 border-purple-500/40 text-white placeholder-slate-400 font-bold text-base focus:outline-none focus:border-pink-500 focus:ring-4 focus:ring-pink-500/20 transition-all shadow-inner"
                  />
                </div>
                {error && <p className="text-rose-400 text-xs mt-2 pl-1 font-semibold">{error}</p>}
              </div>

              <button
                type="submit"
                className="w-full py-4 px-6 rounded-2xl font-black text-white bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-600 hover:from-pink-400 hover:via-purple-500 hover:to-indigo-500 shadow-xl shadow-pink-500/30 hover:shadow-pink-500/45 transform hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-center gap-2 text-base cursor-pointer"
              >
                <span>Join Game Lobby</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </form>

            {/* Vibrant Solid Badges */}
            <div className="mt-10 pt-6 border-t border-white/10 grid grid-cols-3 gap-3 text-center">
              <div className="bg-purple-950/40 p-3 rounded-2xl border border-purple-500/20">
                <p className="text-xl font-black text-pink-400">10</p>
                <p className="text-[11px] text-slate-300 font-bold uppercase tracking-wider">3D Puzzles</p>
              </div>
              <div className="bg-purple-950/40 p-3 rounded-2xl border border-purple-500/20">
                <p className="text-xl font-black text-amber-400">Speed</p>
                <p className="text-[11px] text-slate-300 font-bold uppercase tracking-wider">Bonus Points</p>
              </div>
              <div className="bg-purple-950/40 p-3 rounded-2xl border border-purple-500/20">
                <p className="text-xl font-black text-cyan-400">Live</p>
                <p className="text-[11px] text-slate-300 font-bold uppercase tracking-wider">Multiplayer</p>
              </div>
            </div>
          </div>
        ) : (
          /* State 2: Registered In Lobby - Waiting for Host Screen */
          <div className="glass-panel-glow rounded-3xl p-8 sm:p-12 text-center relative overflow-hidden border-2 border-purple-500/30">
            {/* Pulsing Game Beacon */}
            <div className="relative w-24 h-24 mx-auto mb-6 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-2 border-pink-500/40 animate-radar" />
              <div className="absolute inset-2 rounded-full border border-cyan-400/30 animate-ping opacity-35" />
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-pink-500 to-purple-600 flex items-center justify-center shadow-xl shadow-pink-500/35">
                <Clock className="w-8 h-8 text-white" />
              </div>
            </div>

            {/* Waiting Status */}
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-400 text-slate-950 shadow-md shadow-amber-400/25 mb-3">
              <span className="w-2 h-2 rounded-full bg-slate-950 animate-ping" />
              WAITING FOR HOST TO LAUNCH
            </span>

            <h2 className="text-3xl font-black font-display text-white mb-2">
              You're In, <span className="gradient-text-fun">{currentParticipant.name}</span>!
            </h2>

            <p className="text-slate-200 text-sm max-w-sm mx-auto mb-8 font-medium leading-relaxed">
              Hold tight! As soon as the host hits "Start Quiz", your 3D arena will automatically launch into Question 1.
            </p>

            {/* Lobby Connected Candidates Roster */}
            <div className="bg-slate-950/60 rounded-2xl p-5 border border-white/10 mb-6 max-w-md mx-auto">
              <div className="flex items-center justify-between text-xs font-bold text-slate-300 mb-3 pb-2 border-b border-white/10">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  Players in Lobby
                </span>
                <span className="font-mono text-pink-400 text-xs px-2.5 py-0.5 rounded-full bg-pink-500/10 border border-pink-500/30">
                  {participants.length} Ready
                </span>
              </div>

              <div className="flex flex-wrap gap-2 max-h-36 overflow-y-auto pr-1 justify-center">
                {participants.map((p, idx) => {
                  const tagColors = [
                    'bg-pink-500/20 text-pink-300 border-pink-500/40',
                    'bg-indigo-500/20 text-indigo-300 border-indigo-500/40',
                    'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
                    'bg-amber-500/20 text-amber-300 border-amber-500/40',
                  ];
                  const color = tagColors[idx % tagColors.length];

                  return (
                    <span
                      key={p.id}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border ${
                        p.id === currentParticipant.id
                          ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white border-pink-400 shadow-md shadow-pink-500/25'
                          : color
                      }`}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-white" />
                      {p.name} {p.id === currentParticipant.id && '(You)'}
                    </span>
                  );
                })}
              </div>
            </div>

            {/* Solo Practice Bypass Button */}
            <div className="pt-2 flex flex-col items-center">
              <button
                onClick={() => {
                  playClickSound();
                  onBypassStart();
                }}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-indigo-950/80 hover:bg-indigo-900 border-2 border-indigo-500/40 text-xs font-bold text-white transition-all cursor-pointer group shadow-md"
              >
                <Zap className="w-4 h-4 text-amber-400 group-hover:scale-125 transition-transform" />
                <span>Solo Practice (Play Without Host)</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
