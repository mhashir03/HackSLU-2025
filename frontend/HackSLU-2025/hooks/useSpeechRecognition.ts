import { useState, useCallback, useEffect } from 'react';
import * as Speech from 'expo-speech';

/**
 * State for the speech recognition process
 */
type SpeechRecognitionState = 'idle' | 'listening' | 'processing' | 'error';

/**
 * Results from the speech recognition
 */
interface SpeechRecognitionResult {
  /**
   * Transcribed text from speech recognition
   */
  text: string;
  
  /**
   * Whether the result is final
   */
  isFinal: boolean;
}

/**
 * Configuration for the speech recognition hook
 */
interface SpeechRecognitionConfig {
  /**
   * Language to recognize
   * @default 'en-US'
   */
  language?: string;
  
  /**
   * Callback when recognition completes
   */
  onResult?: (result: SpeechRecognitionResult) => void;
  
  /**
   * Callback when an error occurs
   */
  onError?: (error: Error) => void;
  
  /**
   * Whether to auto-stop after a period of silence
   * @default true
   */
  autoStop?: boolean;
  
  /**
   * Silence duration in ms before auto-stopping
   * @default 1500
   */
  silenceTimeout?: number;
}

/**
 * Hook return value
 */
interface SpeechRecognitionReturn {
  /**
   * Current state of speech recognition
   */
  state: SpeechRecognitionState;
  
  /**
   * Latest recognized text
   */
  text: string;
  
  /**
   * Start speech recognition
   */
  startListening: () => Promise<void>;
  
  /**
   * Stop speech recognition
   */
  stopListening: () => Promise<void>;
  
  /**
   * Reset the speech recognition state
   */
  reset: () => void;
  
  /**
   * Error if one occurred
   */
  error: Error | null;
}

// Mock implementation since real implementation depends on native modules
export function useSpeechRecognition({
  language = 'en-US',
  onResult,
  onError,
  autoStop = true,
  silenceTimeout = 1500,
}: SpeechRecognitionConfig = {}): SpeechRecognitionReturn {
  const [state, setState] = useState('idle' as SpeechRecognitionState);
  const [text, setText] = useState('');
  const [error, setError] = useState(null as Error | null);
  
  // Reset function
  const reset = useCallback(() => {
    setState('idle');
    setText('');
    setError(null);
  }, []);
  
  // Start listening function
  const startListening = useCallback(async () => {
    try {
      setState('listening');
      setError(null);
      
      // In a real implementation, this would call the actual speech API
      // For demonstration, we'll simulate a delay and a result
      setTimeout(() => {
        const mockResult: SpeechRecognitionResult = {
          text: 'This is a mock transcription result.',
          isFinal: true,
        };
        
        setText(mockResult.text);
        onResult?.(mockResult);
        
        if (autoStop) {
          setState('idle');
        }
      }, 2000);
      
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error in speech recognition');
      setState('error');
      setError(error);
      onError?.(error);
    }
  }, [onResult, onError, autoStop]);
  
  // Stop listening function
  const stopListening = useCallback(async () => {
    try {
      if (state === 'listening') {
        setState('processing');
        
        // In a real implementation, this would call the actual speech API
        setTimeout(() => {
          setState('idle');
        }, 500);
      }
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to stop speech recognition');
      setState('error');
      setError(error);
      onError?.(error);
    }
  }, [state, onError]);
  
  // Clean up on unmount
  useEffect(() => {
    return () => {
      // Real implementation would clean up resources
    };
  }, []);
  
  return {
    state,
    text,
    startListening,
    stopListening,
    reset,
    error,
  };
}

export default useSpeechRecognition; 