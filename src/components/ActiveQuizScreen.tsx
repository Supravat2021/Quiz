import { useState, useEffect, useRef } from 'react';
import { Clock, CheckCircle2, ArrowRight, Sparkles, Send } from 'lucide-react';
import { QuizQuestion, Participant, ParticipantAnswer } from '../types/quiz';
import { QUIZ_QUESTIONS } from '../data/questions';
import { QuestionCanvas } from './3d/QuestionCanvas';
import { playClickSound } from '../utils/sound';

interface ActiveQuizScreenProps {
  currentParticipant: Participant;
  onUpdateParticipant: (participant: Participant) => void;
  onSubmitQuiz: (participant: Participant) => void;
}

const SECONDS_PER_QUESTION = 20;

export function ActiveQuizScreen({
  currentParticipant,
  onUpdateParticipant,
  onSubmitQuiz,
}: ActiveQuizScreenProps) {
  const [questionIndex, setQuestionIndex] = useState(
    currentParticipant.currentQuestionIndex || 0
  );
  const [selectedOption, setSelectedOption] = useState<'A' | 'B' | 'C' | 'D' | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [timeLeft, setTimeLeft] = useState(SECONDS_PER_QUESTION);
  const [questionStartTime, setQuestionStartTime] = useState(Date.now());
  const timerRef = useRef<number | null>(null);
  const autoAdvanceTimeoutRef = useRef<number | null>(null);

  const currentQuestion: QuizQuestion = QUIZ_QUESTIONS[questionIndex] || QUIZ_QUESTIONS[0];
  const isLastQuestion = questionIndex === QUIZ_QUESTIONS.length - 1;

  // Restore previously chosen answer if navigating
  useEffect(() => {
    const existing = currentParticipant.answers?.[currentQuestion.id];
    if (existing) {
      setSelectedOption(existing.selectedOption);
      setIsAnswered(true);
    } else {
      setSelectedOption(null);
      setIsAnswered(false);
    }

    setTimeLeft(SECONDS_PER_QUESTION);
    setQuestionStartTime(Date.now());

    if (timerRef.current) clearInterval(timerRef.current);
    if (autoAdvanceTimeoutRef.current) clearTimeout(autoAdvanceTimeoutRef.current);

    timerRef.current = window.setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          handleTimeExpired();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (autoAdvanceTimeoutRef.current) clearTimeout(autoAdvanceTimeoutRef.current);
    };
  }, [questionIndex]);

  const handleTimeExpired = () => {
    if (isAnswered) return;
    setIsAnswered(true);

    const isCorrect = 'A' === currentQuestion.correct;
    const answerRecord: ParticipantAnswer = {
      questionId: currentQuestion.id,
      selectedOption: 'A', // default timeout option
      isCorrect,
      timeTakenMs: SECONDS_PER_QUESTION * 1000,
      pointsEarned: isCorrect ? 100 : 0,
    };

    const updatedAnswers = {
      ...currentParticipant.answers,
      [currentQuestion.id]: answerRecord,
    };

    onUpdateParticipant({
      ...currentParticipant,
      currentQuestionIndex: questionIndex,
      answers: updatedAnswers,
    });
  };

  const handleOptionSelect = (optionId: 'A' | 'B' | 'C' | 'D') => {
    if (isAnswered) return;

    if (timerRef.current) clearInterval(timerRef.current);
    setIsAnswered(true);
    setSelectedOption(optionId);

    // Compute points and correctness silently in background without revealing to participant
    const isCorrect = optionId === currentQuestion.correct;
    const timeTakenMs = Date.now() - questionStartTime;
    const remainingFraction = Math.max(0, timeLeft / SECONDS_PER_QUESTION);
    const speedBonus = isCorrect ? Math.round(remainingFraction * 50) : 0;
    const pointsEarned = isCorrect ? 100 + speedBonus : 0;

    const answerRecord: ParticipantAnswer = {
      questionId: currentQuestion.id,
      selectedOption: optionId,
      isCorrect,
      timeTakenMs,
      pointsEarned,
    };

    // Calculate cumulative score silently
    const previousAnswers = { ...currentParticipant.answers, [currentQuestion.id]: answerRecord };
    const calculatedTotalScore = Object.values(previousAnswers).reduce(
      (sum, a) => sum + (a.pointsEarned || 0),
      0
    );

    const updatedParticipant: Participant = {
      ...currentParticipant,
      score: calculatedTotalScore,
      currentQuestionIndex: questionIndex,
      answers: previousAnswers,
    };

    onUpdateParticipant(updatedParticipant);

    // Smooth auto-advance after 1.2s if not last question
    if (!isLastQuestion) {
      autoAdvanceTimeoutRef.current = window.setTimeout(() => {
        advanceNextQuestion(updatedParticipant);
      }, 1200);
    }
  };

  const advanceNextQuestion = (participantState = currentParticipant) => {
    if (autoAdvanceTimeoutRef.current) clearTimeout(autoAdvanceTimeoutRef.current);

    if (isLastQuestion) {
      // Last question submitted
      const submittedState: Participant = {
        ...participantState,
        submitted: true,
        completed: false, // will become completed when admin confirms & publishes
      };
      onSubmitQuiz(submittedState);
    } else {
      const nextIndex = questionIndex + 1;
      setQuestionIndex(nextIndex);
      onUpdateParticipant({
        ...participantState,
        currentQuestionIndex: nextIndex,
      });
    }
  };

  const answeredCount = Object.keys(currentParticipant.answers || {}).length;
  const progressPercentage = ((questionIndex + 1) / QUIZ_QUESTIONS.length) * 100;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
      {/* Top Header Bar: Progress & Confidentiality Notice */}
      <div className="mb-4 sm:mb-6 glass-panel rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4 border border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center font-mono font-bold text-amber-400">
            {questionIndex + 1}/{QUIZ_QUESTIONS.length}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold">
                {currentQuestion.topic}
              </span>
            </div>
            <h3 className="text-sm sm:text-base font-bold text-white">
              Question {questionIndex + 1}
            </h3>
          </div>
        </div>

        {/* Status Indicators */}
        <div className="flex items-center gap-3">
          {/* Answered Counter badge */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/90 border border-slate-700 text-xs text-slate-300">
            <CheckCircle2 className="w-4 h-4 text-cyan-400" />
            <span>Answered: <strong className="text-cyan-300 font-mono">{answeredCount} of 10</strong></span>
          </div>

          {/* Timer Countdown Badge */}
          <div
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl font-mono text-sm font-bold border transition-colors ${
              timeLeft <= 5
                ? 'bg-red-500/20 text-red-400 border-red-500/50 animate-pulse'
                : 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>{timeLeft}s</span>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-900 h-2 rounded-full mb-6 overflow-hidden border border-slate-800">
        <div
          className="h-full bg-gradient-to-r from-cyan-400 via-amber-400 to-amber-500 transition-all duration-500 rounded-full"
          style={{ width: `${progressPercentage}%` }}
        />
      </div>

      {/* Split-Screen Main Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left Column: 3D Procedural Canvas Scene */}
        <div className="lg:col-span-6 xl:col-span-7 flex flex-col">
          <QuestionCanvas questionIndex={questionIndex} />
        </div>

        {/* Right Column: Question Card & Options */}
        <div className="lg:col-span-6 xl:col-span-5 flex flex-col justify-between">
          <div className="glass-panel rounded-2xl p-6 sm:p-8 border border-slate-800 shadow-xl flex-1 flex flex-col justify-between">
            {/* Question Text */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="inline-block px-3 py-1 rounded-lg text-xs font-mono font-medium text-cyan-300 bg-cyan-950/60 border border-cyan-800/50">
                  {currentQuestion.topic}
                </span>
                <span className="text-[11px] font-mono text-slate-400">
                  Score revealed after submission & host confirmation
                </span>
              </div>

              <h2 className="text-xl sm:text-2xl font-bold text-white mb-6 leading-snug">
                {currentQuestion.text}
              </h2>

              {/* 4 Options Grid */}
              <div className="space-y-3">
                {currentQuestion.options.map((option) => {
                  const isSelected = selectedOption === option.id;

                  // Clean, neutral selected state (DO NOT reveal correct/incorrect during the quiz)
                  let buttonStyles =
                    'bg-slate-900/80 hover:bg-slate-800 border-slate-800 text-slate-200 hover:border-slate-700 hover:text-white';

                  if (isSelected) {
                    buttonStyles =
                      'bg-amber-400/20 border-amber-400 text-amber-200 shadow-lg shadow-amber-500/20 font-bold';
                  } else if (isAnswered) {
                    buttonStyles = 'bg-slate-900/40 border-slate-800/40 text-slate-500 opacity-70';
                  }

                  return (
                    <button
                      key={option.id}
                      disabled={isAnswered}
                      onClick={() => {
                        playClickSound();
                        handleOptionSelect(option.id);
                      }}
                      className={`w-full p-4 rounded-xl border text-left flex items-start gap-3.5 transition-all cursor-pointer font-medium text-sm sm:text-base relative ${buttonStyles}`}
                    >
                      <span
                        className={`w-7 h-7 rounded-lg flex items-center justify-center font-mono font-bold text-xs shrink-0 transition-colors ${
                          isSelected
                            ? 'bg-amber-400 text-slate-950 font-extrabold'
                            : 'bg-slate-800 text-slate-300'
                        }`}
                      >
                        {option.id}
                      </span>
                      <span className="flex-1 pt-0.5">{option.text}</span>

                      {isSelected && (
                        <CheckCircle2 className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Answer Recorded Notification & Advance Control */}
            {isAnswered && (
              <div className="mt-6 pt-5 border-t border-slate-800 animate-fadeIn">
                <div className="p-3.5 rounded-xl border bg-slate-900/90 border-slate-700 text-slate-200 flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span className="text-xs sm:text-sm font-semibold">
                      Answer saved for Question {questionIndex + 1}
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-400 font-mono">Locked</span>
                </div>

                {/* Manual Advance / Submit Button */}
                <button
                  onClick={() => advanceNextQuestion()}
                  className={`w-full py-3.5 px-5 rounded-xl font-bold flex items-center justify-center gap-2 cursor-pointer shadow-lg transition-all ${
                    isLastQuestion
                      ? 'bg-gradient-to-r from-emerald-400 to-emerald-500 hover:from-emerald-300 hover:to-emerald-400 text-slate-950 shadow-emerald-500/25'
                      : 'bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 shadow-amber-500/20'
                  }`}
                >
                  {isLastQuestion ? (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Submit All 10 Answers</span>
                    </>
                  ) : (
                    <>
                      <span>Next Question</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
