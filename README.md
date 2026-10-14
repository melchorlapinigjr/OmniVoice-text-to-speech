# OmniVoice AI Studio 🎙️

> **Universal AI Text-to-Speech & Voice Customization Studio**  
> Powered by Gemini 3.8 Flash TTS and modern web audio technologies.

OmniVoice AI Studio is a full-stack speech synthesis and voice design platform. It empowers creators, developers, educators, and podcasters to transform text into expressive, natural speech with customizable worldwide accents, distinct vocal personas, atmospheric moods, and multi-speaker dialogues.

---

## ✨ Key Features

### 1. 🌍 Worldwide Accent & Regional Dialect Library
- **North America**: General American 🇺🇸, Canadian English 🇨🇦
- **British & Irish**: British Received Pronunciation (RP) 🇬🇧, Irish English 🇮🇪, Scottish English 🏴󠁧󠁢󠁳󠁣󠁴󠁿
- **Europe & Mediterranean**: French-accented English 🇫🇷, Spanish-accented English 🇪🇸, German-accented English 🇩🇪
- **Asia & Pacific**: Australian English 🇦🇺, Indian English 🇮🇳, Japanese-accented English 🇯🇵
- **Latin America & Caribbean**: Caribbean / Jamaican English 🇯🇲
- **Africa**: Nigerian English (Naija) 🇳🇬, Ghanaian English 🇬🇭, South African English 🇿🇦, Kenyan English 🇰🇪, Ethiopian English 🇪🇹, Egyptian English 🇪🇬
- **Custom Dialect Builder**: Define any regional dialect, colloquial accent, or vocal flavor (e.g., Australian Outback, Scottish Gaelic, Cameroonian Pidgin, Singaporean Singlish) with custom phonetic direction.
- **Accent Intensity Control**: Fine-tune dialect strength from **Subtle (25%)** to **Authentic (100%)** and **Pronounced (150%)**.

---

### 2. 🎭 Voice Personas & Atmospheric Direction
- **5 Prebuilt Gemini 3.8 Base Voices**:
  - **Puck**: Charismatic, dynamic, and upbeat masculine voice.
  - **Kore**: Warm, clear, articulate, and balanced feminine voice.
  - **Fenrir**: Deep, commanding, and authoritative baritone.
  - **Zephyr**: Gentle, soothing, melodic, and conversational.
  - **Charon**: Gravelly, deep baritone, venerable and dramatic storyteller.
- **7 Emotional Tones**: Conversational & Friendly, News Anchor Broadcast, Upbeat & High Energy, Deep Storyteller, Inspirational & Motivational, Calm & Meditative, and Poetic & Lyrical.
- **Pacing & Cadence**: Natural rhythm, brisk & punchy, deliberate & measured, and syllable-timed flow.
- **Vocal Resonance / Pitch**: Deep Resonance, Natural Balanced, and Bright & Crisp.
- **Dual Engine Selection**: Choose between flagship **Gemini 3.8 Flash TTS** (voice design & vocal bursts) and **Gemini 3.8 Flash-Lite TTS** (ultra-fast throughput).

---

### 3. ✍️ Script Director & Expressive Vocal Bursts
- **Sample Script Presets**: Quick-load templates across key genres (Global Tech Keynote, International Documentary, Podcast Studio Intro, Mindful Meditation, and Folklore Storytelling).
- **One-Click Conversational Markers**: Insert natural vocal bursts and backchanneling markers natively understood by Gemini 3.8 Flash TTS:
  - `|mhm|`, `|yeah|`, `<laugh>`, `<breath>`, `<gasp>`, and `[pause]`.
- **AI Script Polish**:
  - **Podcast & Radio Host**: Inserts organic backchanneling and natural pauses.
  - **Cinematic Storyteller**: Adds narrative imagery, dramatic pauses, and breathing cadence.
  - **Executive Keynote**: Polishes diction for crisp, professional presentations.
  - **Natural Conversational**: Rewrites text for warm, effortless oral delivery.
- **Real-Time Word & Timing Metrics**: Word count, character count, and spoken duration estimator (~130 wpm).
- **Quick Local Browser Preview**: Instant offline browser speech synthesis audition before generating studio-quality audio.

---

### 4. 🎛️ Studio Waveform Player & Browser Blob Download
- **Interactive Frequency Waveform Scrubber**: Click or drag anywhere along the waveform to scrub through playback.
- **Dedicated 'Download Audio' Button**: Converts the generated speech audio into a native browser binary `Blob` (`audio/wav`) and triggers a clean browser download with formatted metadata filenames.
- **Playback Controls**: Play, Pause, Rewind 5s, Forward 5s, and Seamless Loop.
- **Variable Playback Speed**: Toggle between `0.75x`, `1.0x`, `1.25x`, `1.5x`, and `2.0x`.
- **Studio Equalizer Presets**: Simulate acoustic environments (*Studio Flat*, *Warm Radio*, *Griot Hall*, *Deep Bass*).
- **Share & Copy**: Quick-copy formatted script metadata to the clipboard.

---

### 5. 👥 Dual-Speaker Multi-Accent Dialogue Studio
- Generate natural multi-speaker screenplays and podcasts using Gemini 3.8 Flash TTS.
- Configure distinct characters (e.g., Alex with an American accent and Maya with a British RP accent).
- Turn-by-turn dialogue editor with turn additions, deletions, speaker reassignment, and single-click dual-speaker audio generation.

---

### 6. 📖 Linguistic Field Guide & Saved Clip Library
- **Dialect Field Guide**: Educational breakdown explaining stress-timed vs. syllable-timed rhythm, rhoticity, intonation contours, and oral storytelling traditions.
- **Saved Audio Library**: Slide-over drawer with locally stored generations for instant replay, batch review, and audio file export.

---

## 🛠️ Architecture & Tech Stack

```
OmniVoice AI Studio
│
├── Frontend (Client SPA)
│   ├── React 19 (Hooks, Functional Architecture)
│   ├── Tailwind CSS v4 (@tailwindcss/vite)
│   ├── Lucide React Icons
│   ├── Web Audio API (Waveform synthesis, AudioContext analysis)
│   └── Browser SpeechSynthesis API (Instant offline preview)
│
└── Backend Server (Node.js / Express)
    ├── Express 4.x JSON API
    ├── Google GenAI TypeScript SDK (@google/genai)
    ├── Vite Dev Middleware (Development) / Static Serving (Production)
    └── Gemini 3.8 Models:
        ├── gemini-3.8-flash-tts (Primary 24kHz Unary WAV generator)
        ├── gemini-3.8-flash-lite-tts (Fast high-throughput fallback)
        └── gemini-3.8-flash (Smart script enhancement & styling)
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- Gemini API Key (configured via `GEMINI_API_KEY` environment variable)

### Installation

1. **Clone the repository and install dependencies**:
   ```bash
   npm install
   ```

2. **Configure Environment Variables**:
   Create or verify your `.env` file (see `.env.example`):
   ```env
   GEMINI_API_KEY="YOUR_GEMINI_API_KEY"
   PORT=3000
   ```

3. **Start the Development Server**:
   ```bash
   npm run dev
   ```
   Open your browser at `http://localhost:3000`.

4. **Production Build**:
   ```bash
   npm run build
   npm run start
   ```

5. **Deploying to GitHub Pages**:
   - The Vite build is configured with `base: './'` to support repository subpaths (e.g., `https://<username>.github.io/<repo-name>/`).
   - Run `npm run build` to generate the production assets in `dist/`.
   - The build automatically includes `dist/404.html` and `.nojekyll` for smooth routing on GitHub Pages.
   - Deploy the `dist` folder to your `gh-pages` branch using GitHub Actions or `gh-pages`:
     ```bash
     npx gh-pages -d dist
     ```
   - On GitHub Pages (static hosting), the app automatically runs in client-side speech synthesis mode so voice generation, playback, waveforms, and audio blob downloads work immediately without needing a server.

---

## 📡 API Reference

### `POST /api/tts/generate`
Generates single-speaker speech audio in 24kHz WAV format.
- **Request Body**:
  ```json
  {
    "text": "Welcome to our audio presentation.",
    "accentId": "general-american",
    "voiceName": "Puck",
    "emotion": "conversational",
    "pacing": "natural",
    "accentIntensity": "authentic",
    "pitchShift": "balanced",
    "preferredModel": "gemini-3.8-flash-tts"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "audioDataUrl": "data:audio/wav;base64,...",
    "accent": "General American",
    "voice": "Puck",
    "modelUsed": "gemini-3.8-flash-tts",
    "styleApplied": "..."
  }
  ```

### `POST /api/tts/dialogue`
Synthesizes a dual-speaker screenplay conversation.
- **Request Body**:
  ```json
  {
    "speaker1": { "name": "Alex", "voiceName": "Puck", "accentStyle": "..." },
    "speaker2": { "name": "Maya", "voiceName": "Kore", "accentStyle": "..." },
    "turns": [
      { "speaker": "Alex", "text": "Hello Maya!" },
      { "speaker": "Maya", "text": "Great to be here, Alex!" }
    ]
  }
  ```

### `POST /api/tts/enhance-text`
Rewrites and enhances script text using Gemini 3.8 Flash.
- **Request Body**:
  ```json
  {
    "text": "Original message",
    "goal": "podcast-host",
    "accentName": "General American"
  }
  ```

### `GET /api/tts/config`
Retrieves the registry of available global accents, base voice personas, emotions, and pacing options.

---

## 📄 License
Apache-2.0
