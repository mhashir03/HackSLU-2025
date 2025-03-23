import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch, ScrollView, ActivityIndicator, Alert, Platform, StatusBar, Image, ImageBackground } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import * as Speech from 'expo-speech';
import { useTheme } from '../context/ThemeContext';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { recognizeSpeech } from '../../api/speechApi'
import { enhanceTranscription } from '../../api/speechApi';
import { LinearGradient } from 'expo-linear-gradient';
import * as FileSystem from 'expo-file-system';

// Define the Language interface
interface Language {
  code: string;
  name: string;
}

// Define the navigation prop type
interface NavigationProps {
  navigation: {
    navigate: (screen: string) => void;
  };
}

export default function SpeechScreen({ navigation }: NavigationProps) {
  const { theme, isDark } = useTheme();
  const insets = useSafeAreaInsets();
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transcription, setTranscription] = useState("");
  const [clarifiedText, setClarifiedText] = useState("");
  const [autoSpeak, setAutoSpeak] = useState(true);
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState<Language>({ 
    code: 'en-US',  // Default to English
    name: 'English'
  });
  const [recordingTime, setRecordingTime] = useState(0);
  const [recordingTimer, setRecordingTimer] = useState<NodeJS.Timeout | null>(null);

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
      
      // Save the recording object to state
      setRecording(recording);
      
      setIsRecording(true);
      setRecordingTime(0);
      // Start a timer to track recording duration
      const timer = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
      setRecordingTimer(timer);
    } catch (err) {
      console.error('Failed to start recording', err);
      Alert.alert('Error', 'Failed to start recording');
    }
  }

  async function stopRecording() {
    if (!recording) return;
    
    setIsRecording(false);
    setIsProcessing(true);
    // Clear the recording timer
    if (recordingTimer) {
      clearInterval(recordingTimer);
      setRecordingTimer(null);
    }
    
    try {
      await recording.stopAndUnloadAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
      });
      
      // Send to Whisper API for processing
      const result = await recognizeSpeech(recording);

      if (result.error) {
        console.warn('Speech recognition warning:', result.error);
        // You could show a more specific error to the user if needed
      }
      
      setTranscription(result.text);
      
      // post-processing
      let enhancedText = enhanceTranscription(result.text);
      
      enhancedText = enhancedText.trim();
      
      // Set the clarified text
      setClarifiedText(enhancedText);
      
    } catch (err) {
      console.error('Error processing speech:', err);
      Alert.alert(
        'Transcription Error', 
        'Failed to process speech recording. Please try again, speaking clearly and slowly.',
        [{ text: 'OK' }]
      );
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

  const speakText = (text: string) => {
    Speech.speak(text, {
      language: selectedLanguage.code,
      pitch: 1.0,
      rate: 0.9,
    });
  };

  const copyToClipboard = (text: string) => {
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

  // Define styles aligned with the HomeScreen theme
  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    backgroundImage: {
      width: '100%',
      height: '100%',
    },
    contentContainer: {
      flex: 1,
      backgroundColor: isDark ? 'rgba(0, 0, 0, 0.7)' : 'rgba(255, 255, 255, 0.8)',
    },
    header: {
      width: '100%',
      height: 60,
      backgroundColor: theme.cardBackground,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      borderBottomWidth: 1,
      borderBottomColor: theme.borderColor,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 2,
    },
    headerTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: theme.textColor,
    },
    content: {
      flex: 1,
    },
    scrollContent: {
      flexGrow: 1,
      paddingHorizontal: 16,
      paddingBottom: 24,
    },
    messageContainer: {
      paddingVertical: 16,
      paddingHorizontal: 16,
      backgroundColor: isDark ? 'rgba(30, 30, 30, 0.85)' : 'rgba(255, 255, 255, 0.85)',
      marginBottom: 12,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: theme.borderColor,
    },
    userMessageContainer: {
      backgroundColor: isDark ? 'rgba(50, 50, 70, 0.85)' : 'rgba(240, 240, 255, 0.85)',
      borderColor: theme.accentLight,
    },
    assistantMessageContainer: {
      backgroundColor: isDark ? 'rgba(30, 30, 30, 0.85)' : 'rgba(255, 255, 255, 0.85)',
    },
    messageLabel: {
      fontSize: 14,
      marginBottom: 4,
      color: theme.secondaryTextColor,
      fontWeight: '600',
    },
    messageText: {
      fontSize: 16,
      color: theme.textColor,
      lineHeight: 24,
    },
    controlsContainer: {
      borderTopWidth: 1,
      borderTopColor: theme.borderColor,
      padding: 16,
      backgroundColor: isDark ? 'rgba(20, 20, 20, 0.9)' : 'rgba(255, 255, 255, 0.9)',
    },
    micButtonContainer: {
      alignItems: 'center',
      marginBottom: 16,
    },
    micButton: {
      width: 60,
      height: 60,
      borderRadius: 30,
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: theme.accentColor,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 6,
      overflow: 'hidden',
    },
    timerText: {
      marginTop: 8,
      fontSize: 16,
      color: theme.accentColor,
      fontWeight: '600',
    },
    micButtonContent: {
      flex: 1,
      width: '100%',
      height: '100%',
      justifyContent: 'center',
      alignItems: 'center',
    },
    statusText: {
      textAlign: 'center',
      marginTop: 8,
      color: theme.secondaryTextColor,
      fontSize: 14,
    },
    settingsContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginTop: 16,
      paddingTop: 16,
      borderTopWidth: 1,
      borderTopColor: theme.borderColor,
    },
    settingLabel: {
      fontSize: 16,
      color: theme.textColor,
    },
    loadingContainer: {
      padding: 20,
      alignItems: 'center',
      justifyContent: 'center',
    },
    actionsContainer: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      marginTop: 8,
    },
    actionButton: {
      padding: 8,
      borderRadius: 4,
      backgroundColor: isDark ? 'rgba(60, 60, 80, 0.8)' : 'rgba(240, 240, 255, 0.8)',
      marginLeft: 8,
    },
    actionIcon: {
      color: theme.accentColor,
    },
    titleContainer: {
      width: '100%',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 30,
      marginTop: 20 + insets.top, // Add top inset to ensure content is below the notch
    },
    title: {
      fontSize: 34,
      fontWeight: 'bold',
      color: theme.textColor,
      marginTop: 10, // Add margin top for spacing between logo and text
    },
    logo: {
      width: 150, // Increased from 120
      height: 150, // Increased from 120
    },
  });

  return (
    <ImageBackground 
      source={require('../../assets/images/bg.png')} 
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      <SafeAreaView style={styles.contentContainer} edges={['bottom', 'left', 'right']}>
        <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
        
        <View style={styles.content}>
          <ScrollView 
            style={{flex: 1}}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Ozzy title and logo - Now bigger, centered, and clickable */}
            <TouchableOpacity 
              style={styles.titleContainer}
              onPress={() => navigation.navigate('Home')}
            >
              <Image 
                source={require('../../assets/images/Ozzy.png')} 
                style={styles.logo}
                resizeMode="contain"
              />
            </TouchableOpacity>
            
            {transcription ? (
              <View style={[styles.messageContainer, styles.userMessageContainer]}>
                <Text style={styles.messageLabel}>You</Text>
                <Text style={styles.messageText}>{transcription}</Text>
              </View>
            ) : null}

            {clarifiedText ? (
              <View style={[styles.messageContainer, styles.assistantMessageContainer]}>
                <Text style={styles.messageLabel}>Ozzy</Text>
                <Text style={styles.messageText}>{clarifiedText}</Text>
                <View style={styles.actionsContainer}>
                  <TouchableOpacity 
                    style={styles.actionButton}
                    onPress={() => speakText(clarifiedText)}
                  >
                    <Feather name="volume-2" size={18} style={styles.actionIcon} />
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={styles.actionButton}
                    onPress={() => copyToClipboard(clarifiedText)}
                  >
                    <Feather name="copy" size={18} style={styles.actionIcon} />
                  </TouchableOpacity>
                </View>
              </View>
            ) : null}

            {isProcessing && (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={theme.accentColor} />
              </View>
            )}
          </ScrollView>
          
          {/* Bottom controls area */}
          <View style={styles.controlsContainer}>
            <View style={styles.micButtonContainer}>
              {isRecording && (
                <Text style={styles.timerText}>
                  {Math.floor(recordingTime / 60)}:{(recordingTime % 60).toString().padStart(2, '0')}
                </Text>
              )}
              <TouchableOpacity
                style={styles.micButton}
                onPress={toggleRecording}
                activeOpacity={0.8}
                disabled={isProcessing}
              >
                {isRecording ? (
                  <LinearGradient
                    colors={[theme.dangerColor, '#FF7A7A']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.micButtonContent}
                  >
                    <Feather name="mic-off" size={24} color="white" />
                  </LinearGradient>
                ) : (
                  <LinearGradient
                    colors={[theme.accentColor, '#8A4FFF']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.micButtonContent}
                  >
                    <Feather name="mic" size={24} color="white" />
                  </LinearGradient>
                )}
              </TouchableOpacity>
              <Text style={styles.statusText}>
                {isRecording 
                  ? "Listening..." 
                  : isProcessing 
                    ? "Processing..." 
                    : "Tap the microphone to start speaking"}
              </Text>
            </View>
            
            <View style={styles.settingsContainer}>
              <Text style={styles.settingLabel}>Auto-speak responses</Text>
              <Switch
                value={autoSpeak}
                onValueChange={setAutoSpeak}
                trackColor={{ false: isDark ? theme.mutedBackground : '#E2E8F0', true: theme.accentColor }}
                thumbColor={"#FFFFFF"}
                ios_backgroundColor={isDark ? theme.mutedBackground : '#E2E8F0'}
              />
            </View>
          </View>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
}