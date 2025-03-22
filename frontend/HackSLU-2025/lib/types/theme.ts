/**
 * Theme type definitions for the VoiceClarity application
 */

export interface ThemeColors {
  backgroundColor: string;
  textColor: string;
  secondaryTextColor: string;
  accentColor: string;
  mutedBackground: string;
  error: string;
  success: string;
  warning: string;
  cardBackground: string;
  divider: string;
}

export interface FontSizes {
  xs: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
  xxl: number;
}

export interface Spacing {
  xs: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
  xxl: number;
}

export interface BorderRadius {
  sm: number;
  md: number;
  lg: number;
  full: number;
}

export interface ThemeConfig {
  colors: ThemeColors;
  fontSizes: FontSizes;
  spacing: Spacing;
  borderRadius: BorderRadius;
  isDark: boolean;
}

export type ThemeMode = 'light' | 'dark' | 'system';

export interface ThemeContextType {
  theme: ThemeColors;
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
  isDark: boolean;
}

/**
 * Navigation types
 */
export type RootStackParamList = {
  Home: undefined;
  Speech: undefined;
  History: undefined;
  Profile: { screen?: string };
  Settings: undefined;
};

export type TabParamList = {
  HomeStack: undefined;
  SpeechStack: undefined;
  HistoryStack: undefined;
  ProfileStack: undefined;
}; 