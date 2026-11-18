import React, { useEffect, useState } from 'react';
import { Download, Smartphone, Check, ExternalLink } from 'lucide-react';
import { Modal } from './Modal';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export const AndroidInstallPrompt: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if running in standalone mode (already installed)
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstallPWA = async () => {
    if (!deferredPrompt) {
      // If browser doesn't support beforeinstallprompt or not triggered yet
      alert('To install on Android: Tap the three dots (⋮) in your Chrome browser menu, then tap "Add to Home screen" or "Install App".');
      return;
    }
    await deferredPrompt.prompt();
    const choice = await deferredPrompt.userChoice;
    if (choice.outcome === 'accepted') {
      setIsInstalled(true);
      setShowModal(false);
    }
    setDeferredPrompt(null);
  };

  const GITHUB_REPO_URL = 'https://github.com/jeevesh-2010/pycho';
  const APK_DOWNLOAD_URL = `${GITHUB_REPO_URL}/releases/latest/download/zendaily-android.apk`;
  const RELEASES_PAGE_URL = `${GITHUB_REPO_URL}/releases`;

  return (
    <>
      {/* Subtle Android Download Chip in Header or floating banner */}
      {!isInstalled && (
        <button
          onClick={() => setShowModal(true)}
          className="h-9 inline-flex items-center gap-1.5 px-3 rounded-full text-xs font-semibold bg-[#dbe2f9] text-[#131c2b] dark:bg-[#004a77] dark:text-[#c2e7ff] hover:bg-[#c2e7ff] dark:hover:bg-[#0842a0] transition-colors cursor-pointer m3-pressable shadow-2xs"
          title="Download & Install for Android"
        >
          <Smartphone className="w-3.5 h-3.5 text-[#1a73e8] dark:text-[#a8c7fa]" />
          <span className="hidden sm:inline">Get Android App</span>
          <span className="sm:hidden">Install</span>
        </button>
      )}

      {/* Android Download Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Download for Android"
        subtitle="Install as a native Android app on your phone"
        maxWidth="md"
      >
        <div className="flex flex-col gap-5">
          <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-[#d3e3fd]/40 dark:bg-[#0842a0]/40 border border-[#1a73e8]/30 dark:border-[#a8c7fa]/30">
            <div className="w-12 h-12 rounded-2xl bg-[#1a73e8] text-white flex items-center justify-center font-bold text-xl shadow-xs shrink-0">
              <Smartphone className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-[#1d1b20] dark:text-[#e6e0e9]">
                ZenDaily for Android
              </h3>
              <p className="text-xs text-[#49454f] dark:text-[#cac4d0] mt-0.5">
                Version 1.0 • Material You M3 • Standalone Offline & Realtime Sync
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {/* Option 1: Direct APK Download */}
            <a
              href={APK_DOWNLOAD_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="p-5 rounded-3xl bg-[#f7f2fa] dark:bg-[#1d1b20] border border-[#cac4d0]/60 dark:border-[#49454f]/60 hover:border-[#1a73e8] dark:hover:border-[#a8c7fa] flex flex-col justify-between gap-3 transition-all text-left group cursor-pointer"
            >
              <div>
                <div className="w-9 h-9 rounded-full bg-[#1a73e8] text-white flex items-center justify-center mb-2.5">
                  <Download className="w-4 h-4" />
                </div>
                <h4 className="text-sm font-semibold text-[#1d1b20] dark:text-[#e6e0e9] group-hover:text-[#1a73e8] dark:group-hover:text-[#a8c7fa]">
                  Download APK
                </h4>
                <p className="text-xs text-[#49454f] dark:text-[#cac4d0] mt-1 leading-relaxed">
                  Direct Android installation file (.apk) built via GitHub Releases.
                </p>
              </div>
              <span className="text-xs font-semibold text-[#1a73e8] dark:text-[#a8c7fa] flex items-center gap-1">
                Download .apk file <ExternalLink className="w-3 h-3" />
              </span>
            </a>

            {/* Option 2: 1-Click Install WebAPK / PWA */}
            <button
              onClick={handleInstallPWA}
              className="p-5 rounded-3xl bg-[#f7f2fa] dark:bg-[#1d1b20] border border-[#cac4d0]/60 dark:border-[#49454f]/60 hover:border-[#1a73e8] dark:hover:border-[#a8c7fa] flex flex-col justify-between gap-3 transition-all text-left group cursor-pointer"
            >
              <div>
                <div className="w-9 h-9 rounded-full bg-[#34a853] text-white flex items-center justify-center mb-2.5">
                  <Check className="w-4 h-4" />
                </div>
                <h4 className="text-sm font-semibold text-[#1d1b20] dark:text-[#e6e0e9] group-hover:text-[#1a73e8] dark:group-hover:text-[#a8c7fa]">
                  Instant Install (WebAPK)
                </h4>
                <p className="text-xs text-[#49454f] dark:text-[#cac4d0] mt-1 leading-relaxed">
                  Adds directly to your Android Home Screen with zero download wait.
                </p>
              </div>
              <span className="text-xs font-semibold text-[#1a73e8] dark:text-[#a8c7fa] flex items-center gap-1">
                Tap to Install Now
              </span>
            </button>
          </div>

          {/* Android Installation Instructions */}
          <div className="p-4 rounded-2xl bg-[#ece6f0]/70 dark:bg-[#2b2930]/70 text-xs text-[#49454f] dark:text-[#cac4d0] leading-relaxed">
            <p className="font-semibold text-[#1d1b20] dark:text-[#e6e0e9] mb-1">
              How to install on your Android device:
            </p>
            <ol className="list-decimal list-inside space-y-1">
              <li>Click <strong>Download APK</strong> to download the file directly to your phone.</li>
              <li>When prompted by Android, tap <strong>Install anyway</strong> (or allow install from browser).</li>
              <li>Or in Chrome on your phone, tap the browser menu (<strong>⋮</strong>) and tap <strong>Add to Home screen</strong>.</li>
            </ol>
          </div>

          <div className="flex items-center justify-between pt-1">
            <a
              href={RELEASES_PAGE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-[#1a73e8] dark:text-[#a8c7fa] hover:underline flex items-center gap-1"
            >
              <span>View GitHub Releases</span>
              <ExternalLink className="w-3 h-3" />
            </a>

            <button
              onClick={() => setShowModal(false)}
              className="px-5 py-2 text-xs font-semibold rounded-full bg-[#ece6f0] dark:bg-[#2b2930] hover:bg-[#e6e0e9] dark:hover:bg-[#36343b] text-[#1d1b20] dark:text-[#e6e0e9] transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};
