import React, { useState, useEffect } from 'react';
import {
  Volume2,
  Sparkles,
  Info,
  Radio,
  AlertCircle,
  CheckCircle2,
  HelpCircle,
} from 'lucide-react';
import { Navbar } from './components/Navbar';
import { ScriptEditor } from './components/ScriptEditor';
import { AudioPlayer } from './components/AudioPlayer';
import { AccentSelector } from './components/AccentSelector';
import { VoiceControls } from './components/VoiceControls';
import { DialogueStudio } from './components/DialogueStudio';
import { AccentLabModal } from './components/AccentLabModal';
import { HistoryDrawer } from './components/HistoryDrawer';
import { ACCENT_PRESETS, BASE_VOICES, SCRIPT_TEMPLATES } from './data/presets';
import { AccentConfig, GeneratedClip, TTSGenerationOptions } from './types';
import {
  createClientSyntheticWavBlob,
  blobToDataUrl,
  speakWithBrowserSynthesis,
} from './utils/audio';

export default function App() {
  const [activeTab, setActiveTab] = useState<'studio' | 'dialogue' | 'explorer'>('studio');
  const [text, setText] = useState<string>(
    'Welcome to OmniVoice Studio! |yeah| Create lifelike, expressive speech with customizable accents, distinct voice personas, and studio-grade audio effects. <breath> Select an accent, customize your delivery style, and generate speech instantly.'
  );

  const [selectedAccent, setSelectedAccent] = useState<AccentConfig>(ACCENT_PRESETS[0]); // General American
  const [accentIntensity, setAccentIntensity] = useState<'subtle' | 'authentic' | 'pronounced'>('authentic');
  const [customAccentName, setCustomAccentName] = useState('');
  const [customAccentDescription, setCustomAccentDescription] = useState('');
  const [isCustomAccentActive, setIsCustomAccentActive] = useState(false);

  const [selectedVoice, setSelectedVoice] = useState('Puck');
  const [selectedEmotion, setSelectedEmotion] = useState('conversational');
  const [selectedPacing, setSelectedPacing] = useState('natural');
  const [pitchShift, setPitchShift] = useState('balanced');
  const [preferredModel, setPreferredModel] = useState<'gemini-3.8-flash-tts' | 'gemini-3.8-flash-lite-tts'>(
    'gemini-3.8-flash-tts'
  );

  const [currentClip, setCurrentClip] = useState<GeneratedClip | null>(null);
  const [history, setHistory] = useState<GeneratedClip[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isDialectGuideOpen, setIsDialectGuideOpen] = useState(false);

  // Load history from localStorage
  useEffect(() => {
    try {
      const saved =
        localStorage.getItem('omnivoice_history') ||
        localStorage.getItem('afrivoice_history');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setHistory(parsed);
          setCurrentClip(parsed[0]);
        }
      }
    } catch (e) {
      console.warn('Failed to load history:', e);
    }
  }, []);

  // Save history to localStorage
  const saveToHistory = (newClip: GeneratedClip) => {
    const updated = [newClip, ...history.filter((c) => c.id !== newClip.id)].slice(0, 30);
    setHistory(updated);
    try {
      localStorage.setItem('omnivoice_history', JSON.stringify(updated));
    } catch (e) {
      console.warn('Failed to save to localStorage:', e);
    }
  };

  const handleDeleteClip = (id: string) => {
    const updated = history.filter((c) => c.id !== id);
    setHistory(updated);
    try {
      localStorage.setItem('omnivoice_history', JSON.stringify(updated));
    } catch (e) {}
    if (currentClip?.id === id) {
      setCurrentClip(updated[0] || null);
    }
  };

  const handleClearHistory = () => {
    setHistory([]);
    try {
      localStorage.removeItem('omnivoice_history');
    } catch (e) {}
  };

  // Main Speech Generation Trigger
  const handleGenerate = async () => {
    if (!text.trim()) return;
    setIsGenerating(true);
    setErrorMessage(null);

    try {
      const payload: TTSGenerationOptions = {
        text: text.trim(),
        accentId: selectedAccent.id,
        customAccentName: isCustomAccentActive ? customAccentName : undefined,
        customAccentDescription: isCustomAccentActive ? customAccentDescription : undefined,
        voiceName: selectedVoice,
        emotion: selectedEmotion,
        pacing: selectedPacing,
        accentIntensity,
        pitchShift,
        preferredModel,
      };

      let audioDataUrl: string;
      let modelUsed: string = preferredModel;

      try {
        const res = await fetch('/api/tts/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        const contentType = res.headers.get('content-type') || '';
        if (res.ok && contentType.includes('application/json')) {
          const data = await res.json();
          audioDataUrl = data.audioDataUrl;
          modelUsed = data.modelUsed || preferredModel;
        } else {
          throw new Error('Static host without backend detected');
        }
      } catch (backendErr) {
        console.info('Backend unavailable, using browser synthesis engine:', backendErr);
        const pitchMult = pitchShift === 'deep' ? 0.8 : pitchShift === 'bright' ? 1.25 : 1.0;
        const wavBlob = createClientSyntheticWavBlob(text.trim(), pitchMult);
        audioDataUrl = await blobToDataUrl(wavBlob);
        modelUsed = 'Web Speech Engine (Client)';
        speakWithBrowserSynthesis(text.trim(), undefined, undefined, 1.0, pitchMult, selectedAccent.id);
      }

      const activeName = isCustomAccentActive ? customAccentName : selectedAccent.name;
      const activeFlag = isCustomAccentActive ? '🌍' : selectedAccent.flag;

      const newClip: GeneratedClip = {
        id: Date.now().toString(),
        title: `${activeName} - ${selectedVoice}`,
        text: text.trim(),
        accentName: activeName,
        accentFlag: activeFlag,
        voiceName: selectedVoice,
        emotion: selectedEmotion,
        audioUrl: audioDataUrl,
        timestamp: Date.now(),
        modelUsed: modelUsed,
      };

      setCurrentClip(newClip);
      saveToHistory(newClip);
    } catch (err: any) {
      console.error('Speech synthesis error:', err);
      setErrorMessage(
        err?.message ||
          'Failed to generate speech. Please try a different voice.'
      );
    } finally {
      setIsGenerating(false);
    }
  };

  // Handle template selection
  const handleSelectTemplate = (template: (typeof SCRIPT_TEMPLATES)[0]) => {
    setText(template.text);
    const targetAccent = ACCENT_PRESETS.find((a) => a.id === template.accentId);
    if (targetAccent) {
      setSelectedAccent(targetAccent);
      setIsCustomAccentActive(false);
    }
    if (template.voice) setSelectedVoice(template.voice);
    if (template.emotion) setSelectedEmotion(template.emotion);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0c0d14] text-neutral-100 selection:bg-amber-500 selection:text-black">
      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        historyCount={history.length}
        onOpenHistory={() => setIsHistoryOpen(true)}
        onOpenDialectGuide={() => setIsDialectGuideOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Error notification banner if any */}
        {errorMessage && (
          <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{errorMessage}</span>
            </div>
            <button
              onClick={() => setErrorMessage(null)}
              className="text-neutral-400 hover:text-white text-xs underline"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Tab 1: Studio TTS */}
        {activeTab === 'studio' && (
          <div className="space-y-6">
            {/* Top row: Script Director & Speech Editor */}
            <ScriptEditor
              text={text}
              onChangeText={setText}
              onGenerate={handleGenerate}
              isGenerating={isGenerating}
              selectedAccentName={isCustomAccentActive ? customAccentName : selectedAccent.name}
              selectedAccentFlag={isCustomAccentActive ? '🌍' : selectedAccent.flag}
              onSelectTemplate={handleSelectTemplate}
            />

            {/* Audio Waveform Player Section */}
            <AudioPlayer clip={currentClip} />

            {/* Accent Selection Grid */}
            <AccentSelector
              selectedAccentId={selectedAccent.id}
              onSelectAccent={setSelectedAccent}
              accentIntensity={accentIntensity}
              onChangeIntensity={setAccentIntensity}
              customAccentName={customAccentName}
              customAccentDescription={customAccentDescription}
              onUpdateCustomAccent={(name, desc) => {
                setCustomAccentName(name);
                setCustomAccentDescription(desc);
              }}
              isCustomAccentActive={isCustomAccentActive}
              setIsCustomAccentActive={setIsCustomAccentActive}
              onApplySampleScript={(script) => setText(script)}
            />

            {/* Voice Persona & Emotion Controls */}
            <VoiceControls
              selectedVoice={selectedVoice}
              onSelectVoice={setSelectedVoice}
              selectedEmotion={selectedEmotion}
              onSelectEmotion={setSelectedEmotion}
              selectedPacing={selectedPacing}
              onSelectPacing={setSelectedPacing}
              pitchShift={pitchShift}
              onChangePitch={setPitchShift}
              preferredModel={preferredModel}
              onChangeModel={setPreferredModel}
            />
          </div>
        )}

        {/* Tab 2: Dual Dialogue Studio */}
        {activeTab === 'dialogue' && <DialogueStudio />}

        {/* Tab 3: Accent Explorer */}
        {activeTab === 'explorer' && (
          <div className="space-y-6">
            <div className="bg-[#121624] border border-[#232b43] rounded-2xl p-6 shadow-xl">
              <h2 className="text-xl font-bold font-display text-white flex items-center gap-2 mb-2">
                <Sparkles className="w-5 h-5 text-amber-400" />
                Global Accent & Linguistic Laboratory
              </h2>
              <p className="text-xs text-neutral-400 max-w-2xl leading-relaxed">
                Explore worldwide dialects, rhythmic cadence, and voice personas. Audition any accent below to load it directly into the Studio editor.
              </p>
            </div>

            <AccentSelector
              selectedAccentId={selectedAccent.id}
              onSelectAccent={(accent) => {
                setSelectedAccent(accent);
                setIsCustomAccentActive(false);
                setText(accent.sampleScript);
                setActiveTab('studio');
              }}
              accentIntensity={accentIntensity}
              onChangeIntensity={setAccentIntensity}
              customAccentName={customAccentName}
              customAccentDescription={customAccentDescription}
              onUpdateCustomAccent={(name, desc) => {
                setCustomAccentName(name);
                setCustomAccentDescription(desc);
              }}
              isCustomAccentActive={isCustomAccentActive}
              setIsCustomAccentActive={setIsCustomAccentActive}
              onApplySampleScript={(script) => {
                setText(script);
                setActiveTab('studio');
              }}
            />
          </div>
        )}
      </main>

      {/* History Slide-over Drawer */}
      <HistoryDrawer
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        clips={history}
        onPlayClip={(clip) => {
          setCurrentClip(clip);
          setIsHistoryOpen(false);
          setActiveTab('studio');
        }}
        onDeleteClip={handleDeleteClip}
        onClearAll={handleClearHistory}
        activeClipId={currentClip?.id}
      />

      {/* Dialect Guide Modal */}
      <AccentLabModal
        isOpen={isDialectGuideOpen}
        onClose={() => setIsDialectGuideOpen(false)}
        onSelectAndApply={(accent, script) => {
          setSelectedAccent(accent);
          setIsCustomAccentActive(false);
          setText(script);
          setActiveTab('studio');
        }}
      />

      {/* Footer */}
      <footer className="border-t border-[#1a1f30] py-6 text-center text-xs text-neutral-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>© OmniVoice Studio • Universal AI Text-to-Speech & Voice Studio</p>
          <div className="flex items-center gap-4 text-neutral-400">
            <span>Powered by Gemini 3.8 Flash TTS</span>
            <span>•</span>
            <span>24kHz Studio Audio</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
