export interface QuestionOption {
  id: 'A' | 'B' | 'C' | 'D';
  text: string;
}

export interface QuizQuestion {
  id: number;
  text: string;
  options: QuestionOption[];
  correct: 'A' | 'B' | 'C' | 'D';
  explanation: string;
  topic: string;
  codeSnippet?: string;
}

export type QuizStatus = 'waiting' | 'active' | 'ended';

export interface QuizSession {
  id: string;
  status: QuizStatus;
  currentQuestionIndex: number;
  startedAt: number | null;
  endedAt: number | null;
  updatedAt: number;
  resetCount: number;
}

export interface ParticipantAnswer {
  questionId: number;
  selectedOption: 'A' | 'B' | 'C' | 'D';
  isCorrect: boolean;
  timeTakenMs: number;
  pointsEarned: number;
}

export interface Participant {
  id: string;
  name: string;
  score: number;
  currentQuestionIndex: number;
  answers: Record<number, ParticipantAnswer>;
  completed: boolean;
  joinedAt: number;
  lastActiveAt: number;
}
