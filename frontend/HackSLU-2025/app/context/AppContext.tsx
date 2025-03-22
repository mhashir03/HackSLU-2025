// context/AppContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Define the history item type
export interface HistoryItem {
  id: string;
  originalText: string;
  clarifiedText: string;
  date: Date;
  language: string;
}

// Define the context type
interface AppContextType {
  // Speech settings
  targetLanguage: string;
  setTargetLanguage: (lang: string) => void;
  
  // History management
  history: HistoryItem[];
  addToHistory: (item: Omit<HistoryItem, 'id' | 'date'>) => void;
  clearHistory: () => void;
}

// Create the context
const AppContext = createContext<AppContextType | undefined>(undefined);

// Create provider component
export const AppProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [targetLanguage, setTargetLanguage] = useState('en');
  const [history, setHistory] = useState<HistoryItem[]>([]);
  
  // Load saved data when the app starts
  useEffect(() => {
    const loadSavedData = async () => {
      try {
        // Load language preference
        const savedLanguage = await AsyncStorage.getItem('targetLanguage');
        if (savedLanguage) {
          setTargetLanguage(savedLanguage);
        }
        
        // Load history
        const savedHistory = await AsyncStorage.getItem('speechHistory');
        if (savedHistory) {
          setHistory(JSON.parse(savedHistory));
        }
      } catch (error) {
        console.error('Failed to load saved data:', error);
      }
    };
    
    loadSavedData();
  }, []);
  
  // Save language preference when it changes
  useEffect(() => {
    AsyncStorage.setItem('targetLanguage', targetLanguage);
  }, [targetLanguage]);
  
  // Save history when it changes
  useEffect(() => {
    AsyncStorage.setItem('speechHistory', JSON.stringify(history));
  }, [history]);
  
  // Add a new item to history
  const addToHistory = (item: Omit<HistoryItem, 'id' | 'date'>) => {
    const newItem: HistoryItem = {
      ...item,
      id: Date.now().toString(),
      date: new Date(),
    };
    
    setHistory(prev => [newItem, ...prev]);
  };
  
  // Clear all history
  const clearHistory = () => {
    setHistory([]);
  };
  
  return (
    <AppContext.Provider value={{
      targetLanguage,
      setTargetLanguage,
      history,
      addToHistory,
      clearHistory,
    }}>
      {children}
    </AppContext.Provider>
  );
};

// Custom hook to use the context
export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};