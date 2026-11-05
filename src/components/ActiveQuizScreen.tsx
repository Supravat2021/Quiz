import { useState, useEffect, useRef } from 'react';
import { Clock, Zap, CheckCircle2, XCircle, ArrowRight, Sparkles, Award } from 'lucide-react';
import { QuizQuestion, Participant, ParticipantAnswer } from '../types/quiz';
import { QUIZ_QUESTIONS } from '../data/questions';
import { QuestionCanvas } from './3d/QuestionCanvas';
import { playClickSound, playCorrectSound, playWrongSound } from '../utils/sound';

interface ActiveQuizScreenProps {
  currentParticipant: Participant;
  onUpdateParticipant: (participant: Participant) => void;
  onFinishQuiz: () => void;
}

const SECONDS_PER_QUESTION = 20;

export function ActiveQuizScreen({
  currentParticipant,
  onUpdateParticipant,
  onFinishQuiz,
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

  // Initialize timer for each question
  useEffect(() => {
    setTimeLeft(SECONDS_PER_QUESTION);
    setQuestionStartTime(Date.now());
    setSelectedOption(null);
    setIsAnswered(false);

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
    playWrongSound();

    const answerRecord: ParticipantAnswer = {
      questionId: currentQuestion.id,
      selectedOption: 'A', // default timeout
      isCorrect: false,
      timeTakenMs: SECONDS_PER_QUESTION * 1000,
      pointsEarned: 0,
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

    const isCorrect = optionId === currentQuestion.correct;
    const timeTakenMs = Date.now() - questionStartTime;
    const remainingFraction = Math.max(0, timeLeft / SECONDS_PER_QUESTION);
    const speedBonus = isCorrect ? Math.round(remainingFraction * 50) : 0;
    const pointsEarned = isCorrect ? 100 + speedBonus : 0;

    if (isCorrect) {
      playCorrectSound();
    } else {
      playWrongSound();
    }

    const answerRecord: ParticipantAnswer = {
      questionId: currentQuestion.id,
      selectedOption: optionId,
      isCorrect,
      timeTakenMs,
      pointsEarned,
    };

    const newScore = (currentParticipant.score || 0) + pointsEarned;
    const updatedAnswers = {
      ...currentParticipant.answers,
      [currentQuestion.id]: answerRecord,
    };

    const updatedParticipant: Participant = {
      ...currentParticipant,
      score: newScore,
      currentQuestionIndex: questionIndex,
      answers: updatedAnswers,
    };

    onUpdateParticipant(updatedParticipant);

    // Auto-advance after 2.8 seconds
    autoAdvanceTimeoutRef.current = window.setTimeout(() => {
      advanceNextQuestion(updatedParticipant);
    }, 2800);
  };

  const advanceNextQuestion = (participantState = currentParticipant) => {
    if (autoAdvanceTimeoutRef.current) clearTimeout(autoAdvanceTimeoutRef.current);

    if (isLastQuestion) {
      onUpdateParticipant({
        ...participantState,
        completed: true,
      });
      onFinishQuiz();
    } else {
      const nextIndex = questionIndex + 1;
      setQuestionIndex(nextIndex);
      onUpdateParticipant({
        ...participantState,
        currentQuestionIndex: nextIndex,
      });
    }
  };

  const progressPercentage = ((questionIndex + 1) / QUIZ_QUESTIONS.length) * 100;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
      {/* Top Header Bar: Progress & Score */}
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

        {/* Live Score Counter */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/90 border border-slate-700">
            <Award className="w-4 h-4 text-amber-400" />
            <span className="text-xs text-slate-400">Score:</span>
            <span className="font-mono font-bold text-amber-300 text-sm">
              {currentParticipant.score || 0} pts
            </span>
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
              <span className="inline-block px-3 py-1 rounded-lg text-xs font-mono font-medium text-cyan-300 bg-cyan-950/60 border border-cyan-800/50 mb-3">
                {currentQuestion.topic}
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-6 leading-snug">
                {currentQuestion.text}
              </h2>

              {/* 4 Options Grid */}
              <div className="space-y-3">
                {currentQuestion.options.map((option) => {
                  const isSelected = selectedOption === option.id;
                  const isCorrect = option.id === currentQuestion.correct;

                  let buttonStyles =
                    'bg-slate-900/80 hover:bg-slate-800 border-slate-800 text-slate-200 hover:border-slate-700 hover:text-white';

                  if (isAnswered) {
                    if (isCorrect) {
                      buttonStyles =
                        'bg-emerald-500/20 border-emerald-500 text-emerald-200 shadow-lg shadow-emerald-500/20';
                    } else if (isSelected && !isCorrect) {
                      buttonStyles =
                        'bg-red-500/20 border-red-500 text-red-200 shadow-lg shadow-red-500/20';
                    } else {
                      buttonStyles = 'bg-slate-900/40 border-slate-800/40 text-slate-500 opacity-60';
                    }
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
                          isAnswered && isCorrect
                            ? 'bg-emerald-500 text-slate-950'
                            : isAnswered && isSelected && !isCorrect
                            ? 'bg-red-500 text-white'
                            : isSelected
                            ? 'bg-amber-400 text-slate-950'
                            : 'bg-slate-800 text-slate-300'
                        }`}
                      >
                        {option.id}
                      </span>
                      <span className="flex-1 pt-0.5">{option.text}</span>

                      {/* Result Icons */}
                      {isAnswered && isCorrect && (
                        <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                      )}
                      {isAnswered && isSelected && !isCorrect && (
                        <XCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Answer Feedback & Explanation Box */}
            {isAnswered && (
              <div className="mt-6 pt-5 border-t border-slate-800 animate-fadeIn">
                <div
                  className={`p-4 rounded-xl border mb-4 ${
                    selectedOption === currentQuestion.correct
                      ? 'bg-emerald-950/40 border-emerald-800/60 text-emerald-200'
                      : 'bg-amber-950/40 border-amber-800/60 text-amber-200'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1.5 font-bold text-sm">
                    {selectedOption === currentQuestion.correct ? (
                      <>
                        <Zap className="w-4 h-4 text-emerald-400" />
                        <span>Correct! (+100 pts + speed bonus)</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 text-amber-400" />
                        <span>Concept Insight:</span>
                      </>
                    )}
                  </div>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    {currentQuestion.explanation}
                  </p>
                </div>

                {/* Manual Next Button */}
                <button
                  onClick={() => advanceNextQuestion()}
                  className="w-full py-3 px-5 rounded-xl font-bold text-slate-950 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-amber-500/20"
                >
                  <span>{isLastQuestion ? 'View Results & Leaderboard' : 'Next Question'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
