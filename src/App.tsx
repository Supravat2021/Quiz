import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { LobbyScreen } from './components/LobbyScreen';
import { ActiveQuizScreen } from './components/ActiveQuizScreen';
import { WaitingForResultsScreen } from './components/WaitingForResultsScreen';
import { CompletionScreen } from './components/CompletionScreen';
import { AdminPortal } from './components/AdminPortal';
import { Participant, QuizSession } from './types/quiz';
import {
  defaultSession,
  subscribeToQuizState,
  startQuizSession,
  publishResultsSession,
  unpublishResultsSession,
  resetQuizSession,
  upsertParticipant,
  removeParticipant,
  addDemoParticipants,
  getStoredSession,
  getStoredParticipants,
} from './services/stateSync';

const LOCAL_PARTICIPANT_ID_KEY = 'ai_quiz_my_participant_id';

export function App() {
  // Routing: inspect path
  const [currentView, setCurrentView] = useState<'participant' | 'admin'>(() => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname.toLowerCase();
      const hash = window.location.hash.toLowerCase();
      if (path.includes('/admin') || hash.includes('admin')) {
        return 'admin';
      }
    }
    return 'participant';
  });

  const [session, setSession] = useState<QuizSession>(getStoredSession());
  const [participants, setParticipants] = useState<Participant[]>(getStoredParticipants());
  const [myParticipant, setMyParticipant] = useState<Participant | null>(null);
  const [soloBypassStart, setSoloBypassStart] = useState(false);
  const [soloBypassResults, setSoloBypassResults] = useState(false);
  const [lastResetCount, setLastResetCount] = useState<number>(session.resetCount || 0);

  // Sync route changes with URL
  const handleNavigate = (view: 'participant' | 'admin') => {
    setCurrentView(view);
    if (typeof window !== 'undefined') {
      const newPath = view === 'admin' ? '/admin' : '/';
      window.history.pushState({}, '', newPath);
    }
  };

  // Listen to popstate for browser back/forward navigation
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname.toLowerCase();
      const hash = window.location.hash.toLowerCase();
      setCurrentView(path.includes('/admin') || hash.includes('admin') ? 'admin' : 'participant');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Subscribe to real-time session and participant state (dual-mode: broadcast + storage + supabase)
  useEffect(() => {
    const unsubscribe = subscribeToQuizState({
      onSession: (updatedSession) => {
        setSession(updatedSession);
      },
      onParticipants: (updatedParticipants) => {
        setParticipants(updatedParticipants);
      },
    });

    return () => unsubscribe();
  }, []);

  // Track & restore local participant profile
  useEffect(() => {
    const savedId = localStorage.getItem(LOCAL_PARTICIPANT_ID_KEY);
    if (savedId) {
      const match = participants.find((p) => p.id === savedId);
      if (match) {
        setMyParticipant(match);
      }
    }
  }, [participants]);

  // Handle session reset broadcast
  useEffect(() => {
    if (session.resetCount !== undefined && session.resetCount > lastResetCount) {
      setLastResetCount(session.resetCount);
      setSoloBypassStart(false);
      setSoloBypassResults(false);
      // Reset local participant answers if needed
      if (myParticipant) {
        const fresh: Participant = {
          ...myParticipant,
          score: 0,
          currentQuestionIndex: 0,
          answers: {},
          submitted: false,
          completed: false,
        };
        setMyParticipant(fresh);
        upsertParticipant(fresh);
      }
    }
  }, [session.resetCount, lastResetCount, myParticipant]);

  // Join quiz handler
  const handleJoinQuiz = (name: string) => {
    const newId = 'user_' + Math.random().toString(36).substring(2, 9);
    const newParticipant: Participant = {
      id: newId,
      name,
      score: 0,
      currentQuestionIndex: 0,
      answers: {},
      submitted: false,
      completed: false,
      joinedAt: Date.now(),
      lastActiveAt: Date.now(),
    };

    localStorage.setItem(LOCAL_PARTICIPANT_ID_KEY, newId);
    setMyParticipant(newParticipant);
    upsertParticipant(newParticipant);
  };

  // Participant updates
  const handleUpdateParticipant = (updated: Participant) => {
    setMyParticipant(updated);
    upsertParticipant(updated);
  };

  // Participant submits all 10 answers
  const handleSubmitQuiz = (submittedParticipant: Participant) => {
    const updated: Participant = {
      ...submittedParticipant,
      submitted: true,
      completed: false,
    };
    setMyParticipant(updated);
    upsertParticipant(updated);
  };

  // Play again handler
  const handlePlayAgain = () => {
    if (myParticipant) {
      const restarted: Participant = {
        ...myParticipant,
        score: 0,
        currentQuestionIndex: 0,
        answers: {},
        submitted: false,
        completed: false,
      };
      setMyParticipant(restarted);
      upsertParticipant(restarted);
      setSoloBypassStart(true);
      setSoloBypassResults(false);
    }
  };

  // Determine participant screen state
  const isQuizLive = session.status === 'active' || soloBypassStart;
  const hasSubmitted = myParticipant?.submitted === true || myParticipant?.completed === true;
  const canViewResults = session.resultsPublished || soloBypassResults;

  return (
    <div className="min-h-screen bg-[#0b132b] text-slate-100 flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Global Navigation Header */}
      <Header
        currentView={currentView}
        onNavigate={handleNavigate}
        quizStatus={session.status}
        participantCount={participants.length}
      />

      {/* Main Content Router */}
      <main className="flex-1">
        {currentView === 'admin' ? (
          <AdminPortal
            session={session}
            participants={participants}
            onStartQuiz={() => {
              startQuizSession();
            }}
            onPublishResults={() => {
              publishResultsSession();
            }}
            onUnpublishResults={() => {
              unpublishResultsSession();
            }}
            onResetSession={() => {
              resetQuizSession();
            }}
            onAddDemoParticipants={() => {
              addDemoParticipants();
            }}
            onRemoveParticipant={(id) => {
              removeParticipant(id);
            }}
          />
        ) : (
          /* Participant View */
          <>
            {!myParticipant ? (
              <LobbyScreen
                currentParticipant={null}
                onJoin={handleJoinQuiz}
                session={session}
                participants={participants}
                onBypassStart={() => setSoloBypassStart(true)}
              />
            ) : hasSubmitted && canViewResults ? (
              <CompletionScreen
                currentParticipant={myParticipant}
                participants={participants}
                onPlayAgain={handlePlayAgain}
              />
            ) : hasSubmitted && !canViewResults ? (
              <WaitingForResultsScreen
                currentParticipant={myParticipant}
                participants={participants}
                session={session}
                onSoloRevealResults={() => setSoloBypassResults(true)}
              />
            ) : !isQuizLive ? (
              <LobbyScreen
                currentParticipant={myParticipant}
                onJoin={handleJoinQuiz}
                session={session}
                participants={participants}
                onBypassStart={() => setSoloBypassStart(true)}
              />
            ) : (
              <ActiveQuizScreen
                currentParticipant={myParticipant}
                onUpdateParticipant={handleUpdateParticipant}
                onSubmitQuiz={handleSubmitQuiz}
              />
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="py-4 border-t border-slate-900 text-center text-xs text-slate-500 font-mono">
        <p>AI Quiz 3D • Next-Gen Interactive Web Application • Ready for Vercel Deployment</p>
      </footer>
    </div>
  );
}

export default App;
