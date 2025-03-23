// api/speechApi.js
import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system';
import Constants from 'expo-constants';

/**
 * Get the Whisper API key from environment variables
 * In development, this comes from app.config.js or .env
 * In production, this should be set in your build process
 */
const getApiKey = () => {
  try {
    // Access environment variables through Constants.expoConfig.extra
    const apiKey = Constants.expoConfig?.extra?.whisperApiKey;
    
    if (!apiKey) {
      throw new Error("No Whisper API key found in environment configuration");
    }
    
    return apiKey;
  } catch (error) {
    console.error("Error retrieving API key:", error);
    throw new Error("API key not configured properly. Please check your environment setup.");
  }
};

/**
 * Processes audio using the OpenAI Whisper API, optimized for slurred speech
 * @param {Audio.Recording} recording - The Expo Audio recording
 * @returns {Promise<{text: string, error?: string}>} - Transcribed text and optional error
 */
export async function recognizeSpeech(recording) {
  try {
    // Get the recording URI
    const uri = recording.getURI();
    if (!uri) throw new Error('Recording URI is undefined');
    
    // Verify file exists
    const fileInfo = await FileSystem.getInfoAsync(uri);
    if (!fileInfo.exists) throw new Error('Recording file not found');
    
    // Get API key securely
    const OPENAI_API_KEY = getApiKey();
    
    // Create form data for the API request
    const formData = new FormData();
    formData.append('file', {
      uri: uri,
      type: 'audio/m4a', // Default format for Expo recordings
      name: 'recording.m4a',
    });
    
    // Configure Whisper API options
    formData.append('model', 'whisper-1');
    formData.append('language', 'en'); // Specify language for better accuracy
    
    // Add a prompt to help with slurred speech recognition
    formData.append('prompt', 
      'This audio contains slurred speech. The speaker may have difficulty pronouncing certain sounds ' +
        'or may speak at an irregular pace. Please transcribe as accurately as possible, focusing on ' +
        'content over perfect pronunciation. Common words in this context include medical terms, ' +
        'daily activities, and communication needs.'
    );
    
    // Optional: For slurred speech, we might want to use higher response formats
    // formData.append('response_format', 'verbose_json');
    
    
    // Send the request to the Whisper API
    const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        // Let FormData set its own Content-Type with boundary
      },
      body: formData,
    });
    
    // Handle API errors
    if (!response.ok) {
      const errorData = await response.json();
      const errorMessage = errorData.error?.message || response.statusText;
      console.error(`Whisper API returned error: ${errorMessage}`);
      throw new Error(`Transcription failed: ${errorMessage}`);
    }
    
    // Parse the response
    const data = await response.json();
    
    // Log success (remove in production)
    console.log('Successfully received transcription from Whisper API');
    
    return { 
      text: data.text,
      // If using verbose_json format, you could return more data here
    };
  } catch (error) {
    console.error('Error in speech recognition:', error);
    
    // Return a user-friendly error message and the technical details
    return { 
      text: "Sorry, I couldn't transcribe that audio. Please try again.",
      error: error.message 
    };
  }
}

/**
 * Enhance transcribed text to correct common issues with slurred speech
 * @param {string} text - The original transcribed text
 * @returns {string} - Enhanced text
 */
export function enhanceTranscription(text) {
  if (!text) return text;
  
  // Basic text cleanup
  let enhanced = text.trim();
  
    // Dictionary of common slurred speech patterns
    const corrections = {
        // Consonant simplification patterns
        'sis': 'this',
        'dat': 'that',
        'dere': 'there',
        'tink': 'think',
        'wif': 'with',
        
        // Vowel elongation or substitution
        'cain': 'can',
        'cannt': 'can\'t',
        'wanna': 'want to',
        'gonna': 'going to',
        
        // Word boundary issues
        'amigoing': 'am I going',
        'howbout': 'how about',
        'whatssat': 'what\'s that',
        
        // Add more corrections specific to your users' speech patterns
      };
      
      // Apply corrections
      for (const [incorrect, correct] of Object.entries(corrections)) {
        // Use word boundary markers to avoid partial word replacements
        const regex = new RegExp(`\\b${incorrect}\\b`, 'gi');
        enhanced = enhanced.replace(regex, correct);
      }
  
  return enhanced;
}

