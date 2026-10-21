'use client';

import React, { useState } from 'react';
import { WorkJob, AgentStep, AgentDeliverable } from '@/types';
import { DEFAULT_AGENTS } from '@/lib/constants';
import {
  Cpu,
  Bot,
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  Clock,
  Download,
  AlertCircle,
  ShieldAlert,
  Terminal,
  FileCheck,
  ChevronRight,
  Plus,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

export const WorkStudio: React.FC = () => {
  const [prompt, setPrompt] = useState(
    'Perform a market and regulatory analysis for establishing an autonomous AI data corridor between Mumbai and Singapore, including DPDP compliance and tax treaties.'
  );
  const [selectedAgentId, setSelectedAgentId] = useState('researcher');
  const [isRunning, setIsRunning] = useState(false);
  const [currentJob, setCurrentJob] = useState<WorkJob | null>({
    id: 'job-demo-1',
    title: 'Market & Regulatory Analysis: India-Singapore AI Corridor',
    prompt:
      'Perform a market and regulatory analysis for establishing an autonomous AI data corridor between Mumbai and Singapore, including DPDP compliance and tax treaties.',
    category: 'Regulatory & Global Strategy',
    status: 'completed',
    progress: 100,
    agentName: 'Bharat Research Analyst',
    createdAt: '10 mins ago',
    steps: [
      {
        id: 's-1',
        title: 'Jurisdictional Scope & Data Boundary Definition',
        status: 'completed',
        duration: '1.4s',
        log: 'Parsed cross-border data transfer provisions under India DPDP Act 2023 Sec 16 and Singapore PDPA.',
      },
      {
        id: 's-2',
        title: 'Tax Treaty (DTAA) & GST Assessment',
        status: 'completed',
        duration: '2.1s',
        log: 'Calculated withholding tax implications, 18% IGST on cross-border cloud ingestion, and PE exposure.',
      },
      {
        id: 's-3',
        title: 'Subsea Cable Latency & Redundancy Benchmark',
        status: 'completed',
        duration: '1.8s',
        log: 'Benchmarked route via Chennai/Mumbai landings (BBG, SEA-ME-WE 5). Typical round-trip latency: ~28ms.',
      },
      {
        id: 's-4',
        title: 'Executive Deliverable Synthesis',
        status: 'completed',
        duration: '0.9s',
        log: 'Deliverable finalized in Markdown. Ready for review and C-suite presentation export.',
      },
    ],
    deliverables: [
      {
        id: 'd-1',
        title: 'Bilateral AI Corridor Strategic Memorandum',
        type: 'report',
        content: `# Executive Strategic Memorandum: India-Singapore Autonomous AI Data Corridor\n\n## 1. Executive Summary\nEstablishing high-speed encrypted data pathways connecting Indian sovereign GPU clusters with Southeast Asian financial routers.\n\n## 2. Regulatory Alignment\n- Compliance achieved under DPDP Act 2023 (Adequacy & Trusted Geography Framework).\n- 18% IGST input tax credit eligibility confirmed for domestic infrastructure providers.\n\n## 3. Financial Forecast\n- Estimated setup capex: ₹14.5 Crore.\n- Projected IRR: 38% over 36 months.`,
        downloadName: 'bilateral_ai_corridor_memo.md',
      },
    ],
  });

  const [activeStepTab, setActiveStepTab] = useState<'steps' | 'deliverables' | 'agents'>('steps');

  const handleLaunchTask = async () => {
    if (!prompt.trim()) return;
    setIsRunning(true);

    try {
      const res = await fetch('/api/ai/work', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          agentId: selectedAgentId,
          category: 'Strategic Research',
        }),
      });

      const data = await res.json();
      if (data.success && data.job) {
        setCurrentJob(data.job);
        setActiveStepTab('deliverables');
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsRunning(false);
    }
  };

  const handleDownloadDeliverable = (del: AgentDeliverable) => {
    const blob = new Blob([del.content], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = del.downloadName;
    link.click();
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#08090C] overflow-hidden">
      {/* Top Launch Console */}
      <div className="p-6 bg-[#0c0e14] border-b border-[#222733] space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="h-9 w-9 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center">
              <Cpu className="h-5 w-5 text-indigo-400" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white">Autonomous AI Work Runner</h2>
              <p className="text-xs text-slate-400">
                Delegate multi-step workflows with real progress tracking and verifiable deliverables.
              </p>
            </div>
          </div>

          {/* Agent Selector */}
          <div className="flex items-center space-x-2">
            <span className="text-xs text-slate-400">Assigned Agent:</span>
            <select
              value={selectedAgentId}
              onChange={(e) => setSelectedAgentId(e.target.value)}
              className="bg-[#161a25] border border-[#262c3e] rounded-xl px-3 py-1.5 text-xs text-indigo-300 font-semibold focus:outline-none"
            >
              {DEFAULT_AGENTS.map((ag) => (
                <option key={ag.id} value={ag.id}>
                  {ag.avatar} {ag.name} ({ag.role})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Prompt Input Box */}
        <div className="relative rounded-2xl bg-[#131622] border border-[#252c3d] focus-within:border-indigo-500 shadow-xl p-3">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            rows={2}
            placeholder="Instruct your autonomous agent with clear objectives and desired deliverables..."
            className="w-full bg-transparent text-sm text-slate-100 placeholder-slate-500 resize-none focus:outline-none"
          />

          <div className="flex items-center justify-between pt-2 border-t border-[#202534] mt-1">
            <div className="flex items-center space-x-2 text-xs text-slate-400">
              <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Safe Sandboxed Execution
              </span>
              <span>Requires confirmation for sensitive writes</span>
            </div>

            <button
              onClick={handleLaunchTask}
              disabled={isRunning || !prompt.trim()}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 disabled:opacity-40 text-white font-semibold text-xs shadow-lg shadow-indigo-600/30 flex items-center space-x-2 transition"
            >
              <Sparkles className="h-4 w-4" />
              <span>{isRunning ? 'Orchestrating Plan...' : 'Execute Autonomous Task'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Tabs: Execution Steps vs Deliverables vs Agents */}
      <div className="px-6 border-b border-[#222733] bg-[#0f121a] flex space-x-6 text-xs">
        <button
          onClick={() => setActiveStepTab('steps')}
          className={`py-3 font-semibold border-b-2 transition ${
            activeStepTab === 'steps'
              ? 'text-indigo-400 border-indigo-500'
              : 'text-slate-400 border-transparent hover:text-slate-200'
          }`}
        >
          Task Execution Steps ({currentJob?.steps.length || 0})
        </button>
        <button
          onClick={() => setActiveStepTab('deliverables')}
          className={`py-3 font-semibold border-b-2 transition ${
            activeStepTab === 'deliverables'
              ? 'text-indigo-400 border-indigo-500'
              : 'text-slate-400 border-transparent hover:text-slate-200'
          }`}
        >
          Generated Deliverables ({currentJob?.deliverables.length || 0})
        </button>
        <button
          onClick={() => setActiveStepTab('agents')}
          className={`py-3 font-semibold border-b-2 transition ${
            activeStepTab === 'agents'
              ? 'text-indigo-400 border-indigo-500'
              : 'text-slate-400 border-transparent hover:text-slate-200'
          }`}
        >
          Reusable Specialized Agents ({DEFAULT_AGENTS.length})
        </button>
      </div>

      {/* Body Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {activeStepTab === 'steps' && currentJob && (
          <div className="space-y-4 max-w-4xl">
            <div className="p-4 rounded-2xl bg-[#12151f] border border-[#222736] flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white mb-1">{currentJob.title}</h3>
                <p className="text-xs text-slate-400">Agent: {currentJob.agentName}</p>
              </div>
              <div className="flex items-center space-x-3">
                <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 font-bold text-xs border border-emerald-500/20">
                  {currentJob.status.toUpperCase()} (100%)
                </span>
              </div>
            </div>

            {/* Step List */}
            <div className="space-y-3">
              {currentJob.steps.map((step, idx) => (
                <div
                  key={step.id}
                  className="p-4 rounded-xl bg-[#131622] border border-[#242b3b] space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                      <span className="text-xs font-bold text-white">
                        Step {idx + 1}: {step.title}
                      </span>
                    </div>
                    <span className="text-[11px] font-mono text-slate-500">{step.duration}</span>
                  </div>
                  <p className="text-xs text-slate-300">{step.description}</p>
                  {step.log && (
                    <div className="p-2 rounded-lg bg-[#090b10] border border-[#1f2433] text-[11px] font-mono text-slate-400">
                      &gt; {step.log}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {activeStepTab === 'deliverables' && currentJob && (
          <div className="space-y-4 max-w-4xl">
            {currentJob.deliverables.map((del) => (
              <div
                key={del.id}
                className="rounded-2xl bg-[#12151f] border border-[#222736] overflow-hidden shadow-xl"
              >
                <div className="p-4 bg-[#161a25] border-b border-[#242b3b] flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <FileCheck className="h-4 w-4 text-emerald-400" />
                    <span className="text-sm font-bold text-white">{del.title}</span>
                  </div>
                  <button
                    onClick={() => handleDownloadDeliverable(del)}
                    className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs flex items-center space-x-1.5 transition"
                  >
                    <Download className="h-3.5 w-3.5" />
                    <span>Download {del.downloadName}</span>
                  </button>
                </div>
                <div className="p-6 prose prose-invert max-w-none text-xs leading-relaxed whitespace-pre-wrap bg-[#0c0e14]">
                  {del.content}
                </div>
              </div>
            ))}
          </div>
        )}

        {activeStepTab === 'agents' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-5xl">
            {DEFAULT_AGENTS.map((agent) => (
              <div
                key={agent.id}
                className="p-5 rounded-2xl bg-[#12151f] border border-[#222736] hover:border-indigo-500/40 space-y-3 transition"
              >
                <div className="flex items-center space-x-3">
                  <span className="text-3xl">{agent.avatar}</span>
                  <div>
                    <h4 className="text-sm font-bold text-white">{agent.name}</h4>
                    <p className="text-xs text-indigo-400 font-medium">{agent.role}</p>
                  </div>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">{agent.description}</p>
                <div className="flex flex-wrap gap-1.5 pt-2 border-t border-[#202534]">
                  {agent.tools.map((t, i) => (
                    <span
                      key={i}
                      className="text-[10px] px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 font-medium"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
