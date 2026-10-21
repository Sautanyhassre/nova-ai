'use client';

import React, { useState } from 'react';
import {
  FolderKanban,
  Folder,
  FileText,
  FileCode,
  Image as ImageIcon,
  Upload,
  Search,
  HardDrive,
  Trash2,
  Download,
  MoreVertical,
  Plus,
} from 'lucide-react';

export const ProjectsStudio: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFolder, setActiveFolder] = useState('All');

  const folders = ['All', 'India Expansion 2026', 'Brand Kit & Designs', 'Financial Models (GST)', 'Engineering'];

  const files = [
    { name: 'Diwali_Sale_Campaign_Master.svg', type: 'image', size: '1.4 MB', folder: 'Brand Kit & Designs', date: 'Today' },
    { name: 'Bilateral_AI_Corridor_Memo.md', type: 'doc', size: '240 KB', folder: 'India Expansion 2026', date: 'Yesterday' },
    { name: 'Q3_Financial_Projections_INR.csv', type: 'sheet', size: '84 KB', folder: 'Financial Models (GST)', date: '3 days ago' },
    { name: 'App_Nextjs15_Checkout.tsx', type: 'code', size: '42 KB', folder: 'Engineering', date: 'Last week' },
    { name: 'DPDP_Act_Compliance_Audit.pdf', type: 'doc', size: '3.1 MB', folder: 'India Expansion 2026', date: '2 weeks ago' },
  ];

  const filteredFiles = files.filter(
    (f) =>
      (activeFolder === 'All' || f.folder === activeFolder) &&
      f.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex-1 flex flex-col h-full bg-[#08090C] overflow-hidden">
      {/* Top Header */}
      <div className="p-6 bg-[#0c0e14] border-b border-[#222733] flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="h-9 w-9 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center">
            <FolderKanban className="h-5 w-5 text-indigo-400" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white">Projects & Object Storage</h2>
            <p className="text-xs text-slate-400">
              Encrypted cloud files, design assets, code repos & generated deliverables.
            </p>
          </div>
        </div>

        <button
          onClick={() => alert('Select files to upload into NOVA encrypted vault')}
          className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-md shadow-indigo-600/30 flex items-center space-x-2 transition"
        >
          <Upload className="h-4 w-4" />
          <span>Upload File</span>
        </button>
      </div>

      {/* Main Explorer */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Folder Tree */}
        <div className="w-64 bg-[#0a0c12] border-r border-[#222733] p-4 flex flex-col justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-2 px-2">
              Workspace Folders
            </span>
            {folders.map((f) => (
              <button
                key={f}
                onClick={() => setActiveFolder(f)}
                className={`w-full flex items-center space-x-2 px-3 py-2 rounded-xl text-xs font-medium transition ${
                  activeFolder === f
                    ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-[#141722]'
                }`}
              >
                <Folder className="h-4 w-4" />
                <span className="truncate">{f}</span>
              </button>
            ))}
          </div>

          {/* Storage Quota Card */}
          <div className="p-3 rounded-2xl bg-[#12151f] border border-[#222736] space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-white flex items-center space-x-1.5">
                <HardDrive className="h-3.5 w-3.5 text-indigo-400" />
                <span>Cloud Storage</span>
              </span>
              <span className="text-indigo-400 font-mono text-[11px]">42%</span>
            </div>
            <div className="w-full bg-[#1e2330] rounded-full h-1.5">
              <div className="bg-gradient-to-r from-indigo-500 to-cyan-400 h-1.5 rounded-full w-[42%]" />
            </div>
            <p className="text-[11px] text-slate-400">42.4 GB of 100 GB used</p>
          </div>
        </div>

        {/* Right File List */}
        <div className="flex-1 p-6 overflow-y-auto space-y-4">
          {/* Search bar */}
          <div className="flex items-center space-x-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search across files, deliverables, designs & datasets..."
                className="w-full pl-9 pr-4 py-2 bg-[#12151f] border border-[#242b3b] rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Table */}
          <div className="rounded-2xl border border-[#222733] overflow-hidden bg-[#0e1119]">
            <table className="w-full text-xs text-left text-slate-300">
              <thead className="bg-[#141824] text-slate-400 font-semibold uppercase tracking-wider text-[10px] border-b border-[#222733]">
                <tr>
                  <th className="px-5 py-3">File Name</th>
                  <th className="px-4 py-3">Folder</th>
                  <th className="px-4 py-3">Size</th>
                  <th className="px-4 py-3">Modified</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1e2333]">
                {filteredFiles.map((file, i) => (
                  <tr key={i} className="hover:bg-[#141824] transition">
                    <td className="px-5 py-3 font-semibold text-white flex items-center space-x-2">
                      <FileText className="h-4 w-4 text-indigo-400" />
                      <span>{file.name}</span>
                    </td>
                    <td className="px-4 py-3 text-slate-400">{file.folder}</td>
                    <td className="px-4 py-3 font-mono text-slate-400">{file.size}</td>
                    <td className="px-4 py-3 text-slate-500">{file.date}</td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => alert(`Downloading ${file.name}`)}
                        className="p-1 hover:text-white text-slate-400 transition mr-2"
                        title="Download"
                      >
                        <Download className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => alert(`Deleted ${file.name}`)}
                        className="p-1 hover:text-rose-400 text-slate-400 transition"
                        title="Delete"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
