'use client';

import React, { useState } from 'react';
import { VideoProject, VideoScene } from '@/types';
import {
  Film,
  Play,
  Pause,
  Plus,
  Trash2,
  Sparkles,
  Download,
  Clock,
  Layers,
  Sliders,
  Volume2,
  Tv,
  Smartphone,
} from 'lucide-react';

export const VideoStudio: React.FC = () => {
  const [project, setProject] = useState<VideoProject>({
    id: 'vid-1',
    title: 'NOVA AI Launch: Bharat Digital Leap',
    aspectRatio: '16:9',
    totalDuration: 18,
    status: 'draft',
    createdAt: 'Just now',
    scenes: [
      {
        id: 'scene-1',
        sceneNumber: 1,
        title: 'Opening Panorama: Indian Innovation Hubs',
        narration: 'From Bengaluru to Gurugram, a quiet revolution is redefining intelligence across the subcontinent.',
        visualPrompt: 'Cinematic drone shot over illuminated tech parks in Bengaluru with glowing fiber optic lines connecting cities.',
        duration: 5,
        status: 'ready',
        videoPreviewUrl: '',
      },
      {
        id: 'scene-2',
        sceneNumber: 2,
        title: 'Unified Multimodality in Action',
        narration: 'One intelligence powering code, designs, presentations, and autonomous workflows in seamless harmony.',
        visualPrompt: 'Dynamic 3D UI interface exploding into particles, morphing between code editor, vector graphics, and live analytics.',
        duration: 6,
        status: 'ready',
        videoPreviewUrl: '',
      },
      {
        id: 'scene-3',
        sceneNumber: 3,
        title: 'Call to Action: NOVA AI',
        narration: 'Experience the future today. One intelligence. Every possibility.',
        visualPrompt: 'Bold neon typography zooming into camera with glowing aurora horizon and NOVA AI emblem.',
        duration: 7,
        status: 'ready',
        videoPreviewUrl: '',
      },
    ],
  });

  const [activeSceneIndex, setActiveSceneIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isRendering, setIsRendering] = useState(false);
  const [renderProgress, setRenderProgress] = useState(0);

  const activeScene = project.scenes[activeSceneIndex];

  const handleAddScene = () => {
    const newScene: VideoScene = {
      id: `scene-${Date.now()}`,
      sceneNumber: project.scenes.length + 1,
      title: `Scene ${project.scenes.length + 1}: Custom Sequence`,
      narration: 'Enter custom voiceover narration or sound cues for this sequence...',
      visualPrompt: 'Enter prompt for external generative video diffusion model...',
      duration: 5,
      status: 'ready',
    };
    const updatedScenes = [...project.scenes, newScene];
    const totalDuration = updatedScenes.reduce((acc, sc) => acc + sc.duration, 0);
    setProject({ ...project, scenes: updatedScenes, totalDuration });
    setActiveSceneIndex(updatedScenes.length - 1);
  };

  const handleUpdateActiveScene = (updates: Partial<VideoScene>) => {
    const updatedScenes = project.scenes.map((sc, i) =>
      i === activeSceneIndex ? { ...sc, ...updates } : sc
    );
    const totalDuration = updatedScenes.reduce((acc, sc) => acc + sc.duration, 0);
    setProject({ ...project, scenes: updatedScenes, totalDuration });
  };

  const handleDeleteActiveScene = () => {
    if (project.scenes.length <= 1) return;
    const updated = project.scenes.filter((_, i) => i !== activeSceneIndex);
    const totalDuration = updated.reduce((acc, sc) => acc + sc.duration, 0);
    setProject({ ...project, scenes: updated, totalDuration });
    setActiveSceneIndex(0);
  };

  const handleRenderVideo = () => {
    setIsRendering(true);
    setRenderProgress(10);
    const interval = setInterval(() => {
      setRenderProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsRendering(false);
          alert('Video rendered successfully! Ready for MP4 export.');
          return 100;
        }
        return prev + 15;
      });
    }, 400);
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#08090C] overflow-hidden select-none">
      {/* Top Header Bar */}
      <div className="h-14 px-6 bg-[#0e1118] border-b border-[#222733] flex items-center justify-between z-10">
        <div className="flex items-center space-x-3">
          <Film className="h-5 w-5 text-indigo-400" />
          <input
            type="text"
            value={project.title}
            onChange={(e) => setProject({ ...project, title: e.target.value })}
            className="bg-transparent text-sm font-bold text-white border-b border-transparent hover:border-slate-600 focus:border-indigo-500 focus:outline-none"
          />
          <span className="text-xs text-slate-500 font-mono">
            {project.scenes.length} Scenes • {project.totalDuration}s Total
          </span>
        </div>

        {/* Aspect Ratio Switcher */}
        <div className="flex items-center space-x-2">
          <div className="flex bg-[#161a25] p-1 rounded-xl border border-[#242b3b]">
            <button
              onClick={() => setProject({ ...project, aspectRatio: '16:9' })}
              className={`flex items-center space-x-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition ${
                project.aspectRatio === '16:9'
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Tv className="h-3 w-3" />
              <span>16:9 YouTube / Web</span>
            </button>
            <button
              onClick={() => setProject({ ...project, aspectRatio: '9:16' })}
              className={`flex items-center space-x-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition ${
                project.aspectRatio === '9:16'
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Smartphone className="h-3 w-3" />
              <span>9:16 Reels / Shorts</span>
            </button>
          </div>

          <button
            onClick={handleRenderVideo}
            disabled={isRendering}
            className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500 hover:opacity-90 disabled:opacity-40 text-white text-xs font-semibold shadow-md shadow-indigo-600/30 flex items-center space-x-1.5 transition"
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>{isRendering ? `Queue Rendering (${renderProgress}%)` : 'Render Full Video'}</span>
          </button>
        </div>
      </div>

      {/* Main Workspace (Preview + Scene Inspector) */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Video Player Preview */}
        <div className="flex-1 bg-[#050608] p-6 flex flex-col items-center justify-center relative">
          <div
            className={`relative rounded-2xl bg-[#0c0e14] border border-[#232938] overflow-hidden shadow-2xl flex flex-col items-center justify-center ${
              project.aspectRatio === '16:9'
                ? 'w-full max-w-3xl aspect-video'
                : 'h-full max-h-[480px] aspect-[9/16]'
            }`}
          >
            {/* Visual simulation canvas */}
            <div className="absolute inset-0 bg-gradient-to-tr from-indigo-950 via-[#0d111a] to-[#1e1b4b] flex flex-col items-center justify-center p-8 text-center">
              <div className="h-16 w-16 rounded-full bg-indigo-500/20 border border-indigo-400/40 flex items-center justify-center mb-4">
                <Film className="h-8 w-8 text-indigo-400" />
              </div>
              <h3 className="text-base font-bold text-white mb-2">
                {activeScene?.title || 'Sequence Preview'}
              </h3>
              <p className="text-xs text-slate-400 max-w-md italic mb-4">
                "{activeScene?.visualPrompt}"
              </p>
              <div className="px-3 py-1 rounded-full bg-black/40 border border-white/10 text-xs text-indigo-300 font-mono">
                Duration: {activeScene?.duration}s • Scene {activeSceneIndex + 1} of {project.scenes.length}
              </div>
            </div>

            {/* Play/Pause Button Overlay */}
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="absolute bottom-4 left-4 p-3 rounded-full bg-black/60 hover:bg-indigo-600 text-white backdrop-blur-md transition shadow-lg"
            >
              {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {/* Right Storyboard Scene Editor */}
        <div className="w-96 bg-[#0c0e14] border-l border-[#222733] p-5 flex flex-col justify-between overflow-y-auto">
          {activeScene ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-[#222733] pb-3">
                <span className="text-xs font-bold text-white uppercase tracking-wider">
                  Scene {activeSceneIndex + 1} Parameters
                </span>
                <button
                  onClick={handleDeleteActiveScene}
                  disabled={project.scenes.length <= 1}
                  className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 disabled:opacity-30 transition"
                  title="Delete Scene"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                  Scene Title
                </label>
                <input
                  type="text"
                  value={activeScene.title}
                  onChange={(e) => handleUpdateActiveScene({ title: e.target.value })}
                  className="w-full bg-[#161a25] border border-[#262c3e] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                  Voiceover & Narration Script
                </label>
                <textarea
                  value={activeScene.narration}
                  onChange={(e) => handleUpdateActiveScene({ narration: e.target.value })}
                  rows={3}
                  className="w-full bg-[#161a25] border border-[#262c3e] rounded-xl p-3 text-xs text-white focus:outline-none focus:border-indigo-500 resize-none"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                  AI Visual Prompt (Diffusion Engine)
                </label>
                <textarea
                  value={activeScene.visualPrompt}
                  onChange={(e) => handleUpdateActiveScene({ visualPrompt: e.target.value })}
                  rows={3}
                  className="w-full bg-[#161a25] border border-[#262c3e] rounded-xl p-3 text-xs text-white focus:outline-none focus:border-indigo-500 resize-none"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                  Scene Duration (Seconds)
                </label>
                <input
                  type="number"
                  min={2}
                  max={30}
                  value={activeScene.duration}
                  onChange={(e) => handleUpdateActiveScene({ duration: parseInt(e.target.value) || 3 })}
                  className="w-full bg-[#161a25] border border-[#262c3e] rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                />
              </div>
            </div>
          ) : null}

          <div className="pt-4 border-t border-[#222733]">
            <button
              onClick={handleAddScene}
              className="w-full py-2.5 rounded-xl bg-[#181d2a] hover:bg-[#222838] border border-[#262c3e] text-indigo-300 font-semibold text-xs flex items-center justify-center space-x-2 transition"
            >
              <Plus className="h-4 w-4" />
              <span>Add Next Storyboard Scene</span>
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Timeline Multi-Track Sequencer */}
      <div className="h-36 bg-[#0a0c12] border-t border-[#222733] px-6 py-3 flex flex-col justify-between">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center space-x-2 font-mono">
            <Clock className="h-3.5 w-3.5 text-indigo-400" />
            <span>00:00 / 00:{project.totalDuration < 10 ? `0${project.totalDuration}` : project.totalDuration}</span>
          </div>
          <span className="text-[10px] uppercase font-bold text-slate-500">
            Multi-Track Timeline (Video + Audio)
          </span>
        </div>

        {/* Video Track */}
        <div className="flex items-center space-x-2 overflow-x-auto py-1">
          {project.scenes.map((sc, i) => (
            <div
              key={sc.id}
              onClick={() => setActiveSceneIndex(i)}
              className={`h-16 shrink-0 rounded-xl p-2.5 flex flex-col justify-between cursor-pointer border transition-all ${
                activeSceneIndex === i
                  ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-lg'
                  : 'bg-[#141722] border-[#222736] text-slate-400 hover:bg-[#1a1f2e]'
              }`}
              style={{ width: `${Math.max(140, sc.duration * 32)}px` }}
            >
              <span className="text-[11px] font-bold truncate">
                {i + 1}. {sc.title}
              </span>
              <div className="flex items-center justify-between text-[10px] text-slate-400">
                <span>{sc.duration}s</span>
                <span className="text-[9px] px-1 rounded bg-indigo-500/20 text-indigo-300">
                  Cut
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
