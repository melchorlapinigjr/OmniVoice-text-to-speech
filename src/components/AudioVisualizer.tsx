import React, { useRef, useEffect } from 'react';

interface AudioVisualizerProps {
  isPlaying: boolean;
  progress: number; // 0 to 1
  onSeek: (progress: number) => void;
  barCount?: number;
}

export const AudioVisualizer: React.FC<AudioVisualizerProps> = ({
  isPlaying,
  progress,
  onSeek,
  barCount = 48,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Generate pseudo-random bar heights that look like realistic speech formants
  // (higher in vowels, dips on consonants and pauses)
  const barHeights = React.useMemo(() => {
    const bars: number[] = [];
    for (let i = 0; i < barCount; i++) {
      const x = i / barCount;
      // Speech waveform pattern simulation with natural modulation
      const wave1 = Math.sin(x * Math.PI * 4) * 0.35 + 0.5;
      const wave2 = Math.sin(x * Math.PI * 12) * 0.2;
      const jitter = ((i * 17) % 19) / 70;
      const height = Math.min(0.95, Math.max(0.12, wave1 + wave2 + jitter));
      bars.push(height);
    }
    return bars;
  }, [barCount]);

  const handlePointerDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const newProgress = Math.max(0, Math.min(1, clickX / rect.width));
    onSeek(newProgress);
  };

  return (
    <div
      ref={containerRef}
      onClick={handlePointerDown}
      className="relative w-full h-20 bg-[#10131f] rounded-xl border border-[#20273d] p-3 flex items-center justify-between gap-1 cursor-pointer select-none group hover:border-amber-500/40 transition-colors"
      title="Click anywhere to scrub playback position"
    >
      {/* Background track line */}
      <div className="absolute inset-x-3 top-1/2 -translate-y-1/2 h-0.5 bg-[#1e253a] pointer-events-none" />

      {/* Progress line highlight */}
      <div
        className="absolute left-3 top-1/2 -translate-y-1/2 h-0.5 bg-gradient-to-r from-amber-600 to-amber-400 pointer-events-none transition-all duration-75"
        style={{ width: `calc((100% - 24px) * ${progress})` }}
      />

      {/* Scrubber head */}
      <div
        className="absolute top-1/2 -translate-y-1/2 w-3.5 h-7 rounded-full bg-amber-400 shadow-md shadow-amber-500/50 pointer-events-none transition-all duration-75 flex items-center justify-center -translate-x-1/2 z-10"
        style={{ left: `calc(12px + (100% - 24px) * ${progress})` }}
      >
        <div className="w-1 h-3 rounded-full bg-black/70" />
      </div>

      {/* Waveform Bars */}
      {barHeights.map((h, i) => {
        const barPos = i / barCount;
        const isPast = barPos <= progress;

        return (
          <div
            key={i}
            className="flex-1 flex items-center justify-center h-full relative"
          >
            <div
              className={`w-full max-w-[4px] rounded-full transition-all duration-150 ${
                isPast
                  ? 'bg-gradient-to-t from-amber-600 via-amber-400 to-amber-300'
                  : 'bg-[#252c42] group-hover:bg-[#2e3752]'
              } ${isPlaying && isPast ? 'animate-pulse' : ''}`}
              style={{
                height: `${Math.round(h * 100)}%`,
                opacity: isPast ? 1 : 0.65,
                transform: isPlaying && isPast ? `scaleY(${1 + (Math.sin(i * 1.5) * 0.15)})` : 'scaleY(1)',
              }}
            />
          </div>
        );
      })}
    </div>
  );
};
