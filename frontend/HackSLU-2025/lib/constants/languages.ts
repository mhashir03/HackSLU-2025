/**
 * Supported languages for speech recognition and synthesis
 */

export interface Language {
  /**
   * Language code (BCP 47)
   */
  code: string;
  
  /**
   * Display name for the language
   */
  name: string;
  
  /**
   * ISO country code for flag display
   */
  flag: string;
}

/**
 * List of supported languages
 */
export const SUPPORTED_LANGUAGES: Language[] = [
  { code: 'en-US', name: 'English (US)', flag: '🇺🇸' },
  { code: 'es-ES', name: 'Spanish', flag: '🇪🇸' },
  { code: 'fr-FR', name: 'French', flag: '🇫🇷' },
  { code: 'de-DE', name: 'German', flag: '🇩🇪' },
  { code: 'it-IT', name: 'Italian', flag: '🇮🇹' },
  { code: 'ja-JP', name: 'Japanese', flag: '🇯🇵' },
  { code: 'ko-KR', name: 'Korean', flag: '🇰🇷' },
  { code: 'zh-CN', name: 'Chinese (Simplified)', flag: '🇨🇳' },
  { code: 'pt-BR', name: 'Portuguese (Brazil)', flag: '🇧🇷' },
  { code: 'ru-RU', name: 'Russian', flag: '🇷🇺' },
];

/**
 * Default language code
 */
export const DEFAULT_LANGUAGE_CODE = 'en-US';

/**
 * Get a language by its code
 */
export function getLanguageByCode(code: string): Language | undefined {
  return SUPPORTED_LANGUAGES.find(lang => lang.code === code);
}

/**
 * Get default language
 */
export function getDefaultLanguage(): Language {
  return SUPPORTED_LANGUAGES[0];
} 