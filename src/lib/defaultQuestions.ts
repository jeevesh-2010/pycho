import type { Question } from '../types';

export const DEFAULT_QUESTIONS: Question[] = [
  {
    id: 'q-default-1',
    text: 'How was your day?',
    placeholder: 'Give a quick pulse check on your mood and how today felt overall...',
    required: true,
    order: 0,
    archived: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'q-default-2',
    text: 'What did you focus on today?',
    placeholder: 'Key accomplishments, projects progressed, or main tasks completed...',
    required: true,
    order: 1,
    archived: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'q-default-3',
    text: 'What is one win or moment of gratitude?',
    placeholder: 'A small victory, something that went well, or someone who helped you...',
    required: false,
    order: 2,
    archived: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'q-default-4',
    text: "What's top of mind for tomorrow?",
    placeholder: 'The single most important objective or mindset for tomorrow...',
    required: false,
    order: 3,
    archived: false,
    createdAt: new Date().toISOString(),
  },
];

export const QUESTION_PRESETS = [
  {
    title: 'Daily Reflection (Default)',
    description: 'Balanced daily check-in covering mood, focus, wins, and next steps.',
    questions: [
      'How was your day?',
      'What did you focus on today?',
      'What is one win or moment of gratitude?',
      "What's top of mind for tomorrow?",
    ],
  },
  {
    title: 'Agile / Work Standup',
    description: 'Focused sprint and project reflection for creators and developers.',
    questions: [
      'What did you accomplish today?',
      'Did you run into any blockers or friction?',
      'What are your high-priority commitments for tomorrow?',
    ],
  },
  {
    title: 'Mindfulness & Wellbeing',
    description: 'Mental clarity, energy levels, stress management, and self-care.',
    questions: [
      'How are your energy and stress levels today (1-10)?',
      'What drained your energy, and what restored it?',
      'What is something you appreciate about today?',
      'How can you be kinder to yourself tomorrow?',
    ],
  },
  {
    title: 'Evening Decompression',
    description: 'Wind down your day with peace of mind.',
    questions: [
      'What are you ready to let go of from today?',
      'What brought a smile to your face today?',
      'One intention before going to sleep:',
    ],
  },
];
