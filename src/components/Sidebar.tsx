'use client';

import React, { useState } from 'react';
import { TabType } from '@/types';
import {
  SquarePen,
  Search,
  PanelLeftClose,
  PanelLeft,
  Sparkles,
  LayoutGrid,
  Settings,
  LogOut,
  MoreHorizontal,
  Trash2,
  Share2,
} from 'lucide-react';

interface SidebarProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
  onNewChat: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  isCollapsed,
  setIsCollapsed,
  onNewChat,
}) => {
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isStudiosOpen, setIsStudiosOpen] = useState(false);

  const recentChats = [
    { id: '1', title: 'Rice Water Shampoo Formulation & Features' },
    { id: '2', title: 'Next.js 15 Streaming Architecture' },
    { id: '3', title: 'Diwali Campaign Banner Plan' },
    { id: '4', title: 'Indian SaaS GST & Payment Rails' },
  ];

  const studios = [
    { id: 'design' as TabType, label: 'Design Studio' },
    { id: 'image' as TabType, label: 'Image Studio' },
    { id: 'video' as TabType, label: 'Video Studio' },
    { id: 'work' as TabType, label: 'AI Work & Agents' },
    { id: 'code' as TabType, label: 'Code Studio' },
    { id: 'docs' as TabType, label: 'Documents' },
    { id: 'sheets' as TabType, label: 'Spreadsheets' },
    { id: 'slides' as TabType, label: 'Presentations' },
    { id: 'voice' as TabType, label: 'Voice Studio' },
  ];

  if (isCollapsed) {
    return (
      <aside className="w-14 bg-[#171717] flex flex-col items-center py-3 border-r border-[#262626] select-none justify-between z-30">
        <div className="flex flex-col items-center space-y-3">
          <button
            onClick={() => setIsCollapsed(false)}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-[#212121] transition"
            title="Open sidebar"
          >
            <PanelLeft className="h-5 w-5" />
          </button>
          <button
            onClick={onNewChat}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-[#212121] transition"
            title="New chat"
          >
            <SquarePen className="h-5 w-5" />
          </button>
        </div>

        <button
          onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
          className="h-8 w-8 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center hover:opacity-90"
        >
          B
        </button>
      </aside>
    );
  }

  return (
    <aside className="w-[260px] bg-[#171717] flex flex-col h-full border-r border-[#262626] select-none text-slate-200 z-30">
      {/* Top Header */}
      <div className="p-3 flex items-center justify-between">
        <button
          onClick={() => setIsCollapsed(true)}
          className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-[#212121] transition"
          title="Close sidebar"
        >
          <PanelLeftClose className="h-5 w-5" />
        </button>

        <div className="flex items-center space-x-1">
          <button
            onClick={onNewChat}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-[#212121] transition"
            title="New chat"
          >
            <SquarePen className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Main Navigation: New Chat & Tools Drawer */}
      <div className="px-3 space-y-1">
        <button
          onClick={onNewChat}
          className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm font-medium transition ${
            activeTab === 'chat'
              ? 'bg-[#212121] text-white'
              : 'hover:bg-[#212121] text-slate-300'
          }`}
        >
          <div className="flex items-center space-x-2.5">
            <SquarePen className="h-4 w-4" />
            <span>New chat</span>
          </div>
        </button>

        {/* Explore Studios (Single Drawer instead of 15 buttons) */}
        <div>
          <button
            onClick={() => setIsStudiosOpen(!isStudiosOpen)}
            className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm font-medium hover:bg-[#212121] text-slate-300 transition"
          >
            <div className="flex items-center space-x-2.5">
              <LayoutGrid className="h-4 w-4 text-indigo-400" />
              <span>Explore Studios</span>
            </div>
            <span className="text-[10px] text-slate-500 font-mono">
              {isStudiosOpen ? '▲' : '▼'}
            </span>
          </button>

          {isStudiosOpen && (
            <div className="pl-6 pr-2 py-1 space-y-0.5">
              {studios.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setActiveTab(s.id)}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs transition ${
                    activeTab === s.id
                      ? 'bg-indigo-600/20 text-indigo-300 font-medium'
                      : 'text-slate-400 hover:text-white hover:bg-[#212121]'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Chat History (Clean, familiar ChatGPT style) */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-3">
        <div>
          <span className="text-[11px] font-semibold text-slate-500 px-3 uppercase tracking-wider">
            Today
          </span>
          <div className="mt-1 space-y-0.5">
            {recentChats.slice(0, 2).map((c) => (
              <button
                key={c.id}
                onClick={() => setActiveTab('chat')}
                className="w-full text-left px-3 py-2 rounded-lg text-sm text-slate-300 hover:bg-[#212121] hover:text-white truncate transition block"
              >
                {c.title}
              </button>
            ))}
          </div>
        </div>

        <div>
          <span className="text-[11px] font-semibold text-slate-500 px-3 uppercase tracking-wider">
            Previous 7 Days
          </span>
          <div className="mt-1 space-y-0.5">
            {recentChats.slice(2).map((c) => (
              <button
                key={c.id}
                onClick={() => setActiveTab('chat')}
                className="w-full text-left px-3 py-2 rounded-lg text-sm text-slate-300 hover:bg-[#212121] hover:text-white truncate transition block"
              >
                {c.title}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Profile Bar (Exact ChatGPT style) */}
      <div className="p-3 border-t border-[#262626] relative">
        <div
          onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
          className="flex items-center justify-between p-2 rounded-xl hover:bg-[#212121] cursor-pointer transition"
        >
          <div className="flex items-center space-x-2.5 truncate">
            <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-xs text-white shrink-0">
              B
            </div>
            <div className="truncate">
              <p className="text-sm font-medium text-white truncate">Balaji G.</p>
            </div>
          </div>
          <MoreHorizontal className="h-4 w-4 text-slate-400 shrink-0" />
        </div>

        {/* Profile Popover Menu */}
        {isProfileMenuOpen && (
          <div className="absolute bottom-16 left-3 right-3 rounded-2xl bg-[#212121] border border-[#333333] shadow-2xl p-1.5 z-50 space-y-0.5 text-sm">
            <button
              onClick={() => {
                setActiveTab('billing');
                setIsProfileMenuOpen(false);
              }}
              className="w-full flex items-center space-x-2.5 px-3 py-2 rounded-xl text-slate-200 hover:bg-[#2f2f2f] transition"
            >
              <Sparkles className="h-4 w-4 text-indigo-400" />
              <span>Upgrade Plan</span>
            </button>
            <button
              onClick={() => {
                setActiveTab('settings');
                setIsProfileMenuOpen(false);
              }}
              className="w-full flex items-center space-x-2.5 px-3 py-2 rounded-xl text-slate-200 hover:bg-[#2f2f2f] transition"
            >
              <Settings className="h-4 w-4 text-slate-400" />
              <span>Settings</span>
            </button>
            <div className="border-t border-[#2f2f2f] my-1" />
            <button
              onClick={() => {
                alert('Logged out.');
                setIsProfileMenuOpen(false);
              }}
              className="w-full flex items-center space-x-2.5 px-3 py-2 rounded-xl text-rose-400 hover:bg-rose-500/10 transition"
            >
              <LogOut className="h-4 w-4" />
              <span>Log out</span>
            </button>
          </div>
        )}
      </div>
    </aside>
  );
};
