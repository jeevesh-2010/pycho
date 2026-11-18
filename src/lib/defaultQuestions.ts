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

export const INITIAL_TEMPLATES: QuestionTemplate[] = [
  {
    id: 'tpl-daily-reflection',
    title: 'Daily Reflection',
    description: 'Balanced daily check-in covering mood, focus, wins, and next steps.',
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
      {
        id: 'tq-1-3',
        text: 'What is one win or moment of gratitude?',
        placeholder: 'A small victory, something that went well, or someone who helped you...',
        required: false,
      },
      {
        id: 'tq-1-4',
        text: "What's top of mind for tomorrow?",
        placeholder: 'The single most important objective or mindset for tomorrow...',
        required: false,
      },
    ],
  },
  {
    id: 'tpl-work-standup',
    title: 'Work & Agile Standup',
    description: 'Focused sprint and project reflection for creators and developers.',
    icon: 'briefcase',
    isCustom: false,
    createdAt: '2026-01-01T00:00:00.000Z',
    questions: [
      {
        id: 'tq-2-1',
        text: 'What did you accomplish today?',
        placeholder: 'Key code commits, designs finalized, meetings held...',
        required: true,
      },
      {
        id: 'tq-2-2',
        text: 'Did you run into any blockers or friction?',
        placeholder: 'Technical snags, waiting on feedback, dependency delays...',
        required: false,
      },
      {
        id: 'tq-2-3',
        text: 'What are your high-priority commitments for tomorrow?',
        placeholder: 'The #1 deliverable that moves the needle forward...',
        required: true,
      },
    ],
  },
  {
    id: 'tpl-evening-decompress',
    title: 'Evening Decompression',
    description: 'Wind down your day with peace of mind before sleeping.',
    icon: 'moon',
    isCustom: false,
    createdAt: '2026-01-01T00:00:00.000Z',
    questions: [
      {
        id: 'tq-3-1',
        text: 'What are you ready to let go of from today?',
        placeholder: 'Any stress, unresolved thoughts, or lingering tension...',
        required: false,
      },
      {
        id: 'tq-3-2',
        text: 'What brought a genuine smile to your face today?',
        placeholder: 'A conversation, a meme, coffee, music, or a kind gesture...',
        required: false,
      },
      {
        id: 'tq-3-3',
        text: 'One peaceful intention before sleeping:',
        placeholder: 'A calm mindset or feeling of contentment...',
        required: false,
      },
    ],
  },
  {
    id: 'tpl-mindfulness',
    title: 'Mindfulness & Wellbeing',
    description: 'Mental clarity, energy levels, stress management, and self-care.',
    icon: 'heart',
    isCustom: false,
    createdAt: '2026-01-01T00:00:00.000Z',
    questions: [
      {
        id: 'tq-4-1',
        text: 'How are your energy and stress levels today (1-10)?',
        placeholder: 'Energy score and what influenced it most...',
        required: true,
      },
      {
        id: 'tq-4-2',
        text: 'What drained your energy, and what restored it?',
        placeholder: 'Activities, conversations, or environments that shifted your state...',
        required: false,
      },
      {
        id: 'tq-4-3',
        text: 'How can you be kinder to yourself tomorrow?',
        placeholder: 'A boundary to hold, breaks to take, or positive self-talk...',
        required: false,
      },
    ],
  },
  {
    id: 'tpl-weekly-review',
    title: 'Weekly Review',
    description: 'High-level retrospective to evaluate growth and set direction.',
    icon: 'book',
    isCustom: false,
    createdAt: '2026-01-01T00:00:00.000Z',
    questions: [
      {
        id: 'tq-5-1',
        text: 'What was your biggest win of the week?',
        placeholder: 'The standout accomplishment or milestone you are proud of...',
        required: true,
      },
      {
        id: 'tq-5-2',
        text: 'What was your most valuable lesson learned?',
        placeholder: 'Something that did not go as planned, and what you learned from it...',
        required: false,
      },
      {
        id: 'tq-5-3',
        text: "What are your top 3 non-negotiable goals for next week?",
        placeholder: '1. Goal one\n2. Goal two\n3. Goal three',
        required: true,
      },
    ],
  },
];
