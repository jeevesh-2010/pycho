import React, { useEffect } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/common/Header';
import { MobileNav } from './components/common/MobileNav';
import { ToastContainer } from './components/common/Toast';
import { QuickAnswerScreen } from './components/home/QuickAnswerScreen';
import { HistoryDashboard } from './components/history/HistoryDashboard';
import { QuestionManager } from './components/questions/QuestionManager';
import { CloudSyncModal } from './components/sync/CloudSyncModal';

const MainApp: React.FC = () => {
  const { activeTab, setActiveTab } = useApp();

  // Global keyboard shortcuts (1, 2, 3 for tabs when not typing in inputs)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeTag = document.activeElement?.tagName?.toLowerCase();
      if (activeTag === 'input' || activeTag === 'textarea') return;

      if (e.key === '1') {
        setActiveTab('checkin');
      } else if (e.key === '2') {
        setActiveTab('history');
      } else if (e.key === '3') {
        setActiveTab('questions');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setActiveTab]);

  return (
    <div className="min-h-screen flex flex-col bg-zinc-50/60 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 transition-colors">
      {/* Top Header */}
      <Header />

      {/* Main Content Area */}
      <main className="flex-1 pb-20 md:pb-12">
        {activeTab === 'checkin' && <QuickAnswerScreen />}
        {activeTab === 'history' && <HistoryDashboard />}
        {activeTab === 'questions' && <QuestionManager />}
      </main>

      {/* Bottom Mobile Navigation */}
      <MobileNav />

      {/* Cloud Sync & Auth Modal */}
      <CloudSyncModal />

      {/* Toast Notifications */}
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppProvider>
          <MainApp />
        </AppProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
