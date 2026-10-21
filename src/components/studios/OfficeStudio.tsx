'use client';

import React, { useState } from 'react';
import { DocItem, PresentationProject, SpreadsheetProject } from '@/types';
import {
  FileText,
  Presentation,
  Table2,
  Sparkles,
  Download,
  Bold,
  Italic,
  List,
  Heading1,
  Heading2,
  Plus,
  Trash2,
  BarChart3,
  Play,
  Copy,
  Check,
} from 'lucide-react';

interface OfficeStudioProps {
  initialSubTab?: 'docs' | 'slides' | 'sheets';
}

export const OfficeStudio: React.FC<OfficeStudioProps> = ({ initialSubTab = 'docs' }) => {
  const [subTab, setSubTab] = useState<'docs' | 'slides' | 'sheets'>(initialSubTab);

  // Docs State
  const [docContent, setDocContent] = useState(
    `# Strategic Framework: Scaling Digital Services in India\n\n## 1. Market Imperatives\nIndia represents the world's most dynamic digital public infrastructure (DPI) ecosystem. Leveraging Aadhaar, UPI, and Account Aggregator rails enables instantaneous customer onboarding at near-zero unit cost.\n\n## 2. Regulatory Compliance\nEvery digital service must comply with the provisions of the Digital Personal Data Protection (DPDP) Act 2023, ensuring explicit consent mechanisms and sovereign data localization where required.\n\n## 3. Financial Architecture\n- 18% GST standard SaaS treatment with verified GSTIN matching.\n- Support for RuPay cards and recurring UPI Autopay mandates up to ₹15,000 without additional factors of authentication (AFA).`
  );
  const [docTitle, setDocTitle] = useState('India Digital Expansion Whitepaper');

  // Presentation State
  const [presentation, setPresentation] = useState<PresentationProject>({
    id: 'pres-1',
    title: 'NOVA AI Investor & Product Showcase',
    theme: 'Midnight Aurora',
    updatedAt: 'Just now',
    slides: [
      {
        id: 's-1',
        title: 'NOVA AI: The Sovereign Intelligence Engine',
        subtitle: 'One intelligence. Every possibility.',
        bulletPoints: [
          'Unified Multimodality: Chat, Canvas Design, Video, Docs & Code',
          'Tailored for 1.4 Billion People: Vernacular tokenization & INR pricing',
          'Native integration with UPI, Razorpay & GST-compliant invoicing',
        ],
        speakerNotes: 'Welcome investors and introduce NOVA AI as the unified super-intelligence ecosystem for India.',
        backgroundTheme: '#0F172A',
      },
      {
        id: 's-2',
        title: 'Massive Market Opportunity in India',
        subtitle: 'From Digital India to Frontier AI Leadership',
        bulletPoints: [
          '850M+ smartphone users with highest per-capita data consumption globally',
          'SaaS & creator economy growing at 32% CAGR',
          'Tier 2 & Tier 3 cities driving 60% of new internet adoption',
        ],
        speakerNotes: 'Emphasize that our distribution focuses on frictionless Indian payment rails (UPI) and localized languages.',
        backgroundTheme: '#1E1B4B',
      },
      {
        id: 's-3',
        title: 'Sustainable Economics & Pricing Tiers',
        subtitle: 'Transparent INR Subscriptions',
        bulletPoints: [
          'PLUS Tier: ₹499/mo (Students & casual creators)',
          'PRO Tier: ₹1,999/mo (Developers, researchers & pros)',
          'ULTRA Tier: ₹10,699/mo (High-throughput enterprises)',
        ],
        speakerNotes: 'Conclude with strong unit economics and sustainable multi-tier monetization.',
        backgroundTheme: '#090D16',
      },
    ],
  });
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);

  // Spreadsheet State
  const [sheet, setSheet] = useState<SpreadsheetProject>({
    id: 'sheet-1',
    name: 'Q3 Financial Projections (INR Lakhs)',
    cols: ['A', 'B', 'C', 'D', 'E'],
    rows: 8,
    data: {
      'A1': { raw: 'Metric', computed: 'Metric' },
      'B1': { raw: 'July', computed: 'July' },
      'C1': { raw: 'August', computed: 'August' },
      'D1': { raw: 'September', computed: 'September' },
      'E1': { raw: 'Total Q3', computed: 'Total Q3' },

      'A2': { raw: 'Subscriptions (₹ L)', computed: 'Subscriptions (₹ L)' },
      'B2': { raw: '45', computed: '45' },
      'C2': { raw: '68', computed: '68' },
      'D2': { raw: '94', computed: '94' },
      'E2': { raw: '=SUM(B2:D2)', computed: '207' },

      'A3': { raw: 'API Usage (₹ L)', computed: 'API Usage (₹ L)' },
      'B3': { raw: '18', computed: '18' },
      'C3': { raw: '26', computed: '26' },
      'D3': { raw: '39', computed: '39' },
      'E3': { raw: '=SUM(B3:D3)', computed: '83' },

      'A4': { raw: 'Gross Revenue (₹ L)', computed: 'Gross Revenue (₹ L)' },
      'B4': { raw: '63', computed: '63' },
      'C4': { raw: '94', computed: '94' },
      'D4': { raw: '133', computed: '133' },
      'E4': { raw: '=SUM(B4:D4)', computed: '290' },
    },
    updatedAt: 'Just now',
  });

  const [selectedCell, setSelectedCell] = useState('B2');

  const handleCellChange = (cellKey: string, rawVal: string) => {
    let computedVal = rawVal;
    if (rawVal.startsWith('=')) {
      computedVal = 'Calculated';
    }
    setSheet({
      ...sheet,
      data: {
        ...sheet.data,
        [cellKey]: { raw: rawVal, computed: computedVal },
      },
    });
  };

  const handleExportCSV = () => {
    let csv = '';
    for (let r = 1; r <= sheet.rows; r++) {
      const rowVals = sheet.cols.map((c) => `"${sheet.data[`${c}${r}`]?.computed || ''}"`);
      csv += rowVals.join(',') + '\n';
    }
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${sheet.name.toLowerCase().replace(/\s+/g, '_')}.csv`;
    link.click();
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#08090C] overflow-hidden">
      {/* Sub-studio navigation bar */}
      <div className="h-12 px-6 bg-[#0c0e14] border-b border-[#222733] flex items-center justify-between z-10">
        <div className="flex items-center space-x-1 bg-[#141722] p-1 rounded-xl border border-[#242b3b]">
          <button
            onClick={() => setSubTab('docs')}
            className={`flex items-center space-x-2 px-3 py-1 rounded-lg text-xs font-semibold transition ${
              subTab === 'docs' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileText className="h-3.5 w-3.5" />
            <span>Documents</span>
          </button>
          <button
            onClick={() => setSubTab('slides')}
            className={`flex items-center space-x-2 px-3 py-1 rounded-lg text-xs font-semibold transition ${
              subTab === 'slides' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Presentation className="h-3.5 w-3.5" />
            <span>Presentations</span>
          </button>
          <button
            onClick={() => setSubTab('sheets')}
            className={`flex items-center space-x-2 px-3 py-1 rounded-lg text-xs font-semibold transition ${
              subTab === 'sheets' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Table2 className="h-3.5 w-3.5" />
            <span>Spreadsheet Studio</span>
          </button>
        </div>

        {/* Global Export */}
        <button
          onClick={() => {
            if (subTab === 'sheets') handleExportCSV();
            else alert(`Exporting ${subTab} to PDF/DOCX format.`);
          }}
          className="px-3 py-1.5 rounded-xl bg-[#161a25] hover:bg-[#202534] border border-[#272f42] text-slate-200 text-xs font-semibold flex items-center space-x-1.5 transition"
        >
          <Download className="h-3.5 w-3.5" />
          <span>Export {subTab.toUpperCase()}</span>
        </button>
      </div>

      {/* Main SubTab View */}
      <div className="flex-1 overflow-hidden flex flex-col">
        {/* 1. DOCUMENTS VIEW */}
        {subTab === 'docs' && (
          <div className="flex-1 flex flex-col h-full">
            <div className="p-4 bg-[#0f121a] border-b border-[#222733] flex items-center justify-between">
              <input
                type="text"
                value={docTitle}
                onChange={(e) => setDocTitle(e.target.value)}
                className="bg-transparent text-sm font-bold text-white focus:outline-none border-b border-transparent hover:border-slate-600 px-1"
              />
              <div className="flex items-center space-x-2 text-xs">
                <button
                  onClick={() =>
                    setDocContent(
                      docContent + '\n\n### AI Executive Summary\nSynthesized automatically with key takeaways.'
                    )
                  }
                  className="px-3 py-1 rounded-lg bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 font-medium hover:bg-indigo-600/30 transition flex items-center space-x-1"
                >
                  <Sparkles className="h-3 w-3" />
                  <span>AI Rewrite / Summarize</span>
                </button>
              </div>
            </div>

            <div className="flex-1 p-8 overflow-y-auto max-w-4xl mx-auto w-full">
              <textarea
                value={docContent}
                onChange={(e) => setDocContent(e.target.value)}
                className="w-full h-full min-h-[500px] bg-transparent text-sm text-slate-200 leading-relaxed font-sans focus:outline-none resize-none"
              />
            </div>
          </div>
        )}

        {/* 2. PRESENTATIONS VIEW */}
        {subTab === 'slides' && (
          <div className="flex-1 flex overflow-hidden">
            {/* Left Slide Thumbnails */}
            <div className="w-64 bg-[#0c0e14] border-r border-[#222733] p-4 space-y-3 overflow-y-auto">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-2">
                Slide Navigator ({presentation.slides.length})
              </span>
              {presentation.slides.map((sl, idx) => (
                <div
                  key={sl.id}
                  onClick={() => setActiveSlideIndex(idx)}
                  className={`p-3 rounded-xl border cursor-pointer transition ${
                    activeSlideIndex === idx
                      ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-md'
                      : 'bg-[#131622] border-[#222736] text-slate-400 hover:bg-[#1a1f2e]'
                  }`}
                >
                  <span className="text-xs font-bold block mb-1 truncate">
                    {idx + 1}. {sl.title}
                  </span>
                  <span className="text-[10px] text-slate-500">{sl.bulletPoints.length} points</span>
                </div>
              ))}
            </div>

            {/* Center Slide Viewer & Editor */}
            <div className="flex-1 bg-[#050608] p-8 flex flex-col items-center justify-center">
              <div
                className="w-full max-w-3xl aspect-video rounded-2xl p-8 border border-[#232938] shadow-2xl flex flex-col justify-between"
                style={{ backgroundColor: presentation.slides[activeSlideIndex]?.backgroundTheme || '#090D16' }}
              >
                <div>
                  <h2 className="text-2xl font-extrabold text-white mb-2">
                    {presentation.slides[activeSlideIndex]?.title}
                  </h2>
                  <p className="text-sm font-semibold text-indigo-400 mb-6">
                    {presentation.slides[activeSlideIndex]?.subtitle}
                  </p>
                  <ul className="space-y-3">
                    {presentation.slides[activeSlideIndex]?.bulletPoints.map((bp, i) => (
                      <li key={i} className="flex items-start space-x-2 text-xs md:text-sm text-slate-200">
                        <span className="text-indigo-400 font-bold">•</span>
                        <span>{bp}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-500 pt-4 border-t border-white/10">
                  <span>NOVA AI Confidential</span>
                  <span>Slide {activeSlideIndex + 1} of {presentation.slides.length}</span>
                </div>
              </div>

              {/* Presenter Notes */}
              <div className="w-full max-w-3xl mt-4 p-3 rounded-xl bg-[#0e1119] border border-[#222733] text-xs text-slate-400">
                <span className="font-bold text-slate-300 mr-2">Speaker Notes:</span>
                {presentation.slides[activeSlideIndex]?.speakerNotes}
              </div>
            </div>
          </div>
        )}

        {/* 3. SPREADSHEET STUDIO VIEW */}
        {subTab === 'sheets' && (
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Formula bar */}
            <div className="px-6 py-2.5 bg-[#0f121a] border-b border-[#222733] flex items-center space-x-3 text-xs">
              <span className="font-mono text-indigo-400 font-bold w-10 text-center">
                {selectedCell}
              </span>
              <input
                type="text"
                value={sheet.data[selectedCell]?.raw || ''}
                onChange={(e) => handleCellChange(selectedCell, e.target.value)}
                placeholder="Enter value or formula like =SUM(B2:D2)"
                className="flex-1 bg-[#161a25] border border-[#242b3b] rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            {/* Grid */}
            <div className="flex-1 overflow-auto p-6">
              <table className="w-full border-collapse border border-[#222733] text-xs text-slate-200 font-sans">
                <thead>
                  <tr className="bg-[#121520]">
                    <th className="border border-[#222733] p-2 w-12 text-slate-500 font-mono">#</th>
                    {sheet.cols.map((col) => (
                      <th
                        key={col}
                        className="border border-[#222733] p-2 text-center text-slate-400 font-mono font-bold"
                      >
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {Array.from({ length: sheet.rows }).map((_, rIdx) => {
                    const rowNum = rIdx + 1;
                    return (
                      <tr key={rowNum} className="hover:bg-[#141824]">
                        <td className="border border-[#222733] p-2 text-center text-slate-500 font-mono bg-[#0f121a]">
                          {rowNum}
                        </td>
                        {sheet.cols.map((col) => {
                          const cellKey = `${col}${rowNum}`;
                          const cellData = sheet.data[cellKey];
                          const isSelected = selectedCell === cellKey;

                          return (
                            <td
                              key={cellKey}
                              onClick={() => setSelectedCell(cellKey)}
                              className={`border border-[#222733] p-2.5 cursor-pointer transition ${
                                isSelected
                                  ? 'bg-indigo-600/20 outline outline-2 outline-indigo-500 text-white font-semibold'
                                  : ''
                              }`}
                            >
                              {cellData?.computed || ''}
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              {/* Chart Visualizer */}
              <div className="mt-8 p-5 rounded-2xl bg-[#12151f] border border-[#222736] max-w-2xl">
                <div className="flex items-center space-x-2 mb-3">
                  <BarChart3 className="h-4 w-4 text-cyan-400" />
                  <h4 className="text-xs font-bold text-white">Dynamic Chart Preview (Q3 Revenue)</h4>
                </div>
                <div className="h-40 flex items-end space-x-6 pt-4 border-b border-slate-700/60 pb-2">
                  <div className="flex-1 flex flex-col items-center">
                    <div className="w-12 bg-indigo-500 rounded-t-lg h-20 mb-2 transition-all" />
                    <span className="text-[11px] text-slate-400">July (₹63L)</span>
                  </div>
                  <div className="flex-1 flex flex-col items-center">
                    <div className="w-12 bg-indigo-500 rounded-t-lg h-28 mb-2 transition-all" />
                    <span className="text-[11px] text-slate-400">August (₹94L)</span>
                  </div>
                  <div className="flex-1 flex flex-col items-center">
                    <div className="w-12 bg-cyan-400 rounded-t-lg h-36 mb-2 transition-all" />
                    <span className="text-[11px] text-slate-400">Sept (₹133L)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
