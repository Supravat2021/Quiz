import { useState, useEffect } from 'react';
import { Volume2, VolumeX, Shield, Users, Globe } from 'lucide-react';
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
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            LIVE SESSION
          </span>
        );
      case 'ended':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono tracking-wider bg-purple-500/10 text-purple-300 border border-purple-500/20">
            CONCLUDED
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono tracking-wider bg-amber-400/10 text-amber-300 border border-amber-400/20">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            LOBBY READY
          </span>
        );
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full glass-panel border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand / Logo */}
        <div
          onClick={() => {
            playClickSound();
            onNavigate('participant');
          }}
          className="flex items-center gap-3 cursor-pointer group"
        >
          {/* Minimalist Geometric Monogram */}
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-300 via-amber-400 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/15 group-hover:scale-105 transition-transform">
            <div className="w-4 h-4 border-2 border-slate-950 rotate-45 flex items-center justify-center">
              <div className="w-1.5 h-1.5 bg-slate-950 rounded-full" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <span className="text-lg font-extrabold tracking-tight font-display text-white group-hover:text-amber-200 transition-colors">
                SYNAPSE <span className="text-amber-400 text-sm font-mono tracking-normal">3D</span>
              </span>
              {getStatusBadge()}
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Cloud Sync Status */}
          <div
            title={
              isSupabaseConfigured
                ? 'Cloud Production Mode (Supabase Realtime)'
                : 'Local Tab Sync (BroadcastChannel + LocalStorage)'
            }
            className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-mono bg-slate-900/60 border border-white/5 text-slate-400"
          >
            <Globe className={`w-3.5 h-3.5 ${isSupabaseConfigured ? 'text-teal-400' : 'text-amber-400'}`} />
            <span>{isSupabaseConfigured ? 'Supabase Sync' : 'Direct Sync'}</span>
          </div>

          {/* Sound Synthesizer Toggle */}
          <button
            onClick={handleSoundToggle}
            aria-label={soundOn ? 'Mute sound' : 'Unmute sound'}
            className="p-2 rounded-xl bg-slate-900/60 hover:bg-slate-800/80 border border-white/5 text-slate-400 hover:text-amber-300 transition-all cursor-pointer"
          >
            {soundOn ? <Volume2 className="w-4 h-4 text-amber-400" /> : <VolumeX className="w-4 h-4 text-slate-600" />}
          </button>

          {/* View Switcher: Participant vs Host Admin */}
          {currentView === 'participant' ? (
            <button
              onClick={() => {
                playClickSound();
                onNavigate('admin');
              }}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-white/10 text-xs font-semibold text-slate-300 hover:text-amber-300 transition-all cursor-pointer hover:border-amber-400/30"
            >
              <Shield className="w-3.5 h-3.5 text-amber-400" />
              <span>Host Console</span>
            </button>
          ) : (
            <button
              onClick={() => {
                playClickSound();
                onNavigate('participant');
              }}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-amber-400/10 hover:bg-amber-400/20 border border-amber-400/30 text-xs font-semibold text-amber-300 transition-all cursor-pointer"
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
