import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import type { QuestionTemplate, TemplateQuestionItem } from '../../types';
import { Plus, Trash2, ChevronUp, ChevronDown, Check, Sparkles, Briefcase, Moon, Heart, Book, Coffee, Dumbbell, Zap } from 'lucide-react';

interface TemplateEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  templateToEdit: QuestionTemplate | null;
  onSave: (template: QuestionTemplate) => void;
}

const ICON_OPTIONS = [
  { id: 'sparkles', label: 'Sparkles', icon: Sparkles },
  { id: 'briefcase', label: 'Work', icon: Briefcase },
  { id: 'moon', label: 'Evening', icon: Moon },
  { id: 'heart', label: 'Wellbeing', icon: Heart },
  { id: 'book', label: 'Review', icon: Book },
  { id: 'coffee', label: 'Morning', icon: Coffee },
  { id: 'dumbbell', label: 'Fitness', icon: Dumbbell },
  { id: 'zap', label: 'Focus', icon: Zap },
];

export const TemplateEditorModal: React.FC<TemplateEditorModalProps> = ({
  isOpen,
  onClose,
  templateToEdit,
  onSave,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedIcon, setSelectedIcon] = useState('sparkles');
  const [questions, setQuestions] = useState<TemplateQuestionItem[]>([]);

  useEffect(() => {
    if (templateToEdit) {
      setTitle(templateToEdit.title);
      setDescription(templateToEdit.description || '');
      setSelectedIcon(templateToEdit.icon || 'sparkles');
      setQuestions([...templateToEdit.questions]);
    } else {
      setTitle('');
      setDescription('');
      setSelectedIcon('sparkles');
      setQuestions([
        { id: `tq-${Date.now()}-1`, text: '', placeholder: '', required: true },
        { id: `tq-${Date.now()}-2`, text: '', placeholder: '', required: false },
      ]);
    }
  }, [templateToEdit, isOpen]);

  const handleAddQuestion = () => {
    setQuestions((prev) => [
      ...prev,
      { id: `tq-${Date.now()}-${prev.length}`, text: '', placeholder: '', required: false },
    ]);
  };

  const handleRemoveQuestion = (idx: number) => {
    setQuestions((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleMoveQuestion = (idx: number, direction: 'up' | 'down') => {
    const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= questions.length) return;
    const updated = [...questions];
    const [moved] = updated.splice(idx, 1);
    updated.splice(targetIdx, 0, moved);
    setQuestions(updated);
  };

  const handleUpdateQuestion = (idx: number, field: keyof TemplateQuestionItem, value: unknown) => {
    setQuestions((prev) =>
      prev.map((q, i) => (i === idx ? { ...q, [field]: value } : q))
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanTitle = title.trim();
    if (!cleanTitle) return;

    // Filter out completely empty questions
    const validQuestions = questions.filter((q) => q.text.trim().length > 0);
    if (validQuestions.length === 0) {
      alert('Please provide at least one question in this template.');
      return;
    }

    const updatedTemplate: QuestionTemplate = {
      id: templateToEdit ? templateToEdit.id : `tpl-custom-${Date.now()}`,
      title: cleanTitle,
      description: description.trim(),
      icon: selectedIcon,
      questions: validQuestions,
      isCustom: true,
      createdAt: templateToEdit ? templateToEdit.createdAt : new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    onSave(updatedTemplate);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={templateToEdit ? 'Edit Question Template' : 'New Question Template'}
      subtitle="Customize reusable sets of questions to quickly answer anytime"
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-sm">
        {/* Title & Icon */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-[#1d1b20] dark:text-[#e6e0e9]">
              Template Name *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Work Standup, Evening Gratitude, Workout Log"
              className="px-4 py-2.5 text-base rounded-2xl border border-[#cac4d0] dark:border-[#49454f] bg-[#fdfcff] dark:bg-[#141218] text-[#1d1b20] dark:text-[#e6e0e9] focus:outline-none focus:ring-2 focus:ring-[#1a73e8]"
            />
          </div>

          <div className="flex flex-col gap-1.5 shrink-0">
            <label className="text-xs font-semibold text-[#1d1b20] dark:text-[#e6e0e9]">
              Icon Badge
            </label>
            <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-[#ece6f0] dark:bg-[#2b2930]">
              {ICON_OPTIONS.map((opt) => {
                const IconComp = opt.icon;
                const isSelected = selectedIcon === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setSelectedIcon(opt.id)}
                    title={opt.label}
                    className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#1a73e8] text-white dark:bg-[#a8c7fa] dark:text-[#042f74] shadow-2xs'
                        : 'text-[#49454f] dark:text-[#cac4d0] hover:text-[#1d1b20]'
                    }`}
                  >
                    <IconComp className="w-4 h-4" />
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-[#1d1b20] dark:text-[#e6e0e9]">
            Short Description (optional)
          </label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="e.g. Focused morning reflection for tasks and sprint blockers"
            className="px-4 py-2 text-sm rounded-2xl border border-[#cac4d0] dark:border-[#49454f] bg-[#fdfcff] dark:bg-[#141218] text-[#1d1b20] dark:text-[#e6e0e9] focus:outline-none focus:ring-2 focus:ring-[#1a73e8]"
          />
        </div>

        {/* Questions List */}
        <div className="flex flex-col gap-2.5 pt-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#49454f] dark:text-[#cac4d0]">
              Questions in this Set ({questions.length})
            </span>
            <button
              type="button"
              onClick={handleAddQuestion}
              className="text-xs font-semibold text-[#1a73e8] dark:text-[#a8c7fa] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Question
            </button>
          </div>

          <div className="flex flex-col gap-3 max-h-72 overflow-y-auto pr-1">
            {questions.map((q, idx) => (
              <div
                key={q.id || idx}
                className="p-3.5 rounded-2xl bg-[#f7f2fa] dark:bg-[#1d1b20] border border-[#cac4d0]/60 dark:border-[#49454f]/60 flex flex-col gap-2"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-bold text-[#1a73e8] dark:text-[#a8c7fa]">
                    Q{idx + 1}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={() => handleMoveQuestion(idx, 'up')}
                      className="p-1 rounded-md text-[#79747e] hover:text-[#1d1b20] dark:hover:text-[#e6e0e9] disabled:opacity-30 cursor-pointer"
                      title="Move up"
                    >
                      <ChevronUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      disabled={idx === questions.length - 1}
                      onClick={() => handleMoveQuestion(idx, 'down')}
                      className="p-1 rounded-md text-[#79747e] hover:text-[#1d1b20] dark:hover:text-[#e6e0e9] disabled:opacity-30 cursor-pointer"
                      title="Move down"
                    >
                      <ChevronDown className="w-3.5 h-3.5" />
                    </button>
                    {questions.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveQuestion(idx)}
                        className="p-1 rounded-md text-[#79747e] hover:text-[#ba1a1a] dark:hover:text-[#ffb4ab] cursor-pointer"
                        title="Remove question"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                <input
                  type="text"
                  required
                  value={q.text}
                  onChange={(e) => handleUpdateQuestion(idx, 'text', e.target.value)}
                  placeholder="e.g. What did you focus on today?"
                  className="w-full px-3 py-1.5 text-sm rounded-xl border border-[#cac4d0] dark:border-[#49454f] bg-[#fdfcff] dark:bg-[#141218] text-[#1d1b20] dark:text-[#e6e0e9] focus:outline-none focus:ring-1 focus:ring-[#1a73e8]"
                />

                <div className="flex items-center justify-between gap-2">
                  <input
                    type="text"
                    value={q.placeholder || ''}
                    onChange={(e) => handleUpdateQuestion(idx, 'placeholder', e.target.value)}
                    placeholder="Helper prompt hint..."
                    className="flex-1 px-3 py-1 text-xs rounded-lg border border-[#cac4d0]/60 dark:border-[#49454f]/60 bg-transparent text-[#1d1b20] dark:text-[#e6e0e9] focus:outline-none"
                  />
                  <label className="flex items-center gap-1.5 text-xs text-[#49454f] dark:text-[#cac4d0] shrink-0 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={Boolean(q.required)}
                      onChange={(e) => handleUpdateQuestion(idx, 'required', e.target.checked)}
                      className="rounded text-[#1a73e8] focus:ring-[#1a73e8]"
                    />
                    Required
                  </label>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Modal Actions */}
        <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#cac4d0]/40 dark:border-[#49454f]/40">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-[#49454f] dark:text-[#cac4d0] hover:bg-[#ece6f0] dark:hover:bg-[#2b2930] rounded-full transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-2.5 text-xs font-semibold bg-[#1a73e8] hover:bg-[#1557b0] dark:bg-[#a8c7fa] dark:text-[#042f74] text-white rounded-full transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer m3-pressable"
          >
            <Check className="w-4 h-4" />
            Save Template
          </button>
        </div>
      </form>
    </Modal>
  );
};
