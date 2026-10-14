import React from 'react';
import { X, Play, Download, Trash2, History, Volume2, Clock } from 'lucide-react';
import { GeneratedClip } from '../types';
import { formatTime, downloadAudio } from '../utils/audio';

interface HistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  clips: GeneratedClip[];
  onPlayClip: (clip: GeneratedClip) => void;
  onDeleteClip: (id: string) => void;
  onClearAll: () => void;
  activeClipId?: string;
}

export const HistoryDrawer: React.FC<HistoryDrawerProps> = ({
  isOpen,
  onClose,
  clips,
  onPlayClip,
  onDeleteClip,
  onClearAll,
  activeClipId,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex justify-end">
      <div className="bg-[#10131f] border-l border-[#242c44] w-full max-w-md h-full flex flex-col p-6 shadow-2xl relative animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#20273d]">
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-amber-400" />
            <h3 className="text-base font-bold text-white">Voice Generation Library</h3>
            <span className="text-xs bg-[#191f33] text-amber-300 px-2 py-0.5 rounded-full font-mono">
              {clips.length}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {clips.length > 0 && (
              <button
                onClick={onClearAll}
                className="text-xs text-neutral-400 hover:text-rose-400 transition-colors"
              >
                Clear All
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-[#1a2033]"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Clip List */}
        <div className="flex-1 overflow-y-auto py-4 space-y-3">
          {clips.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-neutral-400">
              <Volume2 className="w-12 h-12 text-neutral-600 mb-3" />
              <p className="text-sm font-medium text-neutral-300">No saved audio clips yet</p>
              <p className="text-xs text-neutral-500 mt-1">
                Audio generated in the studio will appear here automatically.
              </p>
            </div>
          ) : (
            clips.map((clip) => {
              const isActive = activeClipId === clip.id;
              return (
                <div
                  key={clip.id}
                  className={`p-3.5 rounded-xl border transition-all ${
                    isActive
                      ? 'bg-amber-500/15 border-amber-500/40 ring-1 ring-amber-500/20'
                      : 'bg-[#151929] hover:bg-[#1a2033] border-[#222a42]'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{clip.accentFlag}</span>
                      <div>
                        <h4 className="text-xs font-bold text-white leading-tight">
                          {clip.accentName}
                        </h4>
                        <span className="text-[10px] text-amber-400/90 font-mono">
                          Voice: {clip.voiceName} • {clip.emotion}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() =>
                          downloadAudio(
                            clip.audioUrl,
                            `omnivoice_${clip.accentName.toLowerCase().replace(/[^a-z0-9]/g, '_')}.wav`
                          )
                        }
                        className="p-1.5 rounded-lg text-neutral-400 hover:text-amber-400 hover:bg-[#20273f]"
                        title="Download Audio"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onDeleteClip(clip.id)}
                        className="p-1.5 rounded-lg text-neutral-400 hover:text-rose-400 hover:bg-[#20273f]"
                        title="Delete clip"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <p className="text-xs text-neutral-300 line-clamp-2 italic mb-2.5">
                    "{clip.text}"
                  </p>

                  <div className="flex items-center justify-between pt-2 border-t border-[#1e2439] text-[11px] text-neutral-400 font-mono">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-neutral-500" />
                      {new Date(clip.timestamp).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>

                    <button
                      onClick={() => onPlayClip(clip)}
                      className="flex items-center gap-1 font-semibold text-amber-400 hover:text-amber-300"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>{isActive ? 'Active' : 'Play Now'}</span>
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
