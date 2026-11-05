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
        origin: { x: randomInRange(0.15, 0.45), y: Math.random() - 0.2 },
        colors: ['#ff2a85', '#8b5cf6', '#06b6d4', '#f59e0b', '#ffffff'],
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.55, 0.85), y: Math.random() - 0.2 },
        colors: ['#ff2a85', '#8b5cf6', '#06b6d4', '#f59e0b', '#ffffff'],
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
      <div className="glass-panel-glow rounded-3xl p-8 sm:p-12 text-center mb-8 relative overflow-hidden border-2 border-purple-500/30">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-40 bg-pink-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10">
          <div className="w-20 h-20 mx-auto mb-4 rounded-3xl bg-gradient-to-tr from-amber-400 via-pink-500 to-purple-600 flex items-center justify-center shadow-2xl shadow-pink-500/40 transform hover:scale-110 transition-transform">
            <Trophy className="w-10 h-10 text-white" />
          </div>

          <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-md shadow-pink-500/30 mb-3">
            <Sparkles className="w-4 h-4 text-amber-300" />
            OFFICIAL RESULTS CONFIRMED
          </span>

          <h1 className="text-4xl sm:text-5xl font-black font-display text-white mb-2">
            Awesome Round, <span className="gradient-text-fun">{currentParticipant.name}</span>!
          </h1>

          <p className="text-slate-200 text-base max-w-md mx-auto mb-8 font-medium leading-relaxed">
            All results have been published by the host. Check your standing and examine the answers below!
          </p>

          {/* Solid Metric Badges Grid */}
          <div className="grid grid-cols-3 gap-3 sm:gap-4 max-w-lg mx-auto mb-8">
            <div className="bg-pink-950/60 p-4 rounded-3xl border-2 border-pink-500/40 shadow-lg shadow-pink-500/10">
              <p className="text-xs font-bold uppercase tracking-wider text-pink-300 mb-1">Final Score</p>
              <p className="text-3xl sm:text-4xl font-black font-mono text-white">
                {currentParticipant.score || 0}
              </p>
            </div>
            <div className="bg-teal-950/60 p-4 rounded-3xl border-2 border-teal-500/40 shadow-lg shadow-teal-500/10">
              <p className="text-xs font-bold uppercase tracking-wider text-teal-300 mb-1">Accuracy</p>
              <p className="text-3xl sm:text-4xl font-black font-mono text-white">
                {accuracyPercentage}%
              </p>
            </div>
            <div className="bg-amber-950/60 p-4 rounded-3xl border-2 border-amber-500/40 shadow-lg shadow-amber-500/10">
              <p className="text-xs font-bold uppercase tracking-wider text-amber-300 mb-1">Rank</p>
              <p className="text-3xl sm:text-4xl font-black font-mono text-white">
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
              className="px-7 py-3.5 rounded-2xl font-black text-white bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-600 hover:from-pink-400 hover:to-indigo-500 shadow-xl shadow-pink-500/30 transition-all flex items-center gap-2 cursor-pointer text-sm transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Play Again</span>
            </button>
            <button
              onClick={() => {
                playClickSound();
                setShowReview(!showReview);
              }}
              className="px-6 py-3.5 rounded-2xl font-bold text-white bg-indigo-950/80 hover:bg-indigo-900 border-2 border-indigo-500/40 transition-all flex items-center gap-2 cursor-pointer text-sm shadow-md"
            >
              <span>{showReview ? 'Hide Answers' : 'Review Questions & Answers'}</span>
              {showReview ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* Answer Review Section (Collapsible) */}
      {showReview && (
        <div className="glass-panel rounded-3xl p-6 sm:p-8 border-2 border-purple-500/25 mb-8 animate-fadeIn">
          <h3 className="text-xl font-black font-display text-white mb-6 flex items-center gap-2">
            <Award className="w-6 h-6 text-pink-400" />
            <span>Answer Breakdown & Explanations</span>
          </h3>

          <div className="space-y-4">
            {QUIZ_QUESTIONS.map((q) => {
              const answer = currentParticipant.answers?.[q.id];
              const isCorrect = answer?.isCorrect;

              return (
                <div
                  key={q.id}
                  className={`p-5 rounded-2xl border-2 transition-all ${
                    isCorrect
                      ? 'bg-emerald-950/40 border-emerald-500/40'
                      : 'bg-rose-950/40 border-rose-500/40'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-pink-300">
                      Question {q.id} • {q.topic}
                    </span>
                    {isCorrect ? (
                      <span className="inline-flex items-center gap-1 text-xs font-bold px-3 py-0.5 rounded-full bg-emerald-500 text-slate-950 shadow-sm">
                        <CheckCircle className="w-3.5 h-3.5" /> Correct (+{answer?.pointsEarned || 100} pts)
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs font-bold px-3 py-0.5 rounded-full bg-rose-500 text-white shadow-sm">
                        <XCircle className="w-3.5 h-3.5" /> Incorrect
                      </span>
                    )}
                  </div>
                  <p className="text-base font-bold text-white mb-3 leading-snug">{q.text}</p>
                  <div className="text-sm text-slate-200 bg-slate-950/80 p-4 rounded-xl border border-white/10 leading-relaxed">
                    <span className="text-amber-400 font-black">Correct Answer: </span>
                    <strong className="text-white">{q.options.find((o) => o.id === q.correct)?.text}</strong>
                    <p className="mt-1 text-slate-300 text-xs font-medium">{q.explanation}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Live Top 10 Leaderboard */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border-2 border-purple-500/25 shadow-xl">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-pink-500 to-purple-600 flex items-center justify-center shadow-md shadow-pink-500/30">
              <Users className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-black font-display text-white">Live Leaderboard</h2>
              <p className="text-xs text-slate-300 font-medium">Real-time player standings</p>
            </div>
          </div>
          <span className="text-xs font-bold text-white bg-gradient-to-r from-pink-500 to-purple-600 px-3.5 py-1 rounded-full shadow-sm">
            {sortedParticipants.length} Connected
          </span>
        </div>

        {/* Leaderboard Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="text-xs uppercase font-mono font-bold tracking-wider text-pink-300 border-b border-white/10">
                <th className="py-3 px-3">Rank</th>
                <th className="py-3 px-3">Player</th>
                <th className="py-3 px-3 text-center">Questions</th>
                <th className="py-3 px-3 text-right">Score</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 font-medium">
              {sortedParticipants.slice(0, 10).map((p, idx) => {
                const isMe = p.id === currentParticipant.id;
                const rank = idx + 1;

                let rankBadge = (
                  <span className="w-7 h-7 rounded-xl flex items-center justify-center font-bold text-xs bg-slate-900 text-slate-300">
                    {rank}
                  </span>
                );

                if (rank === 1) {
                  rankBadge = (
                    <span className="w-7 h-7 rounded-xl bg-gradient-to-tr from-amber-400 to-orange-500 text-slate-950 flex items-center justify-center font-black text-xs shadow-md shadow-amber-400/35">
                      1
                    </span>
                  );
                } else if (rank === 2) {
                  rankBadge = (
                    <span className="w-7 h-7 rounded-xl bg-gradient-to-tr from-slate-200 to-slate-400 text-slate-950 flex items-center justify-center font-black text-xs shadow-md">
                      2
                    </span>
                  );
                } else if (rank === 3) {
                  rankBadge = (
                    <span className="w-7 h-7 rounded-xl bg-gradient-to-tr from-amber-600 to-amber-800 text-white flex items-center justify-center font-black text-xs shadow-md">
                      3
                    </span>
                  );
                }

                return (
                  <tr
                    key={p.id}
                    className={`transition-colors ${
                      isMe ? 'bg-pink-500/15 text-pink-200 font-bold' : 'hover:bg-slate-900/50'
                    }`}
                  >
                    <td className="py-4 px-3">{rankBadge}</td>
                    <td className="py-4 px-3">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white text-base">{p.name}</span>
                        {isMe && (
                          <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-pink-500 text-white shadow-sm">
                            YOU
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-3 text-center">
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-400">
                        <CheckCircle className="w-4 h-4" /> 10/10 Done
                      </span>
                    </td>
                    <td className="py-4 px-3 text-right font-mono font-black text-pink-400 text-lg">
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
