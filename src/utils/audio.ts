/**
 * Audio helpers for AfriVoice Studio
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
  return Math.ceil((wordCount / wordsPerMinute) * 60);
}

/**
 * Fallback browser Web Speech Synthesis for offline quick testing
 */
export function speakWithBrowserSynthesis(
  text: string,
  onStart?: () => void,
  onEnd?: () => void,
  rate = 1.0,
  pitch = 1.0
): SpeechSynthesisUtterance | null {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    return null;
  }

  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = rate;
  utterance.pitch = pitch;

  // Attempt to select an English voice with African locale if present (e.g. en-ZA, en-NG)
  const voices = window.speechSynthesis.getVoices();
  const africanVoice = voices.find(
    (v) =>
      v.lang.toLowerCase().includes('en-za') ||
      v.lang.toLowerCase().includes('en-ng') ||
      v.name.toLowerCase().includes('south africa') ||
      v.name.toLowerCase().includes('nigeria')
  );

  if (africanVoice) {
    utterance.voice = africanVoice;
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
