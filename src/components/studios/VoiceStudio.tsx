'use client';

import React, { useState } from 'react';
import { Mic, Volume2, Play, Pause, Sparkles, Download, Sliders, Radio } from 'lucide-react';

export const VoiceStudio: React.FC = () => {
  const [text, setText] = useState(
    'Namaste and welcome to NOVA AI. We are building the future of sovereign artificial intelligence for India and the world.'
  );
  const [selectedVoice, setSelectedVoice] = useState('aditi');
  const [isPlaying, setIsPlaying] = useState(false);
  const [isSynthesizing, setIsSynthesizing] = useState(false);

  const voices = [
    { id: 'aditi', name: 'Aditi', lang: 'Indian English (Natural)', tone: 'Warm & Professional' },
    { id: 'rohan', name: 'Rohan', lang: 'Hindi & English Bilingual', tone: 'Energetic & Crisp' },
    { id: 'priya', name: 'Priya', lang: 'Indian English (Corporate)', tone: 'Authoritative & Calm' },
    { id: 'arjun', name: 'Arjun', lang: 'Hindi Formal', tone: 'Narrative & Deep' },
  ];

  const handleSynthesize = () => {
    setIsSynthesizing(true);
    setTimeout(() => {
      setIsSynthesizing(false);
      setIsPlaying(true);
    }, 1200);
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#08090C] overflow-hidden">
      <div className="p-6 bg-[#0c0e14] border-b border-[#222733] space-y-4">
        <div className="flex items-center space-x-3">
          <div className="h-9 w-9 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center">
            <Mic className="h-5 w-5 text-indigo-400" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white">Voice & Speech Studio</h2>
            <p className="text-xs text-slate-400">
              Indian English & regional text-to-speech synthesis with expressive prosody.
            </p>
          </div>
        </div>

        {/* Text Input */}
        <div className="rounded-2xl bg-[#131622] border border-[#252c3d] p-3">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={3}
            placeholder="Enter script to convert into lifelike Indian or global speech..."
            className="w-full bg-transparent text-sm text-slate-100 placeholder-slate-500 resize-none focus:outline-none"
          />

          <div className="flex items-center justify-between pt-2 border-t border-[#202534] mt-1">
            <div className="flex items-center space-x-2">
              <span className="text-xs text-slate-400">Voice:</span>
              <select
                value={selectedVoice}
                onChange={(e) => setSelectedVoice(e.target.value)}
                className="bg-[#181d2a] border border-[#262c3e] rounded-xl px-3 py-1 text-xs text-indigo-300 font-medium focus:outline-none"
              >
                {voices.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.name} — {v.lang}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={handleSynthesize}
              disabled={isSynthesizing || !text.trim()}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500 hover:opacity-90 disabled:opacity-40 text-white font-semibold text-xs shadow-md shadow-indigo-600/30 flex items-center space-x-2 transition"
            >
              <Sparkles className="h-4 w-4" />
              <span>{isSynthesizing ? 'Synthesizing Audio...' : 'Generate Voice'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Audio Waveform & Player Console */}
      <div className="flex-1 p-8 flex flex-col items-center justify-center">
        <div className="w-full max-w-xl p-8 rounded-3xl bg-[#10131d] border border-[#232938] shadow-2xl flex flex-col items-center space-y-6">
          {/* Animated Waveform Visualizer */}
          <div className="flex items-center justify-center space-x-1.5 h-20 w-full px-8">
            {Array.from({ length: 28 }).map((_, i) => {
              const height = isPlaying
                ? Math.sin((i / 28) * Math.PI) * 55 + (i % 3) * 8 + 12
                : 10 + (i % 4) * 6;
              return (
                <div
                  key={i}
                  style={{ height: `${height}px` }}
                  className={`w-2 rounded-full transition-all duration-150 ${
                    isPlaying
                      ? 'bg-gradient-to-t from-indigo-500 to-cyan-400'
                      : 'bg-[#22283a]'
                  }`}
                />
              );
            })}
          </div>

          <div className="text-center">
            <h4 className="text-sm font-bold text-white mb-1">
              Voice: {voices.find((v) => v.id === selectedVoice)?.name} ({voices.find((v) => v.id === selectedVoice)?.tone})
            </h4>
            <p className="text-xs text-slate-400">24kHz Studio Quality WAV • AI Prosody Model v2</p>
          </div>

          {/* Controls */}
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="h-12 w-12 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white flex items-center justify-center shadow-lg shadow-indigo-600/30 transition"
            >
              {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5 ml-0.5" />}
            </button>
            <button
              onClick={() => alert('Downloaded audio file as MP3')}
              className="p-3 rounded-full bg-[#181d2a] hover:bg-[#222838] text-slate-300 border border-[#262c3e] transition"
              title="Download Audio"
            >
              <Download className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
