import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: '10mb' }));

// Initialize Gemini Client
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Global & Regional Accent Registry
const ACCENT_PRESETS = [
  {
    id: 'general-american',
    name: 'General American',
    region: 'North America',
    country: 'United States',
    flag: '🇺🇸',
    description: 'Crisp, modern, approachable standard North American broadcast voice.',
    promptStyle: 'Natural General American accent, clear, approachable, engaging, and professional.',
    sampleScript: 'Welcome to today’s broadcast! Across the globe, creators and innovators are transforming the way we work, communicate, and build the future.',
  },
  {
    id: 'british-rp',
    name: 'British RP',
    region: 'British & Irish',
    country: 'United Kingdom',
    flag: '🇬🇧',
    description: 'Classic British Received Pronunciation, refined, articulate, and poised.',
    promptStyle: 'Polished British Received Pronunciation (RP), articulate, refined, balanced, and clear.',
    sampleScript: 'Good day and welcome. We are delighted to guide you through today’s overview of cutting-edge technology and creative voice design.',
  },
  {
    id: 'australian',
    name: 'Australian English',
    region: 'Asia & Pacific',
    country: 'Australia',
    flag: '🇦🇺',
    description: 'Warm, relaxed cadence with characteristic open vowels and friendly tone.',
    promptStyle: 'Authentic Australian English accent, warm, upbeat, friendly, with characteristic open vowels and relaxed intonation.',
    sampleScript: 'G’day everyone! Thanks for tuning in today. We have got an incredible lineup of stories and updates coming your way.',
  },
  {
    id: 'irish',
    name: 'Irish English',
    region: 'British & Irish',
    country: 'Ireland',
    flag: '🇮🇪',
    description: 'Melodic, lyrical cadence with gentle rhythmic pitch shifts and warmth.',
    promptStyle: 'Authentic Irish English accent, lyrical, melodic, warm, and engaging with gentle musical cadence.',
    sampleScript: 'A very warm welcome to you all. May your journey today be filled with great discoveries and good conversation along the way.',
  },
  {
    id: 'canadian',
    name: 'Canadian English',
    region: 'North America',
    country: 'Canada',
    flag: '🇨🇦',
    description: 'Clear, polite, friendly standard North American with subtle Canadian phonetics.',
    promptStyle: 'Natural Canadian English accent, clear, polite, friendly, and articulate.',
    sampleScript: 'Hello and welcome. From coast to coast, we are witnessing remarkable advancements that bring communities closer together.',
  },
  {
    id: 'scottish',
    name: 'Scottish English',
    region: 'British & Irish',
    country: 'Scotland',
    flag: '🏴󠁧󠁢󠁳󠁣󠁴󠁿',
    description: 'Rich, rhotic cadence with distinctive rolling consonants and character.',
    promptStyle: 'Authentic Scottish English accent, rich, articulate, characterful, and resonant.',
    sampleScript: 'Welcome to this exploration. Step into the highlands of sound, where stories have echoed through ancient stone for centuries.',
  },
  {
    id: 'french-accent',
    name: 'French-Accented English',
    region: 'Europe',
    country: 'France',
    flag: '🇫🇷',
    description: 'Elegant European phrasing with soft vowels and charming melodic rhythm.',
    promptStyle: 'Charming French-accented English with soft melodic vowels, elegant rhythm, and gentle intonation.',
    sampleScript: 'Welcome to our studio. Beauty, craftsmanship, and nuance are at the very heart of everything we create together.',
  },
  {
    id: 'spanish-accent',
    name: 'Spanish-Accented English',
    region: 'Europe',
    country: 'Spain',
    flag: '🇪🇸',
    description: 'Warm, expressive Mediterranean cadence with vibrant rhythmic clarity.',
    promptStyle: 'Warm Spanish-accented English, vibrant, expressive, articulate, and filled with lively energy.',
    sampleScript: 'Welcome my friends! Passion and dedication are what turn simple ideas into unforgettable experiences.',
  },
  {
    id: 'german-accent',
    name: 'German-Accented English',
    region: 'Europe',
    country: 'Germany',
    flag: '🇩🇪',
    description: 'Precise, articulate pronunciation with steady cadence and clarity.',
    promptStyle: 'Articulate German-accented English, precise, structured, clear, and professional.',
    sampleScript: 'Welcome. Precision, innovation, and thoughtful engineering are the foundations of meaningful progress in our digital era.',
  },
  {
    id: 'indian-english',
    name: 'Indian English',
    region: 'Asia & Pacific',
    country: 'India',
    flag: '🇮🇳',
    description: 'Articulate, expressive syllable-timed cadence with polite intonation.',
    promptStyle: 'Authentic Indian English accent, articulate, expressive, syllable-timed cadence, and polite melodic intonation.',
    sampleScript: 'Namaste and welcome! Today we are exploring how collective creativity and bold ideas are solving global challenges.',
  },
  {
    id: 'japanese-accent',
    name: 'Japanese-Accented English',
    region: 'Asia & Pacific',
    country: 'Japan',
    flag: '🇯🇵',
    description: 'Gentle, polite, measured cadence with soft consonant clarity.',
    promptStyle: 'Gentle Japanese-accented English, polite, measured, soft-spoken, and respectful.',
    sampleScript: 'Welcome. Taking time to listen attentively is where true harmony and innovation begin.',
  },
  {
    id: 'caribbean-jamaican',
    name: 'Caribbean / Jamaican',
    region: 'Latin America & Caribbean',
    country: 'Jamaica',
    flag: '🇯🇲',
    description: 'Vibrant Caribbean lyrical cadence with warm island inflections.',
    promptStyle: 'Authentic Caribbean Jamaican English accent with vibrant lyrical cadence, melodic intonation, and warm island energy.',
    sampleScript: 'Big up to everyone listening in! One love and positive vibrations as we step forward into greatness today.',
  },
  {
    id: 'nigerian',
    name: 'Nigerian English (Naija)',
    region: 'Africa',
    country: 'Nigeria',
    flag: '🇳🇬',
    description: 'Energetic, rhythmic syllable-timed cadence with characteristic warm pitch inflections.',
    promptStyle: 'Authentic Nigerian English accent (Naija) with characteristic rhythmic syllable-timed cadence, warm pitch rises, and lively expressive intonation.',
    sampleScript: 'Good morning everyone! Welcome to today’s broadcast. Great things are happening across the continent, and today we celebrate resilience and unstoppable energy.',
  },
  {
    id: 'ghanaian',
    name: 'Ghanaian English',
    region: 'Africa',
    country: 'Ghana',
    flag: '🇬🇭',
    description: 'Warm, melodious, articulate phonetics and smooth resonance.',
    promptStyle: 'Authentic Ghanaian English accent with melodious, articulate phonetics, polite cadence, and warm intonation.',
    sampleScript: 'Akwaaba! Welcome to this audio reflection. Wisdom is like a baobab tree; no one person can embrace it alone. Let us learn and grow together.',
  },
  {
    id: 'south-african',
    name: 'South African English',
    region: 'Africa',
    country: 'South Africa',
    flag: '🇿🇦',
    description: 'Crisp articulation, distinctive vowel rounding, and relaxed modern rhythm.',
    promptStyle: 'Authentic South African English accent with crisp pronunciation, characteristic vowel rounding, and relaxed modern rhythm.',
    sampleScript: 'Welcome to this episode from Cape Town. Let us dive right into the creative minds shaping technology, music, and art.',
  },
  {
    id: 'kenyan',
    name: 'Kenyan English',
    region: 'Africa',
    country: 'Kenya',
    flag: '🇰🇪',
    description: 'Clear, measured, resonant and polite East African melodic cadence.',
    promptStyle: 'Authentic Kenyan English accent with clear, resonant, polite, and melodic cadence.',
    sampleScript: 'Habari zenu! From the heart of Nairobi, the Silicon Savannah, innovation moves fast. Every challenge met is a new opportunity.',
  },
  {
    id: 'ethiopian',
    name: 'Ethiopian English',
    region: 'Africa',
    country: 'Ethiopia',
    flag: '🇪🇹',
    description: 'Soft-spoken, lyrical, gentle cadence with graceful rhythm.',
    promptStyle: 'Authentic Ethiopian Horn of Africa English accent with gentle, lyrical, soft-spoken, and measured tone.',
    sampleScript: 'Greetings to you all. As the morning sun rises, we reflect upon patience, heritage, and the journey ahead.',
  },
  {
    id: 'egyptian',
    name: 'Egyptian / North African',
    region: 'Africa',
    country: 'Egypt',
    flag: '🇪🇬',
    description: 'Rich, expressive Mediterranean cadence with characteristic consonant warmth.',
    promptStyle: 'Authentic Egyptian North African English accent with distinctive rolled consonants and expressive warm intonation.',
    sampleScript: 'Welcome to this timeless tale, where thousands of years of human story meet the modern world.',
  },
];

// Available base voices supported by Gemini 3.8 TTS
const BASE_VOICES = [
  {
    id: 'Puck',
    name: 'Puck',
    gender: 'Masculine',
    timbre: 'Charismatic, dynamic & energetic',
    bestFor: 'Radio, Commercials, Tech Pitches, Upbeat narration',
  },
  {
    id: 'Kore',
    name: 'Kore',
    gender: 'Feminine',
    timbre: 'Warm, clear, articulate & balanced',
    bestFor: 'News broadcast, Documentaries, Audiobooks, Professional guides',
  },
  {
    id: 'Fenrir',
    name: 'Fenrir',
    gender: 'Masculine',
    timbre: 'Deep, commanding & authoritative',
    bestFor: 'Keynotes, Movie trailers, Dramatic reads, Leadership',
  },
  {
    id: 'Zephyr',
    name: 'Zephyr',
    gender: 'Feminine / Gentle',
    timbre: 'Gentle, soothing, melodic & conversational',
    bestFor: 'Poetry, Meditations, Audiobooks, Explainer videos',
  },
  {
    id: 'Charon',
    name: 'Charon',
    gender: 'Masculine',
    timbre: 'Gravelly, deep baritone, venerable & dramatic',
    bestFor: 'Folklore, Historical epics, Audio drama narration',
  },
];

// Helper to get accent by ID
function findAccent(accentId?: string) {
  return (
    ACCENT_PRESETS.find((a) => a.id === accentId) ||
    ACCENT_PRESETS[0]
  );
}

// GET /api/tts/config - returns presets and voice configurations
app.get('/api/tts/config', (req, res) => {
  res.json({
    accents: ACCENT_PRESETS,
    voices: BASE_VOICES,
    emotions: [
      { id: 'conversational', label: 'Conversational & Friendly' },
      { id: 'broadcast', label: 'News Anchor / Studio' },
      { id: 'energetic', label: 'Upbeat & High Energy' },
      { id: 'griot', label: 'Deep Storyteller & Dramatic' },
      { id: 'inspirational', label: 'Inspirational & Motivational' },
      { id: 'calm', label: 'Calm & Meditative' },
      { id: 'poetic', label: 'Poetic & Lyrical' },
    ],
    pacingOptions: [
      { id: 'natural', label: 'Natural Rhythm' },
      { id: 'dynamic-fast', label: 'Brisk & Punchy' },
      { id: 'deliberate', label: 'Deliberate & Measured' },
      { id: 'syllable-timed', label: 'Syllable-Timed Cadence' },
    ],
  });
});

// POST /api/tts/generate - Single Speaker TTS
app.post('/api/tts/generate', async (req, res) => {
  try {
    const {
      text,
      accentId = 'general-american',
      customAccentName,
      customAccentDescription,
      voiceName = 'Puck',
      emotion = 'conversational',
      pacing = 'natural',
      accentIntensity = 'authentic',
      pitchShift = 'balanced',
      customStyleNotes = '',
      preferredModel = 'gemini-3.8-flash-tts',
    } = req.body;

    if (!text || typeof text !== 'string' || !text.trim()) {
      return res.status(400).json({ error: 'Text content is required' });
    }

    const accent = findAccent(accentId);

    // Build rich style prompt for Gemini TTS
    let intensityQualifier = 'Authentic';
    if (accentIntensity === 'subtle') intensityQualifier = 'Subtle, gentle hint of';
    if (accentIntensity === 'pronounced') intensityQualifier = 'Rich, pronounced, deeply authentic';

    let accentBase = accent.promptStyle;
    if (customAccentName && customAccentDescription) {
      accentBase = `${intensityQualifier} ${customAccentName} accent. ${customAccentDescription}`;
    } else {
      accentBase = `${intensityQualifier} ${accentBase}`;
    }

    let emotionGuidance = '';
    switch (emotion) {
      case 'griot':
        emotionGuidance = 'Venerable, dramatic narrative presence with meaningful rhythmic pauses and captivating cadence.';
        break;
      case 'energetic':
        emotionGuidance = 'Vibrant, upbeat, passionate, and filled with radiant positive energy.';
        break;
      case 'broadcast':
        emotionGuidance = 'Clear, professional, authoritative studio broadcast delivery with crisp diction.';
        break;
      case 'inspirational':
        emotionGuidance = 'Uplifting, warm, encouraging, resonant, and deeply inspiring.';
        break;
      case 'calm':
        emotionGuidance = 'Gentle, serene, soothing, and relaxing cadence.';
        break;
      case 'poetic':
        emotionGuidance = 'Lyrical, melodious, with artistic phrasing and expressive rhythm.';
        break;
      default:
        emotionGuidance = 'Warm, natural, conversational, and engaging.';
    }

    let pacingGuidance = '';
    switch (pacing) {
      case 'syllable-timed':
        pacingGuidance = 'Distinct syllable-timed cadence with lively rhythmic intervals.';
        break;
      case 'deliberate':
        pacingGuidance = 'Measured, unhurried, thoughtful pacing.';
        break;
      case 'dynamic-fast':
        pacingGuidance = 'Fast-paced, vibrant, modern radio style.';
        break;
      default:
        pacingGuidance = 'Balanced natural speaking rate.';
    }

    const combinedStyle = [
      accentBase,
      emotionGuidance,
      pacingGuidance,
      pitchShift !== 'balanced' ? `Pitch tone: ${pitchShift}.` : '',
      customStyleNotes ? `Extra direction: ${customStyleNotes}.` : '',
    ]
      .filter(Boolean)
      .join(' ');

    const modelsToTry = [preferredModel, 'gemini-3.8-flash-tts', 'gemini-3.8-flash-lite-tts'];
    const uniqueModels = [...new Set(modelsToTry)];

    let base64Audio: string | undefined;
    let usedModel = uniqueModels[0];
    let lastError: any = null;

    for (const modelCandidate of uniqueModels) {
      try {
        const response = await ai.models.generateContent({
          model: modelCandidate,
          contents: [
            {
              role: 'user',
              parts: [
                {
                  text: text.trim(),
                  speechMetadata: {
                    style: combinedStyle,
                  },
                },
              ],
            },
          ],
          config: {
            responseModalities: ['AUDIO'],
            speechConfig: {
              voiceConfig: {
                prebuiltVoiceConfig: { voiceName: voiceName || 'Puck' },
              },
            },
          },
        });

        const part = response.candidates?.[0]?.content?.parts?.[0];
        if (part?.inlineData?.data) {
          base64Audio = part.inlineData.data;
          usedModel = modelCandidate;
          break;
        }
      } catch (err: any) {
        lastError = err;
        console.warn(`TTS attempt with ${modelCandidate} failed:`, err?.message || err);
      }
    }

    if (!base64Audio) {
      throw lastError || new Error('No audio returned by speech model');
    }

    const audioDataUrl = `data:audio/wav;base64,${base64Audio}`;

    res.json({
      success: true,
      audioDataUrl,
      accent: accent.name,
      voice: voiceName,
      modelUsed: usedModel,
      styleApplied: combinedStyle,
    });
  } catch (error: any) {
    console.error('TTS Generation error:', error);
    res.status(500).json({
      error: error?.message || 'Failed to generate speech audio',
    });
  }
});

// POST /api/tts/dialogue - Multi-Speaker Dialogue
app.post('/api/tts/dialogue', async (req, res) => {
  try {
    const {
      speaker1 = {
        name: 'Alex',
        voiceName: 'Puck',
        accentStyle: 'Natural General American accent, clear, approachable, and engaging.',
      },
      speaker2 = {
        name: 'Maya',
        voiceName: 'Kore',
        accentStyle: 'Polished British Received Pronunciation, articulate, refined, and poised.',
      },
      turns = [],
    } = req.body;

    if (!Array.isArray(turns) || turns.length === 0) {
      return res.status(400).json({ error: 'Dialogue turns are required' });
    }

    const parts = turns.map((turn: any) => ({
      text: `${turn.speaker}: ${turn.text}`,
      speechMetadata: {
        speaker: turn.speaker,
        style:
          turn.style ||
          (turn.speaker === speaker1.name ? speaker1.accentStyle : speaker2.accentStyle),
      },
    }));

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash-tts',
      contents: [
        {
          role: 'user',
          parts,
        },
      ],
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          multiSpeakerVoiceConfig: {
            speakerVoiceConfigs: [
              {
                speaker: speaker1.name,
                voiceConfig: {
                  prebuiltVoiceConfig: { voiceName: speaker1.voiceName || 'Puck' },
                },
              },
              {
                speaker: speaker2.name,
                voiceConfig: {
                  prebuiltVoiceConfig: { voiceName: speaker2.voiceName || 'Kore' },
                },
              },
            ],
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (!base64Audio) {
      throw new Error('No audio returned for dialogue');
    }

    res.json({
      success: true,
      audioDataUrl: `data:audio/wav;base64,${base64Audio}`,
      modelUsed: 'gemini-3.8-flash-tts',
    });
  } catch (error: any) {
    console.error('Dialogue Generation error:', error);
    res.status(500).json({
      error: error?.message || 'Failed to generate dialogue audio',
    });
  }
});

// POST /api/tts/enhance-text - Smart AI Script & Style Polish
app.post('/api/tts/enhance-text', async (req, res) => {
  try {
    const { text, goal = 'podcast-host', accentName = 'General American' } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({ error: 'Text is required' });
    }

    let instruction = '';
    switch (goal) {
      case 'podcast-host':
        instruction = `Rewrite this text as an engaging, charismatic podcast or radio host script. Add natural speech backchanneling tags like |yeah| and |mhm|, and vocal bursts like <laugh> or <breath> to make it sound exceptionally lifelike and dynamic when spoken by AI TTS. Return ONLY the script text.`;
        break;
      case 'storyteller':
        instruction = `Rewrite this script for a deep, cinematic storytelling or documentary performance. Infuse vivid imagery, deliberate dramatic pauses [pause] and <breath>, and resonant cadence while keeping the core message clear. Return ONLY the script text.`;
        break;
      case 'executive':
        instruction = `Polish this text to sound crisp, professional, authoritative, and articulate for an executive keynote or broadcast news anchor. Return ONLY the script text.`;
        break;
      case 'casual-warm':
        instruction = `Rewrite this text to feel completely natural, warm, conversational, and effortless to speak aloud in a ${accentName} accent. Return ONLY the script text.`;
        break;
      default:
        instruction = `Polish this text to sound exceptionally natural, rhythmic, and expressive when read aloud in a ${accentName} accent. Return ONLY the improved script text.`;
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: [
        {
          role: 'user',
          parts: [{ text: `${instruction}\n\nOriginal Text:\n${text}` }],
        },
      ],
    });

    const enhancedText = response.text?.trim() || text;

    res.json({
      success: true,
      enhancedText,
    });
  } catch (error: any) {
    console.error('Enhance text error:', error);
    res.status(500).json({
      error: error?.message || 'Failed to enhance script',
    });
  }
});

// Mount Vite or static server
async function initServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`OmniVoice TTS server running on http://0.0.0.0:${PORT}`);
  });
}

initServer().catch((err) => {
  console.error('Server initialization error:', err);
  process.exit(1);
});
