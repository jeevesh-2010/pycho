import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { Cloud, CloudOff, RefreshCw } from 'lucide-react';

export const SyncStatusBadge: React.FC = () => {
  const { syncStatus, user } = useAuth();
  const { isSyncing, setIsCloudModalOpen } = useApp();

  let dotColor = 'bg-[#79747e]';
  let label = 'Local Only';
  let chipBg = 'bg-[#f7f2fa] dark:bg-[#1d1b20] text-[#49454f] dark:text-[#cac4d0] border-[#cac4d0]/50 dark:border-[#49454f]/60';

  if (syncStatus === 'connected') {
    dotColor = 'bg-emerald-500';
    label = user ? 'Synced' : 'Cloud Ready';
    chipBg = 'bg-[#d3e3fd]/60 dark:bg-[#004a77]/40 text-[#041e49] dark:text-[#c2e7ff] border-[#1a73e8]/30 dark:border-[#a8c7fa]/30';
  } else if (syncStatus === 'connecting' || isSyncing) {
    dotColor = 'bg-amber-500 animate-ping';
    label = 'Syncing';
    chipBg = 'bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-200 border-amber-300 dark:border-amber-700';
  } else if (syncStatus === 'error') {
    dotColor = 'bg-[#ba1a1a]';
    label = 'Offline';
    chipBg = 'bg-[#ffdad6] dark:bg-[#93000a]/40 text-[#410002] dark:text-[#ffdad6] border-[#ba1a1a]/40';
  }

  return (
    <button
      onClick={() => setIsCloudModalOpen(true)}
      title="Tap to manage Android Cloud Sync & Supabase"
      className={`h-9 inline-flex items-center gap-2 px-3 rounded-full text-xs font-medium border transition-all cursor-pointer m3-pressable ${chipBg}`}
    >
      <span className={`w-2 h-2 rounded-full ${dotColor}`} />
      {isSyncing ? (
        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
      ) : syncStatus === 'connected' ? (
        <Cloud className="w-3.5 h-3.5 text-[#1a73e8] dark:text-[#a8c7fa]" />
      ) : (
        <CloudOff className="w-3.5 h-3.5 text-[#79747e]" />
      )}
      <span className="hidden sm:inline">{label}</span>
    </button>
  );
};
