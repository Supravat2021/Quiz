import { useState, useEffect } from 'react';
import { Volume2, VolumeX, Shield, Users, Globe, Sparkles } from 'lucide-react';
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
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/30">
            <span className="w-2 h-2 rounded-full bg-white animate-ping" />
            LIVE QUIZ
          </span>
        );
      case 'ended':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-purple-600 text-white shadow-md shadow-purple-600/30">
            FINISHED
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-400 text-slate-950 shadow-md shadow-amber-400/30">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-950" />
            LOBBY
          </span>
        );
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full glass-panel border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand / Logo */}
        <div
          onClick={() => {
            playClickSound();
            onNavigate('participant');
          }}
          className="flex items-center gap-3 cursor-pointer group"
        >
          {/* Juicy Gradient Rounded Logo Icon */}
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-pink-500 via-purple-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-pink-500/30 group-hover:scale-105 group-hover:rotate-3 transition-transform">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <span className="text-xl font-black tracking-tight font-display text-white group-hover:text-pink-300 transition-colors">
                SYNAPSE <span className="gradient-text-fun font-mono text-sm uppercase">3D</span>
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
                : 'Direct Tab Sync (BroadcastChannel + LocalStorage)'
            }
            className="hidden md:flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-950/80 border border-indigo-500/30 text-indigo-200"
          >
            <Globe className={`w-3.5 h-3.5 ${isSupabaseConfigured ? 'text-teal-400' : 'text-pink-400'}`} />
            <span>{isSupabaseConfigured ? 'Cloud Sync' : 'Tab Sync'}</span>
          </div>

          {/* Sound Synthesizer Toggle */}
          <button
            onClick={handleSoundToggle}
            aria-label={soundOn ? 'Mute sound' : 'Unmute sound'}
            className="p-2.5 rounded-2xl bg-indigo-950/80 hover:bg-indigo-900 border border-indigo-500/25 text-white hover:text-pink-300 transition-all cursor-pointer shadow-sm"
          >
            {soundOn ? <Volume2 className="w-4 h-4 text-pink-400" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
          </button>

          {/* View Switcher: Participant vs Host Admin */}
          {currentView === 'participant' ? (
            <button
              onClick={() => {
                playClickSound();
                onNavigate('admin');
              }}
              className="flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-xs font-bold text-white transition-all cursor-pointer shadow-md shadow-purple-600/25 transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <Shield className="w-3.5 h-3.5 text-amber-300" />
              <span>Host Console</span>
            </button>
          ) : (
            <button
              onClick={() => {
                playClickSound();
                onNavigate('participant');
              }}
              className="flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-400 hover:to-rose-400 text-xs font-bold text-white transition-all cursor-pointer shadow-md shadow-pink-500/25 transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <Users className="w-3.5 h-3.5" />
              <span>Player View</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
