import { useState } from 'react';
import {
  Shield,
  Key,
  Play,
  RotateCcw,
  Download,
  Users,
  CheckCircle,
  Clock,
  Sparkles,
  Bot,
  Trash2,
  Lock,
  Eye,
  EyeOff,
  Award,
} from 'lucide-react';
import { QuizSession, Participant } from '../types/quiz';
import { playClickSound } from '../utils/sound';

interface AdminPortalProps {
  session: QuizSession;
  participants: Participant[];
  onStartQuiz: () => void;
  onResetSession: () => void;
  onAddDemoParticipants: () => void;
  onRemoveParticipant: (id: string) => void;
  onPublishResults: () => void;
  onUnpublishResults: () => void;
}

const ADMIN_PIN = '2026';

export function AdminPortal({
  session,
  participants,
  onStartQuiz,
  onResetSession,
  onAddDemoParticipants,
  onRemoveParticipant,
  onPublishResults,
  onUnpublishResults,
}: AdminPortalProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState('');

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput === ADMIN_PIN) {
      setIsAuthenticated(true);
      setPinError('');
      playClickSound();
    } else {
      setPinError('Invalid Admin PIN. (Default: 2026)');
    }
  };

  const handleExportCSV = () => {
    playClickSound();
    const sorted = [...participants].sort((a, b) => (b.score || 0) - (a.score || 0));

    const csvRows = [
      ['Rank', 'Participant Name', 'Score', 'Progress', 'Submitted', 'Joined Date'],
      ...sorted.map((p, index) => [
        index + 1,
        `"${p.name.replace(/"/g, '""')}"`,
        p.score || 0,
        `Q${(p.currentQuestionIndex || 0) + 1}/10`,
        p.submitted || p.completed ? 'YES' : 'NO',
        new Date(p.joinedAt).toLocaleString(),
      ]),
    ];

    const csvContent = 'data:text/csv;charset=utf-8,' + csvRows.map((e) => e.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `ai_quiz_leaderboard_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const sortedParticipants = [...participants].sort((a, b) => (b.score || 0) - (a.score || 0));
  const submittedCount = participants.filter((p) => p.submitted || p.completed).length;

  if (!isAuthenticated) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 sm:p-6">
        <div className="w-full max-w-md glass-panel-glow rounded-3xl p-8 sm:p-10 border-2 border-purple-500/30 shadow-2xl relative text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-tr from-pink-500 to-purple-600 flex items-center justify-center shadow-lg shadow-pink-500/30">
            <Lock className="w-8 h-8 text-white" />
          </div>

          <h2 className="text-3xl font-black font-display text-white mb-2">Host Portal</h2>
          <p className="text-sm text-slate-300 font-medium mb-6">
            Enter host PIN to launch questions and release scores to players.
          </p>

          <form onSubmit={handlePinSubmit} className="space-y-4">
            <div className="text-left">
              <label htmlFor="admin-pin" className="block text-xs font-bold uppercase tracking-wider text-pink-300 mb-2 pl-1">
                Admin Access PIN
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Key className="w-5 h-5 text-purple-400" />
                </div>
                <input
                  id="admin-pin"
                  type="password"
                  value={pinInput}
                  onChange={(e) => {
                    setPinInput(e.target.value);
                    if (pinError) setPinError('');
                  }}
                  placeholder="PIN: 2026"
                  maxLength={6}
                  className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-[#110e28] border-2 border-purple-500/40 text-white placeholder-slate-500 font-mono tracking-widest text-center text-xl font-black focus:outline-none focus:border-pink-500 focus:ring-4 focus:ring-pink-500/20"
                />
              </div>
              {pinError && <p className="text-rose-400 text-xs mt-2 text-center font-bold">{pinError}</p>}
            </div>

            <button
              type="submit"
              className="w-full py-4 px-6 rounded-2xl font-black text-white bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-600 hover:from-pink-400 hover:to-indigo-500 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xl shadow-pink-500/30 text-base"
            >
              <Shield className="w-5 h-5" />
              <span>Unlock Host Controls</span>
            </button>

            <div className="text-center pt-2">
              <span className="text-xs text-slate-400 font-mono">
                Host PIN: <strong className="text-pink-400">2026</strong>
              </span>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Admin Dashboard Header */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border-2 border-purple-500/25 shadow-xl mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-white/10">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-pink-500 to-purple-600 flex items-center justify-center text-white shadow-md shadow-pink-500/30">
                <Shield className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl font-black font-display text-white">Host Control Console</h1>
                <p className="text-xs text-slate-300 font-mono">Session ID: {session.id}</p>
              </div>
            </div>
          </div>

          {/* Status Badges */}
          <div className="flex items-center gap-4">
            <div className="text-right">
              <span className="text-xs text-slate-400 block font-bold uppercase tracking-wider mb-1">Status</span>
              {session.resultsPublished ? (
                <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold bg-pink-500 text-white shadow-md shadow-pink-500/30">
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  SCORES RELEASED
                </span>
              ) : session.status === 'active' ? (
                <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/30">
                  <span className="w-2 h-2 rounded-full bg-slate-950 animate-ping" />
                  QUIZ LIVE
                </span>
              ) : session.status === 'ended' ? (
                <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold bg-purple-600 text-white shadow-md">
                  CONCLUDED
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold bg-amber-400 text-slate-950 shadow-md">
                  <span className="w-2 h-2 rounded-full bg-slate-950" />
                  WAITING IN LOBBY
                </span>
              )}
            </div>

            <div className="bg-[#121129] border border-purple-500/30 px-5 py-2.5 rounded-2xl text-center shadow-inner">
              <span className="text-[10px] uppercase tracking-wider text-slate-400 block font-bold">Submissions</span>
              <span className="text-xl font-black font-mono text-cyan-400">
                {submittedCount}/{participants.length}
              </span>
            </div>
          </div>
        </div>

        {/* Live Controls Toolbar */}
        <div className="pt-6 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-3">
            {/* Start Quiz Button */}
            <button
              onClick={() => {
                playClickSound();
                onStartQuiz();
              }}
              disabled={session.status === 'active' && !session.resultsPublished}
              className={`px-5 py-3 rounded-2xl font-black text-xs uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer shadow-lg ${
                session.status === 'active' && !session.resultsPublished
                  ? 'bg-slate-900 text-slate-600 cursor-not-allowed opacity-60'
                  : 'bg-gradient-to-r from-emerald-400 to-teal-500 hover:from-emerald-300 hover:to-teal-400 text-slate-950 shadow-emerald-500/30'
              }`}
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Launch Quiz for Everyone</span>
            </button>

            {/* CONFIRM & PUBLISH RESULTS BUTTON */}
            {!session.resultsPublished ? (
              <button
                onClick={() => {
                  playClickSound();
                  onPublishResults();
                }}
                className="px-5 py-3 rounded-2xl font-black text-xs uppercase tracking-wider bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-600 hover:from-pink-400 hover:to-indigo-500 text-white shadow-xl shadow-pink-500/30 transition-all flex items-center gap-2 cursor-pointer transform hover:-translate-y-0.5 active:translate-y-0"
              >
                <Award className="w-4 h-4 text-amber-300" />
                <span>Confirm & Publish Results to Everyone</span>
              </button>
            ) : (
              <button
                onClick={() => {
                  playClickSound();
                  onUnpublishResults();
                }}
                className="px-4 py-3 rounded-2xl font-bold text-xs bg-purple-950/80 hover:bg-purple-900 border-2 border-purple-500/40 text-purple-200 transition-all flex items-center gap-2 cursor-pointer shadow-md"
              >
                <EyeOff className="w-4 h-4" />
                <span>Unpublish Results</span>
              </button>
            )}

            {/* Reset / Clear Session Button */}
            <button
              onClick={() => {
                if (window.confirm('Reset session and clear all scores?')) {
                  playClickSound();
                  onResetSession();
                }
              }}
              className="px-4 py-3 rounded-2xl font-bold text-xs bg-rose-500/15 hover:bg-rose-500/25 border-2 border-rose-500/30 text-rose-300 transition-all flex items-center gap-2 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reset Session</span>
            </button>

            {/* Simulate Participants Button */}
            <button
              onClick={() => {
                playClickSound();
                onAddDemoParticipants();
              }}
              className="px-4 py-3 rounded-2xl font-bold text-xs bg-indigo-950/80 hover:bg-indigo-900 border-2 border-indigo-500/40 text-white transition-all flex items-center gap-2 cursor-pointer shadow-md"
            >
              <Bot className="w-4 h-4 text-cyan-400" />
              <span>Add Demo Players</span>
            </button>
          </div>

          {/* Export CSV Button */}
          <button
            onClick={handleExportCSV}
            disabled={participants.length === 0}
            className={`px-4 py-3 rounded-2xl font-bold text-xs flex items-center gap-2 transition-all ${
              participants.length === 0
                ? 'bg-slate-900/50 border border-white/5 text-slate-600 cursor-not-allowed'
                : 'bg-amber-400/20 hover:bg-amber-400/30 border-2 border-amber-400/40 text-amber-300 cursor-pointer shadow-sm'
            }`}
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Real-Time Participant Tracker Table */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border-2 border-purple-500/25 shadow-xl">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <Users className="w-6 h-6 text-pink-400" />
            <div>
              <h2 className="text-xl font-black font-display text-white">Live Player Monitor</h2>
              <p className="text-xs text-slate-300">
                Scores remain hidden from players until you click "Confirm & Publish".
              </p>
            </div>
          </div>
          <span className="text-xs font-bold text-pink-300 bg-pink-500/15 px-3 py-1 rounded-full border border-pink-500/30 font-mono">
            {submittedCount} of {participants.length} Submissions Logged
          </span>
        </div>

        {sortedParticipants.length === 0 ? (
          <div className="py-12 text-center text-slate-500">
            <Users className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p className="text-base font-bold text-slate-300">No players connected yet.</p>
            <p className="text-xs text-slate-400 mt-1">
              Join from Player View or click "Add Demo Players" above.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="text-xs uppercase font-mono font-bold tracking-wider text-pink-300 border-b border-white/10">
                  <th className="py-3 px-3">Rank</th>
                  <th className="py-3 px-3">Player Name</th>
                  <th className="py-3 px-3 text-center">Progress</th>
                  <th className="py-3 px-3 text-right">Score (Host Preview)</th>
                  <th className="py-3 px-3 text-center">Player Status</th>
                  <th className="py-3 px-3 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 font-medium">
                {sortedParticipants.map((p, index) => {
                  const rank = index + 1;
                  const isSubmitted = p.submitted || p.completed;

                  return (
                    <tr key={p.id} className="hover:bg-slate-900/50 transition-colors">
                      <td className="py-3.5 px-3">
                        <span
                          className={`w-7 h-7 rounded-xl inline-flex items-center justify-center font-bold text-xs ${
                            rank === 1
                              ? 'bg-amber-400 text-slate-950 font-black shadow-md'
                              : rank === 2
                              ? 'bg-slate-300 text-slate-950 font-black'
                              : rank === 3
                              ? 'bg-amber-700 text-white font-black'
                              : 'bg-slate-900 text-slate-400'
                          }`}
                        >
                          {rank}
                        </span>
                      </td>
                      <td className="py-3.5 px-3 text-slate-200">
                        <span className="font-bold text-white text-base">{p.name}</span>
                        <span className="block text-[11px] text-slate-400 font-mono">
                          {p.id.slice(0, 10)}
                        </span>
                      </td>
                      <td className="py-3.5 px-3 text-center font-mono text-xs">
                        {isSubmitted ? (
                          <span className="inline-flex items-center gap-1 text-emerald-400 font-bold">
                            <CheckCircle className="w-4 h-4" /> 10/10 Submitted
                          </span>
                        ) : (
                          <span className="text-amber-300 font-bold">
                            Question {(p.currentQuestionIndex || 0) + 1}/10
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-3 text-right font-mono font-black text-pink-400 text-base">
                        {p.score || 0} pts
                      </td>
                      <td className="py-3.5 px-3 text-center">
                        {session.resultsPublished ? (
                          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500 text-slate-950 shadow-sm">
                            <Eye className="w-3.5 h-3.5" /> Published to Player
                          </span>
                        ) : isSubmitted ? (
                          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                            <Clock className="w-3.5 h-3.5" /> Waiting for Release
                          </span>
                        ) : session.status === 'active' ? (
                          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-purple-900/50 text-purple-300">
                            Answering...
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-slate-900 text-slate-400">
                            In Lobby
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-3 text-center">
                        <button
                          onClick={() => {
                            playClickSound();
                            onRemoveParticipant(p.id);
                          }}
                          title="Remove player"
                          className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/20 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
