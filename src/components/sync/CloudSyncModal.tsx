import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { SUPABASE_SQL_SCHEMA } from '../../lib/supabase';
import {
  Cloud,
  Check,
  Copy,
  Database,
  Lock,
  Mail,
  RefreshCw,
  Smartphone,
  Laptop,
  ArrowRight,
  Download,
  Upload,
  AlertCircle,
  LogOut,
  Info,
} from 'lucide-react';

export const CloudSyncModal: React.FC = () => {
  const {
    cloudConfig,
    updateCloudConfig,
    user,
    syncStatus,
    syncMessage,
    signIn,
    signUp,
    signOut,
    testConnection,
    reconnect,
  } = useAuth();

  const { isCloudModalOpen, setIsCloudModalOpen, showToast, exportSubmissions, importJsonBackup } = useApp();

  const [activeTab, setActiveTab] = useState<'config' | 'auth' | 'sql' | 'backup'>('config');

  // Config inputs
  const [urlInput, setUrlInput] = useState(cloudConfig.supabaseUrl || '');
  const [keyInput, setKeyInput] = useState(cloudConfig.supabaseAnonKey || '');
  const [testingStatus, setTestingStatus] = useState<{ testing: boolean; message?: string; success?: boolean }>({
    testing: false,
  });

  // Auth inputs
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [authSuccessMsg, setAuthSuccessMsg] = useState<string | null>(null);

  // Copied SQL state
  const [copiedSql, setCopiedSql] = useState(false);

  const handleSaveConfig = async () => {
    updateCloudConfig({
      supabaseUrl: urlInput.trim(),
      supabaseAnonKey: keyInput.trim(),
      syncEnabled: Boolean(urlInput.trim() && keyInput.trim()),
    });
    showToast('Cloud database settings saved', 'success');
    await reconnect();
  };

  const handleTestConnection = async () => {
    setTestingStatus({ testing: true });
    const res = await testConnection(urlInput.trim(), keyInput.trim());
    setTestingStatus({
      testing: false,
      success: res.success,
      message: res.message,
    });
    if (res.success) {
      showToast('Connected to Supabase successfully!', 'success');
    }
  };

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError(null);
    setAuthSuccessMsg(null);

    if (authMode === 'login') {
      const res = await signIn(emailInput, passwordInput);
      setAuthLoading(false);
      if (res.error) {
        setAuthError(res.error);
      } else {
        showToast('Signed in successfully!', 'success');
        setEmailInput('');
        setPasswordInput('');
      }
    } else {
      const res = await signUp(emailInput, passwordInput);
      setAuthLoading(false);
      if (res.error) {
        setAuthError(res.error);
      } else {
        setAuthSuccessMsg(res.message || 'Account created!');
        showToast('Account created!', 'success');
      }
    }
  };

  const copySql = () => {
    navigator.clipboard.writeText(SUPABASE_SQL_SCHEMA);
    setCopiedSql(true);
    showToast('SQL schema copied to clipboard', 'info');
    setTimeout(() => setCopiedSql(false), 3000);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        importJsonBackup(content);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <Modal
      isOpen={isCloudModalOpen}
      onClose={() => setIsCloudModalOpen(false)}
      title="Android Cloud Sync"
      subtitle="Real-time multi-device database synchronization via Supabase"
      maxWidth="lg"
    >
      <div className="flex flex-col gap-5">
        {/* Sync Status Banner */}
        <div
          className={`flex items-center justify-between p-4 rounded-2xl border text-xs sm:text-sm ${
            syncStatus === 'connected'
              ? 'bg-[#c4eed0]/50 dark:bg-[#072711]/60 border-[#6dd58c]/40 text-[#072711] dark:text-[#c4eed0]'
              : syncStatus === 'connecting'
              ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-700 text-amber-800 dark:text-amber-200'
              : 'bg-[#ece6f0] dark:bg-[#2b2930] border-[#cac4d0]/60 dark:border-[#49454f]/60 text-[#1d1b20] dark:text-[#e6e0e9]'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                syncStatus === 'connected'
                  ? 'bg-emerald-500'
                  : syncStatus === 'connecting'
                  ? 'bg-amber-500 animate-pulse'
                  : 'bg-[#79747e]'
              }`}
            />
            <span className="font-semibold">{syncMessage}</span>
          </div>

          <div className="flex items-center gap-1.5 text-xs">
            <Smartphone className="w-4 h-4" />
            <ArrowRight className="w-3.5 h-3.5 text-[#79747e]" />
            <Laptop className="w-4 h-4" />
          </div>
        </div>

        {/* Modal Segmented Navigation Tabs */}
        <div className="flex rounded-full bg-[#ece6f0] dark:bg-[#2b2930] p-1 gap-1">
          <button
            onClick={() => setActiveTab('config')}
            className={`flex-1 py-2 text-xs font-semibold rounded-full transition-all cursor-pointer ${
              activeTab === 'config'
                ? 'bg-[#ffffff] dark:bg-[#36343b] text-[#1a73e8] dark:text-[#a8c7fa] shadow-2xs'
                : 'text-[#49454f] dark:text-[#cac4d0] hover:text-[#1d1b20]'
            }`}
          >
            Database
          </button>
          <button
            onClick={() => setActiveTab('auth')}
            className={`flex-1 py-2 text-xs font-semibold rounded-full transition-all cursor-pointer flex items-center justify-center gap-1 ${
              activeTab === 'auth'
                ? 'bg-[#ffffff] dark:bg-[#36343b] text-[#1a73e8] dark:text-[#a8c7fa] shadow-2xs'
                : 'text-[#49454f] dark:text-[#cac4d0] hover:text-[#1d1b20]'
            }`}
          >
            Account
            {user && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />}
          </button>
          <button
            onClick={() => setActiveTab('sql')}
            className={`flex-1 py-2 text-xs font-semibold rounded-full transition-all cursor-pointer ${
              activeTab === 'sql'
                ? 'bg-[#ffffff] dark:bg-[#36343b] text-[#1a73e8] dark:text-[#a8c7fa] shadow-2xs'
                : 'text-[#49454f] dark:text-[#cac4d0] hover:text-[#1d1b20]'
            }`}
          >
            SQL Schema
          </button>
          <button
            onClick={() => setActiveTab('backup')}
            className={`flex-1 py-2 text-xs font-semibold rounded-full transition-all cursor-pointer ${
              activeTab === 'backup'
                ? 'bg-[#ffffff] dark:bg-[#36343b] text-[#1a73e8] dark:text-[#a8c7fa] shadow-2xs'
                : 'text-[#49454f] dark:text-[#cac4d0] hover:text-[#1d1b20]'
            }`}
          >
            Backup
          </button>
        </div>

        {/* Tab 1: Database Settings */}
        {activeTab === 'config' && (
          <div className="flex flex-col gap-4 text-sm">
            <div className="bg-[#ece6f0]/70 dark:bg-[#2b2930]/70 p-4 rounded-2xl border border-[#cac4d0]/40 dark:border-[#49454f]/40 text-xs text-[#49454f] dark:text-[#cac4d0] leading-relaxed">
              <p className="font-semibold text-[#1d1b20] dark:text-[#e6e0e9] mb-1 flex items-center gap-1.5">
                <Database className="w-4 h-4 text-[#1a73e8] dark:text-[#a8c7fa]" />
                Real-Time Postgres Synchronization
              </p>
              Submissions recorded on your phone automatically sync to your laptop or other logged-in screens using Supabase WebSockets. No manual reload required.
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-[#1d1b20] dark:text-[#e6e0e9]">
                Supabase Project URL
              </label>
              <input
                type="url"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="https://xyzcompany.supabase.co"
                className="px-4 py-2.5 text-sm rounded-2xl border border-[#cac4d0] dark:border-[#49454f] bg-[#fdfcff] dark:bg-[#141218] text-[#1d1b20] dark:text-[#e6e0e9] focus:outline-none focus:ring-2 focus:ring-[#1a73e8]"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-[#1d1b20] dark:text-[#e6e0e9]">
                Supabase Anon / Public API Key
              </label>
              <input
                type="password"
                value={keyInput}
                onChange={(e) => setKeyInput(e.target.value)}
                placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                className="px-4 py-2.5 text-xs font-mono rounded-2xl border border-[#cac4d0] dark:border-[#49454f] bg-[#fdfcff] dark:bg-[#141218] text-[#1d1b20] dark:text-[#e6e0e9] focus:outline-none focus:ring-2 focus:ring-[#1a73e8]"
              />
            </div>

            {/* Test result message */}
            {testingStatus.message && (
              <div
                className={`p-3.5 rounded-2xl text-xs flex items-center gap-2 ${
                  testingStatus.success
                    ? 'bg-[#c4eed0]/50 dark:bg-[#072711]/60 text-[#072711] dark:text-[#c4eed0] border border-[#6dd58c]/40'
                    : 'bg-[#ffdad6] dark:bg-[#93000a]/40 text-[#410002] dark:text-[#ffdad6] border border-[#ba1a1a]/40'
                }`}
              >
                {testingStatus.success ? <Check className="w-4 h-4 shrink-0 text-emerald-600" /> : <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />}
                <span>{testingStatus.message}</span>
              </div>
            )}

            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={handleTestConnection}
                disabled={testingStatus.testing || !urlInput.trim() || !keyInput.trim()}
                className="h-10 px-4 text-xs font-semibold rounded-full border border-[#cac4d0] dark:border-[#49454f] hover:bg-[#e6e0e9] dark:hover:bg-[#2b2930] text-[#1d1b20] dark:text-[#e6e0e9] disabled:opacity-40 transition-colors flex items-center gap-1.5 cursor-pointer m3-pressable"
              >
                {testingStatus.testing && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                Test Connection
              </button>

              <button
                type="button"
                onClick={handleSaveConfig}
                className="h-10 px-6 text-xs font-semibold bg-[#1a73e8] hover:bg-[#1557b0] dark:bg-[#a8c7fa] dark:text-[#042f74] text-white rounded-full shadow-xs transition-colors flex items-center gap-2 cursor-pointer m3-pressable"
              >
                <Cloud className="w-4 h-4" />
                Save & Connect
              </button>
            </div>
          </div>
        )}

        {/* Tab 2: Authentication */}
        {activeTab === 'auth' && (
          <div className="flex flex-col gap-4 text-sm">
            {user ? (
              <div className="p-5 rounded-2xl border border-[#cac4d0]/60 dark:border-[#49454f]/60 bg-[#ece6f0]/60 dark:bg-[#2b2930]/60 flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full bg-[#d3e3fd] text-[#041e49] dark:bg-[#0842a0] dark:text-[#d3e3fd] flex items-center justify-center font-bold text-base">
                    {user.email?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <div>
                    <p className="font-semibold text-[#1d1b20] dark:text-[#e6e0e9]">{user.email}</p>
                    <p className="text-xs text-[#49454f] dark:text-[#cac4d0]">Authenticated & Realtime Sync Active</p>
                  </div>
                </div>

                <div className="pt-2 border-t border-[#cac4d0]/30 dark:border-[#49454f]/30 flex items-center justify-between">
                  <span className="text-xs text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" /> Synced to your private account
                  </span>
                  <button
                    onClick={() => signOut()}
                    className="px-4 py-1.5 text-xs font-semibold text-[#ba1a1a] dark:text-[#ffb4ab] hover:bg-[#ffdad6]/60 dark:hover:bg-[#93000a]/40 rounded-full transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" /> Sign Out
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleAuthSubmit} className="flex flex-col gap-3.5">
                <div className="flex rounded-full bg-[#ece6f0] dark:bg-[#2b2930] p-1 text-xs">
                  <button
                    type="button"
                    onClick={() => setAuthMode('login')}
                    className={`flex-1 py-1.5 font-semibold rounded-full transition-colors cursor-pointer ${
                      authMode === 'login'
                        ? 'bg-white dark:bg-[#36343b] text-[#1a73e8] dark:text-[#a8c7fa] shadow-2xs'
                        : 'text-[#49454f] dark:text-[#cac4d0]'
                    }`}
                  >
                    Sign In
                  </button>
                  <button
                    type="button"
                    onClick={() => setAuthMode('signup')}
                    className={`flex-1 py-1.5 font-semibold rounded-full transition-colors cursor-pointer ${
                      authMode === 'signup'
                        ? 'bg-white dark:bg-[#36343b] text-[#1a73e8] dark:text-[#a8c7fa] shadow-2xs'
                        : 'text-[#49454f] dark:text-[#cac4d0]'
                    }`}
                  >
                    Create Account
                  </button>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-[#1d1b20] dark:text-[#e6e0e9]">Email Address</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-[#79747e] absolute left-3.5 top-3" />
                    <input
                      type="email"
                      required
                      value={emailInput}
                      onChange={(e) => setEmailInput(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full pl-10 pr-4 py-2.5 text-sm rounded-2xl border border-[#cac4d0] dark:border-[#49454f] bg-[#fdfcff] dark:bg-[#141218] text-[#1d1b20] dark:text-[#e6e0e9] focus:outline-none focus:ring-2 focus:ring-[#1a73e8]"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-[#1d1b20] dark:text-[#e6e0e9]">Password</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-[#79747e] absolute left-3.5 top-3" />
                    <input
                      type="password"
                      required
                      minLength={6}
                      value={passwordInput}
                      onChange={(e) => setPasswordInput(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-4 py-2.5 text-sm rounded-2xl border border-[#cac4d0] dark:border-[#49454f] bg-[#fdfcff] dark:bg-[#141218] text-[#1d1b20] dark:text-[#e6e0e9] focus:outline-none focus:ring-2 focus:ring-[#1a73e8]"
                    />
                  </div>
                </div>

                {authError && (
                  <p className="text-xs text-[#ba1a1a] dark:text-[#ffb4ab] bg-[#ffdad6] dark:bg-[#93000a]/40 p-3 rounded-2xl">
                    {authError}
                  </p>
                )}

                {authSuccessMsg && (
                  <p className="text-xs text-[#0f5223] dark:text-[#6dd58c] bg-[#c4eed0] dark:bg-[#072711]/60 p-3 rounded-2xl">
                    {authSuccessMsg}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={authLoading}
                  className="w-full h-11 text-xs font-semibold bg-[#1a73e8] hover:bg-[#1557b0] dark:bg-[#a8c7fa] dark:text-[#042f74] text-white rounded-full transition-colors disabled:opacity-50 mt-1 cursor-pointer m3-pressable shadow-xs"
                >
                  {authLoading ? 'Please wait...' : authMode === 'login' ? 'Sign In to Sync' : 'Create Free Account'}
                </button>
              </form>
            )}
          </div>
        )}

        {/* Tab 3: SQL Schema */}
        {activeTab === 'sql' && (
          <div className="flex flex-col gap-3 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs text-[#49454f] dark:text-[#cac4d0]">
                Run once in your Supabase SQL Editor:
              </span>
              <button
                onClick={copySql}
                className="px-3.5 py-1.5 text-xs font-semibold border border-[#cac4d0] dark:border-[#49454f] hover:bg-[#e6e0e9] dark:hover:bg-[#2b2930] rounded-full transition-colors flex items-center gap-1.5 cursor-pointer m3-pressable"
              >
                {copiedSql ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedSql ? 'Copied' : 'Copy SQL'}
              </button>
            </div>
            <pre className="p-4 text-xs font-mono bg-[#141218] text-[#e6e0e9] rounded-2xl max-h-56 overflow-y-auto leading-relaxed border border-[#49454f]">
              {SUPABASE_SQL_SCHEMA}
            </pre>
          </div>
        )}

        {/* Tab 4: Backup & JSON */}
        {activeTab === 'backup' && (
          <div className="flex flex-col gap-4 text-sm">
            <p className="text-xs text-[#49454f] dark:text-[#cac4d0]">
              Export or import your check-in journal as standard JSON backup.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => exportSubmissions('json')}
                className="p-4 rounded-2xl border border-[#cac4d0] dark:border-[#49454f] hover:bg-[#ece6f0] dark:hover:bg-[#2b2930] flex flex-col items-center text-center gap-2 transition-colors cursor-pointer m3-pressable"
              >
                <Download className="w-5 h-5 text-[#1a73e8] dark:text-[#a8c7fa]" />
                <span className="font-semibold text-xs text-[#1d1b20] dark:text-[#e6e0e9]">Export Backup (.json)</span>
                <span className="text-[11px] text-[#49454f] dark:text-[#cac4d0]">Save all submissions to file</span>
              </button>

              <label className="p-4 rounded-2xl border border-[#cac4d0] dark:border-[#49454f] hover:bg-[#ece6f0] dark:hover:bg-[#2b2930] flex flex-col items-center text-center gap-2 transition-colors cursor-pointer m3-pressable">
                <Upload className="w-5 h-5 text-emerald-500" />
                <span className="font-semibold text-xs text-[#1d1b20] dark:text-[#e6e0e9]">Restore Backup (.json)</span>
                <span className="text-[11px] text-[#49454f] dark:text-[#cac4d0]">Import and merge backup file</span>
                <input type="file" accept=".json" onChange={handleFileInput} className="hidden" />
              </label>
            </div>

            <div className="p-3.5 bg-[#ece6f0]/70 dark:bg-[#2b2930]/70 rounded-2xl text-xs text-[#49454f] dark:text-[#cac4d0] flex items-start gap-2">
              <Info className="w-4 h-4 text-[#1a73e8] shrink-0 mt-0.5" />
              <span>Multi-Tab Sync: You can open two browser tabs right now on this device to see instant local synchronization!</span>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};
