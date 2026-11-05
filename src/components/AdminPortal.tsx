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
        `Phase ${(p.currentQuestionIndex || 0) + 1}/10`,
        p.submitted || p.completed ? 'YES' : 'NO',
        new Date(p.joinedAt).toLocaleString(),
      ]),
    ];

    const csvContent = 'data:text/csv;charset=utf-8,' + csvRows.map((e) => e.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `synapse_ai_leaderboard_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const sortedParticipants = [...participants].sort((a, b) => (b.score || 0) - (a.score || 0));
  const submittedCount = participants.filter((p) => p.submitted || p.completed).length;

  if (!isAuthenticated) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 sm:p-6">
        <div className="w-full max-w-md glass-panel-glow rounded-3xl p-8 sm:p-10 border border-white/10 shadow-2xl relative text-center">
          <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/20">
            <Lock className="w-7 h-7 text-slate-950" />
          </div>

          <h2 className="text-2xl font-bold font-display text-white mb-2">Host Console</h2>
          <p className="text-xs text-slate-400 mb-6">
            Enter the host PIN to control the live session and confirm results.
          </p>

          <form onSubmit={handlePinSubmit} className="space-y-4">
            <div className="text-left">
              <label htmlFor="admin-pin" className="block text-[11px] font-mono uppercase tracking-wider text-slate-400 mb-2 pl-1">
                Admin Access PIN
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Key className="w-4 h-4" />
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
                  className="w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-950/70 border border-white/10 text-white placeholder-slate-600 font-mono tracking-widest text-center text-lg focus:outline-none focus:ring-2 focus:ring-amber-400/80"
                />
              </div>
              {pinError && <p className="text-red-400 text-xs mt-2 text-center">{pinError}</p>}
            </div>

            <button
              type="submit"
              className="w-full py-3.5 px-6 rounded-2xl font-bold text-slate-950 bg-gradient-to-r from-amber-300 via-amber-400 to-amber-500 hover:from-amber-200 hover:to-amber-400 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-amber-500/20 text-sm"
            >
              <Shield className="w-4 h-4" />
              <span>Unlock Host Console</span>
            </button>

            <div className="text-center pt-2">
              <span className="text-[11px] text-slate-500 font-mono">
                Host PIN: <strong className="text-amber-300">2026</strong>
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
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 shadow-xl mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-white/5">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center text-amber-300">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-2xl font-bold font-display text-white">Live Host Console</h1>
                <p className="text-xs text-slate-400 font-mono">Session ID: {session.id}</p>
              </div>
            </div>
          </div>

          {/* Status Badges */}
          <div className="flex items-center gap-4">
            <div className="text-right">
              <span className="text-xs text-slate-400 block font-medium">Session Status</span>
              {session.resultsPublished ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  RESULTS RELEASED
                </span>
              ) : session.status === 'active' ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  TRIAL IN PROGRESS
                </span>
              ) : session.status === 'ended' ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono font-bold bg-purple-500/15 text-purple-300 border border-purple-500/30">
                  CONCLUDED
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30">
                  <span className="w-2 h-2 rounded-full bg-amber-400" />
                  WAITING IN LOBBY
                </span>
              )}
            </div>

            <div className="bg-slate-950/70 border border-white/5 px-4 py-2 rounded-2xl text-center">
              <span className="text-[10px] uppercase tracking-wider text-slate-400 block font-mono">Submissions</span>
              <span className="text-lg font-bold font-mono text-teal-300">
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
              className={`px-5 py-2.5 rounded-2xl font-bold text-xs flex items-center gap-2 transition-all cursor-pointer shadow-lg ${
                session.status === 'active' && !session.resultsPublished
                  ? 'bg-slate-900 text-slate-600 cursor-not-allowed opacity-60'
                  : 'bg-gradient-to-r from-emerald-400 to-teal-500 hover:from-emerald-300 hover:to-teal-400 text-slate-950 shadow-teal-500/20'
              }`}
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Launch Quiz for Everyone</span>
            </button>

            {/* CONFIRM & PUBLISH RESULTS BUTTON */}
            {!session.resultsPublished ? (
              <button
                onClick={() => {
                  playClickSound();
                  onPublishResults();
                }}
                className="px-5 py-2.5 rounded-2xl font-bold text-xs bg-gradient-to-r from-amber-300 via-amber-400 to-amber-500 hover:from-amber-200 hover:to-amber-400 text-slate-950 shadow-lg shadow-amber-500/20 transition-all flex items-center gap-2 cursor-pointer"
              >
                <Award className="w-3.5 h-3.5" />
                <span>Confirm & Publish Results to Everyone</span>
              </button>
            ) : (
              <button
                onClick={() => {
                  playClickSound();
                  onUnpublishResults();
                }}
                className="px-4 py-2.5 rounded-2xl font-semibold text-xs bg-amber-400/15 hover:bg-amber-400/25 border border-amber-400/30 text-amber-200 transition-all flex items-center gap-2 cursor-pointer"
              >
                <EyeOff className="w-3.5 h-3.5" />
                <span>Unpublish Results</span>
              </button>
            )}

            {/* Reset / Clear Session Button */}
            <button
              onClick={() => {
                if (window.confirm('Reset the session and wipe current scores?')) {
                  playClickSound();
                  onResetSession();
                }
              }}
              className="px-4 py-2.5 rounded-2xl font-semibold text-xs bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/25 text-rose-300 transition-all flex items-center gap-2 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Session</span>
            </button>

            {/* Simulate Participants Button */}
            <button
              onClick={() => {
                playClickSound();
                onAddDemoParticipants();
              }}
              className="px-4 py-2.5 rounded-2xl font-semibold text-xs bg-slate-950/60 hover:bg-slate-900 border border-white/10 text-slate-300 hover:text-white transition-all flex items-center gap-2 cursor-pointer"
            >
              <Bot className="w-3.5 h-3.5 text-teal-400" />
              <span>Simulate Candidates</span>
            </button>
          </div>

          {/* Export CSV Button */}
          <button
            onClick={handleExportCSV}
            disabled={participants.length === 0}
            className={`px-4 py-2.5 rounded-2xl font-semibold text-xs flex items-center gap-2 transition-all ${
              participants.length === 0
                ? 'bg-slate-950/40 border border-white/5 text-slate-600 cursor-not-allowed'
                : 'bg-amber-400/10 hover:bg-amber-400/20 border border-amber-400/25 text-amber-300 cursor-pointer'
            }`}
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Real-Time Participant Tracker & Leaderboard Table */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 shadow-xl">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/5">
          <div className="flex items-center gap-3">
            <Users className="w-5 h-5 text-amber-400" />
            <div>
              <h2 className="text-lg font-bold font-display text-white">Live Candidate Monitor</h2>
              <p className="text-[11px] text-slate-400">
                Scores remain hidden from players until you click "Confirm & Publish".
              </p>
            </div>
          </div>
          <span className="text-xs font-mono text-slate-400">
            {submittedCount} of {participants.length} Submissions Logged
          </span>
        </div>

        {sortedParticipants.length === 0 ? (
          <div className="py-12 text-center text-slate-500">
            <Users className="w-12 h-12 mx-auto mb-3 opacity-20" />
            <p className="text-sm font-semibold text-slate-400">No candidates connected yet.</p>
            <p className="text-xs text-slate-500 mt-1">
              Join from Participant View or click "Simulate Candidates" above.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="text-[11px] uppercase font-mono tracking-wider text-slate-400 border-b border-white/5">
                  <th className="py-3 px-3">Rank</th>
                  <th className="py-3 px-3">Candidate</th>
                  <th className="py-3 px-3 text-center">Progress</th>
                  <th className="py-3 px-3 text-right">Score (Host Preview)</th>
                  <th className="py-3 px-3 text-center">Player View Status</th>
                  <th className="py-3 px-3 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 font-medium">
                {sortedParticipants.map((p, index) => {
                  const rank = index + 1;
                  const isSubmitted = p.submitted || p.completed;

                  return (
                    <tr key={p.id} className="hover:bg-slate-900/40 transition-colors">
                      <td className="py-3.5 px-3">
                        <span
                          className={`w-6 h-6 rounded-full inline-flex items-center justify-center font-mono text-xs font-bold ${
                            rank === 1
                              ? 'bg-amber-400 text-slate-950'
                              : rank === 2
                              ? 'bg-slate-300 text-slate-950'
                              : rank === 3
                              ? 'bg-amber-700 text-white'
                              : 'text-slate-500'
                          }`}
                        >
                          {rank}
                        </span>
                      </td>
                      <td className="py-3.5 px-3 text-slate-200">
                        <span className="font-semibold text-white">{p.name}</span>
                        <span className="block text-[10px] text-slate-500 font-mono">
                          {p.id.slice(0, 10)}
                        </span>
                      </td>
                      <td className="py-3.5 px-3 text-center font-mono text-xs">
                        {isSubmitted ? (
                          <span className="inline-flex items-center gap-1 text-teal-400 font-bold">
                            <CheckCircle className="w-3.5 h-3.5" /> 10/10 Submitted
                          </span>
                        ) : (
                          <span className="text-amber-300">
                            Phase {(p.currentQuestionIndex || 0) + 1}/10
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-3 text-right font-mono font-bold text-amber-300 text-sm">
                        {p.score || 0} pts
                      </td>
                      <td className="py-3.5 px-3 text-center">
                        {session.resultsPublished ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/15 text-emerald-400">
                            <Eye className="w-3 h-3" /> Released to Player
                          </span>
                        ) : isSubmitted ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-teal-500/15 text-teal-300">
                            <Clock className="w-3 h-3" /> Waiting for Release
                          </span>
                        ) : session.status === 'active' ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-900 text-amber-300">
                            Answering...
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-900 text-slate-400">
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
                          title="Remove participant"
                          className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
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
