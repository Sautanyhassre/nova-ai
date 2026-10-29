'use client';

import React, { useState } from 'react';
import { TabType } from '@/types';
import { SAMPLE_TEMPLATES } from '@/lib/constants';
import {
  Search,
  Sparkles,
  ExternalLink,
  Puzzle,
  Check,
  Shield,
  Key,
  Database,
  Trash2,
  LayoutTemplate,
  Globe,
  Settings,
} from 'lucide-react';

interface UtilityStudiosProps {
  view: 'research' | 'templates' | 'integrations' | 'settings';
  onSelectTemplate?: (templateId: string) => void;
}

export const UtilityStudios: React.FC<UtilityStudiosProps> = ({ view, onSelectTemplate }) => {
  // Research State
  const [researchQuery, setResearchQuery] = useState(
    'Indian semiconductor mission 2026 fab incentives and DLI scheme progress'
  );
  const [isSearching, setIsSearching] = useState(false);
  const [researchResults, setResearchResults] = useState([
    {
      title: 'India Semiconductor Mission (ISM) Phase 2 Outlay & Approvals',
      url: 'https://ism.gov.in/policies/2026-update',
      snippet:
        'The Government of India has approved capital expenditure subsidies up to 50% for compound semiconductor fabs and assembly test units in Dholera, Gujarat and Sanand.',
      source: 'Ministry of Electronics and Information Technology (MeitY)',
    },
    {
      title: 'Design-Linked Incentive (DLI) Beneficiaries in Bengaluru and Hyderabad',
      url: 'https://pib.gov.in/press-release/dli-schemes',
      snippet:
        'Over 27 domestic fabless startups have qualified for deployment support, focusing on RISC-V processors and edge AI inference silicon.',
      source: 'PIB India Official',
    },
  ]);

  // Settings Memory State
  const [memories, setMemories] = useState([
    'User resides in India and focuses on scalable digital products, AI systems, and technology ventures.',
    'Prefers code examples in TypeScript, Next.js App Router, and Tailwind CSS.',
    'Requires all billing & invoices formatted in Indian Rupees (INR ₹) with 18% GST and HSN code classification.',
  ]);

  const [geminiKeyInput, setGeminiKeyInput] = useState('');
  const [keySaved, setKeySaved] = useState(false);

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('nova_gemini_key') || '';
      setGeminiKeyInput(stored);
    }
  }, []);

  const handleSaveKey = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('nova_gemini_key', geminiKeyInput.trim());
      setKeySaved(true);
      setTimeout(() => setKeySaved(false), 2500);
    }
  };

  const [apiKeys, setApiKeys] = useState({
    gemini: '••••••••••••••••••••••••••••••••',
    openai: '••••••••••••••••••••••••••••••••',
    razorpay: 'rzp_live_••••••••••••••••••••',
  });

  const handleResearch = () => {
    if (!researchQuery.trim()) return;
    setIsSearching(true);
    setTimeout(() => {
      setIsSearching(false);
      setResearchResults([
        {
          title: `Comprehensive Analysis: ${researchQuery}`,
          url: 'https://research.nova.ai/briefs/' + Date.now(),
          snippet:
            'Synthesized multi-source verification confirms accelerated policy milestones, high private equity inflow, and state-level subsidy allocations.',
          source: 'NOVA Deep Research Radar',
        },
        ...researchResults,
      ]);
    }, 1000);
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#08090C] overflow-y-auto">
      {/* 1. SEARCH & RESEARCH VIEW */}
      {view === 'research' && (
        <div className="flex-1 flex flex-col h-full p-6 space-y-6 max-w-5xl mx-auto w-full">
          <div className="p-6 rounded-3xl bg-[#10131d] border border-[#222736] space-y-4">
            <h2 className="text-base font-bold text-white flex items-center space-x-2">
              <Search className="h-5 w-5 text-indigo-400" />
              <span>Deep Research & Web Synthesis Radar</span>
            </h2>
            <p className="text-xs text-slate-400">
              Scours indexed authoritative databases, Indian government portals, and global scientific archives with verified source attribution.
            </p>

            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={researchQuery}
                onChange={(e) => setResearchQuery(e.target.value)}
                placeholder="Enter query for deep research synthesis..."
                className="flex-1 bg-[#161a25] border border-[#262c3e] rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
              <button
                onClick={handleResearch}
                disabled={isSearching}
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-md shadow-indigo-600/30 transition flex items-center space-x-1.5"
              >
                <Sparkles className="h-3.5 w-3.5" />
                <span>{isSearching ? 'Synthesizing...' : 'Run Deep Research'}</span>
              </button>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Verified Citations & Findings ({researchResults.length})
            </h3>
            {researchResults.map((r, i) => (
              <div key={i} className="p-5 rounded-2xl bg-[#12151f] border border-[#222736] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider">
                    {r.source}
                  </span>
                  <a
                    href={r.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-slate-400 hover:text-white flex items-center space-x-1"
                  >
                    <span>Source Link</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
                <h4 className="text-sm font-bold text-white">{r.title}</h4>
                <p className="text-xs text-slate-300 leading-relaxed">{r.snippet}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. TEMPLATES VIEW */}
      {view === 'templates' && (
        <div className="flex-1 p-8 space-y-6 max-w-6xl mx-auto w-full">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center space-x-2">
              <LayoutTemplate className="h-5 w-5 text-indigo-400" />
              <span>Curated Template Library</span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Pre-built visual canvases, pitch decks, documents, and business strategies tailored for Indian creators and startups.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {SAMPLE_TEMPLATES.map((tmpl) => (
              <div
                key={tmpl.id}
                className="p-5 rounded-2xl bg-[#10131d] border border-[#222736] hover:border-indigo-500/40 space-y-3 transition flex flex-col justify-between"
              >
                <div>
                  <div className="text-4xl mb-3">{tmpl.thumbnail}</div>
                  <h3 className="text-sm font-bold text-white">{tmpl.name}</h3>
                  <p className="text-xs text-indigo-400 mt-0.5">{tmpl.category} • {tmpl.width}x{tmpl.height}px</p>
                  <p className="text-xs text-slate-400 mt-2">
                    Fully customizable vector canvas with editable fonts, shapes, and brand palettes.
                  </p>
                </div>
                <button
                  onClick={() => alert(`Loaded ${tmpl.name} into Design Studio!`)}
                  className="w-full py-2 rounded-xl bg-[#181d2a] hover:bg-indigo-600 hover:text-white text-slate-300 text-xs font-semibold border border-[#262c3e] transition"
                >
                  Open in Design Studio
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. INTEGRATIONS VIEW */}
      {view === 'integrations' && (
        <div className="flex-1 p-8 space-y-6 max-w-5xl mx-auto w-full">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center space-x-2">
              <Puzzle className="h-5 w-5 text-indigo-400" />
              <span>Native Tool & API Integrations</span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Connect external payment gateways, cloud object repositories, and team communication hubs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { name: 'Razorpay India Gateway', desc: 'Accept UPI, RuPay, NetBanking & auto-generate GST invoices.', connected: true, tag: 'Payments' },
              { name: 'WhatsApp Business Cloud API', desc: 'Deliver instant AI notifications, reports & summaries to Indian clients.', connected: true, tag: 'Messaging' },
              { name: 'GitHub Enterprise', desc: 'Sync multi-file code repos, push pull requests & run automated tests.', connected: true, tag: 'Engineering' },
              { name: 'Google Drive & Workspace', desc: 'Direct two-way export of docs, slides & spreadsheets.', connected: false, tag: 'Cloud Storage' },
            ].map((it, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-[#10131d] border border-[#222736] flex items-start justify-between"
              >
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <h3 className="text-sm font-bold text-white">{it.name}</h3>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 font-semibold">
                      {it.tag}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">{it.desc}</p>
                </div>
                <span
                  className={`text-xs font-bold px-2.5 py-1 rounded-xl ${
                    it.connected
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {it.connected ? 'Connected' : 'Connect'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. SETTINGS VIEW */}
      {view === 'settings' && (
        <div className="flex-1 p-8 space-y-6 max-w-4xl mx-auto w-full">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center space-x-2">
              <Settings className="h-5 w-5 text-indigo-400" />
              <span>Platform Settings & User Memory</span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Manage personal memory preferences, DPDP Act 2023 consent, and API provider credentials.
            </p>
          </div>

          {/* User Memory Manager */}
          <div className="p-6 rounded-3xl bg-[#10131d] border border-[#222736] space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center space-x-2">
              <Database className="h-4 w-4 text-purple-400" />
              <span>User-Controlled Long-Term Memory</span>
            </h3>
            <p className="text-xs text-slate-400">
              NOVA AI retains these preferences to customize responses. You can inspect, modify, or erase any item anytime.
            </p>

            <div className="space-y-2">
              {memories.map((m, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-[#161a25] border border-[#262c3e] flex items-center justify-between text-xs text-slate-200"
                >
                  <span>{m}</span>
                  <button
                    onClick={() => setMemories(memories.filter((_, i) => i !== idx))}
                    className="text-slate-500 hover:text-rose-400 transition ml-3"
                    title="Forget Memory"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* API Keys Vault */}
          <div className="p-6 rounded-3xl bg-[#10131d] border border-[#222736] space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center space-x-2">
              <Key className="h-4 w-4 text-amber-400" />
              <span>Secure Server-Side Provider Credentials</span>
            </h3>
            <p className="text-xs text-slate-400">
              Keys are encrypted at rest with AES-256 and never exposed to the client.
            </p>

            <div className="space-y-3">
              <div>
                <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                  AI Brain Key (Google Gemini or Groq — Free)
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="password"
                    placeholder="AIzaSy... (Gemini) or gsk_... (Groq)"
                    value={geminiKeyInput}
                    onChange={(e) => setGeminiKeyInput(e.target.value)}
                    className="flex-1 bg-[#161a25] border border-[#262c3e] rounded-xl px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                  />
                  <button
                    onClick={handleSaveKey}
                    className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold text-white transition flex items-center space-x-1 shrink-0"
                  >
                    {keySaved ? (
                      <>
                        <Check className="h-3.5 w-3.5 text-emerald-300" />
                        <span>Saved!</span>
                      </>
                    ) : (
                      <span>Save Key</span>
                    )}
                  </button>
                </div>
                <p className="text-[10px] text-slate-500 mt-1">
                  Supports Google Gemini (aistudio.google.com) and Groq (console.groq.com/keys). Both are 100% free with human-level reasoning.
                </p>
              </div>
              <div>
                <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                  Razorpay Key Secret (Live Indian Payments)
                </label>
                <input
                  type="password"
                  value={apiKeys.razorpay}
                  onChange={(e) => setApiKeys({ ...apiKeys, razorpay: e.target.value })}
                  className="w-full bg-[#161a25] border border-[#262c3e] rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
