import React from 'react';
import { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';

// Define theme colors
const lightTheme = {
  backgroundColor: '#F8F9FA',
  cardBackground: '#FFFFFF',
  textColor: '#2D3748',
  secondaryTextColor: '#718096',
  accentColor: '#4A90E2',
  accentLight: '#C5DCFA',
  accentDark: '#3A73B5',
  borderColor: '#E2E8F0',
  dangerColor: '#FF4D4F',
  mutedBackground: '#EDF2F7',
  mutedText: '#718096',
  gradientStart: '#4A90E2',
  gradientEnd: '#63B3ED',
};

const darkTheme = {
  backgroundColor: '#1A202C',
  cardBackground: '#2D3748',
  textColor: '#F7FAFC',
  secondaryTextColor: '#A0AEC0',
  accentColor: '#4A90E2',
  accentLight: '#2A4365',
  accentDark: '#3A73B5',
  borderColor: '#4A5568',
  dangerColor: '#FF4D4F',
  mutedBackground: '#2D3748',
  mutedText: '#A0AEC0',
  gradientStart: '#2C5282',
  gradientEnd: '#4A90E2',
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