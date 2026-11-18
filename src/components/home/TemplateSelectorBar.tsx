import React from 'react';
import { useApp } from '../../context/AppContext';
import { Sparkles, Briefcase, Moon, Heart, Book, Coffee, Dumbbell, Zap, Plus, Check, SlidersHorizontal } from 'lucide-react';

interface TemplateSelectorBarProps {
  onOpenNewTemplate: () => void;
  onOpenManageTemplates: () => void;
}

export const TemplateSelectorBar: React.FC<TemplateSelectorBarProps> = ({
  onOpenNewTemplate,
  onOpenManageTemplates,
}) => {
  const { templates, activeTemplateId, applyTemplate } = useApp();

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

  return (
    <div className="flex flex-col gap-2 mb-5">
      <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-[#49454f] dark:text-[#cac4d0]">
        <span className="flex items-center gap-1.5">
          <SlidersHorizontal className="w-3.5 h-3.5 text-[#1a73e8] dark:text-[#a8c7fa]" />
          Quick Question Sets
        </span>
        <button
          type="button"
          onClick={onOpenManageTemplates}
          className="text-xs text-[#1a73e8] dark:text-[#a8c7fa] hover:underline cursor-pointer lowercase first-letter:uppercase"
        >
          Manage sets
        </button>
      </div>

      {/* Horizontal Scrollable M3 Chip Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar pt-0.5">
        {templates.map((tpl) => {
          const IconComp = getIcon(tpl.icon);
          const isActive = activeTemplateId === tpl.id;

          return (
            <button
              key={tpl.id}
              type="button"
              onClick={() => applyTemplate(tpl.id)}
              className={`h-9 px-3.5 rounded-full text-xs font-medium border shrink-0 transition-all cursor-pointer flex items-center gap-2 m3-pressable ${
                isActive
                  ? 'bg-[#dbe2f9] text-[#131c2b] dark:bg-[#004a77] dark:text-[#c2e7ff] border-[#1a73e8]/30 dark:border-[#a8c7fa]/30 font-semibold shadow-2xs'
                  : 'bg-[#f7f2fa] dark:bg-[#1d1b20] text-[#49454f] dark:text-[#cac4d0] border-[#cac4d0]/60 dark:border-[#49454f]/60 hover:bg-[#ece6f0] dark:hover:bg-[#2b2930]'
              }`}
            >
              {isActive ? (
                <Check className="w-3.5 h-3.5 text-[#1a73e8] dark:text-[#a8c7fa]" />
              ) : (
                <IconComp className="w-3.5 h-3.5 text-[#79747e] dark:text-[#938f99]" />
              )}
              <span>{tpl.title}</span>
              <span className="px-1.5 py-0.2 rounded-full bg-black/5 dark:bg-white/10 text-[10px] font-mono">
                {tpl.questions.length}
              </span>
            </button>
          );
        })}

        {/* Add New Template Chip */}
        <button
          type="button"
          onClick={onOpenNewTemplate}
          className="h-9 px-3 rounded-full text-xs font-medium border border-dashed border-[#79747e] text-[#49454f] dark:text-[#cac4d0] hover:bg-[#ece6f0] dark:hover:bg-[#2b2930] shrink-0 transition-colors flex items-center gap-1 cursor-pointer m3-pressable"
          title="Create a new question set"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Set</span>
        </button>
      </div>
    </div>
  );
};
