'use client';

import React, { useState } from 'react';
import { GeneratedImage } from '@/types';
import {
  Sparkles,
  Download,
  Share2,
  Maximize2,
  Layers,
  Wand2,
  Copy,
  Check,
  RefreshCw,
  Image as ImageIcon,
} from 'lucide-react';

interface ImageStudioProps {
  onOpenInDesign?: (imageUrl: string) => void;
}

export const ImageStudio: React.FC<ImageStudioProps> = ({ onOpenInDesign }) => {
  const [prompt, setPrompt] = useState(
    'Hyper-realistic futuristic cityscape of New Delhi with solar towers and aerial electric metros at sunset'
  );
  const [style, setStyle] = useState('Photorealistic');
  const [aspectRatio, setAspectRatio] = useState('16:9');
  const [resolution, setResolution] = useState('1920x1080');
  const [isGenerating, setIsGenerating] = useState(false);
  const [gallery, setGallery] = useState<GeneratedImage[]>([
    {
      id: 'init-1',
      prompt: 'Hyper-realistic futuristic cityscape of New Delhi with solar towers and aerial electric metros at sunset',
      style: 'Photorealistic',
      aspectRatio: '16:9',
      resolution: '1920x1080',
      imageUrl: 'data:image/svg+xml;utf8,' + encodeURIComponent(`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1280 720" width="1280" height="720">
          <defs>
            <linearGradient id="sky" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stop-color="#1e1b4b" />
              <stop offset="50%" stop-color="#4338ca" />
              <stop offset="100%" stop-color="#f59e0b" />
            </linearGradient>
          </defs>
          <rect width="1280" height="720" fill="url(#sky)" />
          <circle cx="640" cy="500" r="160" fill="#fef08a" opacity="0.8" />
          <polygon points="100,720 250,340 400,720" fill="#0f172a" />
          <polygon points="350,720 500,280 650,720" fill="#1e293b" />
          <polygon points="600,720 800,220 1000,720" fill="#0f172a" />
          <polygon points="900,720 1050,380 1200,720" fill="#1e293b" />
          <text x="640" y="660" font-family="system-ui" font-size="28" font-weight="bold" fill="#ffffff" text-anchor="middle">
            NOVA AI • BHARAT 2035 METROPOLIS
          </text>
        </svg>
      `),
      createdAt: 'Just now',
    },
  ]);

  const stylePresets = [
    { name: 'Photorealistic', icon: '📸', desc: '8K photographic realism' },
    { name: 'Cyberpunk', icon: '🌆', desc: 'Neon glows & synthwave' },
    { name: '3D Render', icon: '🧊', desc: 'Octane 3D shading & depth' },
    { name: 'Anime', icon: '✨', desc: 'Vibrant modern Japanese animation' },
    { name: 'Watercolor', icon: '🎨', desc: 'Soft organic pigment washes' },
  ];

  const aspectRatios = [
    { label: '16:9 Landscape', val: '16:9' },
    { label: '1:1 Square', val: '1:1' },
    { label: '9:16 Mobile Reel', val: '9:16' },
    { label: '4:3 Classic', val: '4:3' },
  ];

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);

    try {
      const res = await fetch('/api/ai/image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, style, aspectRatio, resolution }),
      });

      const data = await res.json();
      if (data.success && data.image) {
        setGallery([data.image, ...gallery]);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsGenerating(false);
    }
  };

  const surprisePrompts = [
    'Traditional Indian Kathakali dancer integrated with neon cybernetic exoskeleton, studio lighting',
    'A high-tech sustainable tea estate in Darjeeling managed by automated drones at sunrise',
    'Ancient Chand Baori stepwell reimagined as a quantum computational data center',
    'Chai stall on Mars with astronauts drinking ginger tea overlooking Martian dunes',
  ];

  return (
    <div className="flex-1 flex flex-col h-full bg-[#08090C] overflow-hidden">
      {/* Top Controls Area */}
      <div className="p-6 bg-[#0c0e14] border-b border-[#222733] space-y-4">
        {/* Prompt Input Box */}
        <div className="relative rounded-2xl bg-[#131622] border border-[#252c3d] focus-within:border-indigo-500 shadow-xl p-3">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            rows={2}
            placeholder="Describe what you want to create in vivid visual detail..."
            className="w-full bg-transparent text-sm text-slate-100 placeholder-slate-500 resize-none focus:outline-none"
          />

          <div className="flex items-center justify-between pt-2 border-t border-[#202534] mt-1">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setPrompt(surprisePrompts[Math.floor(Math.random() * surprisePrompts.length)])}
                className="flex items-center space-x-1.5 px-3 py-1 rounded-xl bg-[#1c2130] hover:bg-[#252c40] text-xs font-medium text-amber-300 transition"
              >
                <Wand2 className="h-3.5 w-3.5" />
                <span>Surprise Me</span>
              </button>
            </div>

            <button
              onClick={handleGenerate}
              disabled={isGenerating || !prompt.trim()}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 hover:opacity-90 disabled:opacity-40 text-white font-semibold text-xs shadow-lg shadow-indigo-600/30 flex items-center space-x-2 transition"
            >
              <Sparkles className="h-4 w-4" />
              <span>{isGenerating ? 'Synthesizing...' : 'Generate Visual'}</span>
            </button>
          </div>
        </div>

        {/* Style & Aspect Ratio Pickers */}
        <div className="flex flex-wrap items-center justify-between gap-4 text-xs">
          {/* Style Presets */}
          <div className="flex items-center space-x-2 overflow-x-auto">
            <span className="text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
              Style:
            </span>
            {stylePresets.map((st) => (
              <button
                key={st.name}
                onClick={() => setStyle(st.name)}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border transition ${
                  style === st.name
                    ? 'bg-indigo-600/20 border-indigo-500 text-white'
                    : 'bg-[#141722] border-[#242b3b] text-slate-400 hover:text-slate-200'
                }`}
              >
                <span>{st.icon}</span>
                <span>{st.name}</span>
              </button>
            ))}
          </div>

          {/* Aspect Ratio */}
          <div className="flex items-center space-x-2">
            <span className="text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
              Ratio:
            </span>
            <div className="flex bg-[#141722] p-1 rounded-xl border border-[#242b3b]">
              {aspectRatios.map((ar) => (
                <button
                  key={ar.val}
                  onClick={() => setAspectRatio(ar.val)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition ${
                    aspectRatio === ar.val
                      ? 'bg-indigo-600 text-white'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {ar.val}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Gallery Scroll View */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white flex items-center space-x-2">
            <span>Generated Gallery</span>
            <span className="text-xs text-slate-500 font-normal">({gallery.length} results)</span>
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {gallery.map((img) => (
            <div
              key={img.id}
              className="group relative rounded-2xl bg-[#12151f] border border-[#222736] overflow-hidden shadow-xl hover:border-indigo-500/50 transition-all"
            >
              {/* Image Preview Container */}
              <div className="relative aspect-video bg-[#05070a] overflow-hidden flex items-center justify-center">
                <img
                  src={img.imageUrl}
                  alt={img.prompt}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />

                {/* Hover overlay actions */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center space-x-3 transition-opacity">
                  <a
                    href={img.imageUrl}
                    download={`nova-image-${img.id}.svg`}
                    className="p-2.5 rounded-xl bg-white/20 hover:bg-white text-white hover:text-black backdrop-blur-md transition shadow-lg"
                    title="Download Asset"
                  >
                    <Download className="h-4 w-4" />
                  </a>
                </div>
              </div>

              {/* Image Details Footer */}
              <div className="p-4 space-y-2">
                <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                  "{img.prompt}"
                </p>
                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-[#202534]">
                  <span className="px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 font-medium border border-indigo-500/20">
                    {img.style} • {img.aspectRatio}
                  </span>
                  <span>{img.createdAt}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
