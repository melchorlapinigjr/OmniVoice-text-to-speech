export interface AccentConfig {
  id: string;
  name: string;
  region: string;
  country: string;
  flag: string;
  description: string;
  promptStyle: string;
  sampleScript: string;
}

export interface VoiceConfig {
  id: string;
  name: string;
  gender: string;
  timbre: string;
  bestFor: string;
}

export interface TTSGenerationOptions {
  text: string;
  accentId: string;
  customAccentName?: string;
  customAccentDescription?: string;
  voiceName: string;
  emotion: string;
  pacing: string;
  accentIntensity: 'subtle' | 'authentic' | 'pronounced';
  pitchShift: string;
  customStyleNotes?: string;
  preferredModel: 'gemini-3.8-flash-tts' | 'gemini-3.8-flash-lite-tts';
}

export interface GeneratedClip {
  id: string;
  title: string;
  text: string;
  accentName: string;
  accentFlag: string;
  voiceName: string;
  emotion: string;
  audioUrl: string; // data:audio/wav;base64,... or blob:
  timestamp: number;
  duration?: number;
  modelUsed?: string;
}

export interface DialogueTurn {
  id: string;
  speaker: string;
  text: string;
  voiceName: string;
  accentStyle: string;
}
