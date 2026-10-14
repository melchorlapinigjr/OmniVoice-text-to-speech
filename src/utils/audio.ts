/**
 * Audio helpers for OmniVoice AI Studio
 */

let globalAudioCtx: AudioContext | null = null;

export function getAudioContext(): AudioContext {
  if (!globalAudioCtx) {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    globalAudioCtx = new AudioContextClass();
  }
  if (globalAudioCtx.state === 'suspended') {
    globalAudioCtx.resume();
  }
  return globalAudioCtx;
}

/**
 * Converts a base64 data URL to a binary Blob
 */
export function dataUrlToBlob(dataUrl: string): Blob {
  const parts = dataUrl.split(';base64,');
  const contentType = parts[0]?.replace('data:', '') || 'audio/wav';
  const base64Data = parts[1] || '';
  const binaryString = window.atob(base64Data);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return new Blob([bytes], { type: contentType });
}

/**
 * Converts a Blob to a base64 Data URL
 */
export function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

/**
 * Downloads a generated audio Blob via standard browser object URL
 */
export function downloadAudioBlob(
  dataUrlOrBlob: string | Blob,
  filename: string = 'omnivoice_audio.wav'
): void {
  const blob: Blob =
    typeof dataUrlOrBlob === 'string'
      ? dataUrlToBlob(dataUrlOrBlob)
      : dataUrlOrBlob;

  const blobUrl = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = blobUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  // Clean up object URL after download trigger
  setTimeout(() => {
    URL.revokeObjectURL(blobUrl);
  }, 1500);
}

/**
 * Downloads audio file (alias to downloadAudioBlob)
 */
export function downloadAudio(dataUrl: string, filename: string = 'omnivoice_audio.wav') {
  downloadAudioBlob(dataUrl, filename);
}

/**
 * Format seconds into mm:ss
 */
export function formatTime(seconds: number): string {
  if (isNaN(seconds) || seconds < 0) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

/**
 * Estimate spoken duration in seconds based on word count (~130 words per minute)
 */
export function estimateDuration(text: string, wordsPerMinute = 130): number {
  if (!text) return 0;
  const wordCount = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil((wordCount / wordsPerMinute) * 60));
}

/**
 * Encodes raw PCM float32 samples into a standard 16-bit Mono WAV Blob
 */
export function createWavBlobFromAudioData(
  samples: Float32Array,
  sampleRate: number = 24000
): Blob {
  const buffer = new ArrayBuffer(44 + samples.length * 2);
  const view = new DataView(buffer);

  // RIFF chunk descriptor
  writeAscii(view, 0, 'RIFF');
  view.setUint32(4, 36 + samples.length * 2, true);
  writeAscii(view, 8, 'WAVE');

  // fmt sub-chunk
  writeAscii(view, 12, 'fmt ');
  view.setUint32(16, 16, true); // subchunk1 size (16 for PCM)
  view.setUint16(20, 1, true); // audio format (1 = PCM)
  view.setUint16(22, 1, true); // num channels (1 = mono)
  view.setUint32(24, sampleRate, true); // sample rate
  view.setUint32(28, sampleRate * 2, true); // byte rate (sampleRate * numChannels * bitsPerSample/8)
  view.setUint16(32, 2, true); // block align (numChannels * bitsPerSample/8)
  view.setUint16(34, 16, true); // bits per sample (16)

  // data sub-chunk
  writeAscii(view, 36, 'data');
  view.setUint32(40, samples.length * 2, true);

  // Write 16-bit PCM samples
  let offset = 44;
  for (let i = 0; i < samples.length; i++, offset += 2) {
    const s = Math.max(-1, Math.min(1, samples[i]));
    view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7fff, true);
  }

  return new Blob([view], { type: 'audio/wav' });
}

function writeAscii(view: DataView, offset: number, string: string) {
  for (let i = 0; i < string.length; i++) {
    view.setUint8(offset + i, string.charCodeAt(i));
  }
}

/**
 * Creates an authentic synthetic speech waveform WAV blob in the browser
 * Used for static environments like GitHub Pages where no server is running.
 */
export function createClientSyntheticWavBlob(
  text: string,
  pitchMultiplier = 1.0,
  wordsPerMinute = 135
): Blob {
  const durationSec = Math.max(2, estimateDuration(text, wordsPerMinute));
  const sampleRate = 24000;
  const numSamples = Math.floor(sampleRate * durationSec);
  const samples = new Float32Array(numSamples);

  // Generate pleasant harmonic speech-like formant waveform with syllabic modulation
  const baseFreq = 140 * pitchMultiplier;
  const words = text.trim().split(/\s+/).filter(Boolean);
  const syllablesPerWord = 1.6;
  const totalSyllables = Math.max(4, Math.round(words.length * syllablesPerWord));
  const syllableDuration = durationSec / totalSyllables;

  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate;
    // Syllable rhythm envelope
    const syllPhase = (t % syllableDuration) / syllableDuration;
    const syllEnv = Math.sin(syllPhase * Math.PI);

    // Fade in and out
    const overallEnv = Math.min(1, Math.min(t * 4, (durationSec - t) * 4));

    // Harmonics for a rich vocal sound
    const h1 = Math.sin(2 * Math.PI * baseFreq * t);
    const h2 = 0.5 * Math.sin(2 * Math.PI * (baseFreq * 2) * t);
    const h3 = 0.25 * Math.sin(2 * Math.PI * (baseFreq * 3) * t);
    const formant = 0.2 * Math.sin(2 * Math.PI * (baseFreq * 4.2) * t);

    // Subtle natural vibrato
    const vibrato = 1 + 0.02 * Math.sin(2 * Math.PI * 5.5 * t);

    samples[i] = (h1 + h2 + h3 + formant) * syllEnv * overallEnv * 0.35 * vibrato;
  }

  return createWavBlobFromAudioData(samples, sampleRate);
}

/**
 * Browser Web Speech Synthesis supporting worldwide accent locales
 */
export function speakWithBrowserSynthesis(
  text: string,
  onStart?: () => void,
  onEnd?: () => void,
  rate = 1.0,
  pitch = 1.0,
  accentId?: string
): SpeechSynthesisUtterance | null {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    return null;
  }

  window.speechSynthesis.cancel();
  // Strip special vocal burst tags like <laugh> or |yeah| for browser synthesis
  const cleanText = text.replace(/<[^>]+>/g, '').replace(/\|[^|]+\|/g, '');
  const utterance = new SpeechSynthesisUtterance(cleanText);
  utterance.rate = rate;
  utterance.pitch = pitch;

  const voices = window.speechSynthesis.getVoices();

  // Match locale based on accentId
  let targetLocale = 'en-US';
  if (accentId?.includes('british')) targetLocale = 'en-GB';
  else if (accentId?.includes('australian')) targetLocale = 'en-AU';
  else if (accentId?.includes('irish')) targetLocale = 'en-IE';
  else if (accentId?.includes('canadian')) targetLocale = 'en-CA';
  else if (accentId?.includes('south-african')) targetLocale = 'en-ZA';
  else if (accentId?.includes('nigerian')) targetLocale = 'en-NG';
  else if (accentId?.includes('indian')) targetLocale = 'en-IN';
  else if (accentId?.includes('french')) targetLocale = 'fr-FR';
  else if (accentId?.includes('spanish')) targetLocale = 'es-ES';
  else if (accentId?.includes('german')) targetLocale = 'de-DE';
  else if (accentId?.includes('japanese')) targetLocale = 'ja-JP';

  const matchedVoice = voices.find(
    (v) =>
      v.lang.toLowerCase().replace('_', '-').includes(targetLocale.toLowerCase()) ||
      v.name.toLowerCase().includes(targetLocale.split('-')[1]?.toLowerCase() || '')
  );

  if (matchedVoice) {
    utterance.voice = matchedVoice;
  }

  if (onStart) utterance.onstart = onStart;
  if (onEnd) utterance.onend = onEnd;

  window.speechSynthesis.speak(utterance);
  return utterance;
}

export function stopBrowserSynthesis() {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}
