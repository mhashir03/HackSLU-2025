/**
 * Theme constants for the VoiceClarity application
 */
import { ThemeConfig, ThemeColors, ThemeMode } from '../types/theme';

/**
 * Light theme color palette
 */
export const lightColors: ThemeColors = {
  backgroundColor: '#FFFFFF',
  textColor: '#1A1A1A',
  secondaryTextColor: '#6B7280',
  accentColor: '#4C6EF5',
  mutedBackground: '#F3F4F6',
  error: '#EF4444',
  success: '#10B981',
  warning: '#F59E0B',
  cardBackground: '#FFFFFF',
  divider: '#E5E7EB',
};

/**
 * Dark theme color palette
 */
export const darkColors: ThemeColors = {
  backgroundColor: '#121212',
  textColor: '#F9FAFB',
  secondaryTextColor: '#9CA3AF',
  accentColor: '#6D8EFF',
  mutedBackground: '#1F1F1F',
  error: '#F87171',
  success: '#34D399',
  warning: '#FBBF24',
  cardBackground: '#1A1A1A',
  divider: '#374151',
};

/**
 * Font sizes used throughout the application
 */
export const fontSizes = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 20,
  xxl: 24,
};

/**
 * Spacing values used for margins, paddings, etc.
 */
export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

/**
 * Border radius values
 */
export const borderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  full: 9999,
};

/**
 * Complete theme configurations
 */
export const lightTheme: ThemeConfig = {
  colors: lightColors,
  fontSizes,
  spacing,
  borderRadius,
  isDark: false,
};

export const darkTheme: ThemeConfig = {
  colors: darkColors,
  fontSizes,
  spacing,
  borderRadius,
  isDark: true,
};

/**
 * Default theme mode
 */
export const DEFAULT_THEME_MODE: ThemeMode = 'system'; 