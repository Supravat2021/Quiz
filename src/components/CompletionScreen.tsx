import { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import {
  Trophy,
  Award,
  CheckCircle,
  XCircle,
  RotateCcw,
  Users,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Zap,
} from 'lucide-react';
import { Participant } from '../types/quiz';
import { QUIZ_QUESTIONS } from '../data/questions';
import { playVictorySound, playClickSound } from '../utils/sound';

interface CompletionScreenProps {
  currentParticipant: Participant;
  participants: Participant[];
  onPlayAgain: () => void;
}

export function CompletionScreen({
  currentParticipant,
  participants,
  onPlayAgain,
}: CompletionScreenProps) {
  const [showReview, setShowReview] = useState(false);

  useEffect(() => {
    playVictorySound();

    // Trigger high-energy confetti burst
    const duration = 3.5 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 1000 };

    const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

    let interval: ReturnType<typeof setInterval> = setInterval(() => {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.4), y: Math.random() - 0.2 },
        colors: ['#fbbf24', '#06b6d4', '#38bdf8', '#f59e0b', '#ffffff'],
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.6, 0.9), y: Math.random() - 0.2 },
        colors: ['#fbbf24', '#06b6d4', '#38bdf8', '#f59e0b', '#ffffff'],
      });
    }, 250);

    return () => clearInterval(interval);
  }, []);

  // Compute stats
  const totalQuestions = QUIZ_QUESTIONS.length;
  const answeredList = Object.values(currentParticipant.answers || {});
  const correctCount = answeredList.filter((a) => a.isCorrect).length;
  const accuracyPercentage = Math.round((correctCount / totalQuestions) * 100);

  // Leaderboard sorted by score descending
  const sortedParticipants = [...participants].sort((a, b) => (b.score || 0) - (a.score || 0));
  const myRank = sortedParticipants.findIndex((p) => p.id === currentParticipant.id) + 1;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      {/* Top Victory Card */}
      <div className="glass-panel-glow rounded-3xl p-6 sm:p-10 border border-amber-400/30 text-center mb-8 relative overflow-hidden">
        {/* Glow backdrop */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-40 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10">
          <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-tr from-amber-400 via-amber-500 to-amber-600 flex items-center justify-center shadow-xl shadow-amber-500/30">
            <Trophy className="w-10 h-10 text-slate-950" />
          </div>

          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-semibold bg-amber-400/10 text-amber-300 border border-amber-400/30 mb-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            CHALLENGE COMPLETED
          </span>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-2">
            Outstanding Work, {currentParticipant.name}!
          </h1>

          <p className="text-slate-300 text-sm max-w-md mx-auto mb-6">
            You navigated all 10 procedural 3D AI simulations and completed the trial.
          </p>

          {/* Stats Badges Grid */}
          <div className="grid grid-cols-3 gap-3 sm:gap-4 max-w-lg mx-auto mb-6">
            <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800">
              <p className="text-xs text-slate-400 mb-1">Final Score</p>
              <p className="text-2xl sm:text-3xl font-extrabold font-mono text-amber-400">
                {currentParticipant.score || 0}
              </p>
            </div>
            <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800">
              <p className="text-xs text-slate-400 mb-1">Accuracy</p>
              <p className="text-2xl sm:text-3xl font-extrabold font-mono text-cyan-400">
                {accuracyPercentage}%
              </p>
            </div>
            <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800">
              <p className="text-xs text-slate-400 mb-1">Rank</p>
              <p className="text-2xl sm:text-3xl font-extrabold font-mono text-amber-300">
                #{myRank || 1}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => {
                playClickSound();
                onPlayAgain();
              }}
              className="px-6 py-3 rounded-xl font-bold text-slate-950 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 transition-all flex items-center gap-2 cursor-pointer shadow-lg shadow-amber-500/20"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Play Again</span>
            </button>
            <button
              onClick={() => {
                playClickSound();
                setShowReview(!showReview);
              }}
              className="px-6 py-3 rounded-xl font-semibold text-slate-200 bg-slate-900/80 hover:bg-slate-800 border border-slate-700 transition-all flex items-center gap-2 cursor-pointer"
            >
              <span>{showReview ? 'Hide Explanations' : 'Review Answers'}</span>
              {showReview ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* Answer Review Section (Collapsible) */}
      {showReview && (
        <div className="glass-panel rounded-2xl p-6 border border-slate-800 mb-8 animate-fadeIn">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-400" />
            <span>Question Review & Explanations</span>
          </h3>

          <div className="space-y-4">
            {QUIZ_QUESTIONS.map((q) => {
              const answer = currentParticipant.answers?.[q.id];
              const isCorrect = answer?.isCorrect;

              return (
                <div
                  key={q.id}
                  className={`p-4 rounded-xl border ${
                    isCorrect
                      ? 'bg-slate-900/60 border-emerald-900/40'
                      : 'bg-slate-900/60 border-red-900/40'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <span className="text-xs font-mono text-cyan-400 font-semibold">
                      Q{q.id}: {q.topic}
                    </span>
                    {isCorrect ? (
                      <span className="inline-flex items-center gap-1 text-xs text-emerald-400 font-semibold">
                        <CheckCircle className="w-3.5 h-3.5" /> Correct
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs text-red-400 font-semibold">
                        <XCircle className="w-3.5 h-3.5" /> Incorrect
                      </span>
                    )}
                  </div>
                  <p className="text-sm font-semibold text-slate-200 mb-2">{q.text}</p>
                  <p className="text-xs text-slate-400 bg-slate-950/60 p-3 rounded-lg border border-slate-800">
                    <span className="text-amber-400 font-bold">Answer: </span>
                    {q.options.find((o) => o.id === q.correct)?.text} — {q.explanation}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Live Top 10 Leaderboard */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-400/10 border border-cyan-400/30 flex items-center justify-center">
              <Users className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Live Top 10 Leaderboard</h2>
              <p className="text-xs text-slate-400">Real-time synced participant standings</p>
            </div>
          </div>
          <span className="text-xs font-mono text-amber-400 bg-amber-400/10 px-3 py-1 rounded-full border border-amber-400/30">
            {sortedParticipants.length} Connected
          </span>
        </div>

        {/* Leaderboard Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="text-xs uppercase font-mono text-slate-400 border-b border-slate-800">
                <th className="py-3 px-3">Rank</th>
                <th className="py-3 px-3">Participant</th>
                <th className="py-3 px-3 text-center">Progress</th>
                <th className="py-3 px-3 text-right">Score</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-medium">
              {sortedParticipants.slice(0, 10).map((p, idx) => {
                const isMe = p.id === currentParticipant.id;
                const rank = idx + 1;

                let rankBadge = (
                  <span className="w-6 h-6 rounded-full flex items-center justify-center font-mono text-xs text-slate-400">
                    {rank}
                  </span>
                );

                if (rank === 1) {
                  rankBadge = (
                    <span className="w-6 h-6 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center font-bold text-xs shadow-md shadow-amber-400/30">
                      1
                    </span>
                  );
                } else if (rank === 2) {
                  rankBadge = (
                    <span className="w-6 h-6 rounded-full bg-slate-300 text-slate-950 flex items-center justify-center font-bold text-xs">
                      2
                    </span>
                  );
                } else if (rank === 3) {
                  rankBadge = (
                    <span className="w-6 h-6 rounded-full bg-amber-700 text-white flex items-center justify-center font-bold text-xs">
                      3
                    </span>
                  );
                }

                return (
                  <tr
                    key={p.id}
                    className={`transition-colors ${
                      isMe ? 'bg-amber-400/10 text-amber-300 font-bold' : 'hover:bg-slate-800/40'
                    }`}
                  >
                    <td className="py-3.5 px-3">{rankBadge}</td>
                    <td className="py-3.5 px-3">
                      <div className="flex items-center gap-2">
                        <span>{p.name}</span>
                        {isMe && (
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-400/20 text-amber-300 border border-amber-400/40">
                            YOU
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3.5 px-3 text-center">
                      {p.completed ? (
                        <span className="inline-flex items-center gap-1 text-xs text-emerald-400 font-mono">
                          <CheckCircle className="w-3.5 h-3.5" /> 10/10
                        </span>
                      ) : (
                        <span className="text-xs text-slate-400 font-mono">
                          Q{(p.currentQuestionIndex || 0) + 1}/10
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-3 text-right font-mono font-bold text-amber-400">
                      {p.score || 0} pts
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
