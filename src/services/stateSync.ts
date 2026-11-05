import { QuizSession, Participant } from '../types/quiz';
import { supabase, isSupabaseConfigured } from './supabaseClient';

const STORAGE_SESSION_KEY = 'ai_quiz_session_state';
const STORAGE_PARTICIPANTS_KEY = 'ai_quiz_participants_list';
const BROADCAST_CHANNEL_NAME = 'ai_quiz_realtime_sync_channel';

// Default initial session
export const defaultSession: QuizSession = {
  id: 'main-quiz-session',
  status: 'waiting',
  currentQuestionIndex: 0,
  resultsPublished: false,
  startedAt: null,
  endedAt: null,
  updatedAt: Date.now(),
  resetCount: 0,
};

// In-memory cache
let currentSession: QuizSession = defaultSession;
let currentParticipants: Participant[] = [];

// Initialize broadcast channel if supported in browser
let broadcastChannel: BroadcastChannel | null = null;
if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
  try {
    broadcastChannel = new BroadcastChannel(BROADCAST_CHANNEL_NAME);
  } catch (err) {
    console.warn('BroadcastChannel not available:', err);
  }
}

// Read from LocalStorage safely
export function getStoredSession(): QuizSession {
  if (typeof window === 'undefined') return defaultSession;
  try {
    const raw = localStorage.getItem(STORAGE_SESSION_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      currentSession = { ...defaultSession, ...parsed };
      return currentSession;
    }
  } catch (e) {
    console.error('Error parsing stored session:', e);
  }
  return defaultSession;
}

export function getStoredParticipants(): Participant[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_PARTICIPANTS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        currentParticipants = parsed;
        return currentParticipants;
      }
    }
  } catch (e) {
    console.error('Error parsing stored participants:', e);
  }
  return [];
}

// Save helpers
function persistSession(session: QuizSession) {
  if (typeof window === 'undefined') return;
  currentSession = session;
  localStorage.setItem(STORAGE_SESSION_KEY, JSON.stringify(session));
  if (broadcastChannel) {
    broadcastChannel.postMessage({ type: 'SESSION_SYNC', payload: session });
  }

  // Supabase cloud broadcast if enabled
  if (isSupabaseConfigured && supabase) {
    supabase.channel('ai-quiz-room').send({
      type: 'broadcast',
      event: 'session_sync',
      payload: session,
    }).catch((err) => console.warn('Supabase session broadcast error:', err));
  }
}

function persistParticipants(participants: Participant[]) {
  if (typeof window === 'undefined') return;
  currentParticipants = participants;
  localStorage.setItem(STORAGE_PARTICIPANTS_KEY, JSON.stringify(participants));
  if (broadcastChannel) {
    broadcastChannel.postMessage({ type: 'PARTICIPANTS_SYNC', payload: participants });
  }

  // Supabase cloud broadcast if enabled
  if (isSupabaseConfigured && supabase) {
    supabase.channel('ai-quiz-room').send({
      type: 'broadcast',
      event: 'participants_sync',
      payload: participants,
    }).catch((err) => console.warn('Supabase participants broadcast error:', err));
  }
}

// Public API
export function updateSession(partial: Partial<QuizSession>): QuizSession {
  const current = getStoredSession();
  const updated: QuizSession = {
    ...current,
    ...partial,
    updatedAt: Date.now(),
  };
  persistSession(updated);
  return updated;
}

export function startQuizSession(): QuizSession {
  const current = getStoredSession();
  const updated: QuizSession = {
    ...current,
    status: 'active',
    currentQuestionIndex: 0,
    resultsPublished: false,
    startedAt: Date.now(),
    endedAt: null,
    updatedAt: Date.now(),
  };
  persistSession(updated);
  return updated;
}

export function publishResultsSession(): QuizSession {
  const current = getStoredSession();
  const updated: QuizSession = {
    ...current,
    resultsPublished: true,
    status: 'ended',
    endedAt: current.endedAt || Date.now(),
    updatedAt: Date.now(),
  };
  persistSession(updated);
  return updated;
}

export function unpublishResultsSession(): QuizSession {
  const current = getStoredSession();
  const updated: QuizSession = {
    ...current,
    resultsPublished: false,
    updatedAt: Date.now(),
  };
  persistSession(updated);
  return updated;
}

export function resetQuizSession(): QuizSession {
  const current = getStoredSession();
  const resetSessionState: QuizSession = {
    ...defaultSession,
    resultsPublished: false,
    resetCount: (current.resetCount || 0) + 1,
    updatedAt: Date.now(),
  };
  persistSession(resetSessionState);
  persistParticipants([]);
  return resetSessionState;
}

export function finishQuizSession(): QuizSession {
  const current = getStoredSession();
  const updated: QuizSession = {
    ...current,
    status: 'ended',
    endedAt: Date.now(),
    updatedAt: Date.now(),
  };
  persistSession(updated);
  return updated;
}

export function upsertParticipant(participant: Participant): void {
  const list = getStoredParticipants();
  const index = list.findIndex((p) => p.id === participant.id);
  let updatedList: Participant[];

  if (index >= 0) {
    updatedList = [...list];
    updatedList[index] = {
      ...updatedList[index],
      ...participant,
      lastActiveAt: Date.now(),
    };
  } else {
    updatedList = [...list, { ...participant, lastActiveAt: Date.now() }];
  }

  persistParticipants(updatedList);
}

export function removeParticipant(id: string): void {
  const list = getStoredParticipants();
  const updated = list.filter((p) => p.id !== id);
  persistParticipants(updated);
}

export function addDemoParticipants(): void {
  const demoUsers: Participant[] = [
    {
      id: 'demo-1',
      name: 'Ada Lovelace',
      score: 1180,
      currentQuestionIndex: 9,
      submitted: true,
      completed: true,
      joinedAt: Date.now() - 360000,
      lastActiveAt: Date.now(),
      answers: {},
    },
    {
      id: 'demo-2',
      name: 'Alan Turing',
      score: 1140,
      currentQuestionIndex: 9,
      submitted: true,
      completed: true,
      joinedAt: Date.now() - 320000,
      lastActiveAt: Date.now(),
      answers: {},
    },
    {
      id: 'demo-3',
      name: 'Geoffrey Hinton',
      score: 1020,
      currentQuestionIndex: 8,
      submitted: true,
      completed: false,
      joinedAt: Date.now() - 250000,
      lastActiveAt: Date.now(),
      answers: {},
    },
    {
      id: 'demo-4',
      name: 'Fei-Fei Li',
      score: 980,
      currentQuestionIndex: 7,
      submitted: false,
      completed: false,
      joinedAt: Date.now() - 200000,
      lastActiveAt: Date.now(),
      answers: {},
    },
    {
      id: 'demo-5',
      name: 'Demis Hassabis',
      score: 950,
      currentQuestionIndex: 6,
      submitted: false,
      completed: false,
      joinedAt: Date.now() - 150000,
      lastActiveAt: Date.now(),
      answers: {},
    },
  ];

  const current = getStoredParticipants();
  const merged = [...current];
  demoUsers.forEach((demo) => {
    if (!merged.some((p) => p.id === demo.id)) {
      merged.push(demo);
    }
  });

  persistParticipants(merged);
}

// Unified Subscription hook
export function subscribeToQuizState(callbacks: {
  onSession: (session: QuizSession) => void;
  onParticipants: (participants: Participant[]) => void;
}): () => void {
  let isSubscribed = true;

  // Initial push
  callbacks.onSession(getStoredSession());
  callbacks.onParticipants(getStoredParticipants());

  // 1. BroadcastChannel listener
  const handleBroadcastMessage = (event: MessageEvent) => {
    if (!isSubscribed) return;
    const { type, payload } = event.data || {};
    if (type === 'SESSION_SYNC' && payload) {
      currentSession = payload;
      callbacks.onSession(payload);
    } else if (type === 'PARTICIPANTS_SYNC' && payload) {
      currentParticipants = payload;
      callbacks.onParticipants(payload);
    }
  };

  if (broadcastChannel) {
    broadcastChannel.addEventListener('message', handleBroadcastMessage);
  }

  // 2. Storage event listener (cross-tab sync)
  const handleStorageChange = (e: StorageEvent) => {
    if (!isSubscribed) return;
    if (e.key === STORAGE_SESSION_KEY && e.newValue) {
      try {
        const session = JSON.parse(e.newValue);
        currentSession = session;
        callbacks.onSession(session);
      } catch (err) {
        console.error('Storage session parse error:', err);
      }
    } else if (e.key === STORAGE_PARTICIPANTS_KEY && e.newValue) {
      try {
        const participants = JSON.parse(e.newValue);
        currentParticipants = participants;
        callbacks.onParticipants(participants);
      } catch (err) {
        console.error('Storage participants parse error:', err);
      }
    }
  };

  window.addEventListener('storage', handleStorageChange);

  // 3. Supabase Realtime cloud listener (if configured)
  let supabaseChannel: ReturnType<NonNullable<typeof supabase>['channel']> | null = null;
  if (isSupabaseConfigured && supabase) {
    supabaseChannel = supabase
      .channel('ai-quiz-room')
      .on('broadcast', { event: 'session_sync' }, ({ payload }) => {
        if (!isSubscribed) return;
        currentSession = payload;
        localStorage.setItem(STORAGE_SESSION_KEY, JSON.stringify(payload));
        callbacks.onSession(payload);
      })
      .on('broadcast', { event: 'participants_sync' }, ({ payload }) => {
        if (!isSubscribed) return;
        currentParticipants = payload;
        localStorage.setItem(STORAGE_PARTICIPANTS_KEY, JSON.stringify(payload));
        callbacks.onParticipants(payload);
      })
      .subscribe();
  }

  // 4. Polling fallback (every 600ms) to ensure sync if browser tabs throttled events
  const intervalId = window.setInterval(() => {
    if (!isSubscribed) return;
    const freshSession = getStoredSession();
    if (JSON.stringify(freshSession) !== JSON.stringify(currentSession)) {
      currentSession = freshSession;
      callbacks.onSession(freshSession);
    }
    const freshParticipants = getStoredParticipants();
    if (JSON.stringify(freshParticipants) !== JSON.stringify(currentParticipants)) {
      currentParticipants = freshParticipants;
      callbacks.onParticipants(freshParticipants);
    }
  }, 600);

  // Cleanup
  return () => {
    isSubscribed = false;
    window.clearInterval(intervalId);
    window.removeEventListener('storage', handleStorageChange);
    if (broadcastChannel) {
      broadcastChannel.removeEventListener('message', handleBroadcastMessage);
    }
    if (supabaseChannel && supabase) {
      supabase.removeChannel(supabaseChannel);
    }
  };
}
