import React from 'react';
import { BookOpen, Sparkles, X, Globe, Music, Volume2, ArrowRight } from 'lucide-react';
import { ACCENT_PRESETS } from '../data/presets';
import { AccentConfig } from '../types';

interface AccentLabModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectAndApply: (accent: AccentConfig, sampleText: string) => void;
}

export const AccentLabModal: React.FC<AccentLabModalProps> = ({
  isOpen,
  onClose,
  onSelectAndApply,
}) => {
  if (!isOpen) return null;

  const phoneticInsights = [
    {
      title: 'Stress-Timed vs Syllable-Timed Cadence',
      region: 'Worldwide Dialects',
      desc: 'Standard North American and British English are stress-timed (unstressed vowels compress), whereas many African, Caribbean, and South Asian varieties are syllable-timed, with equal syllable duration creating a lively, melodic rhythm.',
    },
    {
      title: 'Rhoticity & Consonant Coloring',
      region: 'North America, Scotland & Ireland',
      desc: 'Rhotic accents fully pronounce the "r" after vowels (as in "car" and "bird"), giving General American, Canadian, Scottish, and Irish speech its resonant phonetic presence compared to non-rhotic British RP and Australian.',
    },
    {
      title: 'Vowel Inflections & Intonation Contours',
      region: 'British, Irish & Pacific',
      desc: 'Accents convey cultural character through intonation. Australian English features relaxed vowel shifts with gentle terminal rises, while Irish English carries a lyrical rising-and-falling musical cadence.',
    },
    {
      title: 'Regional Tone & Oral Storytelling',
      region: 'Global & Regional Traditions',
      desc: 'From venerable West African Griot folklore to Mediterranean expressiveness and Latin American warmth, regional speech uses distinct pitch arcs, deliberate pauses, and breath punctuation for emotional resonance.',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#121624] border border-[#27324f] rounded-2xl max-w-4xl w-full p-6 sm:p-8 shadow-2xl relative my-8 max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-[#1a2033] hover:bg-[#252e49] text-neutral-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-600 to-amber-400 flex items-center justify-center text-black shadow-lg shadow-amber-500/20">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold font-display text-white">
              Global Accent & Dialect Field Guide
            </h2>
            <p className="text-xs text-neutral-400 mt-0.5">
              Explore the phonetic patterns, intonations, and speech cadence across worldwide accents in OmniVoice AI
            </p>
          </div>
        </div>

        {/* Phonetic Insight Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 mb-8">
          {phoneticInsights.map((insight, i) => (
            <div
              key={i}
              className="p-4 rounded-xl bg-[#161a2a] border border-[#232c45] relative overflow-hidden"
            >
              <div className="flex items-center justify-between mb-1.5">
                <h4 className="text-sm font-bold text-amber-300">{insight.title}</h4>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 font-mono">
                  {insight.region}
                </span>
              </div>
              <p className="text-xs text-neutral-300 leading-relaxed">{insight.desc}</p>
            </div>
          ))}
        </div>

        {/* Interactive Accent Audition List */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Globe className="w-4 h-4 text-amber-400" />
              Audition African Accents & Load Presets
            </h3>
            <span className="text-xs text-neutral-500">Click any accent to load into Studio</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {ACCENT_PRESETS.map((accent) => (
              <div
                key={accent.id}
                className="p-4 rounded-xl bg-[#161b2b] hover:bg-[#1c2236] border border-[#232c44] hover:border-amber-500/40 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-2.5 mb-1.5">
                    <span className="text-3xl">{accent.flag}</span>
                    <div>
                      <h4 className="text-sm font-bold text-white leading-tight">
                        {accent.name}
                      </h4>
                      <span className="text-[10px] text-amber-400/90 font-mono">
                        {accent.region}
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-neutral-400 line-clamp-2 mt-1">
                    {accent.description}
                  </p>
                </div>

                <button
                  onClick={() => {
                    onSelectAndApply(accent, accent.sampleScript);
                    onClose();
                  }}
                  className="mt-3 w-full py-1.5 px-3 rounded-lg text-xs font-semibold bg-amber-500/15 hover:bg-amber-500 text-amber-300 hover:text-black border border-amber-500/30 flex items-center justify-center gap-1.5 transition-all"
                >
                  <span>Select & Load Script</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
