import { useState, useEffect } from 'react';
import { Volume2, VolumeX, Shield, Users, Sparkles, Globe } from 'lucide-react';
import { isSoundEnabled, toggleSound, playClickSound } from '../utils/sound';
import { QuizStatus } from '../types/quiz';
import { isSupabaseConfigured } from '../services/supabaseClient';

interface HeaderProps {
  currentView: 'participant' | 'admin';
  onNavigate: (view: 'participant' | 'admin') => void;
  quizStatus: QuizStatus;
  participantCount?: number;
}

export function Header({
  currentView,
  onNavigate,
  quizStatus,
  participantCount = 0,
}: HeaderProps) {
  const [soundOn, setSoundOn] = useState(true);

  useEffect(() => {
    setSoundOn(isSoundEnabled());
  }, []);

  const handleSoundToggle = () => {
    const next = toggleSound();
    setSoundOn(next);
    if (next) playClickSound();
  };

  const getStatusBadge = () => {
    switch (quizStatus) {
      case 'active':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            LIVE
          </span>
        );
      case 'ended':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-500/20 text-purple-400 border border-purple-500/30">
            FINISHED
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-400 border border-amber-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            LOBBY
          </span>
        );
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full glass-panel border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand / Logo */}
        <div
          onClick={() => {
            playClickSound();
            onNavigate('participant');
          }}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform">
            <Sparkles className="w-5 h-5 text-slate-950" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold tracking-tight text-white group-hover:text-amber-300 transition-colors">
                AI QUIZ <span className="text-amber-400">3D</span>
              </span>
              {getStatusBadge()}
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">
              Interactive Real-Time Architecture Challenge
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Cloud Sync Mode indicator */}
          <div
            title={
              isSupabaseConfigured
                ? 'Cloud Production Mode Active (Supabase Realtime)'
                : 'Demo Local Mode Active (BroadcastChannel + LocalStorage)'
            }
            className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-mono bg-slate-900/60 border border-slate-800 text-slate-400"
          >
            <Globe className={`w-3.5 h-3.5 ${isSupabaseConfigured ? 'text-cyan-400' : 'text-amber-400'}`} />
            <span>{isSupabaseConfigured ? 'Supabase Sync' : 'Local Tab Sync'}</span>
          </div>

          {/* Sound Toggle */}
          <button
            onClick={handleSoundToggle}
            aria-label={soundOn ? 'Mute sound' : 'Unmute sound'}
            className="p-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-700/60 text-slate-300 hover:text-amber-300 transition-colors"
          >
            {soundOn ? <Volume2 className="w-4 h-4 text-amber-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
          </button>

          {/* View Switcher: Participant vs Admin */}
          {currentView === 'participant' ? (
            <button
              onClick={() => {
                playClickSound();
                onNavigate('admin');
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-700/70 text-xs font-semibold text-slate-200 hover:text-amber-400 transition-all hover:border-amber-400/40"
            >
              <Shield className="w-3.5 h-3.5 text-amber-400" />
              <span>Host Admin</span>
            </button>
          ) : (
            <button
              onClick={() => {
                playClickSound();
                onNavigate('participant');
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-400/10 hover:bg-amber-400/20 border border-amber-400/40 text-xs font-semibold text-amber-300 transition-all"
            >
              <Users className="w-3.5 h-3.5" />
              <span>Participant View</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}

