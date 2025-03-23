import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system';

// Replace with your actual OpenAI API key
const OPENAI_API_KEY = '';

/**
 * Converts an Expo Audio recording to a base64 string
 * @param {Audio.Recording} recording - The Expo Audio recording
 * @returns {Promise<string>} - Base64 string of the audio file
 */
async function getBase64FromRecording(recording) {
  try {
    const uri = recording.getURI();
    if (!uri) throw new Error('Recording URI is undefined');
    
    // Read the file as base64
    const base64 = await FileSystem.readAsStringAsync(uri, {
      encoding: FileSystem.EncodingType.Base64,
    });
    
    return base64;
  } catch (error) {
    console.error('Error converting recording to base64:', error);
    throw error;
  }
}

/**
 * Processes audio using the OpenAI Whisper API
 * @param {Audio.Recording} recording - The Expo Audio recording
 * @returns {Promise<{text: string}>} - Transcribed text
 */
export async function recognizeSpeech(recording) {
  try {
    // Get the recording URI and file info
    const uri = recording.getURI();
    if (!uri) throw new Error('Recording URI is undefined');
    
    const fileInfo = await FileSystem.getInfoAsync(uri);
    if (!fileInfo.exists) throw new Error('Recording file not found');
    
    // Create form data for the API request
    const formData = new FormData();
    formData.append('file', {
      uri: uri,
      type: 'audio/m4a', // Adjust based on your recording format
      name: 'recording.m4a',
    });
    formData.append('model', 'whisper-1');
    
    // Optional: Add parameters to handle slurred speech better
    formData.append('language', 'en'); // Specify the language if known
    formData.append('prompt', 'This may contain slurred speech. Please transcribe accurately.');
    
    // Send the request to the Whisper API
    const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        // Don't set Content-Type header here, let it be set automatically for FormData
      },
      body: formData,
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Whisper API error: ${errorData.error?.message || response.statusText}`);
    }
    
    const data = await response.json();
    
    // Return the transcribed text
    return { 
      text: data.text,
      // You could add more properties here if needed
    };
  } catch (error) {
    console.error('Whisper API error:', error);
    // Return a user-friendly error message
    return { 
      text: "Sorry, I couldn't understand that. Please try speaking again.",
      error: error.message 
    };
  }
}

/**
 * Alternative implementation using base64 encoding
 * Use this if the FormData approach doesn't work
 */
export async function recognizeSpeechBase64(recording) {
  try {
    // Get base64 audio data
    const base64Audio = await getBase64FromRecording(recording);
    
    // Send the request to the Whisper API
    const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'whisper-1',
        file: base64Audio,
        language: 'en', // Specify the language if known
        prompt: 'This may contain slurred speech. Please transcribe accurately.',
      }),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Whisper API error: ${errorData.error?.message || response.statusText}`);
    }
    
    const data = await response.json();
    
    return { text: data.text };
  } catch (error) {
    console.error('Whisper API error:', error);
    return { 
      text: "Sorry, I couldn't understand that. Please try speaking again.",
      error: error.message 
    };
  }
}