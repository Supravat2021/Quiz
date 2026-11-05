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
        <div className="glass-panel-glow rounded-3xl p-8 sm:p-12 border border-white/10 shadow-2xl text-center relative overflow-hidden">
          {/* Ambient Glows */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-72 h-28 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Minimalist Intermission Icon */}
          <div className="relative w-20 h-20 mx-auto mb-6 flex items-center justify-center">
            <div className="absolute inset-0 rounded-full border border-teal-400/20 animate-radar" />
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-teal-400 to-cyan-600 flex items-center justify-center shadow-lg shadow-teal-500/20">
              <CheckCircle2 className="w-7 h-7 text-slate-950" />
            </div>
          </div>

          {/* Status Badge */}
          <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-[11px] font-mono tracking-widest uppercase bg-teal-400/10 text-teal-300 border border-teal-400/20 mb-3">
            <Clock className="w-3.5 h-3.5 text-teal-400 animate-spin" />
            SUBMISSION CONFIRMED • AWAITING HOST RELEASE
          </span>

          <h1 className="text-2xl sm:text-3xl font-extrabold font-display text-white mb-2">
            Responses Stored, <span className="text-amber-300">{currentParticipant.name}</span>
          </h1>

          <p className="text-slate-300 text-sm max-w-md mx-auto mb-6 font-normal leading-relaxed">
            All 10 architectural phases have been logged. Official scores, accuracy rankings, and the concept breakdown will publish simultaneously once the host confirms the results.
          </p>

          {/* Live Submissions Tracker Card */}
          <div className="bg-slate-950/60 rounded-2xl p-4 border border-white/5 mb-6 max-w-md mx-auto">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-3 pb-2 border-b border-white/5">
              <span className="flex items-center gap-1.5 font-medium">
                <Users className="w-3.5 h-3.5 text-teal-400" />
                Candidate Submissions
              </span>
              <span className="font-mono text-amber-300 font-semibold text-xs">
                {submittedCount} of {participants.length} Completed
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
                        ? 'bg-amber-400/15 text-amber-200 border-amber-400/35 font-bold'
                        : isDone
                        ? 'bg-teal-500/10 text-teal-300 border-teal-500/20'
                        : 'bg-slate-900/60 text-slate-400 border-white/5'
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        isDone ? 'bg-teal-400' : 'bg-slate-600'
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
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900/60 hover:bg-slate-800 border border-white/10 text-xs text-slate-400 hover:text-white transition-all cursor-pointer group"
            >
              <Zap className="w-3.5 h-3.5 text-amber-400 group-hover:scale-110 transition-transform" />
              <span>Solo Testing: Reveal My Results Now</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
