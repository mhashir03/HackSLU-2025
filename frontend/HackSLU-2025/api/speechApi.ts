import { Audio } from 'expo-av';

// Replace with your Supabase URL
const API_BASE_URL = 'https://kxmqhjwwylomedrvjuzl.supabase.co';

// You'll likely need an API key for authentication
const SUPABASE_API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt4bXFoand3eWxvbWVkcnZqdXpsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI2Njk5NzcsImV4cCI6MjA1ODI0NTk3N30.ekbsKB3nY8c9IgfTmlcNxTk781esT6g-5ZpCT3ZS8oc';

export interface RecognitionResult {
  text: string;
  language: string;
}

export interface TranslationResult {
  translated_text: string;
}

export interface RecognizeAndTranslateResult {
  original_text: string;
  translated_text: string;
  detected_language: string;
}

/**
 * Send recorded audio to Supabase for speech recognition
 */
export async function recognizeSpeech(
  recording: Audio.Recording,
  sourceLang?: string
): Promise<RecognitionResult> {
  const uri = await recording.getURI();
  if (!uri) {
    throw new Error('Failed to get recording URI');
  }

  // Create form data with the audio file
  const formData = new FormData();
  formData.append('audio_file', {
    uri,
    type: 'audio/wav',
    name: 'recording.wav',
  } as any);

  if (sourceLang) {
    formData.append('source_lang', sourceLang);
  }

  // Send the request to Supabase
  const response = await fetch(`${API_BASE_URL}/rest/v1/recognize`, {
    method: 'POST',
    headers: {
      'apikey': SUPABASE_API_KEY,
      'Authorization': `Bearer ${SUPABASE_API_KEY}`,
      // You might need additional headers depending on your Supabase setup
    },
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to recognize speech');
  }

  return response.json();
}

/**
 * Translate text from one language to another via Supabase
 */
export async function translateText(
  text: string,
  sourceLang: string,
  targetLang: string
): Promise<TranslationResult> {
  const response = await fetch(`${API_BASE_URL}/rest/v1/translate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': SUPABASE_API_KEY,
      'Authorization': `Bearer ${SUPABASE_API_KEY}`,
    },
    body: JSON.stringify({
      text,
      source_lang: sourceLang,
      target_lang: targetLang,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to translate text');
  }

  return response.json();
}

/**
 * Recognize speech and translate it in one call via Supabase
 */
export async function recognizeAndTranslate(
  recording: Audio.Recording,
  targetLang: string
): Promise<RecognizeAndTranslateResult> {
  const uri = await recording.getURI();
  if (!uri) {
    throw new Error('Failed to get recording URI');
  }

  // Create form data with the audio file
  const formData = new FormData();
  formData.append('audio_file', {
    uri,
    type: 'audio/wav',
    name: 'recording.wav',
  } as any);
  formData.append('target_lang', targetLang);

  // Send the request to Supabase
  const response = await fetch(`${API_BASE_URL}/rest/v1/recognize_and_translate`, {
    method: 'POST',
    headers: {
      'apikey': SUPABASE_API_KEY,
      'Authorization': `Bearer ${SUPABASE_API_KEY}`,
    },
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to process speech');
  }

  return response.json();
}