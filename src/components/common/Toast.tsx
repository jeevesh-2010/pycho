import React from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle2, Info, AlertCircle, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-24 md:bottom-8 right-4 left-4 md:left-auto md:w-96 z-50 flex flex-col gap-2.5 pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`pointer-events-auto flex items-center justify-between gap-3 px-4 py-3 rounded-2xl shadow-lg border text-sm backdrop-blur-md transition-all duration-200 animate-in slide-in-from-bottom-3 ${
            toast.type === 'success'
              ? 'bg-[#c4eed0] dark:bg-[#072711] border-[#6dd58c]/50 text-[#072711] dark:text-[#c4eed0]'
              : toast.type === 'warning'
              ? 'bg-[#ffdad6] dark:bg-[#93000a] border-[#ba1a1a]/40 text-[#410002] dark:text-[#ffdad6]'
              : 'bg-[#313033] dark:bg-[#e6e0e9] text-[#f4eff4] dark:text-[#1d1b20] border-transparent'
          }`}
        >
          <div className="flex items-center gap-2.5 min-w-0">
            {toast.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-[#0f5223] dark:text-[#6dd58c] shrink-0" />
            ) : toast.type === 'warning' ? (
              <AlertCircle className="w-4 h-4 text-[#ba1a1a] dark:text-[#ffb4ab] shrink-0" />
            ) : (
              <Info className="w-4 h-4 text-[#a8c7fa] dark:text-[#0b57d0] shrink-0" />
            )}
            <span className="truncate text-xs sm:text-sm font-medium">{toast.message}</span>
          </div>
          <button
            onClick={() => removeToast(toast.id)}
            className="p-1 hover:opacity-75 transition-opacity shrink-0 cursor-pointer"
            aria-label="Dismiss"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
};
