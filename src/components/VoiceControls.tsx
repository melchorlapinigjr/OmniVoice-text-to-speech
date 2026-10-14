import React from 'react';
import { Mic2, User, Music, Zap, Flame, Smile, ShieldAlert } from 'lucide-react';
import { BASE_VOICES } from '../data/presets';
import { VoiceConfig } from '../types';

interface VoiceControlsProps {
  selectedVoice: string;
  onSelectVoice: (voiceId: string) => void;
  selectedEmotion: string;
  onSelectEmotion: (emotion: string) => void;
  selectedPacing: string;
  onSelectPacing: (pacing: string) => void;
  pitchShift: string;
  onChangePitch: (pitch: string) => void;
  preferredModel: 'gemini-3.8-flash-tts' | 'gemini-3.8-flash-lite-tts';
  onChangeModel: (model: 'gemini-3.8-flash-tts' | 'gemini-3.8-flash-lite-tts') => void;
}

export const VoiceControls: React.FC<VoiceControlsProps> = ({
  selectedVoice,
  onSelectVoice,
  selectedEmotion,
  onSelectEmotion,
  selectedPacing,
  onSelectPacing,
  pitchShift,
  onChangePitch,
  preferredModel,
  onChangeModel,
}) => {
  const emotions = [
    { id: 'conversational', label: 'Conversational', icon: '💬', desc: 'Natural & friendly' },
    { id: 'griot', label: 'Griot Storyteller', icon: '🛖', desc: 'Deep folklore cadence' },
    { id: 'energetic', label: 'Upbeat & Vibrant', icon: '⚡', desc: 'High energy & excitement' },
    { id: 'broadcast', label: 'News Anchor', icon: '🎙️', desc: 'Formal studio diction' },
    { id: 'inspirational', label: 'Inspirational', icon: '🌟', desc: 'Uplifting & warm' },
    { id: 'calm', label: 'Calm & Serene', icon: '🍃', desc: 'Gentle & reflective' },
    { id: 'poetic', label: 'Poetic & Lyrical', icon: '✨', desc: 'Melodic artistic flow' },
  ];

  const pacingOptions = [
    { id: 'natural', label: 'Natural Flow', desc: 'Standard speaking cadence' },
    { id: 'syllable-timed', label: 'Syllable-Timed (West African)', desc: 'Rhythmic, equal syllable duration' },
    { id: 'deliberate', label: 'Deliberate & Measured', desc: 'Slow, wise, thoughtful' },
    { id: 'dynamic-fast', label: 'Brisk & Punchy', desc: 'Fast, modern radio pace' },
  ];

  return (
    <div className="bg-[#121624] border border-[#232b43] rounded-2xl p-5 sm:p-6 shadow-xl space-y-5">
      {/* Voice Persona Selection */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="text-xs font-semibold text-neutral-300 uppercase tracking-wider flex items-center gap-1.5">
            <Mic2 className="w-3.5 h-3.5 text-amber-400" />
            Base Voice Persona
          </label>
          <span className="text-[11px] text-neutral-500 font-mono">Gemini 3.8 Prebuilt</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
          {BASE_VOICES.map((voice) => {
            const isSelected = selectedVoice === voice.id;
            return (
              <button
                key={voice.id}
                type="button"
                onClick={() => onSelectVoice(voice.id)}
                className={`p-3 rounded-xl border text-left transition-all relative flex flex-col justify-between ${
                  isSelected
                    ? 'bg-gradient-to-b from-amber-500/25 to-amber-600/10 border-amber-400 shadow-md ring-1 ring-amber-400/30'
                    : 'bg-[#161a29] border-[#252e47] hover:border-[#354266] text-neutral-300 hover:text-white'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-sm text-white">{voice.name}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#1e2439] text-amber-300 font-mono">
                      {voice.gender.split(' ')[0]}
                    </span>
                  </div>
                  <p className="text-[11px] text-neutral-400 line-clamp-2 leading-relaxed">
                    {voice.timbre}
                  </p>
                </div>
                <div className="mt-2 text-[10px] text-amber-400/80 font-mono truncate">
                  {voice.bestFor.split(',')[0]}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tone & Emotion Selector */}
      <div>
        <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-2.5">
          Speech Emotion & Atmospheric Tone
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-2">
          {emotions.map((emo) => {
            const isSelected = selectedEmotion === emo.id;
            return (
              <button
                key={emo.id}
                type="button"
                onClick={() => onSelectEmotion(emo.id)}
                className={`p-2.5 rounded-xl border text-center transition-all ${
                  isSelected
                    ? 'bg-amber-500/20 border-amber-400 text-amber-300 shadow-sm'
                    : 'bg-[#161a29] border-[#252e47] text-neutral-400 hover:text-neutral-200 hover:bg-[#1b2134]'
                }`}
              >
                <div className="text-xl mb-1">{emo.icon}</div>
                <div className="text-xs font-medium leading-tight text-white">{emo.label}</div>
                <div className="text-[10px] text-neutral-400 mt-0.5 truncate">{emo.desc}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Pacing & Pitch Shift Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-[#20273d]">
        {/* Pacing */}
        <div>
          <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-2">
            Pacing & Cadence Flow
          </label>
          <div className="grid grid-cols-2 gap-2">
            {pacingOptions.map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => onSelectPacing(opt.id)}
                className={`p-2.5 rounded-xl border text-left transition-all ${
                  selectedPacing === opt.id
                    ? 'bg-amber-500/15 border-amber-500/50 text-white font-medium'
                    : 'bg-[#161a29] border-[#252e47] text-neutral-400 hover:text-neutral-200'
                }`}
              >
                <div className="text-xs font-semibold text-white">{opt.label}</div>
                <div className="text-[10px] text-neutral-400 mt-0.5">{opt.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Pitch Shift & TTS Model Tier */}
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-2">
              Vocal Resonance & Pitch
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'deep', label: 'Deep Resonance', desc: 'Heavy baritone' },
                { id: 'balanced', label: 'Natural Balanced', desc: 'Standard pitch' },
                { id: 'bright', label: 'Bright & Crisp', desc: 'Higher register' },
              ].map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => onChangePitch(p.id)}
                  className={`p-2 rounded-xl border text-center transition-all ${
                    pitchShift === p.id
                      ? 'bg-amber-500/15 border-amber-500/50 text-amber-300'
                      : 'bg-[#161a29] border-[#252e47] text-neutral-400 hover:text-white'
                  }`}
                >
                  <div className="text-xs font-medium text-white">{p.label}</div>
                  <div className="text-[10px] text-neutral-400">{p.desc}</div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">
                Speech Synthesis Engine
              </label>
            </div>
            <div className="flex items-center gap-2 mt-1">
              <button
                type="button"
                onClick={() => onChangeModel('gemini-3.8-flash-tts')}
                className={`flex-1 py-1.5 px-2.5 rounded-lg text-xs font-medium border text-center transition-all ${
                  preferredModel === 'gemini-3.8-flash-tts'
                    ? 'bg-amber-500/20 border-amber-500/60 text-amber-300'
                    : 'bg-[#161a29] border-[#232b43] text-neutral-400 hover:text-neutral-200'
                }`}
              >
                Gemini 3.8 Flash TTS <span className="text-[10px] text-neutral-400">(Studio)</span>
              </button>

              <button
                type="button"
                onClick={() => onChangeModel('gemini-3.8-flash-lite-tts')}
                className={`flex-1 py-1.5 px-2.5 rounded-lg text-xs font-medium border text-center transition-all ${
                  preferredModel === 'gemini-3.8-flash-lite-tts'
                    ? 'bg-amber-500/20 border-amber-500/60 text-amber-300'
                    : 'bg-[#161a29] border-[#232b43] text-neutral-400 hover:text-neutral-200'
                }`}
              >
                Flash-Lite TTS <span className="text-[10px] text-neutral-400">(Fast)</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
