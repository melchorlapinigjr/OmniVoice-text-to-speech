import React, { useState, useRef, useEffect } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  RotateCw,
  Download,
  Repeat,
  Volume2,
  Sliders,
  Sparkles,
  Share2,
  Check,
} from 'lucide-react';
import { GeneratedClip } from '../types';
import { AudioVisualizer } from './AudioVisualizer';
import { formatTime, downloadAudioBlob } from '../utils/audio';

interface AudioPlayerProps {
  clip: GeneratedClip | null;
  onClipUpdate?: (clip: GeneratedClip) => void;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({ clip }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1.0);
  const [isLooping, setIsLooping] = useState(false);
  const [eqPreset, setEqPreset] = useState<'clean' | 'warm-radio' | 'griot-hall' | 'bass-boost'>('clean');
  const [copied, setCopied] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Reset state when new clip is passed
  useEffect(() => {
    if (audioRef.current && clip?.audioUrl) {
      audioRef.current.src = clip.audioUrl;
      audioRef.current.playbackRate = playbackRate;
      audioRef.current.loop = isLooping;
      audioRef.current.load();
      setCurrentTime(0);
      setIsPlaying(false);

      // Auto play on new clip creation
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => setIsPlaying(true))
          .catch(() => {
            // Autoplay may be blocked by browser policy until user interaction
            setIsPlaying(false);
          });
      }
    }
  }, [clip?.audioUrl]);

  const togglePlay = () => {
    if (!audioRef.current || !clip) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleTimeUpdate = () => {
    if (!audioRef.current) return;
    setCurrentTime(audioRef.current.currentTime);
  };

  const handleLoadedMetadata = () => {
    if (!audioRef.current) return;
    setDuration(audioRef.current.duration);
  };

  const handleEnded = () => {
    if (!isLooping) {
      setIsPlaying(false);
      setCurrentTime(0);
    }
  };

  const handleSeek = (newProgress: number) => {
    if (!audioRef.current || !duration) return;
    const targetTime = newProgress * duration;
    audioRef.current.currentTime = targetTime;
    setCurrentTime(targetTime);
  };

  const skipSeconds = (sec: number) => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = Math.max(0, Math.min(duration, audioRef.current.currentTime + sec));
  };

  const handleRateChange = (rate: number) => {
    setPlaybackRate(rate);
    if (audioRef.current) {
      audioRef.current.playbackRate = rate;
    }
  };

  const toggleLoop = () => {
    const next = !isLooping;
    setIsLooping(next);
    if (audioRef.current) {
      audioRef.current.loop = next;
    }
  };

  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = () => {
    if (!clip?.audioUrl) return;
    setIsDownloading(true);
    try {
      const sanitizedTitle = (clip.title || 'audio_speech')
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '_')
        .substring(0, 30);
      const filename = `${sanitizedTitle || 'speech'}_${Date.now()}.wav`;
      downloadAudioBlob(clip.audioUrl, filename);
    } catch (e) {
      console.error('Download error:', e);
    } finally {
      setTimeout(() => setIsDownloading(false), 1200);
    }
  };

  const handleCopyLink = () => {
    if (!clip) return;
    const shareText = `OmniVoice Studio clip: "${clip.text.slice(0, 80)}..." spoken with ${clip.accentFlag} ${clip.accentName} accent and ${clip.voiceName} persona.`;
    navigator.clipboard.writeText(shareText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  if (!clip) {
    return (
      <div className="bg-[#121624] border border-[#20273d] rounded-2xl p-8 flex flex-col items-center justify-center text-center">
        <div className="w-14 h-14 rounded-2xl bg-[#181d2e] border border-[#262f4a] flex items-center justify-center text-neutral-400 mb-3">
          <Volume2 className="w-7 h-7 text-neutral-500" />
        </div>
        <h3 className="text-base font-semibold text-neutral-200">No Audio Generated Yet</h3>
        <p className="text-sm text-neutral-400 max-w-sm mt-1">
          Type or select a sample script above, choose your voice settings, and click{' '}
          <span className="text-amber-400 font-medium">Generate Speech</span>.
        </p>
      </div>
    );
  }

  const progress = duration > 0 ? currentTime / duration : 0;

  return (
    <div className="bg-[#121624] border border-[#232b43] rounded-2xl p-5 sm:p-6 shadow-xl relative overflow-hidden">
      {/* Decorative ambient background glow */}
      <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 bg-orange-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Hidden native audio element */}
      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
        preload="metadata"
      />

      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-4 border-b border-[#20273d]">
        <div className="flex items-center gap-3">
          <span className="text-3xl filter drop-shadow-md">{clip.accentFlag}</span>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-white text-base">
                {clip.accentName}
              </h3>
              <span className="px-2 py-0.5 rounded-full text-[11px] font-mono font-medium bg-amber-500/15 text-amber-300 border border-amber-500/30">
                Voice: {clip.voiceName}
              </span>
              {clip.modelUsed && (
                <span className="hidden md:inline px-2 py-0.5 rounded-full text-[10px] font-mono bg-blue-500/10 text-blue-300 border border-blue-500/20">
                  {clip.modelUsed}
                </span>
              )}
            </div>
            <p className="text-xs text-neutral-400 mt-0.5 line-clamp-1 italic">
              "{clip.text}"
            </p>
          </div>
        </div>

        {/* Action icons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyLink}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-[#1a2033] hover:bg-[#232c45] text-neutral-300 border border-[#2b3552] transition-colors"
            title="Copy script details"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Share'}</span>
          </button>

          {/* Prominent Download Audio Button */}
          <button
            onClick={handleDownload}
            disabled={isDownloading}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-black shadow-lg shadow-amber-500/25 active:scale-95 transition-all cursor-pointer"
            title="Download the generated audio blob to your browser"
          >
            {isDownloading ? (
              <>
                <Check className="w-4 h-4 text-black animate-bounce" />
                <span>Downloading Blob...</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4 stroke-[2.5]" />
                <span>Download Audio</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Waveform Scrubber */}
      <div className="mb-4">
        <AudioVisualizer
          isPlaying={isPlaying}
          progress={progress}
          onSeek={handleSeek}
        />
        <div className="flex items-center justify-between text-xs font-mono text-neutral-400 mt-1.5 px-1">
          <span>{formatTime(currentTime)}</span>
          <span className="text-neutral-500 text-[11px]">24kHz Mono WAV • 16-bit</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* Playback Controls & Equalizer Presets */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-2">
        {/* Core Play Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => skipSeconds(-5)}
            className="p-2 rounded-xl bg-[#181d2e] hover:bg-[#222a42] text-neutral-300 border border-[#28324f] transition-all"
            title="Rewind 5 seconds"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            onClick={togglePlay}
            className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-black transition-all transform active:scale-95 shadow-lg ${
              isPlaying
                ? 'bg-amber-400 hover:bg-amber-300 shadow-amber-500/30 ring-4 ring-amber-500/20'
                : 'bg-gradient-to-tr from-amber-500 to-amber-300 hover:from-amber-400 hover:to-amber-200 shadow-amber-500/40'
            }`}
            title={isPlaying ? 'Pause' : 'Play audio'}
          >
            {isPlaying ? (
              <Pause className="w-6 h-6 fill-black" />
            ) : (
              <Play className="w-6 h-6 fill-black ml-0.5" />
            )}
          </button>

          <button
            onClick={() => skipSeconds(5)}
            className="p-2 rounded-xl bg-[#181d2e] hover:bg-[#222a42] text-neutral-300 border border-[#28324f] transition-all"
            title="Forward 5 seconds"
          >
            <RotateCw className="w-4 h-4" />
          </button>

          <button
            onClick={toggleLoop}
            className={`p-2 rounded-xl border transition-all ${
              isLooping
                ? 'bg-amber-500/20 border-amber-500/50 text-amber-300'
                : 'bg-[#181d2e] hover:bg-[#222a42] text-neutral-400 border-[#28324f]'
            }`}
            title={isLooping ? 'Looping enabled' : 'Loop audio'}
          >
            <Repeat className="w-4 h-4" />
          </button>
        </div>

        {/* Speed Controls */}
        <div className="flex items-center gap-1 bg-[#161a29] p-1 rounded-xl border border-[#242c44]">
          {[0.75, 1.0, 1.25, 1.5, 2.0].map((rate) => (
            <button
              key={rate}
              onClick={() => handleRateChange(rate)}
              className={`px-2.5 py-1 rounded-lg text-xs font-mono font-medium transition-all ${
                playbackRate === rate
                  ? 'bg-amber-500 text-black font-bold'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              {rate}x
            </button>
          ))}
        </div>

        {/* Studio Acoustic Equalizer Presets */}
        <div className="flex items-center gap-1.5 text-xs">
          <span className="text-neutral-500 flex items-center gap-1 text-[11px] uppercase tracking-wider font-semibold">
            <Sliders className="w-3.5 h-3.5 text-amber-400" />
            EQ:
          </span>
          <div className="flex items-center gap-1 bg-[#161a29] p-1 rounded-xl border border-[#242c44]">
            {[
              { id: 'clean', label: 'Studio Flat' },
              { id: 'warm-radio', label: 'Warm Radio' },
              { id: 'griot-hall', label: 'Griot Hall' },
              { id: 'bass-boost', label: 'Deep Bass' },
            ].map((preset) => (
              <button
                key={preset.id}
                onClick={() => setEqPreset(preset.id as any)}
                className={`px-2 py-1 rounded-lg text-[11px] font-medium transition-all ${
                  eqPreset === preset.id
                    ? 'bg-[#29324e] text-amber-300 font-semibold'
                    : 'text-neutral-400 hover:text-neutral-200'
                }`}
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
