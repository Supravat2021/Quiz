import { QuizQuestion } from '../types/quiz';

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    topic: 'LLM Fundamentals',
    text: 'What does an LLM do at its core?',
    options: [
      { id: 'A', text: 'Searches a database for answers' },
      { id: 'B', text: 'Predicts the next token' },
      { id: 'C', text: 'Copies text from websites' },
      { id: 'D', text: 'Runs a calculator' },
    ],
    correct: 'B',
    explanation:
      'At its architectural core, an LLM calculates a probability distribution across its vocabulary to predict the most likely next token given the prompt context.',
  },
  {
    id: 2,
    topic: 'Tokenization',
    text: 'Roughly how many English characters is one token?',
    options: [
      { id: 'A', text: '1' },
      { id: 'B', text: '4' },
      { id: 'C', text: '40' },
      { id: 'D', text: '400' },
    ],
    correct: 'B',
    explanation:
      'In standard byte-pair encoding (BPE) for English text, 1 token roughly corresponds to 4 characters (or ~0.75 words).',
  },
  {
    id: 3,
    topic: 'Model Behavior',
    text: 'What is a hallucination in AI?',
    options: [
      { id: 'A', text: 'AI refusing to answer' },
      { id: 'B', text: 'AI crashing' },
      { id: 'C', text: 'A confident answer that is false or made up' },
      { id: 'D', text: 'AI drawing a picture' },
    ],
    correct: 'C',
    explanation:
      'AI hallucinations occur when a model synthesizes information that sounds authoritative and grammatically fluent, but lacks factual grounding in reality.',
  },
  {
    id: 4,
    topic: 'Prompt Engineering',
    text: '"Act as a strict examiner" is which framework?',
    options: [
      { id: 'A', text: 'Role' },
      { id: 'B', text: 'Few-shot' },
      { id: 'C', text: 'Slash command' },
      { id: 'D', text: 'Tokenization' },
    ],
    correct: 'A',
    explanation:
      'Role Prompting instructs the LLM to adopt a persona, tone, and domain perspective, anchoring its vocabulary and critique style.',
  },
  {
    id: 5,
    topic: 'Few-Shot Learning',
    text: 'Giving AI two or three examples of the style you want is called:',
    options: [
      { id: 'A', text: 'Zero-shot' },
      { id: 'B', text: 'Few-shot' },
      { id: 'C', text: 'Hallucination' },
      { id: 'D', text: 'Iteration' },
    ],
    correct: 'B',
    explanation:
      'Few-shot prompting provides in-context exemplar demonstrations (input-output pairs) so the model recognizes the desired structure without weights updating.',
  },
  {
    id: 6,
    topic: 'Content Quality',
    text: 'Which is a sign of AI slop?',
    options: [
      { id: 'A', text: 'Specific names and numbers' },
      { id: 'B', text: 'Opens with "In today\'s fast-paced world" and vague big words' },
      { id: 'C', text: 'A personal story' },
      { id: 'D', text: 'Facts that were checked' },
    ],
    correct: 'B',
    explanation:
      'AI slop is characterized by generic filler prose, ubiquitous stock openings ("In today\'s fast-paced world..."), and superficial adjectives lacking concrete data.',
  },
  {
    id: 7,
    topic: 'Generative Media',
    text: 'In many image tools, what does --ar 16:9 control?',
    options: [
      { id: 'A', text: 'Art style' },
      { id: 'B', text: 'Shape of the image (aspect ratio)' },
      { id: 'C', text: 'Number of images' },
      { id: 'D', text: 'Colour' },
    ],
    correct: 'B',
    explanation:
      'The `--ar` parameter sets the aspect ratio (width to height ratio). 16:9 creates standard widescreen landscape compositions commonly used in video and displays.',
  },
  {
    id: 8,
    topic: 'Architecture Acronyms',
    text: 'What does the acronym "GPT" stand for in popular AI tools like ChatGPT?',
    options: [
      { id: 'A', text: 'General Processing Technology' },
      { id: 'B', text: 'Generative Pre-trained Transformer' },
      { id: 'C', text: 'Global Programming Tool' },
      { id: 'D', text: 'Guided Pattern Text' },
    ],
    correct: 'B',
    explanation:
      'GPT stands for Generative (produces content), Pre-trained (trained on massive unlabeled datasets beforehand), Transformer (deep neural network self-attention architecture).',
  },
  {
    id: 9,
    topic: 'Factuality & Hallucination',
    text: 'When an AI chatbot confidently makes up a false fact or fake information, what is this phenomenon commonly called?',
    options: [
      { id: 'A', text: 'A hallucination' },
      { id: 'B', text: 'A daydream' },
      { id: 'C', text: 'A system virus' },
      { id: 'D', text: 'A memory leak' },
    ],
    correct: 'A',
    explanation:
      'When an AI model generates fabricated citations, historical dates, or spurious facts with high statistical confidence, it is known as a hallucination.',
  },
  {
    id: 10,
    topic: 'Everyday Applied AI',
    text: 'Which of the following everyday features is powered by Artificial Intelligence?',
    options: [
      { id: 'A', text: 'Face ID unlocking your smartphone' },
      { id: 'B', text: 'Calculator doing basic addition' },
      { id: 'C', text: 'Saving a file to a USB drive' },
      { id: 'D', text: 'Adjusting screen brightness manually' },
    ],
    correct: 'A',
    explanation:
      'Modern Face ID relies on deep convolutional and transformer neural networks combined with infrared dot projection to securely model 3D facial topology in real time.',
  },
];
