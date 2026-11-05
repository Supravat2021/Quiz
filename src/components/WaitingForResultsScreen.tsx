import { Clock, CheckCircle2, ShieldCheck, Zap, Users, Sparkles } from 'lucide-react';
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
      {/* 3D Constellation Background */}
      <BackgroundCanvas />

      {/* Main Glass Panel */}
      <div className="w-full max-w-xl z-10">
        <div className="glass-panel-glow rounded-3xl p-6 sm:p-10 border border-slate-700/80 shadow-2xl text-center relative overflow-hidden">
          {/* Ambient Glows */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-80 h-32 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />

          {/* Animated Pulsing Radar Beacon */}
          <div className="relative w-24 h-24 mx-auto mb-6 flex items-center justify-center">
            <div className="absolute inset-0 rounded-full border border-cyan-400/30 animate-radar" />
            <div className="absolute inset-2 rounded-full border border-amber-400/30 animate-ping opacity-25" />
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/30">
              <CheckCircle2 className="w-8 h-8 text-slate-950" />
            </div>
          </div>

          {/* Status Badge */}
          <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-mono font-semibold bg-cyan-400/10 text-cyan-300 border border-cyan-400/30 mb-3">
            <Clock className="w-3.5 h-3.5 text-cyan-400 animate-spin" />
            ANSWERS SUBMITTED • AWAITING HOST CONFIRMATION
          </span>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mb-2">
            Great Job, <span className="text-amber-400">{currentParticipant.name}</span>!
          </h1>

          <p className="text-slate-300 text-sm max-w-md mx-auto mb-6 leading-relaxed">
            All 10 of your answers have been securely recorded. To ensure fair competition, official scores and the correct answer key will be published for everyone once the host confirms the results.
          </p>

          {/* Live Submissions Tracker Card */}
          <div className="bg-slate-900/80 rounded-2xl p-4 border border-slate-800 mb-6 max-w-md mx-auto">
            <div className="flex items-center justify-between text-xs text-slate-400 font-medium mb-3 pb-2 border-b border-slate-800">
              <span className="flex items-center gap-1.5">
                <Users className="w-4 h-4 text-cyan-400" />
                Participant Submissions
              </span>
              <span className="font-mono text-amber-400 font-bold">
                {submittedCount} of {participants.length} Finished
              </span>
            </div>

            <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto pr-1 justify-center">
              {participants.map((p) => {
                const isDone = p.submitted || p.completed;
                return (
                  <span
                    key={p.id}
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium border ${
                      p.id === currentParticipant.id
                        ? 'bg-amber-400/20 text-amber-300 border-amber-400/50 font-bold'
                        : isDone
                        ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                        : 'bg-slate-800/90 text-slate-400 border-slate-700/60'
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
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
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800/90 hover:bg-slate-700/90 border border-slate-700 text-xs font-semibold text-slate-300 hover:text-white transition-all cursor-pointer group"
            >
              <Zap className="w-3.5 h-3.5 text-amber-400 group-hover:scale-110 transition-transform" />
              <span>Solo Testing: Reveal My Results Now</span>
            </button>
            <p className="text-[11px] text-slate-500 mt-2">
              If you are testing solo on a single device, click above to unlock your score and the answer key immediately.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

