import React from 'react';
import { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';

// Define theme colors
const lightTheme = {
  backgroundColor: '#FFFFFF',
  cardBackground: '#F2F2F2',
  textColor: '#121212',
  secondaryTextColor: '#4A4A4A',
  accentColor: '#4A90E2',
  accentLight: '#E1F0FF',
  borderColor: '#E5E5E5',
  dangerColor: '#FF4D4F',
  mutedBackground: '#F5F5F5',
  mutedText: '#71717A',
};

const darkTheme = {
  backgroundColor: '#121212',
  cardBackground: '#1E1E1E',
  textColor: '#FFFFFF',
  secondaryTextColor: '#A1A1AA',
  accentColor: '#4A90E2',
  accentLight: '#1A365D',
  borderColor: '#2E2E2E',
  dangerColor: '#FF4D4F',
  mutedBackground: '#2E2E2E',
  mutedText: '#A1A1AA',
};

const ThemeContext = createContext({
  theme: lightTheme,
  isDark: false,
  toggleTheme: () => {},
});

// @ts-ignore - ignoring children type issues
export const ThemeProvider = ({ children }) => {
  const colorScheme = useColorScheme();
  const [isDark, setIsDark] = useState(colorScheme === 'dark');
  
  useEffect(() => {
    setIsDark(colorScheme === 'dark');
  }, [colorScheme]);

  const theme = isDark ? darkTheme : lightTheme;
  
  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  return (
    <ThemeContext.Provider value={{ theme, isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);