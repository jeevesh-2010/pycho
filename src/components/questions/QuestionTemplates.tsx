import React from 'react';
import { QUESTION_PRESETS } from '../../lib/defaultQuestions';
import { Sparkles, ArrowRight } from 'lucide-react';

interface QuestionTemplatesProps {
  onApplyPreset: (questions: string[]) => void;
}

export const QuestionTemplates: React.FC<QuestionTemplatesProps> = ({ onApplyPreset }) => {
  return (
    <div className="flex flex-col gap-3.5">
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#49454f] dark:text-[#cac4d0]">
        <Sparkles className="w-4 h-4 text-[#1a73e8] dark:text-[#a8c7fa]" />
        <span>Curated Question Preset Packs</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {QUESTION_PRESETS.map((preset, idx) => (
          <div
            key={idx}
            className="p-5 rounded-3xl bg-[#f7f2fa] dark:bg-[#1d1b20] border border-[#cac4d0]/50 dark:border-[#49454f]/50 shadow-2xs flex flex-col justify-between gap-3 hover:border-[#79747e]/60 dark:hover:border-[#938f99]/60 transition-all"
          >
            <div>
              <h4 className="text-base font-semibold text-[#1d1b20] dark:text-[#e6e0e9]">
                {preset.title}
              </h4>
              <p className="text-xs sm:text-sm text-[#49454f] dark:text-[#cac4d0] mt-1 leading-relaxed">
                {preset.description}
              </p>
              <div className="mt-3 flex flex-col gap-1 border-t border-[#cac4d0]/30 dark:border-[#49454f]/30 pt-2.5">
                {preset.questions.map((q, qIdx) => (
                  <p key={qIdx} className="text-xs text-[#49454f] dark:text-[#cac4d0] truncate">
                    • {q}
                  </p>
                ))}
              </div>
            </div>

            <button
              onClick={() => onApplyPreset(preset.questions)}
              className="mt-1 w-full h-10 px-4 rounded-full bg-[#dbe2f9] dark:bg-[#004a77] hover:bg-[#c2e7ff] dark:hover:bg-[#0842a0] text-xs font-semibold text-[#131c2b] dark:text-[#c2e7ff] transition-colors flex items-center justify-center gap-1.5 cursor-pointer m3-pressable"
            >
              <span>Use this Template</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
