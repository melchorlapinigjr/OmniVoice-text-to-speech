import React, { useState, useRef } from 'react';
import {
  Sparkles,
  FileText,
  Volume2,
  Clock,
  Wand2,
  Play,
  RotateCcw,
  Plus,
  Loader2,
  VolumeX,
} from 'lucide-react';
import { SCRIPT_TEMPLATES } from '../data/presets';
import { estimateDuration, formatTime, speakWithBrowserSynthesis, stopBrowserSynthesis } from '../utils/audio';

interface ScriptEditorProps {
  text: string;
  onChangeText: (text: string) => void;
  onGenerate: () => void;
  isGenerating: boolean;
  selectedAccentName: string;
  selectedAccentFlag: string;
  onSelectTemplate: (template: (typeof SCRIPT_TEMPLATES)[0]) => void;
}

export const ScriptEditor: React.FC<ScriptEditorProps> = ({
  text,
  onChangeText,
  onGenerate,
  isGenerating,
  selectedAccentName,
  selectedAccentFlag,
  onSelectTemplate,
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [showEnhanceMenu, setShowEnhanceMenu] = useState(false);
  const [isBrowserPlaying, setIsBrowserPlaying] = useState(false);

  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;
  const charCount = text.length;
  const estimatedSecs = estimateDuration(text);

  // Helper to insert vocal tags at cursor position
  const insertTag = (tag: string) => {
    if (!textareaRef.current) {
      onChangeText(text + ' ' + tag);
      return;
    }
    const start = textareaRef.current.selectionStart;
    const end = textareaRef.current.selectionEnd;
    const newText = text.substring(0, start) + ' ' + tag + ' ' + text.substring(end);
    onChangeText(newText);
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.selectionStart = textareaRef.current.selectionEnd = start + tag.length + 2;
        textareaRef.current.focus();
      }
    }, 20);
  };

  // AI Script Enhancement
  const handleEnhance = async (goal: string) => {
    if (!text.trim()) return;
    setIsEnhancing(true);
    setShowEnhanceMenu(false);
    try {
      const res = await fetch('/api/tts/enhance-text', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text,
          goal,
          accentName: selectedAccentName,
        }),
      });

      const contentType = res.headers.get('content-type') || '';
      if (res.ok && contentType.includes('application/json')) {
        const data = await res.json();
        if (data.enhancedText) {
          onChangeText(data.enhancedText);
        }
      } else {
        // Local formatting fallback for static hosting
        if (goal === 'podcast-host') {
          onChangeText(`Hey everyone! <breath> ${text} |yeah|`);
        } else if (goal === 'storyteller') {
          onChangeText(`Listen closely... [pause] ${text} <breath>`);
        } else {
          onChangeText(`${text}`);
        }
      }
    } catch (err) {
      console.warn('Enhance unavailable on static host:', err);
    } finally {
      setIsEnhancing(false);
    }
  };

  // Quick browser preview
  const handleBrowserPreview = () => {
    if (isBrowserPlaying) {
      stopBrowserSynthesis();
      setIsBrowserPlaying(false);
      return;
    }
    if (!text.trim()) return;
    setIsBrowserPlaying(true);
    // Strip vocal markers for browser synth
    const cleanText = text.replace(/<[^>]+>/g, '').replace(/\|[^|]+\|/g, '');
    speakWithBrowserSynthesis(
      cleanText,
      () => setIsBrowserPlaying(true),
      () => setIsBrowserPlaying(false)
    );
  };

  return (
    <div className="bg-[#121624] border border-[#232b43] rounded-2xl p-5 sm:p-6 shadow-xl relative">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-amber-400" />
          <h2 className="text-lg font-bold font-display text-white">
            Script & Speech Director
          </h2>
        </div>

        {/* Templates dropdown & AI Polish */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="relative">
            <select
              onChange={(e) => {
                const found = SCRIPT_TEMPLATES.find((t) => t.title === e.target.value);
                if (found) onSelectTemplate(found);
                e.target.value = '';
              }}
              defaultValue=""
              className="bg-[#171c2d] hover:bg-[#20273f] text-neutral-300 text-xs font-medium border border-[#29334f] rounded-xl px-3 py-1.5 focus:outline-none focus:border-amber-500 cursor-pointer transition-colors"
            >
              <option value="" disabled>
                📋 Load Sample Voice Script...
              </option>
              {SCRIPT_TEMPLATES.map((tmpl) => (
                <option key={tmpl.title} value={tmpl.title}>
                  {tmpl.title} ({tmpl.category})
                </option>
              ))}
            </select>
          </div>

          {/* AI Script Polish */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowEnhanceMenu(!showEnhanceMenu)}
              disabled={isEnhancing || !text.trim()}
              className="flex items-center gap-1.5 bg-[#171c2d] hover:bg-[#20273f] text-amber-300 text-xs font-medium border border-amber-500/30 rounded-xl px-3 py-1.5 transition-colors disabled:opacity-50"
            >
              {isEnhancing ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Wand2 className="w-3.5 h-3.5 text-amber-400" />
              )}
              <span>AI Polish</span>
            </button>

            {showEnhanceMenu && (
              <div className="absolute right-0 top-full mt-2 w-64 bg-[#151929] border border-[#2a3452] rounded-xl p-2 shadow-2xl z-30 space-y-1">
                <div className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider px-2 py-1">
                  Stylistic Polish Modes
                </div>
                {[
                  { id: 'podcast-host', label: 'Podcast & Radio Host', desc: 'Inserts vocal bursts & backchanneling' },
                  { id: 'storyteller', label: 'Cinematic Storyteller', desc: 'Adds dramatic pauses & narrative depth' },
                  { id: 'executive', label: 'Executive Keynote', desc: 'Crisp, professional studio diction' },
                  { id: 'casual-warm', label: 'Natural Conversational', desc: 'Warm, relaxed spoken cadence' },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleEnhance(item.id)}
                    className="w-full text-left p-2 rounded-lg hover:bg-[#20273f] transition-colors"
                  >
                    <div className="text-xs font-semibold text-white">{item.label}</div>
                    <div className="text-[10px] text-neutral-400">{item.desc}</div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Textarea */}
      <div className="relative">
        <textarea
          ref={textareaRef}
          value={text}
          onChange={(e) => onChangeText(e.target.value)}
          rows={6}
          placeholder="Enter text to speak, or pick a sample script above... Use vocal markers like <breath>, |yeah|, <laugh>, or [pause] for ultra-realistic delivery."
          className="w-full bg-[#0d101a] border border-[#232c45] rounded-xl p-4 text-sm sm:text-base text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/50 resize-y leading-relaxed font-sans"
        />

        {/* Clear Button */}
        {text && (
          <button
            onClick={() => onChangeText('')}
            className="absolute top-3 right-3 text-neutral-500 hover:text-neutral-300 text-xs px-2 py-1 rounded bg-[#171b29] border border-[#22283b]"
            title="Clear text"
          >
            Clear
          </button>
        )}
      </div>

      {/* Vocal Bursts & Backchanneling insertion bar */}
      <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider mr-1">
            Vocal Bursts:
          </span>
          {[
            { tag: '|mhm|', label: '|mhm|' },
            { tag: '|yeah|', label: '|yeah|' },
            { tag: '<laugh>', label: '<laugh>' },
            { tag: '<breath>', label: '<breath>' },
            { tag: '<gasp>', label: '<gasp>' },
            { tag: '[pause]', label: '[pause]' },
          ].map((item) => (
            <button
              key={item.tag}
              type="button"
              onClick={() => insertTag(item.tag)}
              className="px-2 py-0.5 rounded-lg text-xs font-mono bg-[#171b2b] hover:bg-[#22283d] text-amber-300 border border-[#29324c] transition-all"
              title={`Insert ${item.tag} at cursor`}
            >
              + {item.label}
            </button>
          ))}
        </div>

        {/* Word Counter & Spoken Duration */}
        <div className="flex items-center gap-3 text-xs font-mono text-neutral-400">
          <span>{wordCount} words</span>
          <span>•</span>
          <span>{charCount} chars</span>
          <span>•</span>
          <span className="flex items-center gap-1 text-amber-400">
            <Clock className="w-3.5 h-3.5" />
            ~{formatTime(estimatedSecs)}
          </span>
        </div>
      </div>

      {/* Primary Action Buttons */}
      <div className="mt-5 pt-4 border-t border-[#20273d] flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Current Target preview */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span className="text-xl">{selectedAccentFlag}</span>
          <div className="text-xs">
            <span className="text-neutral-400">Active Accent:</span>{' '}
            <span className="font-semibold text-white">{selectedAccentName}</span>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          <button
            type="button"
            onClick={handleBrowserPreview}
            disabled={!text.trim()}
            className={`flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-medium border transition-all ${
              isBrowserPlaying
                ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                : 'bg-[#181d2e] hover:bg-[#21273d] text-neutral-300 border-[#29334d]'
            }`}
            title="Instant browser synthesis preview"
          >
            {isBrowserPlaying ? (
              <>
                <VolumeX className="w-4 h-4 text-rose-400" />
                <span>Stop Preview</span>
              </>
            ) : (
              <>
                <Volume2 className="w-4 h-4 text-neutral-400" />
                <span>Quick Preview</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={onGenerate}
            disabled={isGenerating || !text.trim()}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl font-semibold text-sm bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-black shadow-lg shadow-amber-500/25 transition-all transform active:scale-98 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-black" />
                <span>Synthesizing Voice...</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-black" />
                <span>Generate Speech</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
