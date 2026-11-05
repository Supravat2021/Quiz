import { Clock, CheckCircle2, Zap, Users } from 'lucide-react';
import { Participant, QuizSession } from '../types/quiz';
import { BackgroundCanvas } from './3d/BackgroundCanvas';
import { playClickSound } from '../utils/sound';

interface WaitingForResultsScreenProps {
  currentParticipant: Participant;
  participants: Participant[];
  session: QuizSession;
  onSoloRevealResults: () => void;
}

export function WaitingForResultsScreen({
  currentParticipant,
  participants,
  session,
  onSoloRevealResults,
}: WaitingForResultsScreenProps) {
  const submittedCount = participants.filter((p) => p.submitted || p.completed).length;

  return (
    <div className="relative min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 sm:p-6 lg:p-8">
      {/* 3D Atmospheric Background */}
      <BackgroundCanvas />

      {/* Main Glass Panel */}
      <div className="w-full max-w-xl z-10">
        <div className="glass-panel-glow rounded-3xl p-8 sm:p-12 border-2 border-purple-500/30 shadow-2xl text-center relative overflow-hidden">
          {/* Ambient Glows */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-80 h-32 bg-pink-500/20 rounded-full blur-3xl pointer-events-none" />

          {/* Animated Celebration Icon */}
          <div className="relative w-24 h-24 mx-auto mb-6 flex items-center justify-center">
            <div className="absolute inset-0 rounded-full border-2 border-pink-500/40 animate-radar" />
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-400 to-teal-600 flex items-center justify-center shadow-xl shadow-emerald-500/35">
              <CheckCircle2 className="w-9 h-9 text-slate-950" />
            </div>
          </div>

          {/* Status Badge */}
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-md shadow-pink-500/25 mb-3">
            <Clock className="w-4 h-4 animate-spin" />
            ANSWERS SAVED • AWAITING HOST CONFIRMATION
          </span>

          <h1 className="text-3xl sm:text-4xl font-black font-display text-white mb-2">
            Awesome Job, <span className="gradient-text-fun">{currentParticipant.name}</span>!
          </h1>

          <p className="text-slate-200 text-base max-w-md mx-auto mb-6 font-medium leading-relaxed">
            All 10 answers are locked in. The host will release official scores and the answer key once all players finish!
          </p>

          {/* Live Submissions Tracker Card */}
          <div className="bg-[#121129]/90 rounded-2xl p-5 border border-purple-500/20 mb-6 max-w-md mx-auto">
            <div className="flex items-center justify-between text-xs font-bold text-slate-300 mb-3 pb-2 border-b border-white/10">
              <span className="flex items-center gap-1.5">
                <Users className="w-4 h-4 text-cyan-400" />
                Player Submissions
              </span>
              <span className="font-mono text-pink-400 font-bold text-xs px-2.5 py-0.5 rounded-full bg-pink-500/15 border border-pink-500/30">
                {submittedCount} of {participants.length} Finished
              </span>
            </div>

            <div className="flex flex-wrap gap-2 max-h-36 overflow-y-auto pr-1 justify-center">
              {participants.map((p) => {
                const isDone = p.submitted || p.completed;
                return (
                  <span
                    key={p.id}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border ${
                      p.id === currentParticipant.id
                        ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white border-pink-400 shadow-sm'
                        : isDone
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                        : 'bg-slate-900/80 text-slate-400 border-white/5'
                    }`}
                  >
                    <span
                      className={`w-2 h-2 rounded-full ${
                        isDone ? 'bg-emerald-400' : 'bg-slate-500'
                      }`}
                    />
                    {p.name} {p.id === currentParticipant.id && '(You)'}
                    {isDone ? ' ✓' : ' ...'}
                  </span>
                );
              })}
            </div>
          </div>

          {/* Solo Bypass Option */}
          <div className="pt-2 flex flex-col items-center">
            <button
              onClick={() => {
                playClickSound();
                onSoloRevealResults();
              }}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-indigo-950/90 hover:bg-indigo-900 border-2 border-indigo-500/40 text-xs font-bold text-white transition-all cursor-pointer group shadow-md"
            >
              <Zap className="w-4 h-4 text-amber-400 group-hover:scale-125 transition-transform" />
              <span>Solo Testing: Reveal My Score Now</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
