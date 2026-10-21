'use client';

import React, { useState, useRef } from 'react';
import { CanvasElement, DesignProject } from '@/types';
import { SAMPLE_TEMPLATES } from '@/lib/constants';
import {
  Type,
  Square,
  Circle as CircleIcon,
  Sparkles,
  Download,
  Undo2,
  Redo2,
  ZoomIn,
  ZoomOut,
  Layers,
  Lock,
  Unlock,
  Trash2,
  Copy,
  Palette,
  Image as ImageIcon,
  ArrowUp,
  ArrowDown,
  Layout,
  Star,
  Check,
} from 'lucide-react';

export const DesignStudio: React.FC = () => {
  const [project, setProject] = useState<DesignProject>({
    id: 'proj-1',
    title: 'Diwali Dhamaka Social Campaign',
    width: 800,
    height: 800,
    backgroundColor: '#0F131E',
    elements: [...SAMPLE_TEMPLATES[0].elements],
    updatedAt: 'Just now',
  });

  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  const [activeSidebarTab, setActiveSidebarTab] = useState<'templates' | 'text' | 'shapes' | 'brand' | 'layers'>('templates');
  const [isExporting, setIsExporting] = useState(false);
  const [draggedElementId, setDraggedElementId] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  const canvasRef = useRef<SVGSVGElement>(null);

  const selectedElement = project.elements.find((el) => el.id === selectedElementId);

  // Template loader
  const loadTemplate = (tmpl: typeof SAMPLE_TEMPLATES[0]) => {
    setProject({
      ...project,
      title: tmpl.name,
      width: tmpl.width,
      height: tmpl.height,
      elements: JSON.parse(JSON.stringify(tmpl.elements)),
      updatedAt: 'Just now',
    });
    setSelectedElementId(null);
  };

  // Add Element functions
  const addText = (textValue = 'Add a heading', fontSize = 32, fontWeight = 'bold') => {
    const newEl: CanvasElement = {
      id: `text-${Date.now()}`,
      type: 'text',
      x: 100,
      y: 100 + project.elements.length * 20,
      width: 400,
      height: 60,
      text: textValue,
      fontSize,
      fontWeight,
      fill: '#FFFFFF',
      fontFamily: 'Inter, sans-serif',
      textAlign: 'left',
      zIndex: project.elements.length + 1,
    };
    setProject({ ...project, elements: [...project.elements, newEl] });
    setSelectedElementId(newEl.id);
  };

  const addShape = (shapeType: 'rect' | 'circle', fill = '#4F46E5') => {
    const newEl: CanvasElement = {
      id: `shape-${Date.now()}`,
      type: shapeType,
      x: 150,
      y: 150,
      width: 160,
      height: 160,
      fill,
      stroke: '#FFFFFF',
      strokeWidth: 0,
      opacity: 1,
      zIndex: project.elements.length + 1,
    };
    setProject({ ...project, elements: [...project.elements, newEl] });
    setSelectedElementId(newEl.id);
  };

  // Modify Selected Element
  const updateSelectedElement = (updates: Partial<CanvasElement>) => {
    if (!selectedElementId) return;
    setProject({
      ...project,
      elements: project.elements.map((el) =>
        el.id === selectedElementId ? { ...el, ...updates } : el
      ),
    });
  };

  // Delete Element
  const deleteSelectedElement = () => {
    if (!selectedElementId) return;
    setProject({
      ...project,
      elements: project.elements.filter((el) => el.id !== selectedElementId),
    });
    setSelectedElementId(null);
  };

  // Duplicate Element
  const duplicateSelectedElement = () => {
    if (!selectedElement) return;
    const duplicated: CanvasElement = {
      ...selectedElement,
      id: `${selectedElement.type}-${Date.now()}`,
      x: selectedElement.x + 20,
      y: selectedElement.y + 20,
      zIndex: project.elements.length + 1,
    };
    setProject({ ...project, elements: [...project.elements, duplicated] });
    setSelectedElementId(duplicated.id);
  };

  // Layer Ordering
  const bringForward = () => {
    if (!selectedElementId) return;
    updateSelectedElement({ zIndex: (selectedElement?.zIndex || 0) + 1 });
  };

  const sendBackward = () => {
    if (!selectedElementId) return;
    updateSelectedElement({ zIndex: Math.max(0, (selectedElement?.zIndex || 1) - 1) });
  };

  // Mouse Interaction for Dragging on Canvas
  const handleMouseDown = (e: React.MouseEvent, elementId: string) => {
    e.stopPropagation();
    setSelectedElementId(elementId);
    setDraggedElementId(elementId);

    const el = project.elements.find((item) => item.id === elementId);
    if (!el || el.isLocked) return;

    if (canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      const mouseX = (e.clientX - rect.left) / zoom;
      const mouseY = (e.clientY - rect.top) / zoom;
      setDragOffset({ x: mouseX - el.x, y: mouseY - el.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!draggedElementId || !canvasRef.current) return;
    const el = project.elements.find((item) => item.id === draggedElementId);
    if (!el || el.isLocked) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const mouseX = (e.clientX - rect.left) / zoom;
    const mouseY = (e.clientY - rect.top) / zoom;

    const newX = Math.round(mouseX - dragOffset.x);
    const newY = Math.round(mouseY - dragOffset.y);

    setProject({
      ...project,
      elements: project.elements.map((item) =>
        item.id === draggedElementId ? { ...item, x: newX, y: newY } : item
      ),
    });
  };

  const handleMouseUp = () => {
    setDraggedElementId(null);
  };

  // Export functions (SVG & PNG download)
  const exportDesign = (format: 'svg' | 'png') => {
    setIsExporting(true);
    try {
      if (format === 'svg') {
        const svgElement = canvasRef.current;
        if (!svgElement) return;
        const serializer = new XMLSerializer();
        const svgString = serializer.serializeToString(svgElement);
        const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${project.title.toLowerCase().replace(/\s+/g, '_')}.svg`;
        link.click();
      } else {
        // Direct PNG Export via SVG rasterization on canvas
        const svgElement = canvasRef.current;
        if (!svgElement) return;
        const serializer = new XMLSerializer();
        const svgString = serializer.serializeToString(svgElement);
        const img = new Image();
        const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
        const url = URL.createObjectURL(svgBlob);

        img.onload = () => {
          const canvas = document.createElement('canvas');
          canvas.width = project.width;
          canvas.height = project.height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0);
            const pngUrl = canvas.toDataURL('image/png');
            const link = document.createElement('a');
            link.href = pngUrl;
            link.download = `${project.title.toLowerCase().replace(/\s+/g, '_')}.png`;
            link.click();
          }
        };
        img.src = url;
      }
    } finally {
      setTimeout(() => setIsExporting(false), 800);
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#08090C] overflow-hidden select-none">
      {/* Top Studio Control Bar */}
      <div className="h-14 px-5 bg-[#0e1118] border-b border-[#222733] flex items-center justify-between z-10">
        <div className="flex items-center space-x-4">
          <input
            type="text"
            value={project.title}
            onChange={(e) => setProject({ ...project, title: e.target.value })}
            className="bg-transparent text-sm font-bold text-white border-b border-transparent hover:border-slate-600 focus:border-indigo-500 focus:outline-none px-1"
          />
          <span className="text-xs text-slate-500 font-mono">
            {project.width} × {project.height}px
          </span>
        </div>

        {/* Center Canvas Tools */}
        <div className="flex items-center space-x-2 bg-[#151923] px-2 py-1 rounded-xl border border-[#242b3b]">
          <button
            onClick={() => setZoom(Math.max(0.4, zoom - 0.1))}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg transition"
            title="Zoom Out"
          >
            <ZoomOut className="h-4 w-4" />
          </button>
          <span className="text-xs font-mono text-slate-300 w-12 text-center">
            {Math.round(zoom * 100)}%
          </span>
          <button
            onClick={() => setZoom(Math.min(2, zoom + 0.1))}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg transition"
            title="Zoom In"
          >
            <ZoomIn className="h-4 w-4" />
          </button>
        </div>

        {/* Export Buttons */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => exportDesign('svg')}
            className="px-3 py-1.5 rounded-xl bg-[#181d2a] hover:bg-[#222838] text-slate-200 text-xs font-semibold border border-[#272f42] transition"
          >
            Export SVG
          </button>
          <button
            onClick={() => exportDesign('png')}
            disabled={isExporting}
            className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white text-xs font-semibold shadow-md shadow-indigo-600/30 flex items-center space-x-1.5 transition"
          >
            <Download className="h-3.5 w-3.5" />
            <span>{isExporting ? 'Exporting...' : 'Export High-Res PNG'}</span>
          </button>
        </div>
      </div>

      {/* Main Workspace Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Toolbar / Asset Library */}
        <div className="w-80 bg-[#0c0e14] border-r border-[#222733] flex flex-col">
          {/* Tool Selector Tabs */}
          <div className="flex border-b border-[#222733] bg-[#10131b]">
            {[
              { id: 'templates', label: 'Templates', icon: Layout },
              { id: 'text', label: 'Text', icon: Type },
              { id: 'shapes', label: 'Shapes', icon: Square },
              { id: 'brand', label: 'Brand Kit', icon: Palette },
              { id: 'layers', label: 'Layers', icon: Layers },
            ].map((t) => {
              const Icon = t.icon;
              return (
                <button
                  key={t.id}
                  onClick={() => setActiveSidebarTab(t.id as any)}
                  className={`flex-1 py-3 flex flex-col items-center justify-center text-[10px] font-medium transition ${
                    activeSidebarTab === t.id
                      ? 'text-indigo-400 border-b-2 border-indigo-500 bg-[#161a25]'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Icon className="h-4 w-4 mb-1" />
                  <span>{t.label}</span>
                </button>
              );
            })}
          </div>

          {/* Tab Panel Content */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {activeSidebarTab === 'templates' && (
              <div className="space-y-3">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  India & Global Templates
                </p>
                {SAMPLE_TEMPLATES.map((tmpl) => (
                  <div
                    key={tmpl.id}
                    onClick={() => loadTemplate(tmpl)}
                    className="p-3 rounded-xl bg-[#141722] hover:bg-[#1c2130] border border-[#242b3b] hover:border-indigo-500/40 cursor-pointer transition group"
                  >
                    <div className="flex items-center space-x-3 mb-1">
                      <span className="text-2xl">{tmpl.thumbnail}</span>
                      <div>
                        <h4 className="text-xs font-bold text-slate-200 group-hover:text-indigo-400 transition">
                          {tmpl.name}
                        </h4>
                        <span className="text-[10px] text-slate-500">
                          {tmpl.category} • {tmpl.width}x{tmpl.height}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeSidebarTab === 'text' && (
              <div className="space-y-3">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Add Typography
                </p>
                <button
                  onClick={() => addText('Add a Headline', 42, 'bold')}
                  className="w-full text-left p-3 rounded-xl bg-[#161a25] hover:bg-[#1f2535] border border-[#242b3b] text-white text-base font-bold transition"
                >
                  Add a Headline
                </button>
                <button
                  onClick={() => addText('Add a Subheading', 24, '600')}
                  className="w-full text-left p-3 rounded-xl bg-[#161a25] hover:bg-[#1f2535] border border-[#242b3b] text-slate-200 text-sm font-semibold transition"
                >
                  Add a Subheading
                </button>
                <button
                  onClick={() => addText('Add little bit of body text for details', 16, 'normal')}
                  className="w-full text-left p-3 rounded-xl bg-[#161a25] hover:bg-[#1f2535] border border-[#242b3b] text-slate-400 text-xs transition"
                >
                  Add regular body text
                </button>
              </div>
            )}

            {activeSidebarTab === 'shapes' && (
              <div className="space-y-4">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Geometric Shapes & Stickers
                </p>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => addShape('rect', '#6366F1')}
                    className="flex flex-col items-center justify-center p-4 rounded-xl bg-[#161a25] hover:bg-[#1f2535] border border-[#242b3b] text-indigo-400 transition"
                  >
                    <Square className="h-8 w-8 mb-1" />
                    <span className="text-xs text-slate-300">Rectangle</span>
                  </button>
                  <button
                    onClick={() => addShape('circle', '#06B6D4')}
                    className="flex flex-col items-center justify-center p-4 rounded-xl bg-[#161a25] hover:bg-[#1f2535] border border-[#242b3b] text-cyan-400 transition"
                  >
                    <CircleIcon className="h-8 w-8 mb-1" />
                    <span className="text-xs text-slate-300">Circle</span>
                  </button>
                </div>
              </div>
            )}

            {activeSidebarTab === 'brand' && (
              <div className="space-y-3">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Brand Color Palette
                </p>
                <div className="flex flex-wrap gap-2">
                  {['#6366F1', '#06B6D4', '#F59E0B', '#10B981', '#EC4899', '#EF4444', '#0F172A', '#FFFFFF'].map((col) => (
                    <button
                      key={col}
                      onClick={() => {
                        if (selectedElement) updateSelectedElement({ fill: col });
                        else setProject({ ...project, backgroundColor: col });
                      }}
                      className="h-9 w-9 rounded-xl border border-white/20 shadow-md transition hover:scale-110"
                      style={{ backgroundColor: col }}
                      title={`Apply ${col}`}
                    />
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t border-[#222733]">
                  <p className="text-xs text-slate-400">
                    Click color to apply to selected element or canvas background.
                  </p>
                </div>
              </div>
            )}

            {activeSidebarTab === 'layers' && (
              <div className="space-y-2">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Canvas Layers ({project.elements.length})
                </p>
                {project.elements.map((el) => (
                  <div
                    key={el.id}
                    onClick={() => setSelectedElementId(el.id)}
                    className={`p-2.5 rounded-xl border text-xs flex items-center justify-between cursor-pointer transition ${
                      selectedElementId === el.id
                        ? 'bg-indigo-600/20 border-indigo-500 text-white'
                        : 'bg-[#151924] border-[#242b3c] text-slate-300 hover:bg-[#1c2130]'
                    }`}
                  >
                    <span className="truncate">
                      {el.type === 'text' ? `Text: "${el.text?.substring(0, 16)}"` : `Shape: ${el.type}`}
                    </span>
                    <span className="text-[10px] text-slate-500">z:{el.zIndex}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Center Canvas Workspace */}
        <div
          className="flex-1 bg-[#050608] overflow-auto flex items-center justify-center p-8 relative"
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onClick={() => setSelectedElementId(null)}
        >
          <div
            style={{
              transform: `scale(${zoom})`,
              transformOrigin: 'center center',
              transition: 'transform 0.15s ease-out',
            }}
            className="shadow-2xl shadow-black rounded-lg overflow-hidden border border-[#272e3f]"
          >
            <svg
              ref={canvasRef}
              width={project.width}
              height={project.height}
              viewBox={`0 0 ${project.width} ${project.height}`}
              style={{ backgroundColor: project.backgroundColor }}
              className="cursor-default"
            >
              {project.elements
                .sort((a, b) => a.zIndex - b.zIndex)
                .map((el) => {
                  const isSelected = selectedElementId === el.id;

                  if (el.type === 'text') {
                    return (
                      <g
                        key={el.id}
                        onMouseDown={(e) => handleMouseDown(e, el.id)}
                        className="cursor-move"
                      >
                        <text
                          x={el.x}
                          y={el.y}
                          fill={el.fill}
                          fontSize={el.fontSize || 24}
                          fontWeight={el.fontWeight || 'normal'}
                          fontFamily={el.fontFamily || 'Inter, sans-serif'}
                          textAnchor={el.textAlign === 'center' ? 'middle' : el.textAlign === 'right' ? 'end' : 'start'}
                        >
                          {el.text}
                        </text>
                        {isSelected && (
                          <rect
                            x={el.x - 6}
                            y={el.y - (el.fontSize || 24)}
                            width={el.width || 200}
                            height={(el.fontSize || 24) * 1.3}
                            fill="none"
                            stroke="#6366F1"
                            strokeWidth="2"
                            strokeDasharray="4"
                          />
                        )}
                      </g>
                    );
                  }

                  if (el.type === 'rect') {
                    return (
                      <g
                        key={el.id}
                        onMouseDown={(e) => handleMouseDown(e, el.id)}
                        className="cursor-move"
                      >
                        <rect
                          x={el.x}
                          y={el.y}
                          width={el.width}
                          height={el.height}
                          fill={el.fill}
                          rx={8}
                        />
                        {isSelected && (
                          <rect
                            x={el.x - 3}
                            y={el.y - 3}
                            width={el.width + 6}
                            height={el.height + 6}
                            fill="none"
                            stroke="#6366F1"
                            strokeWidth="2"
                            strokeDasharray="4"
                          />
                        )}
                      </g>
                    );
                  }

                  if (el.type === 'circle') {
                    const radius = el.width / 2;
                    return (
                      <g
                        key={el.id}
                        onMouseDown={(e) => handleMouseDown(e, el.id)}
                        className="cursor-move"
                      >
                        <circle
                          cx={el.x + radius}
                          cy={el.y + radius}
                          r={radius}
                          fill={el.fill}
                        />
                        {isSelected && (
                          <rect
                            x={el.x - 3}
                            y={el.y - 3}
                            width={el.width + 6}
                            height={el.height + 6}
                            fill="none"
                            stroke="#6366F1"
                            strokeWidth="2"
                            strokeDasharray="4"
                          />
                        )}
                      </g>
                    );
                  }

                  return null;
                })}
            </svg>
          </div>
        </div>

        {/* Right Properties Inspector */}
        <div className="w-72 bg-[#0c0e14] border-l border-[#222733] p-4 flex flex-col justify-between">
          {selectedElement ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-[#222733] pb-3">
                <span className="text-xs font-bold text-white uppercase tracking-wider">
                  Element Inspector
                </span>
                <div className="flex items-center space-x-1">
                  <button
                    onClick={bringForward}
                    className="p-1.5 rounded-lg bg-[#161a25] hover:bg-[#202636] text-slate-300"
                    title="Bring Forward"
                  >
                    <ArrowUp className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={sendBackward}
                    className="p-1.5 rounded-lg bg-[#161a25] hover:bg-[#202636] text-slate-300"
                    title="Send Backward"
                  >
                    <ArrowDown className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={duplicateSelectedElement}
                    className="p-1.5 rounded-lg bg-[#161a25] hover:bg-[#202636] text-slate-300"
                    title="Duplicate"
                  >
                    <Copy className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={deleteSelectedElement}
                    className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400"
                    title="Delete"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              {/* Text Controls */}
              {selectedElement.type === 'text' && (
                <div className="space-y-3">
                  <div>
                    <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                      Text Content
                    </label>
                    <input
                      type="text"
                      value={selectedElement.text || ''}
                      onChange={(e) => updateSelectedElement({ text: e.target.value })}
                      className="w-full bg-[#161a25] border border-[#262c3e] rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                        Font Size
                      </label>
                      <input
                        type="number"
                        value={selectedElement.fontSize || 24}
                        onChange={(e) => updateSelectedElement({ fontSize: parseInt(e.target.value) || 12 })}
                        className="w-full bg-[#161a25] border border-[#262c3e] rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                        Color
                      </label>
                      <input
                        type="color"
                        value={selectedElement.fill || '#ffffff'}
                        onChange={(e) => updateSelectedElement({ fill: e.target.value })}
                        className="w-full h-8 bg-[#161a25] border border-[#262c3e] rounded-xl cursor-pointer"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Shape Controls */}
              {(selectedElement.type === 'rect' || selectedElement.type === 'circle') && (
                <div className="space-y-3">
                  <div>
                    <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                      Fill Color
                    </label>
                    <input
                      type="color"
                      value={selectedElement.fill || '#4F46E5'}
                      onChange={(e) => updateSelectedElement({ fill: e.target.value })}
                      className="w-full h-8 bg-[#161a25] border border-[#262c3e] rounded-xl cursor-pointer"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                        Width
                      </label>
                      <input
                        type="number"
                        value={selectedElement.width}
                        onChange={(e) => updateSelectedElement({ width: parseInt(e.target.value) || 20 })}
                        className="w-full bg-[#161a25] border border-[#262c3e] rounded-xl px-3 py-1.5 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                        Height
                      </label>
                      <input
                        type="number"
                        value={selectedElement.height}
                        onChange={(e) => updateSelectedElement({ height: parseInt(e.target.value) || 20 })}
                        className="w-full bg-[#161a25] border border-[#262c3e] rounded-xl px-3 py-1.5 text-xs text-white"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-center py-12 text-slate-500">
              <Sparkles className="h-8 w-8 text-slate-600 mb-2" />
              <p className="text-xs font-semibold">No element selected</p>
              <p className="text-[11px] mt-1">
                Click any layer on canvas to position, resize, recolor, or change typography.
              </p>
            </div>
          )}

          {/* Quick Canvas Background Color */}
          <div className="border-t border-[#222733] pt-3">
            <span className="text-[11px] font-semibold text-slate-400 block mb-1.5">
              Canvas Background
            </span>
            <div className="flex items-center space-x-2">
              <input
                type="color"
                value={project.backgroundColor}
                onChange={(e) => setProject({ ...project, backgroundColor: e.target.value })}
                className="h-8 w-10 bg-transparent rounded cursor-pointer"
              />
              <span className="text-xs font-mono text-slate-300 uppercase">
                {project.backgroundColor}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
