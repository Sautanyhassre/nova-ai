'use client';

import React, { useState, useEffect } from 'react';
import {
  Download,
  Smartphone,
  Laptop,
  Apple,
  Share2,
  PlusSquare,
  Check,
  X,
  Sparkles,
} from 'lucide-react';

interface InstallPromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  deferredPrompt: any;
}

export const InstallPromptModal: React.FC<InstallPromptModalProps> = ({
  isOpen,
  onClose,
  deferredPrompt,
}) => {
  const [platform, setPlatform] = useState<'android' | 'ios' | 'desktop'>('android');
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Detect OS
    const userAgent = window.navigator.userAgent.toLowerCase();
    if (/iphone|ipad|ipod/.test(userAgent)) {
      setPlatform('ios');
    } else if (/android/.test(userAgent)) {
      setPlatform('android');
    } else {
      setPlatform('desktop');
    }

    // Check if already in standalone mode
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }
  }, []);

  if (!isOpen) return null;

  const handleNativeInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setIsInstalled(true);
        onClose();
      }
    } else {
      alert('To install on this device, check your browser address bar for the Install icon or follow the instructions below.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md rounded-3xl bg-[#10131e] border border-[#262d40] shadow-2xl p-6 space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-cyan-400 flex items-center justify-center shadow-md">
              <Download className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Install NOVA AI App</h3>
              <p className="text-[11px] text-slate-400">Works on Android, iPhone, iPad, Mac & Windows</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white text-base p-1"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Platform Tabs */}
        <div className="flex bg-[#161a25] p-1 rounded-2xl border border-[#242b3b]">
          <button
            onClick={() => setPlatform('android')}
            className={`flex-1 py-1.5 rounded-xl text-xs font-semibold flex items-center justify-center space-x-1.5 transition ${
              platform === 'android'
                ? 'bg-indigo-600 text-white shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Smartphone className="h-3.5 w-3.5" />
            <span>Android</span>
          </button>
          <button
            onClick={() => setPlatform('ios')}
            className={`flex-1 py-1.5 rounded-xl text-xs font-semibold flex items-center justify-center space-x-1.5 transition ${
              platform === 'ios'
                ? 'bg-indigo-600 text-white shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Smartphone className="h-3.5 w-3.5" />
            <span>iPhone / iPad</span>
          </button>
          <button
            onClick={() => setPlatform('desktop')}
            className={`flex-1 py-1.5 rounded-xl text-xs font-semibold flex items-center justify-center space-x-1.5 transition ${
              platform === 'desktop'
                ? 'bg-indigo-600 text-white shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Laptop className="h-3.5 w-3.5" />
            <span>Laptop / Mac</span>
          </button>
        </div>

        {/* Platform-Specific Step-by-Step Instructions */}
        <div className="p-4 rounded-2xl bg-[#0c0e14] border border-[#222736] space-y-3 text-xs text-slate-300">
          {platform === 'android' && (
            <div className="space-y-2">
              <h4 className="font-bold text-white flex items-center space-x-1.5">
                <span>Android (Chrome / Samsung Internet / Edge)</span>
              </h4>
              <p className="text-slate-400">
                1. Tap the <b>"Install App"</b> button below.<br />
                2. Tap <b>"Install"</b> on the system prompt.<br />
                3. NOVA AI will be added to your app drawer and home screen.
              </p>
              {deferredPrompt && (
                <button
                  onClick={handleNativeInstall}
                  className="w-full mt-2 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-md transition flex items-center justify-center space-x-2"
                >
                  <Download className="h-4 w-4" />
                  <span>Install App on Android Now</span>
                </button>
              )}
            </div>
          )}

          {platform === 'ios' && (
            <div className="space-y-2.5">
              <h4 className="font-bold text-white flex items-center space-x-1.5">
                <span>Apple iOS (Safari on iPhone / iPad)</span>
              </h4>
              <ol className="space-y-2 text-slate-400 list-decimal list-inside leading-relaxed">
                <li>
                  Open this page in <b>Safari</b> on your iPhone or iPad.
                </li>
                <li>
                  Tap the <b className="text-white">Share button</b> (the square with an arrow pointing up at the bottom).
                </li>
                <li>
                  Scroll down and tap <b className="text-white">"Add to Home Screen"</b> (<PlusSquare className="inline h-3.5 w-3.5 text-indigo-400" />).
                </li>
                <li>
                  Tap <b className="text-white">"Add"</b> in the top right corner.
                </li>
              </ol>
              <div className="p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-[11px] text-indigo-300">
                ✨ Launches in native full-screen mode without browser address bars!
              </div>
            </div>
          )}

          {platform === 'desktop' && (
            <div className="space-y-2.5">
              <h4 className="font-bold text-white flex items-center space-x-1.5">
                <span>Laptops (Windows, Mac, Chromebook)</span>
              </h4>
              <p className="text-slate-400 leading-relaxed">
                • <b>Chrome / Edge on Windows & Mac</b>: Look for the <b className="text-white">Install icon</b> (<Download className="inline h-3 w-3" />) on the right side of the URL address bar, or click below.<br />
                • <b>Safari on macOS Sonoma / Sequoia</b>: Click <b className="text-white">File &gt; Add to Dock...</b> to run NOVA AI as a native Mac desktop app.
              </p>
              {deferredPrompt && (
                <button
                  onClick={handleNativeInstall}
                  className="w-full mt-2 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500 hover:opacity-90 text-white font-bold text-xs shadow-md transition flex items-center justify-center space-x-2"
                >
                  <Download className="h-4 w-4" />
                  <span>Install Desktop App</span>
                </button>
              )}
            </div>
          )}
        </div>

        {/* Benefits badge */}
        <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-[#1e2333]">
          <span>⚡ Offline Cache Support</span>
          <span>🔒 Encrypted Sandbox</span>
          <span>🚀 Instant Startup</span>
        </div>
      </div>
    </div>
  );
};
