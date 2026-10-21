'use client';

import React, { useState } from 'react';
import {
  Code2,
  Play,
  RotateCcw,
  Sparkles,
  Download,
  Copy,
  Check,
  FileCode,
  Eye,
  Terminal,
  ShieldCheck,
} from 'lucide-react';

export const CodeStudio: React.FC = () => {
  const [files, setFiles] = useState<Record<string, string>>({
    'App.tsx': `import React, { useState } from 'react';

export default function NovaIndianPaymentWidget() {
  const [amount, setAmount] = useState(1999);
  const [method, setMethod] = useState<'upi' | 'card' | 'netbanking'>('upi');

  const gst = Math.round(amount * 0.18 * 100) / 100;
  const total = amount + gst;

  return (
    <div style={{ fontFamily: 'sans-serif', padding: 24, background: '#0B0F19', color: '#fff', borderRadius: 16 }}>
      <h2>NOVA AI — Fast Checkout (India)</h2>
      <p style={{ color: '#94A3B8' }}>Seamless UPI, RuPay and Net Banking integration</p>
      
      <div style={{ margin: '16px 0', padding: 16, background: '#161F30', borderRadius: 12 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
          <span>Plan Base Amount:</span>
          <b>₹{amount}</b>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, color: '#38BDF8' }}>
          <span>GST (18% HSN 998313):</span>
          <b>₹{gst}</b>
        </div>
        <hr style={{ borderColor: '#2A3447', margin: '12px 0' }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 18, color: '#4ADE80' }}>
          <span>Total Payable:</span>
          <b>₹{total}</b>
        </div>
      </div>

      <button style={{ width: '100%', padding: 12, background: '#4F46E5', color: '#fff', border: 'none', borderRadius: 10, fontWeight: 'bold', cursor: 'pointer' }}>
        Pay via UPI FastRail (Instant)
      </button>
    </div>
  );
}`,
    'styles.css': `body {
  margin: 0;
  background-color: #08090C;
  color: #f8fafc;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
}`,
    'package.json': `{
  "name": "nova-india-payment-demo",
  "version": "1.0.0",
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1"
  }
}`,
  });

  const [activeFile, setActiveFile] = useState('App.tsx');
  const [previewTab, setPreviewTab] = useState<'preview' | 'console'>('preview');
  const [copied, setCopied] = useState(false);
  const [aiOutput, setAiOutput] = useState<string | null>(null);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(files[activeFile] || '');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadCode = () => {
    const blob = new Blob([files[activeFile] || ''], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = activeFile;
    link.click();
  };

  const handleAiAction = (action: string) => {
    if (action === 'explain') {
      setAiOutput(
        `### AI Code Analysis for ${activeFile}\n- **Purpose**: Computes an Indian SaaS checkout flow with dynamic 18% GST calculation (HSN 998313).\n- **Safety**: Pure client-side calculations with isolated rendering.\n- **Optimization**: Zero re-render overhead; instantaneous UPI dispatch.`
      );
    } else if (action === 'refactor') {
      setAiOutput(
        `### AI Optimization Suggestions\n1. Extract state into a centralized \`useInvoiceCalculator\` hook.\n2. Add validation for 15-character GSTIN input strings (e.g., \`29AAAAA0000A1Z5\`).`
      );
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#08090C] overflow-hidden">
      {/* Top Bar */}
      <div className="h-12 px-6 bg-[#0c0e14] border-b border-[#222733] flex items-center justify-between z-10">
        <div className="flex items-center space-x-2">
          {Object.keys(files).map((filename) => (
            <button
              key={filename}
              onClick={() => setActiveFile(filename)}
              className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition ${
                activeFile === filename
                  ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-[#141722]'
              }`}
            >
              <FileCode className="h-3.5 w-3.5" />
              <span>{filename}</span>
            </button>
          ))}
        </div>

        {/* AI Actions */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => handleAiAction('explain')}
            className="flex items-center space-x-1.5 px-3 py-1 rounded-lg bg-[#161a25] hover:bg-[#1e2332] text-xs font-semibold text-slate-300 border border-[#262c3e] transition"
          >
            <Sparkles className="h-3 w-3 text-indigo-400" />
            <span>Explain Code</span>
          </button>
          <button
            onClick={() => handleAiAction('refactor')}
            className="flex items-center space-x-1.5 px-3 py-1 rounded-lg bg-[#161a25] hover:bg-[#1e2332] text-xs font-semibold text-slate-300 border border-[#262c3e] transition"
          >
            <RotateCcw className="h-3 w-3 text-cyan-400" />
            <span>Refactor / Debug</span>
          </button>
          <button
            onClick={handleCopyCode}
            className="p-1.5 rounded-lg bg-[#161a25] hover:bg-[#1e2332] text-slate-300 border border-[#262c3e] transition"
            title="Copy Code"
          >
            {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
          </button>
          <button
            onClick={handleDownloadCode}
            className="p-1.5 rounded-lg bg-[#161a25] hover:bg-[#1e2332] text-slate-300 border border-[#262c3e] transition"
            title="Download File"
          >
            <Download className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Main Split View: Code Editor (Left) & Preview Sandbox (Right) */}
      <div className="flex-1 flex overflow-hidden">
        {/* Editor Panel */}
        <div className="flex-1 bg-[#090b10] border-r border-[#222733] flex flex-col overflow-hidden">
          <div className="flex-1 p-4 overflow-auto font-mono text-xs text-slate-200">
            <textarea
              value={files[activeFile] || ''}
              onChange={(e) => setFiles({ ...files, [activeFile]: e.target.value })}
              className="w-full h-full bg-transparent text-slate-200 font-mono text-xs leading-relaxed focus:outline-none resize-none"
              spellCheck={false}
            />
          </div>

          {/* AI Output Drawer */}
          {aiOutput && (
            <div className="p-4 bg-[#10131d] border-t border-indigo-500/30 text-xs text-slate-300 relative">
              <button
                onClick={() => setAiOutput(null)}
                className="absolute top-2 right-2 text-slate-400 hover:text-white"
              >
                ×
              </button>
              <div className="prose prose-invert max-w-none text-xs whitespace-pre-wrap">
                {aiOutput}
              </div>
            </div>
          )}
        </div>

        {/* Live Web Preview Sandbox */}
        <div className="w-[45%] bg-[#06080d] flex flex-col overflow-hidden">
          <div className="h-9 px-4 bg-[#0e1118] border-b border-[#222733] flex items-center justify-between text-xs text-slate-400">
            <div className="flex items-center space-x-2 font-semibold">
              <Eye className="h-3.5 w-3.5 text-cyan-400" />
              <span>Isolated Sandboxed Web Preview</span>
            </div>
            <span className="text-[10px] text-emerald-400 font-mono">Running (Port 3000)</span>
          </div>

          {/* Sandbox Render */}
          <div className="flex-1 p-6 overflow-auto flex items-center justify-center">
            <div className="w-full max-w-md p-6 rounded-2xl bg-[#0f1422] border border-[#232938] shadow-2xl">
              <h3 className="text-base font-bold text-white mb-1">NOVA AI — Fast Checkout (India)</h3>
              <p className="text-xs text-slate-400 mb-4">
                Seamless UPI, RuPay and Net Banking integration
              </p>

              <div className="p-4 rounded-xl bg-[#161f30] space-y-2 mb-4 text-xs">
                <div className="flex justify-between text-slate-300">
                  <span>Plan Base Amount:</span>
                  <span className="font-bold text-white">₹1,999.00</span>
                </div>
                <div className="flex justify-between text-cyan-400">
                  <span>GST (18% HSN 998313):</span>
                  <span className="font-bold">₹359.82</span>
                </div>
                <div className="pt-2 border-t border-slate-700/60 flex justify-between text-emerald-400 font-bold text-sm">
                  <span>Total Payable:</span>
                  <span>₹2,358.82</span>
                </div>
              </div>

              <button className="w-full py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-semibold text-xs shadow-md shadow-indigo-600/30 transition">
                Pay via UPI FastRail (Instant)
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
