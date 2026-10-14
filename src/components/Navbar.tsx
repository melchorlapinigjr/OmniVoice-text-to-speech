import React from 'react';
import { Volume2, Sparkles, BookOpen, Users, History, Radio } from 'lucide-react';

interface NavbarProps {
  activeTab: 'studio' | 'dialogue' | 'explorer';
  setActiveTab: (tab: 'studio' | 'dialogue' | 'explorer') => void;
  historyCount: number;
  onOpenHistory: () => void;
  onOpenDialectGuide: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  historyCount,
  onOpenHistory,
  onOpenDialectGuide,
}) => {
  return (
    <header className="sticky top-0 z-40 border-b border-[#222738] bg-[#0c0d14]/90 backdrop-blur-md px-4 lg:px-8 py-3.5 transition-all">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
        {/* Logo and Brand */}
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-600 via-orange-500 to-amber-400 text-black shadow-lg shadow-amber-500/20">
            <Volume2 className="w-5 h-5" />
            <span className="absolute -bottom-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold font-display tracking-tight text-white flex items-center gap-1.5">
                OmniVoice <span className="text-amber-400 text-xs px-2 py-0.5 rounded-full bg-amber-400/10 border border-amber-400/20 font-mono font-medium">STUDIO</span>
              </h1>
            </div>
            <p className="text-xs text-neutral-400 hidden sm:block">
              Universal AI Text-to-Speech & Voice Customization
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center bg-[#151824] p-1 rounded-xl border border-[#262c40]">
          <button
            onClick={() => setActiveTab('studio')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'studio'
                ? 'bg-amber-500 text-black font-semibold shadow-md shadow-amber-500/20'
                : 'text-neutral-300 hover:text-white hover:bg-[#1f2438]'
            }`}
          >
            <Radio className="w-4 h-4" />
            Studio TTS
          </button>

          <button
            onClick={() => setActiveTab('dialogue')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'dialogue'
                ? 'bg-amber-500 text-black font-semibold shadow-md shadow-amber-500/20'
                : 'text-neutral-300 hover:text-white hover:bg-[#1f2438]'
            }`}
          >
            <Users className="w-4 h-4" />
            Dual Dialogue
          </button>

          <button
            onClick={() => setActiveTab('explorer')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'explorer'
                ? 'bg-amber-500 text-black font-semibold shadow-md shadow-amber-500/20'
                : 'text-neutral-300 hover:text-white hover:bg-[#1f2438]'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            Accent Lab
          </button>
        </div>

        {/* Right Action buttons & Badge */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={onOpenDialectGuide}
            className="flex items-center gap-1.5 text-xs text-amber-300 bg-amber-950/40 hover:bg-amber-900/50 border border-amber-600/30 px-2.5 py-1.5 rounded-lg transition-all"
            title="Learn about African accent phonetics and cadence"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden md:inline">Dialect Guide</span>
          </button>

          <button
            onClick={onOpenHistory}
            className="relative flex items-center gap-1.5 text-xs text-neutral-300 bg-[#161a29] hover:bg-[#20263b] border border-[#2b334d] px-3 py-1.5 rounded-lg transition-all"
          >
            <History className="w-3.5 h-3.5 text-neutral-400" />
            <span>Library</span>
            {historyCount > 0 && (
              <span className="ml-0.5 px-1.5 py-0.2 bg-amber-500 text-black font-bold text-[10px] rounded-full">
                {historyCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
