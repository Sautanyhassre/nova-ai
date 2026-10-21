'use client';

import React, { useState } from 'react';
import {
  ShieldCheck,
  TrendingUp,
  Users,
  Cpu,
  HardDrive,
  Activity,
  AlertTriangle,
  ToggleLeft,
  ToggleRight,
  Server,
  Layers,
  IndianRupee,
} from 'lucide-react';

export const AdminStudio: React.FC = () => {
  const [modelRouting, setModelRouting] = useState({
    geminiPro: true,
    claudeSonnet: true,
    gpt4o: true,
    localNovaFast: true,
  });

  const [featureFlags, setFeatureFlags] = useState({
    enable4kVideo: true,
    enableUpiRecurring: true,
    enableAutonomousSwarm: true,
    maintenanceMode: false,
  });

  const metrics = [
    { label: 'Monthly Recurring Revenue (MRR)', val: '₹48.2 Lakhs', growth: '+28.4% MoM', icon: IndianRupee },
    { label: 'Active Subscribers (India)', val: '14,820', growth: '+12.1% MoM', icon: Users },
    { label: 'Frontier Tokens Ingested', val: '1.84 Billion', growth: '42.8M / 24h', icon: Cpu },
    { label: 'Active Object Storage', val: '48.6 TB', growth: 'NVMe Encrypted', icon: HardDrive },
  ];

  const queues = [
    { id: 'q-1', task: '4K Diffusion Scene Render', user: 'vikram@studios.in', status: 'Processing', worker: 'GPU-Cluster-Mum-04' },
    { id: 'q-2', task: 'Autonomous MCA Due Diligence Audit', user: 'legal@corpleap.com', status: 'Running', worker: 'Agent-Node-08' },
    { id: 'q-3', task: 'Bilingual Hindi Voice Synthesis (45 mins)', user: 'meera@podcast.in', status: 'Queued', worker: 'Audio-Worker-02' },
  ];

  return (
    <div className="flex-1 flex flex-col h-full bg-[#08090C] overflow-y-auto p-8 space-y-8">
      {/* Top Banner */}
      <div className="flex items-center justify-between border-b border-[#222733] pb-6">
        <div>
          <div className="flex items-center space-x-2">
            <ShieldCheck className="h-6 w-6 text-indigo-400" />
            <h2 className="text-xl font-bold text-white">NOVA AI Command & Administration Console</h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real-time telemetry, model routing gates, Indian payment reconciliation & worker fleets.
          </p>
        </div>

        <div className="flex items-center space-x-2 px-3 py-1.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-semibold">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span>All 6 Regions Operational</span>
        </div>
      </div>

      {/* High-level Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {metrics.map((m, i) => {
          const Icon = m.icon;
          return (
            <div key={i} className="p-5 rounded-2xl bg-[#10131d] border border-[#222736] space-y-2">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-xs font-medium">{m.label}</span>
                <Icon className="h-4 w-4 text-indigo-400" />
              </div>
              <h3 className="text-2xl font-extrabold text-white">{m.val}</h3>
              <p className="text-[11px] font-semibold text-emerald-400">{m.growth}</p>
            </div>
          );
        })}
      </div>

      {/* Model Provider Router & Gateways */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-6 rounded-3xl bg-[#10131d] border border-[#222736] space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center space-x-2">
            <Server className="h-4 w-4 text-indigo-400" />
            <span>Server-Side Model Provider Gateways</span>
          </h3>
          <p className="text-xs text-slate-400">
            Dynamically divert prompt traffic across frontier APIs without frontend client downtime.
          </p>

          <div className="space-y-3 pt-2">
            {[
              { key: 'geminiPro', name: 'Google Gemini 1.5 Pro / Flash Gateway', status: 'Primary Multi-modal' },
              { key: 'claudeSonnet', name: 'Anthropic Claude 3.5 Sonnet Route', status: 'Coding & Architecture' },
              { key: 'gpt4o', name: 'OpenAI GPT-4o Gateway', status: 'General Reasoning' },
              { key: 'localNovaFast', name: 'NOVA Sovereign Edge (Mumbai Cloud)', status: 'Sub-second Fallback' },
            ].map((gw) => (
              <div
                key={gw.key}
                className="p-3.5 rounded-xl bg-[#161a25] border border-[#262c3e] flex items-center justify-between"
              >
                <div>
                  <h4 className="text-xs font-bold text-white">{gw.name}</h4>
                  <p className="text-[10px] text-slate-400">{gw.status}</p>
                </div>
                <button
                  onClick={() =>
                    setModelRouting({
                      ...modelRouting,
                      [gw.key]: !modelRouting[gw.key as keyof typeof modelRouting],
                    })
                  }
                  className="text-indigo-400 hover:text-indigo-300 transition"
                >
                  {modelRouting[gw.key as keyof typeof modelRouting] ? (
                    <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                      ENABLED
                    </span>
                  ) : (
                    <span className="text-xs font-bold text-slate-500 bg-slate-800 px-2 py-0.5 rounded">
                      MUTED
                    </span>
                  )}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Feature Flags & Security Controls */}
        <div className="p-6 rounded-3xl bg-[#10131d] border border-[#222736] space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center space-x-2">
            <Activity className="h-4 w-4 text-cyan-400" />
            <span>Global Feature Flags & Killswitches</span>
          </h3>
          <p className="text-xs text-slate-400">
            Control platform capabilities, high-compute modules, and compliance bounds in real time.
          </p>

          <div className="space-y-3 pt-2">
            {[
              { key: 'enableUpiRecurring', name: 'UPI Autopay Recurring Engine (India)', desc: 'Mandates up to ₹15,000 without OTP' },
              { key: 'enable4kVideo', name: '4K Generative Video Rendering Queue', desc: 'GPU quota throttle limit' },
              { key: 'enableAutonomousSwarm', name: 'Autonomous Multi-Agent Swarms', desc: 'Background execution orchestrator' },
              { key: 'maintenanceMode', name: 'Emergency Read-Only Maintenance Lock', desc: 'Suspends paid token burning' },
            ].map((flag) => (
              <div
                key={flag.key}
                className="p-3.5 rounded-xl bg-[#161a25] border border-[#262c3e] flex items-center justify-between"
              >
                <div>
                  <h4 className="text-xs font-bold text-white">{flag.name}</h4>
                  <p className="text-[10px] text-slate-400">{flag.desc}</p>
                </div>
                <button
                  onClick={() =>
                    setFeatureFlags({
                      ...featureFlags,
                      [flag.key]: !featureFlags[flag.key as keyof typeof featureFlags],
                    })
                  }
                >
                  {featureFlags[flag.key as keyof typeof featureFlags] ? (
                    <span className="text-xs font-bold text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
                      ACTIVE
                    </span>
                  ) : (
                    <span className="text-xs font-bold text-slate-500 bg-slate-800 px-2 py-0.5 rounded">
                      DISABLED
                    </span>
                  )}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Live Worker Queue Table */}
      <div className="p-6 rounded-3xl bg-[#10131d] border border-[#222736] space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center space-x-2">
          <Layers className="h-4 w-4 text-indigo-400" />
          <span>Active Worker Fleets & Job Queues</span>
        </h3>

        <div className="rounded-2xl border border-[#222733] overflow-hidden bg-[#0a0c12]">
          <table className="w-full text-xs text-left text-slate-300">
            <thead className="bg-[#141824] text-slate-400 font-semibold uppercase tracking-wider text-[10px] border-b border-[#222733]">
              <tr>
                <th className="px-5 py-3">Job ID</th>
                <th className="px-4 py-3">Task Description</th>
                <th className="px-4 py-3">User</th>
                <th className="px-4 py-3">Assigned Worker</th>
                <th className="px-4 py-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1e2333]">
              {queues.map((q) => (
                <tr key={q.id} className="hover:bg-[#141824]">
                  <td className="px-5 py-3 font-mono text-indigo-400 font-semibold">{q.id}</td>
                  <td className="px-4 py-3 text-white font-medium">{q.task}</td>
                  <td className="px-4 py-3 text-slate-400">{q.user}</td>
                  <td className="px-4 py-3 font-mono text-slate-400">{q.worker}</td>
                  <td className="px-4 py-3 text-right">
                    <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-semibold text-[10px] border border-emerald-500/20">
                      {q.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
