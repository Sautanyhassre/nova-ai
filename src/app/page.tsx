'use client';

import React, { useState, useEffect } from 'react';
import { TabType } from '@/types';
import { Sidebar } from '@/components/Sidebar';
import { Header } from '@/components/Header';
import { ChatStudio } from '@/components/studios/ChatStudio';
import { DesignStudio } from '@/components/studios/DesignStudio';
import { ImageStudio } from '@/components/studios/ImageStudio';
import { VideoStudio } from '@/components/studios/VideoStudio';
import { WorkStudio } from '@/components/studios/WorkStudio';
import { OfficeStudio } from '@/components/studios/OfficeStudio';
import { CodeStudio } from '@/components/studios/CodeStudio';
import { VoiceStudio } from '@/components/studios/VoiceStudio';
import { ProjectsStudio } from '@/components/studios/ProjectsStudio';
import { BillingStudio } from '@/components/studios/BillingStudio';
import { AdminStudio } from '@/components/studios/AdminStudio';
import { UtilityStudios } from '@/components/studios/UtilityStudios';

export default function NovaHome() {
  const [activeTab, setActiveTab] = useState<TabType>('chat');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [selectedModel, setSelectedModel] = useState('nova-ultra-4.0');
  const [chatKey, setChatKey] = useState<number>(Date.now());

  const handleNewChat = () => {
    setActiveTab('chat');
    setChatKey(Date.now());
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#212121] text-[#ececec] font-sans">
      {/* ChatGPT-style Minimal Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isCollapsed={isSidebarCollapsed}
        setIsCollapsed={setIsSidebarCollapsed}
        onNewChat={handleNewChat}
      />

      {/* Main Workspace Frame */}
      <div className="flex-1 flex flex-col h-full overflow-hidden bg-[#212121]">
        {/* ChatGPT-style Clean Header */}
        <Header
          activeTab={activeTab}
          selectedModel={selectedModel}
          setSelectedModel={setSelectedModel}
          openSearch={() => {}}
        />

        {/* Dynamic Studio Body */}
        <main className="flex-1 overflow-hidden flex flex-col relative bg-[#212121]">
          {activeTab === 'chat' && <ChatStudio key={chatKey} selectedModel={selectedModel} />}
          {activeTab === 'design' && <DesignStudio />}
          {activeTab === 'image' && <ImageStudio />}
          {activeTab === 'video' && <VideoStudio />}
          {activeTab === 'work' && <WorkStudio />}
          {activeTab === 'agents' && <WorkStudio />}
          {activeTab === 'docs' && <OfficeStudio initialSubTab="docs" />}
          {activeTab === 'slides' && <OfficeStudio initialSubTab="slides" />}
          {activeTab === 'sheets' && <OfficeStudio initialSubTab="sheets" />}
          {activeTab === 'code' && <CodeStudio />}
          {activeTab === 'voice' && <VoiceStudio />}
          {activeTab === 'projects' && <ProjectsStudio />}
          {activeTab === 'billing' && <BillingStudio />}
          {activeTab === 'admin' && <AdminStudio />}
          {activeTab === 'research' && <UtilityStudios view="research" />}
          {activeTab === 'templates' && <UtilityStudios view="templates" />}
          {activeTab === 'integrations' && <UtilityStudios view="integrations" />}
          {activeTab === 'settings' && <UtilityStudios view="settings" />}
        </main>
      </div>
    </div>
  );
}
