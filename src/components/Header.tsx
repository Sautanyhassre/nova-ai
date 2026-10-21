'use client';

import React, { useState } from 'react';
import { TabType } from '@/types';
import { ChevronDown, Sparkles, Check, Download } from 'lucide-react';
import { InstallPromptModal } from '@/components/InstallPromptModal';

interface HeaderProps {
  activeTab: TabType;
  selectedModel: string;
  setSelectedModel: (model: string) => void;
  openSearch: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  selectedModel,
  setSelectedModel,
}) => {
  const [modelDropdownOpen, setModelDropdownOpen] = useState(false);
  const [isInstallModalOpen, setIsInstallModalOpen] = useState(false);

  const models = [
    { id: 'nova-ultra-4.0', name: 'NOVA 4o', badge: 'Flagship', desc: 'Our most intelligent model' },
    { id: 'nova-fast-3.5', name: 'NOVA Mini', badge: 'Fast', desc: 'Fast, everyday tasks' },
  ];

  const currentModel = models.find((m) => m.id === selectedModel) || models[0];

  return (
    <header className="h-14 bg-[#212121] px-4 flex items-center justify-between select-none z-20">
      {/* Left: ChatGPT Model Selector (e.g. "NOVA 4o ▾") */}
      <div className="relative">
        <button
          onClick={() => setModelDropdownOpen(!modelDropdownOpen)}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl hover:bg-[#2f2f2f] text-slate-200 text-sm font-semibold transition"
        >
          <span>{currentModel.name}</span>
          <ChevronDown className="h-4 w-4 text-slate-400" />
        </button>

        {modelDropdownOpen && (
          <div className="absolute top-11 left-0 w-64 rounded-2xl bg-[#2f2f2f] border border-[#3d3d3d] shadow-2xl p-1.5 z-50 space-y-1">
            <div className="px-3 py-1.5 text-[10px] uppercase font-bold tracking-wider text-slate-400">
              Model
            </div>
            {models.map((m) => (
              <div
                key={m.id}
                onClick={() => {
                  setSelectedModel(m.id);
                  setModelDropdownOpen(false);
                }}
                className={`p-2.5 rounded-xl cursor-pointer transition flex items-center justify-between ${
                  selectedModel === m.id
                    ? 'bg-[#3d3d3d] text-white'
                    : 'hover:bg-[#383838] text-slate-300'
                }`}
              >
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium">{m.name}</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-indigo-500/20 text-indigo-300 font-medium">
                      {m.badge}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">{m.desc}</p>
                </div>
                {selectedModel === m.id && <Check className="h-4 w-4 text-white" />}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Right: Discreet Install & Profile shortcuts */}
      <div className="flex items-center space-x-2">
        <button
          onClick={() => setIsInstallModalOpen(true)}
          className="px-3 py-1 rounded-lg text-xs font-medium text-slate-400 hover:text-white hover:bg-[#2f2f2f] transition flex items-center space-x-1.5"
          title="Install App"
        >
          <Download className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Install App</span>
        </button>
      </div>

      <InstallPromptModal
        isOpen={isInstallModalOpen}
        onClose={() => setIsInstallModalOpen(false)}
        deferredPrompt={null}
      />
    </header>
  );
};
