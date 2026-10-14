import React, { useState } from 'react';
import { Sparkles, Globe, Plus, Sliders, Check, Search, Info } from 'lucide-react';
import { AccentConfig } from '../types';
import { ACCENT_PRESETS, REGIONS } from '../data/presets';

interface AccentSelectorProps {
  selectedAccentId: string;
  onSelectAccent: (accent: AccentConfig) => void;
  accentIntensity: 'subtle' | 'authentic' | 'pronounced';
  onChangeIntensity: (intensity: 'subtle' | 'authentic' | 'pronounced') => void;
  customAccentName: string;
  customAccentDescription: string;
  onUpdateCustomAccent: (name: string, description: string) => void;
  isCustomAccentActive: boolean;
  setIsCustomAccentActive: (active: boolean) => void;
  onApplySampleScript?: (script: string) => void;
}

export const AccentSelector: React.FC<AccentSelectorProps> = ({
  selectedAccentId,
  onSelectAccent,
  accentIntensity,
  onChangeIntensity,
  customAccentName,
  customAccentDescription,
  onUpdateCustomAccent,
  isCustomAccentActive,
  setIsCustomAccentActive,
  onApplySampleScript,
}) => {
  const [selectedRegion, setSelectedRegion] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [showCustomModal, setShowCustomModal] = useState(false);
  const [modalName, setModalName] = useState(customAccentName || 'Cameroonian Pidgin English');
  const [modalDesc, setModalDesc] = useState(
    customAccentDescription ||
      'Lively West-Central African pidgin rhythm, energetic syllable cadence, warm tone.'
  );

  const filteredAccents = ACCENT_PRESETS.filter((accent) => {
    const matchesRegion =
      selectedRegion === 'All' || accent.region.toLowerCase().includes(selectedRegion.toLowerCase());
    const matchesSearch =
      accent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      accent.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
      accent.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesRegion && matchesSearch;
  });

  const handleSaveCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!modalName.trim()) return;
    onUpdateCustomAccent(modalName.trim(), modalDesc.trim());
    setIsCustomAccentActive(true);
    setShowCustomModal(false);
  };

  return (
    <div className="bg-[#121624] border border-[#232b43] rounded-2xl p-5 sm:p-6 shadow-xl">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold font-display text-white flex items-center gap-2">
              <Globe className="w-5 h-5 text-amber-400" />
              Global Accent & Dialect Selection
            </h2>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20">
              {ACCENT_PRESETS.length} Accents
            </span>
          </div>
          <p className="text-xs text-neutral-400 mt-1">
            Pick from authentic American, British, European, African, Asian, and Caribbean speech cadences.
          </p>
        </div>

        {/* Accent Intensity Pill Selector */}
        <div className="flex items-center gap-2 bg-[#171b2b] p-1 rounded-xl border border-[#252e47] self-start sm:self-auto">
          <span className="text-[11px] font-semibold text-neutral-400 px-2 flex items-center gap-1">
            <Sliders className="w-3 h-3 text-amber-400" />
            Intensity:
          </span>
          {[
            { id: 'subtle', label: 'Subtle (25%)' },
            { id: 'authentic', label: 'Authentic (100%)' },
            { id: 'pronounced', label: 'Deep (150%)' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => onChangeIntensity(item.id as any)}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                accentIntensity === item.id
                  ? 'bg-amber-500 text-black font-semibold shadow-sm'
                  : 'text-neutral-300 hover:text-white'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Region Filter Bar & Search */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 mb-4">
        {/* Regions tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full scrollbar-none">
          {REGIONS.map((region) => (
            <button
              key={region}
              onClick={() => setSelectedRegion(region)}
              className={`whitespace-nowrap px-3 py-1.5 rounded-xl text-xs font-medium transition-all border ${
                selectedRegion === region
                  ? 'bg-amber-500/20 border-amber-500/50 text-amber-300 shadow-sm'
                  : 'bg-[#161a2a] border-[#252e49] text-neutral-400 hover:text-neutral-200 hover:bg-[#1d2338]'
              }`}
            >
              {region}
            </button>
          ))}
        </div>

        {/* Search Input & Custom Accent Button */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1 sm:w-48">
            <Search className="w-3.5 h-3.5 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search accent, country..."
              className="w-full bg-[#161a29] border border-[#27304b] rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500/60"
            />
          </div>

          <button
            onClick={() => setShowCustomModal(true)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${
              isCustomAccentActive
                ? 'bg-amber-500 text-black border-amber-400 font-bold shadow-md shadow-amber-500/20'
                : 'bg-[#181d2e] hover:bg-[#222a42] text-amber-300 border-amber-500/30'
            }`}
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{isCustomAccentActive ? 'Custom Active' : 'Custom Dialect'}</span>
          </button>
        </div>
      </div>

      {/* Custom Accent active banner if applicable */}
      {isCustomAccentActive && (
        <div className="mb-4 p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
            <div>
              <p className="text-xs font-semibold text-amber-300">
                Custom Accent Active: <span className="text-white font-bold">{customAccentName}</span>
              </p>
              <p className="text-[11px] text-neutral-300 line-clamp-1">{customAccentDescription}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowCustomModal(true)}
              className="text-[11px] text-amber-400 hover:underline"
            >
              Edit
            </button>
            <button
              onClick={() => setIsCustomAccentActive(false)}
              className="text-[11px] text-neutral-400 hover:text-white"
            >
              Reset to Presets
            </button>
          </div>
        </div>
      )}

      {/* Accent Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 max-h-[340px] overflow-y-auto pr-1">
        {filteredAccents.map((accent) => {
          const isSelected = !isCustomAccentActive && selectedAccentId === accent.id;

          return (
            <div
              key={accent.id}
              onClick={() => {
                setIsCustomAccentActive(false);
                onSelectAccent(accent);
              }}
              className={`p-3 rounded-xl border text-left cursor-pointer transition-all relative flex flex-col justify-between ${
                isSelected
                  ? 'bg-gradient-to-br from-amber-500/20 to-orange-500/10 border-amber-400 ring-2 ring-amber-500/20 shadow-md'
                  : 'bg-[#161a29]/90 hover:bg-[#1c2236] border-[#252e4a] hover:border-[#384469]'
              }`}
            >
              {isSelected && (
                <div className="absolute top-2.5 right-2.5 w-5 h-5 rounded-full bg-amber-400 text-black flex items-center justify-center">
                  <Check className="w-3 h-3 stroke-[3]" />
                </div>
              )}

              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-2xl">{accent.flag}</span>
                  <div>
                    <h4 className="text-sm font-semibold text-white leading-tight">
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

              {onApplySampleScript && (
                <div className="mt-2.5 pt-2 border-t border-[#20273d] flex items-center justify-between">
                  <span className="text-[10px] text-neutral-500">Sample script available</span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsCustomAccentActive(false);
                      onSelectAccent(accent);
                      onApplySampleScript(accent.sampleScript);
                    }}
                    className="text-[10px] text-amber-300 hover:text-amber-200 hover:underline font-medium"
                  >
                    Load Sample Script
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Custom Dialect Modal */}
      {showCustomModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#141827] border border-[#2d3755] rounded-2xl p-6 max-w-md w-full shadow-2xl relative">
            <h3 className="text-lg font-bold font-display text-white flex items-center gap-2 mb-1">
              <Sparkles className="w-5 h-5 text-amber-400" />
              Custom Dialect / Accent
            </h3>
            <p className="text-xs text-neutral-400 mb-4">
              Enter any specific regional dialect, country accent, or linguistic styling you want Gemini TTS to model (e.g. Scottish Gaelic, Australian Outback, Singaporean, Jamaican Patois, Nigerian Pidgin, Brazilian English).
            </p>

            <form onSubmit={handleSaveCustom} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1">
                  Accent / Dialect Name
                </label>
                <input
                  type="text"
                  value={modalName}
                  onChange={(e) => setModalName(e.target.value)}
                  placeholder="e.g., Australian Outback English"
                  className="w-full bg-[#1a2034] border border-[#2d3755] rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1">
                  Phonetic & Cadence Description (Voice Prompt Direction)
                </label>
                <textarea
                  value={modalDesc}
                  onChange={(e) => setModalDesc(e.target.value)}
                  rows={3}
                  placeholder="e.g. Energetic syllable cadence, characteristic vowel shift, warm West-Central African rhythm."
                  className="w-full bg-[#1a2034] border border-[#2d3755] rounded-xl p-3 text-xs text-white focus:outline-none focus:border-amber-500"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCustomModal(false)}
                  className="px-4 py-2 rounded-xl text-xs text-neutral-300 hover:bg-[#1f263d] transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-amber-500 hover:bg-amber-400 text-black shadow-md shadow-amber-500/20 transition-all"
                >
                  Save & Apply Dialect
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
