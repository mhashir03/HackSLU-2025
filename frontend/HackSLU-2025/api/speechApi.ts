import { Audio } from 'expo-av';

// Replace with your actual backend URL - likely a localhost during development
const API_BASE_URL = 'http://localhost:5000';

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
 * Send recorded audio to the backend for speech recognition
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

  // Send the request
  const response = await fetch(`${API_BASE_URL}/recognize`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to recognize speech');
  }

  return response.json();
}

/**
 * Translate text from one language to another
 */
export async function translateText(
  text: string,
  sourceLang: string,
  targetLang: string
): Promise<TranslationResult> {
  const response = await fetch(`${API_BASE_URL}/translate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
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
 * Recognize speech and translate it in one call
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

  // Send the request
  const response = await fetch(`${API_BASE_URL}/recognize_and_translate`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to process speech');
  }

  return response.json();
}