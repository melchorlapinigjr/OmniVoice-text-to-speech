import React, { useState } from 'react';
import {
  Users,
  Plus,
  Trash2,
  Play,
  Loader2,
  Sparkles,
  MessageSquare,
  Volume2,
} from 'lucide-react';
import { DialogueTurn } from '../types';
import { BASE_VOICES, ACCENT_PRESETS } from '../data/presets';
import { AudioPlayer } from './AudioPlayer';

export const DialogueStudio: React.FC = () => {
  const [speaker1, setSpeaker1] = useState({
    name: 'Alex',
    voiceName: 'Puck',
    accentId: 'general-american',
  });

  const [speaker2, setSpeaker2] = useState({
    name: 'Maya',
    voiceName: 'Kore',
    accentId: 'british-rp',
  });

  const [turns, setTurns] = useState<DialogueTurn[]>([
    {
      id: '1',
      speaker: 'Alex',
      voiceName: 'Puck',
      text: 'Hey Maya! Have you had a chance to test the latest speech models this week?',
      accentStyle: 'Natural General American accent, clear, approachable, and engaging.',
    },
    {
      id: '2',
      speaker: 'Maya',
      voiceName: 'Kore',
      text: 'Yes Alex, absolutely! |yeah| The voice customization and dialect inflections are remarkably lifelike.',
      accentStyle: 'Polished British Received Pronunciation, articulate, refined, and poised.',
    },
    {
      id: '3',
      speaker: 'Alex',
      voiceName: 'Puck',
      text: 'The cadence sounds completely human. <laugh> It opens up massive creative possibilities for podcasting and narration.',
      accentStyle: 'Natural General American accent, warm and conversational.',
    },
    {
      id: '4',
      speaker: 'Maya',
      voiceName: 'Kore',
      text: 'One hundred percent. <breath> Being able to pair distinct voices in a single conversation is truly next-level.',
      accentStyle: 'Polished British Received Pronunciation with warm enthusiastic delivery.',
    },
  ]);

  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedClip, setGeneratedClip] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const addTurn = () => {
    const lastSpeaker = turns.length > 0 ? turns[turns.length - 1].speaker : speaker2.name;
    const nextSpeaker = lastSpeaker === speaker1.name ? speaker2.name : speaker1.name;
    const nextVoice = nextSpeaker === speaker1.name ? speaker1.voiceName : speaker2.voiceName;

    setTurns([
      ...turns,
      {
        id: Date.now().toString(),
        speaker: nextSpeaker,
        voiceName: nextVoice,
        text: '',
        accentStyle: '',
      },
    ]);
  };

  const removeTurn = (index: number) => {
    if (turns.length <= 1) return;
    setTurns(turns.filter((_, i) => i !== index));
  };

  const updateTurn = (index: number, field: keyof DialogueTurn, val: string) => {
    const updated = [...turns];
    updated[index] = { ...updated[index], [field]: val };
    setTurns(updated);
  };

  const handleGenerateDialogue = async () => {
    if (turns.some((t) => !t.text.trim())) {
      setErrorMsg('Please ensure all dialogue lines have text.');
      return;
    }
    setErrorMsg(null);
    setIsGenerating(true);

    try {
      const sp1Accent = ACCENT_PRESETS.find((a) => a.id === speaker1.accentId)?.promptStyle || '';
      const sp2Accent = ACCENT_PRESETS.find((a) => a.id === speaker2.accentId)?.promptStyle || '';

      const res = await fetch('/api/tts/dialogue', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          speaker1: {
            name: speaker1.name,
            voiceName: speaker1.voiceName,
            accentStyle: sp1Accent,
          },
          speaker2: {
            name: speaker2.name,
            voiceName: speaker2.voiceName,
            accentStyle: sp2Accent,
          },
          turns: turns.map((t) => ({
            speaker: t.speaker,
            text: t.text,
            style: t.speaker === speaker1.name ? sp1Accent : sp2Accent,
          })),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to synthesize dialogue');
      }

      setGeneratedClip({
        id: Date.now().toString(),
        title: `${speaker1.name} & ${speaker2.name} Conversation`,
        text: turns.map((t) => `${t.speaker}: ${t.text}`).join(' | '),
        accentName: `${speaker1.name} (${speaker1.accentId}) & ${speaker2.name} (${speaker2.accentId})`,
        accentFlag: '🎙️',
        voiceName: `${speaker1.voiceName} & ${speaker2.voiceName}`,
        emotion: 'Dialogue',
        audioUrl: data.audioDataUrl,
        timestamp: Date.now(),
        modelUsed: data.modelUsed,
      });
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err?.message || 'Error generating dialogue audio');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-[#121624] border border-[#232b43] rounded-2xl p-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-amber-400" />
              <h2 className="text-lg font-bold font-display text-white">
                Dual-Speaker Multi-Accent Dialogue Studio
              </h2>
            </div>
            <p className="text-xs text-neutral-400 mt-1 max-w-2xl">
              Gemini 3.8 Flash TTS synthesizes natural, multi-speaker conversations and podcasts with distinct voices, custom accents, and realistic conversational turn-taking.
            </p>
          </div>

          <button
            onClick={handleGenerateDialogue}
            disabled={isGenerating || turns.length === 0}
            className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl font-semibold text-sm bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-black shadow-lg shadow-amber-500/20 transition-all disabled:opacity-50"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-black" />
                <span>Synthesizing Dialogue...</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-black" />
                <span>Generate Dual Audio</span>
              </>
            )}
          </button>
        </div>

        {errorMsg && (
          <div className="mt-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
            {errorMsg}
          </div>
        )}
      </div>

      {/* Speaker Profiles Setup */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Speaker 1 */}
        <div className="bg-[#121624] border border-[#232b43] rounded-2xl p-5 shadow-lg">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
              Speaker 1 Profile
            </span>
            <span className="text-[10px] font-mono text-neutral-400 bg-[#171b2b] px-2 py-0.5 rounded">
              Voice: {speaker1.voiceName}
            </span>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-xs text-neutral-400 mb-1">Character Name</label>
              <input
                type="text"
                value={speaker1.name}
                onChange={(e) => setSpeaker1({ ...speaker1, name: e.target.value })}
                className="w-full bg-[#181d2e] border border-[#28324e] rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs text-neutral-400 mb-1">Base Voice</label>
                <select
                  value={speaker1.voiceName}
                  onChange={(e) => setSpeaker1({ ...speaker1, voiceName: e.target.value })}
                  className="w-full bg-[#181d2e] border border-[#28324e] rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-amber-500"
                >
                  {BASE_VOICES.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.name} ({v.gender})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs text-neutral-400 mb-1">Accent Dialect</label>
                <select
                  value={speaker1.accentId}
                  onChange={(e) => setSpeaker1({ ...speaker1, accentId: e.target.value })}
                  className="w-full bg-[#181d2e] border border-[#28324e] rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-amber-500"
                >
                  {ACCENT_PRESETS.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.flag} {a.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Speaker 2 */}
        <div className="bg-[#121624] border border-[#232b43] rounded-2xl p-5 shadow-lg">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
              Speaker 2 Profile
            </span>
            <span className="text-[10px] font-mono text-neutral-400 bg-[#171b2b] px-2 py-0.5 rounded">
              Voice: {speaker2.voiceName}
            </span>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-xs text-neutral-400 mb-1">Character Name</label>
              <input
                type="text"
                value={speaker2.name}
                onChange={(e) => setSpeaker2({ ...speaker2, name: e.target.value })}
                className="w-full bg-[#181d2e] border border-[#28324e] rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs text-neutral-400 mb-1">Base Voice</label>
                <select
                  value={speaker2.voiceName}
                  onChange={(e) => setSpeaker2({ ...speaker2, voiceName: e.target.value })}
                  className="w-full bg-[#181d2e] border border-[#28324e] rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-amber-500"
                >
                  {BASE_VOICES.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.name} ({v.gender})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs text-neutral-400 mb-1">Accent Dialect</label>
                <select
                  value={speaker2.accentId}
                  onChange={(e) => setSpeaker2({ ...speaker2, accentId: e.target.value })}
                  className="w-full bg-[#181d2e] border border-[#28324e] rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-amber-500"
                >
                  {ACCENT_PRESETS.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.flag} {a.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Conversation Script Editor */}
      <div className="bg-[#121624] border border-[#232b43] rounded-2xl p-5 sm:p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-amber-400" />
            Dialogue Script Turns ({turns.length})
          </h3>
          <button
            onClick={addTurn}
            className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl bg-amber-500/15 text-amber-300 hover:bg-amber-500/25 border border-amber-500/30 transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Speech Turn
          </button>
        </div>

        <div className="space-y-3">
          {turns.map((turn, idx) => {
            const isSp1 = turn.speaker === speaker1.name;
            return (
              <div
                key={turn.id}
                className={`p-3.5 rounded-xl border transition-all ${
                  isSp1
                    ? 'bg-[#151a2b] border-[#293452]'
                    : 'bg-[#171c2f] border-[#2f3b5c]'
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <select
                      value={turn.speaker}
                      onChange={(e) => updateTurn(idx, 'speaker', e.target.value)}
                      className="bg-[#1a2138] text-amber-400 font-bold text-xs border border-[#2f3c5f] rounded-lg px-2.5 py-1 focus:outline-none"
                    >
                      <option value={speaker1.name}>{speaker1.name}</option>
                      <option value={speaker2.name}>{speaker2.name}</option>
                    </select>
                    <span className="text-[11px] text-neutral-400">Turn #{idx + 1}</span>
                  </div>

                  <button
                    onClick={() => removeTurn(idx)}
                    disabled={turns.length <= 1}
                    className="text-neutral-500 hover:text-rose-400 transition-colors p-1 disabled:opacity-30"
                    title="Remove turn"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <textarea
                  value={turn.text}
                  onChange={(e) => updateTurn(idx, 'text', e.target.value)}
                  rows={2}
                  placeholder={`What does ${turn.speaker} say? Insert vocal cues like <laugh> or |mhm|...`}
                  className="w-full bg-[#0d101a] border border-[#20273f] rounded-lg p-2.5 text-xs sm:text-sm text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-amber-500"
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* Generated Audio Player for Dialogue */}
      {generatedClip && (
        <div className="mt-6">
          <AudioPlayer clip={generatedClip} />
        </div>
      )}
    </div>
  );
};
