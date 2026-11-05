import { useState, useEffect, useRef } from 'react';
import { Clock, CheckCircle2, ArrowRight, Send } from 'lucide-react';
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
      selectedOption: 'A',
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

    // Smooth auto-advance after 1.1s if not last question
    if (!isLastQuestion) {
      autoAdvanceTimeoutRef.current = window.setTimeout(() => {
        advanceNextQuestion(updatedParticipant);
      }, 1100);
    }
  };

  const advanceNextQuestion = (participantState = currentParticipant) => {
    if (autoAdvanceTimeoutRef.current) clearTimeout(autoAdvanceTimeoutRef.current);

    if (isLastQuestion) {
      const submittedState: Participant = {
        ...participantState,
        submitted: true,
        completed: false,
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

  // Option Letter Badge Colors
  const optionLetterBadges = {
    A: 'bg-gradient-to-br from-pink-500 to-rose-600 text-white shadow-pink-500/30',
    B: 'bg-gradient-to-br from-purple-500 to-indigo-600 text-white shadow-purple-500/30',
    C: 'bg-gradient-to-br from-teal-400 to-cyan-500 text-slate-950 shadow-teal-500/30',
    D: 'bg-gradient-to-br from-amber-400 to-orange-500 text-slate-950 shadow-amber-500/30',
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
      {/* Top Header Bar: Clean Solid & Gradient Progress */}
      <div className="mb-4 sm:mb-6 glass-panel rounded-3xl p-4 flex flex-wrap items-center justify-between gap-4 border-2 border-purple-500/20">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-pink-500 to-purple-600 flex items-center justify-center font-black text-white text-base shadow-lg shadow-pink-500/30">
            {questionIndex + 1}
          </div>
          <div>
            <span className="text-xs uppercase tracking-wider text-pink-300 font-bold block">
              {currentQuestion.topic}
            </span>
            <h3 className="text-base font-black text-white font-display">
              Question {questionIndex + 1} of {QUIZ_QUESTIONS.length}
            </h3>
          </div>
        </div>

        {/* Status Indicators */}
        <div className="flex items-center gap-3">
          {/* Answered Counter Pill */}
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-950/90 border border-indigo-500/40 text-xs font-bold text-white shadow-sm">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Answered: <strong className="text-pink-300">{answeredCount}/10</strong></span>
          </div>

          {/* Timer Countdown Badge */}
          <div
            className={`flex items-center gap-2 px-4 py-1.5 rounded-full font-mono text-xs font-black shadow-md transition-all ${
              timeLeft <= 5
                ? 'bg-rose-500 text-white animate-pulse shadow-rose-500/40'
                : 'bg-gradient-to-r from-amber-400 to-orange-500 text-slate-950 shadow-amber-400/30'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>{timeLeft}s</span>
          </div>
        </div>
      </div>

      {/* Saturated Gradient Progress Bar */}
      <div className="w-full bg-slate-950/80 h-2.5 rounded-full mb-6 overflow-hidden border border-white/10 p-0.5">
        <div
          className="h-full bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-400 transition-all duration-500 rounded-full shadow-lg shadow-pink-500/30"
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
          <div className="glass-panel rounded-3xl p-6 sm:p-8 border-2 border-purple-500/25 shadow-2xl flex-1 flex flex-col justify-between">
            {/* Question Text */}
            <div>
              <div className="flex items-center justify-between mb-3.5">
                <span className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-white bg-gradient-to-r from-indigo-500 to-purple-600 shadow-sm">
                  {currentQuestion.topic}
                </span>
                <span className="text-xs font-bold text-pink-400">
                  Scores reveal at the end!
                </span>
              </div>

              <h2 className="text-xl sm:text-2xl font-black font-display text-white mb-6 leading-snug">
                {currentQuestion.text}
              </h2>

              {/* 4 Options Grid */}
              <div className="space-y-3">
                {currentQuestion.options.map((option) => {
                  const isSelected = selectedOption === option.id;

                  let cardStyles =
                    'bg-[#151433] hover:bg-[#1e1c45] border-2 border-purple-500/20 text-slate-100 hover:border-purple-400/50';

                  if (isSelected) {
                    cardStyles =
                      'bg-gradient-to-r from-purple-900/60 to-indigo-900/60 border-2 border-pink-400 text-white shadow-xl shadow-pink-500/20 font-bold scale-[1.01]';
                  } else if (isAnswered) {
                    cardStyles = 'bg-[#121128]/50 border-white/5 text-slate-500 opacity-50';
                  }

                  return (
                    <button
                      key={option.id}
                      disabled={isAnswered}
                      onClick={() => {
                        playClickSound();
                        handleOptionSelect(option.id);
                      }}
                      className={`w-full p-4 rounded-2xl text-left flex items-start gap-4 transition-all cursor-pointer text-sm sm:text-base relative ${cardStyles}`}
                    >
                      {/* Bold Colorful Solid Letter Badge */}
                      <span
                        className={`w-8 h-8 rounded-xl flex items-center justify-center font-black text-sm shrink-0 shadow-md ${
                          optionLetterBadges[option.id]
                        }`}
                      >
                        {option.id}
                      </span>
                      <span className="flex-1 pt-1 leading-relaxed font-semibold">{option.text}</span>

                      {isSelected && (
                        <CheckCircle2 className="w-6 h-6 text-pink-400 shrink-0 mt-0.5" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Answer Recorded Notification & Advance Control */}
            {isAnswered && (
              <div className="mt-6 pt-5 border-t border-white/10 animate-fadeIn">
                <div className="p-3.5 rounded-2xl border-2 border-emerald-500/30 bg-emerald-950/40 text-emerald-200 flex items-center justify-between mb-4 shadow-sm">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    <span className="text-sm font-bold">
                      Answer saved for Question {questionIndex + 1}!
                    </span>
                  </div>
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">Locked In</span>
                </div>

                {/* Saturated Solid / Gradient Button */}
                <button
                  onClick={() => advanceNextQuestion()}
                  className={`w-full py-4 px-6 rounded-2xl font-black text-base flex items-center justify-center gap-2 cursor-pointer shadow-xl transition-all transform hover:-translate-y-0.5 active:translate-y-0 ${
                    isLastQuestion
                      ? 'bg-gradient-to-r from-emerald-400 via-teal-500 to-cyan-500 hover:from-emerald-300 hover:to-cyan-400 text-slate-950 shadow-emerald-500/30'
                      : 'bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-600 hover:from-pink-400 hover:to-indigo-500 text-white shadow-pink-500/30'
                  }`}
                >
                  {isLastQuestion ? (
                    <>
                      <Send className="w-5 h-5" />
                      <span>Submit All 10 Answers</span>
                    </>
                  ) : (
                    <>
                      <span>Next Question</span>
                      <ArrowRight className="w-5 h-5" />
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
