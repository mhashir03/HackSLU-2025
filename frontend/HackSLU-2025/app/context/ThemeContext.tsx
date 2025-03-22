import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { useColorScheme } from 'react-native';
import { ThemeContextType, ThemeMode } from '../../lib/types/theme';
import { lightColors, darkColors, DEFAULT_THEME_MODE } from '../../lib/constants/theme';

/**
 * Default context value
 */
const defaultContextValue: ThemeContextType = {
  theme: lightColors,
  themeMode: DEFAULT_THEME_MODE,
  setThemeMode: () => {},
  isDark: false,
};

/**
 * Theme context for managing application theming
 */
const ThemeContext = createContext<ThemeContextType>(defaultContextValue);

interface ThemeProviderProps {
  children: ReactNode;
}

/**
 * Theme provider component that manages theme state and system preferences
 */
export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  // Get system color scheme
  const systemColorScheme = useColorScheme();
  
  // State for the user's selected theme mode
  const [themeMode, setThemeMode] = useState<ThemeMode>(DEFAULT_THEME_MODE);
  
  // Determine if dark mode should be used based on theme mode and system preferences
  const [isDark, setIsDark] = useState(
    themeMode === 'dark' || (themeMode === 'system' && systemColorScheme === 'dark')
  );
  
  // Update isDark when system color scheme changes or theme mode changes
  useEffect(() => {
    if (themeMode === 'dark') {
      setIsDark(true);
    } else if (themeMode === 'light') {
      setIsDark(false);
    } else {
      // System preference
      setIsDark(systemColorScheme === 'dark');
    }
  }, [themeMode, systemColorScheme]);

  // Get the appropriate theme colors based on dark mode status
  const theme = isDark ? darkColors : lightColors;
  
  // Create the context value
  const contextValue: ThemeContextType = {
    theme,
    themeMode,
    setThemeMode,
    isDark,
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};

/**
 * Hook to access the theme context
 * @returns Theme context with current theme and methods to change it
 */
export const useTheme = () => useContext(ThemeContext);