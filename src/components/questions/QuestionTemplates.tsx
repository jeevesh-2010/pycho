import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import type { QuestionTemplate } from '../../types';
import { TemplateEditorModal } from '../templates/TemplateEditorModal';
import {
  Sparkles,
  Briefcase,
  Moon,
  Heart,
  Book,
  Coffee,
  Dumbbell,
  Zap,
  Check,
  Edit2,
  Copy,
  Trash2,
  Plus,
  RotateCcw,
  PlayCircle,
} from 'lucide-react';

interface QuestionTemplatesProps {
  onCloseDrawer?: () => void;
}

export const QuestionTemplates: React.FC<QuestionTemplatesProps> = ({ onCloseDrawer }) => {
  const {
    templates,
    activeTemplateId,
    applyTemplate,
    saveTemplate,
    deleteTemplate,
    duplicateTemplate,
    resetTemplatesToDefault,
    setActiveTab,
  } = useApp();

  const [editorOpen, setEditorOpen] = useState(false);
  const [templateEditing, setTemplateEditing] = useState<QuestionTemplate | null>(null);

  const getIcon = (iconName?: string) => {
    switch (iconName) {
      case 'briefcase':
        return Briefcase;
      case 'moon':
        return Moon;
      case 'heart':
        return Heart;
      case 'book':
        return Book;
      case 'coffee':
        return Coffee;
      case 'dumbbell':
        return Dumbbell;
      case 'zap':
        return Zap;
      default:
        return Sparkles;
    }
  };

  const handleEdit = (tpl: QuestionTemplate) => {
    setTemplateEditing(tpl);
    setEditorOpen(true);
  };

  const handleCreateNew = () => {
    setTemplateEditing(null);
    setEditorOpen(true);
  };

  const handleApply = (tplId: string) => {
    applyTemplate(tplId);
    if (onCloseDrawer) onCloseDrawer();
    setActiveTab('checkin');
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Header & New Template Button */}
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#49454f] dark:text-[#cac4d0]">
            <Sparkles className="w-4 h-4 text-[#1a73e8] dark:text-[#a8c7fa]" />
            <span>Editable Question Sets & Templates</span>
          </div>
          <p className="text-xs text-[#49454f] dark:text-[#cac4d0] mt-0.5">
            Switch between question sets or customize any template with your own questions.
          </p>
        </div>

        <button
          type="button"
          onClick={handleCreateNew}
          className="h-9 px-4 rounded-full bg-[#1a73e8] hover:bg-[#1557b0] dark:bg-[#a8c7fa] dark:text-[#042f74] text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer shrink-0 m3-pressable"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Set</span>
        </button>
      </div>

      {/* Grid of Templates */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {templates.map((tpl) => {
          const IconComp = getIcon(tpl.icon);
          const isActive = activeTemplateId === tpl.id;

          return (
            <div
              key={tpl.id}
              className={`p-5 rounded-3xl border flex flex-col justify-between gap-4 transition-all ${
                isActive
                  ? 'bg-[#dbe2f9]/40 dark:bg-[#004a77]/30 border-[#1a73e8] dark:border-[#a8c7fa] shadow-xs'
                  : 'bg-[#f7f2fa] dark:bg-[#1d1b20] border-[#cac4d0]/60 dark:border-[#49454f]/60 hover:border-[#79747e]/60 dark:hover:border-[#938f99]/60'
              }`}
            >
              <div>
                {/* Card Title & Icon */}
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-9 h-9 rounded-2xl flex items-center justify-center ${
                        isActive
                          ? 'bg-[#1a73e8] text-white dark:bg-[#a8c7fa] dark:text-[#042f74]'
                          : 'bg-[#ece6f0] dark:bg-[#2b2930] text-[#1a73e8] dark:text-[#a8c7fa]'
                      }`}
                    >
                      <IconComp className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-base font-semibold text-[#1d1b20] dark:text-[#e6e0e9] leading-tight">
                        {tpl.title}
                      </h4>
                      {isActive && (
                        <span className="text-[10px] font-bold text-[#1a73e8] dark:text-[#a8c7fa] flex items-center gap-0.5">
                          <Check className="w-3 h-3" /> Active Set
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions for this template */}
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleEdit(tpl)}
                      title="Edit this template"
                      className="w-8 h-8 rounded-full flex items-center justify-center text-[#49454f] hover:text-[#1d1b20] dark:text-[#cac4d0] dark:hover:text-[#e6e0e9] hover:bg-[#ece6f0] dark:hover:bg-[#2b2930] transition-colors cursor-pointer"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>

                    <button
                      type="button"
                      onClick={() => duplicateTemplate(tpl.id)}
                      title="Duplicate template"
                      className="w-8 h-8 rounded-full flex items-center justify-center text-[#49454f] hover:text-[#1d1b20] dark:text-[#cac4d0] dark:hover:text-[#e6e0e9] hover:bg-[#ece6f0] dark:hover:bg-[#2b2930] transition-colors cursor-pointer"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>

                    {tpl.isCustom && (
                      <button
                        type="button"
                        onClick={() => deleteTemplate(tpl.id)}
                        title="Delete template"
                        className="w-8 h-8 rounded-full flex items-center justify-center text-[#49454f] hover:text-[#ba1a1a] dark:text-[#cac4d0] dark:hover:text-[#ffb4ab] hover:bg-[#ffdad6]/60 dark:hover:bg-[#93000a]/40 transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                {tpl.description && (
                  <p className="text-xs text-[#49454f] dark:text-[#cac4d0] mt-1 line-clamp-2 leading-relaxed">
                    {tpl.description}
                  </p>
                )}

                {/* Preview Questions */}
                <div className="mt-3 flex flex-col gap-1 border-t border-[#cac4d0]/30 dark:border-[#49454f]/30 pt-2.5">
                  <span className="text-[10px] font-semibold text-[#79747e] dark:text-[#938f99] uppercase tracking-wider mb-0.5">
                    Questions ({tpl.questions.length})
                  </span>
                  {tpl.questions.slice(0, 3).map((q, qIdx) => (
                    <p key={q.id || qIdx} className="text-xs text-[#49454f] dark:text-[#cac4d0] truncate">
                      • {q.text}
                    </p>
                  ))}
                  {tpl.questions.length > 3 && (
                    <span className="text-[11px] text-[#79747e] dark:text-[#938f99] italic pl-2">
                      +{tpl.questions.length - 3} more questions
                    </span>
                  )}
                </div>
              </div>

              {/* Bottom Activate Button */}
              <button
                type="button"
                onClick={() => handleApply(tpl.id)}
                className={`w-full h-10 px-4 rounded-full text-xs font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer m3-pressable shadow-2xs ${
                  isActive
                    ? 'bg-[#1a73e8] text-white dark:bg-[#a8c7fa] dark:text-[#042f74]'
                    : 'bg-[#dbe2f9] dark:bg-[#004a77] text-[#131c2b] dark:text-[#c2e7ff] hover:bg-[#c2e7ff] dark:hover:bg-[#0842a0]'
                }`}
              >
                {isActive ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Selected (Answer on Check-in)</span>
                  </>
                ) : (
                  <>
                    <PlayCircle className="w-4 h-4" />
                    <span>Use this Question Set</span>
                  </>
                )}
              </button>
            </div>
          );
        })}
      </div>

      {/* Reset templates to defaults button */}
      <div className="pt-2 flex justify-end">
        <button
          type="button"
          onClick={resetTemplatesToDefault}
          className="text-xs text-[#79747e] dark:text-[#938f99] hover:text-[#1d1b20] dark:hover:text-[#e6e0e9] flex items-center gap-1 transition-colors cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset templates to default sets</span>
        </button>
      </div>

      {/* Editor Modal */}
      <TemplateEditorModal
        isOpen={editorOpen}
        onClose={() => setEditorOpen(false)}
        templateToEdit={templateEditing}
        onSave={(tpl) => saveTemplate(tpl)}
      />
    </div>
  );
};
