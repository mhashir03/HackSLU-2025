import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import * as Speech from 'expo-speech';
import { useTheme } from '../context/ThemeContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import { recognizeSpeech } from '../../api/speechApi'

// Define the Language interface
interface Language {
  code: string;
  name: string;
}

// @ts-ignore - ignore navigation type for now
export default function SpeechScreen({ navigation }) {
  const { theme } = useTheme();
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transcription, setTranscription] = useState("");
  const [clarifiedText, setClarifiedText] = useState("");
  const [autoSpeak, setAutoSpeak] = useState(true);
  const [recording, setRecording] = useState(null);
  const [selectedLanguage, setSelectedLanguage] = useState({ 
    code: 'en-US',  // Default to English
    name: 'English'
  });

  useEffect(() => {
    // Request permissions
    Audio.requestPermissionsAsync();
    
    // Clean up recording when component unmounts
    return () => {
      if (recording) {
        stopRecording();
      }
    };
  }, []);

  useEffect(() => {
    // Auto-speak clarified text if enabled
    if (clarifiedText && autoSpeak) {
      Speech.speak(clarifiedText, {
        language: selectedLanguage.code,
        pitch: 1.0,
        rate: 0.9,
      });
    }
  }, [clarifiedText, autoSpeak, selectedLanguage]);

  async function startRecording() {
    try {
      // Reset previous results
      setTranscription("");
      setClarifiedText("");
      
      // Set up recording
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });
      
      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      
      setRecording(recording);
      setIsRecording(true);
      
    } catch (err) {
      console.error('Failed to start recording', err);
      Alert.alert('Error', 'Failed to start recording');
    }
  }

  async function stopRecording() {
    if (!recording) return;
    
    setIsRecording(false);
    setIsProcessing(true);
    
    try {
      await recording.stopAndUnloadAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
      });
      
      // Send to backend for processing
      const result = await recognizeSpeech(recording);
      setTranscription(result.text);
      
      // In a real app, you might want to do some post-processing
      // or enhancement of the recognized text
      setClarifiedText(result.text);
      
    } catch (err) {
      console.error('Error processing speech:', err);
      Alert.alert('Error', 'Failed to process speech recording');
    } finally {
      setIsProcessing(false);
      setRecording(null);
    }
  }

  const toggleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  // @ts-ignore - ignore text type for now
  const speakText = (text) => {
    Speech.speak(text, {
      language: selectedLanguage.code,
      pitch: 1.0,
      rate: 0.9,
    });
  };

  // @ts-ignore - ignore text type for now
  const copyToClipboard = (text) => {
    // In a real app, you would use Clipboard.setString(text)
    alert('Text copied to clipboard');
  };

  const handleLanguageSelect = (language: Language) => {
    setSelectedLanguage(language);
    
    // Reset transcriptions when language changes
    if (isRecording) {
      stopRecording();
    }
    setTranscription("");
    setClarifiedText("");
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.backgroundColor,
    },
    content: {
      flex: 1,
      padding: 16,
      maxWidth: 500,
      width: '100%',
      alignSelf: 'center',
    },
    controlsContainer: {
      flexDirection: 'column',
      alignItems: 'center',
      marginVertical: 30,
      width: '100%',
    },
    languageSelectorContainer: {
      width: '100%',
      flexDirection: 'column',
      alignItems: 'center',
      marginBottom: 30,
    },
    languageSelectorLabel: {
      fontSize: 18,
      fontWeight: '600',
      color: theme.textColor,
      marginBottom: 10,
      textAlign: 'center',
    },
    languageSelector: {
      minWidth: 150,
    },
    micButtonContainer: {
      alignItems: 'center',
      width: '100%',
    },
    micButton: {
      width: 110,
      height: 110,
      borderRadius: 55,
      backgroundColor: isRecording ? '#FF4D4F' : theme.accentColor,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 10,
    },
    statusText: {
      textAlign: 'center',
      marginTop: 12,
      color: theme.secondaryTextColor,
      fontSize: 16,
    },
    card: {
      backgroundColor: theme.cardBackground,
      borderRadius: 12,
      padding: 16,
      marginBottom: 16,
    },
    cardHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 8,
    },
    cardTitle: {
      fontSize: 14,
      color: theme.secondaryTextColor,
      fontWeight: '500',
    },
    cardText: {
      fontSize: 18,
      color: theme.textColor,
    },
    cardTextBold: {
      fontSize: 18,
      color: theme.textColor,
      fontWeight: '600',
    },
    buttonRow: {
      flexDirection: 'row',
      gap: 8,
    },
    iconButton: {
      padding: 8,
    },
    switchContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: 16,
      borderTopWidth: 1,
      borderTopColor: theme.divider,
      marginTop: 'auto',
    },
    switchLabel: {
      fontSize: 16,
      color: theme.textColor,
    },
    loadingContainer: {
      marginTop: 20,
      alignItems: 'center',
    },
  });

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView style={styles.content} contentContainerStyle={{ flexGrow: 1 }}>
        <View style={styles.micButtonContainer}>
          <TouchableOpacity
            style={styles.micButton}
            onPress={toggleRecording}
            activeOpacity={0.8}
            disabled={isProcessing}
          >
            <Feather 
              name={isRecording ? "mic-off" : "mic"} 
              size={40} 
              color="white" 
            />
          </TouchableOpacity>
          <Text style={styles.statusText}>
            {isRecording 
              ? "Listening..." 
              : isProcessing 
                ? "Processing..." 
                : "Tap the microphone to start speaking"}
          </Text>
        </View>

        {isProcessing && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={theme.accentColor} />
          </View>
        )}

        {transcription ? (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>Original Speech</Text>
              <TouchableOpacity 
                style={styles.iconButton}
                onPress={() => copyToClipboard(transcription)}
              >
                <Feather name="copy" size={20} color={theme.secondaryTextColor} />
              </TouchableOpacity>
            </View>
            <Text style={styles.cardText}>{transcription}</Text>
          </View>
        ) : null}

        {clarifiedText ? (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>AI Clarified</Text>
              <View style={styles.buttonRow}>
                <TouchableOpacity 
                  style={styles.iconButton}
                  onPress={() => speakText(clarifiedText)}
                >
                  <Feather name="volume-2" size={20} color={theme.secondaryTextColor} />
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.iconButton}
                  onPress={() => copyToClipboard(clarifiedText)}
                >
                  <Feather name="copy" size={20} color={theme.secondaryTextColor} />
                </TouchableOpacity>
              </View>
            </View>
            <Text style={styles.cardTextBold}>{clarifiedText}</Text>
          </View>
        ) : null}

        <View style={styles.switchContainer}>
          <Text style={styles.switchLabel}>Auto-speak clarified text</Text>
          <Switch
            value={autoSpeak}
            onValueChange={setAutoSpeak}
            trackColor={{ false: theme.mutedBackground, true: theme.accentColor }}
            thumbColor="white"
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}