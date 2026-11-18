import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { BookmarkPlus } from 'lucide-react';

interface SaveCurrentAsTemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (title: string, description?: string) => void;
  questionCount: number;
}

export const SaveCurrentAsTemplateModal: React.FC<SaveCurrentAsTemplateModalProps> = ({
  isOpen,
  onClose,
  onSave,
  questionCount,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onSave(title.trim(), description.trim());
    setTitle('');
    setDescription('');
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Save as Reusable Template"
      subtitle={`Save current ${questionCount} questions as a reusable question set`}
      maxWidth="sm"
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-sm">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-[#1d1b20] dark:text-[#e6e0e9]">
            Template Name *
          </label>
          <input
            type="text"
            required
            autoFocus
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Weekly Retrospective, Morning Deep Work"
            className="px-4 py-2.5 text-base rounded-2xl border border-[#cac4d0] dark:border-[#49454f] bg-[#fdfcff] dark:bg-[#141218] text-[#1d1b20] dark:text-[#e6e0e9] focus:outline-none focus:ring-2 focus:ring-[#1a73e8]"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-[#1d1b20] dark:text-[#e6e0e9]">
            Description (optional)
          </label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="e.g. End of sprint question set"
            className="px-4 py-2 text-sm rounded-2xl border border-[#cac4d0] dark:border-[#49454f] bg-[#fdfcff] dark:bg-[#141218] text-[#1d1b20] dark:text-[#e6e0e9] focus:outline-none focus:ring-2 focus:ring-[#1a73e8]"
          />
        </div>

        <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#cac4d0]/40 dark:border-[#49454f]/40">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-[#49454f] dark:text-[#cac4d0] hover:bg-[#ece6f0] dark:hover:bg-[#2b2930] rounded-full transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!title.trim()}
            className="px-6 py-2.5 text-xs font-semibold bg-[#1a73e8] hover:bg-[#1557b0] dark:bg-[#a8c7fa] dark:text-[#042f74] text-white rounded-full transition-colors flex items-center gap-1.5 disabled:opacity-50 shadow-xs cursor-pointer m3-pressable"
          >
            <BookmarkPlus className="w-4 h-4" />
            Save Set
          </button>
        </div>
      </form>
    </Modal>
  );
};
