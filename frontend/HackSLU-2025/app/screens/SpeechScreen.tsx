import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch, ScrollView, ActivityIndicator, Alert, Platform, StatusBar, Image } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import * as Speech from 'expo-speech';
import { useTheme } from '../context/ThemeContext';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { recognizeSpeech } from '../../api/speechApi'
import { LinearGradient } from 'expo-linear-gradient';

// Define the Language interface
interface Language {
  code: string;
  name: string;
}

// @ts-ignore - ignore navigation type for now
export default function SpeechScreen({ navigation }) {
  const { theme, isDark } = useTheme();
  const insets = useSafeAreaInsets();
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

  // Define styles aligned with the HomeScreen theme
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.backgroundColor,
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
      backgroundColor: theme.cardBackground,
      marginBottom: 12,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: theme.borderColor,
    },
    userMessageContainer: {
      backgroundColor: theme.mutedBackground,
      borderColor: theme.accentLight,
    },
    assistantMessageContainer: {
      backgroundColor: theme.cardBackground,
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
      backgroundColor: theme.cardBackground,
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
      backgroundColor: theme.mutedBackground,
      marginLeft: 8,
    },
    actionIcon: {
      color: theme.accentColor,
    },
    waveBackground: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      height: 200,
      opacity: 0.1,
      zIndex: -1,
    },
    titleContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 30,
      marginTop: 20 + insets.top, // Add top inset to ensure content is below the notch
    },
    title: {
      fontSize: 34,
      fontWeight: 'bold',
      color: theme.textColor,
    },
    logo: {
      width: 50,
      height: 50,
      marginLeft: 12,
    },
  });

  return (
    <SafeAreaView style={styles.container} edges={['bottom', 'left', 'right']}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
      
      <View style={styles.content}>
        <ScrollView 
          style={{flex: 1}}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Ozzy title and logo */}
          <View style={styles.titleContainer}>
            <Text style={styles.title}>Ozzy</Text>
            <Image 
              source={require('../../assets/images/Ozzy.png')} 
              style={styles.logo}
              resizeMode="contain"
            />
          </View>
          
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
          
          {/* Decorative wave background */}
          <Image
            source={require('../../assets/images/bg.png')}
            style={styles.waveBackground}
            resizeMode="cover"
          />
        </ScrollView>
        
        {/* Bottom controls area */}
        <View style={styles.controlsContainer}>
          <View style={styles.micButtonContainer}>
            <TouchableOpacity
              style={styles.micButton}
              onPress={toggleRecording}
              activeOpacity={0.8}
              disabled={isProcessing}
            >
              {isRecording ? (
                // @ts-ignore - ignore LinearGradient props error
                <LinearGradient
                  colors={[theme.dangerColor, '#FF7A7A']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.micButtonContent}
                >
                  <Feather name="mic-off" size={24} color="white" />
                </LinearGradient>
              ) : (
                // @ts-ignore - ignore LinearGradient props error
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
  );
}