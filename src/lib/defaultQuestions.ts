import type { Question, QuestionTemplate } from '../types';

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
];

export const INITIAL_TEMPLATES: QuestionTemplate[] = [
  {
    id: 'tpl-daily-checkin',
    title: 'Daily Check-in',
    description: 'Clean daily check-in questions.',
    icon: 'sparkles',
    isCustom: false,
    createdAt: '2026-01-01T00:00:00.000Z',
    questions: [
      {
        id: 'tq-1-1',
        text: 'How was your day?',
        placeholder: 'Give a quick pulse check on your mood and how today felt overall...',
        required: true,
      },
      {
        id: 'tq-1-2',
        text: 'What did you focus on today?',
        placeholder: 'Key accomplishments, projects progressed, or main tasks completed...',
        required: true,
      },
    ],
  },
];
