import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import type { CloudConfig, UserSession } from '../types';
import { loadStoredCloudConfig, saveStoredCloudConfig } from '../lib/storage';
import { getSupabaseClient, testSupabaseConnection } from '../lib/supabase';
import type { SupabaseClient } from '@supabase/supabase-js';

export type SyncStatus = 'offline' | 'connecting' | 'connected' | 'error';

interface AuthContextType {
  cloudConfig: CloudConfig;
  updateCloudConfig: (config: Partial<CloudConfig>) => void;
  user: UserSession | null;
  supabaseClient: SupabaseClient | null;
  syncStatus: SyncStatus;
  syncMessage: string;
  isCloudReady: boolean;
  signIn: (email: string, password: string) => Promise<{ error?: string }>;
  signUp: (email: string, password: string) => Promise<{ error?: string; message?: string }>;
  signOut: () => Promise<void>;
  testConnection: (url?: string, key?: string) => Promise<{ success: boolean; message: string }>;
  reconnect: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cloudConfig, setCloudConfig] = useState<CloudConfig>(loadStoredCloudConfig);
  const [user, setUser] = useState<UserSession | null>(null);
  const [supabaseClient, setSupabaseClient] = useState<SupabaseClient | null>(null);
  const [syncStatus, setSyncStatus] = useState<SyncStatus>('offline');
  const [syncMessage, setSyncMessage] = useState<string>('Local Mode (Offline-first)');

  const initClient = useCallback((config: CloudConfig) => {
    if (!config.supabaseUrl || !config.supabaseAnonKey || !config.syncEnabled) {
      setSupabaseClient(null);
      setUser(null);
      setSyncStatus('offline');
      setSyncMessage('Local Mode (Device Only)');
      return null;
    }

    setSyncStatus('connecting');
    setSyncMessage('Connecting to Supabase...');

    const client = getSupabaseClient(config);
    if (!client) {
      setSyncStatus('error');
      setSyncMessage('Failed to initialize Supabase client.');
      return null;
    }

    setSupabaseClient(client);

    // Check existing auth session
    client.auth.getSession().then(({ data: { session }, error }) => {
      if (error) {
        console.warn('Supabase auth session error:', error.message);
        setSyncStatus('error');
        setSyncMessage(`Auth check: ${error.message}`);
      } else if (session?.user) {
        setUser({ id: session.user.id, email: session.user.email });
        setSyncStatus('connected');
        setSyncMessage(`Live Realtime Sync (${session.user.email})`);
      } else {
        setUser(null);
        setSyncStatus('connected');
        setSyncMessage('Cloud Connected (Anonymous / Ready to Sign In)');
      }
    });

    // Listen to auth changes
    const { data: authListener } = client.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser({ id: session.user.id, email: session.user.email });
        setSyncStatus('connected');
        setSyncMessage(`Live Realtime Sync (${session.user.email})`);
      } else {
        setUser(null);
        setSyncStatus('connected');
        setSyncMessage('Cloud Connected (No User Logged In)');
      }
    });

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    const cleanup = initClient(cloudConfig);
    return () => {
      if (typeof cleanup === 'function') cleanup();
    };
  }, [cloudConfig, initClient]);

  const updateCloudConfig = (partial: Partial<CloudConfig>) => {
    setCloudConfig((prev) => {
      const next = { ...prev, ...partial };
      saveStoredCloudConfig(next);
      return next;
    });
  };

  const signIn = async (email: string, password: string): Promise<{ error?: string }> => {
    if (!supabaseClient) {
      return { error: 'Supabase is not configured yet. Please configure your project URL and Key.' };
    }
    const { error } = await supabaseClient.auth.signInWithPassword({ email, password });
    if (error) {
      return { error: error.message };
    }
    return {};
  };

  const signUp = async (email: string, password: string): Promise<{ error?: string; message?: string }> => {
    if (!supabaseClient) {
      return { error: 'Supabase is not configured yet. Please configure your project URL and Key.' };
    }
    const { data, error } = await supabaseClient.auth.signUp({ email, password });
    if (error) {
      return { error: error.message };
    }
    if (data.session) {
      return { message: 'Account created and signed in successfully!' };
    }
    return { message: 'Confirmation email sent! Check your inbox to verify your email.' };
  };

  const signOut = async () => {
    if (supabaseClient) {
      await supabaseClient.auth.signOut();
    }
    setUser(null);
    setSyncStatus('connected');
    setSyncMessage('Cloud Connected (Signed Out)');
  };

  const testConnection = async (url?: string, key?: string) => {
    const testUrl = url || cloudConfig.supabaseUrl;
    const testKey = key || cloudConfig.supabaseAnonKey;
    if (!testUrl || !testKey) {
      return { success: false, message: 'Please provide both Supabase URL and Anon Key' };
    }
    return testSupabaseConnection(testUrl, testKey);
  };

  const reconnect = async () => {
    initClient(cloudConfig);
  };

  const isCloudReady = Boolean(cloudConfig.supabaseUrl && cloudConfig.supabaseAnonKey && syncStatus === 'connected');

  return (
    <AuthContext.Provider
      value={{
        cloudConfig,
        updateCloudConfig,
        user,
        supabaseClient,
        syncStatus,
        syncMessage,
        isCloudReady,
        signIn,
        signUp,
        signOut,
        testConnection,
        reconnect,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
