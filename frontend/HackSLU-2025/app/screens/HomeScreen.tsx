import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../context/ThemeContext';

// @ts-ignore - ignoring navigation type for now
export default function HomeScreen({ navigation }) {
  const { theme } = useTheme();
  
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
    header: {
      alignItems: 'center',
      marginTop: 32,
      marginBottom: 32,
    },
    title: {
      fontSize: 28,
      fontWeight: 'bold',
      color: theme.textColor,
    },
    subtitle: {
      fontSize: 16,
      color: theme.secondaryTextColor,
      marginTop: 8,
    },
    buttonContainer: {
      marginVertical: 32,
      gap: 24,
    },
    primaryButton: {
      backgroundColor: theme.accentColor,
      borderRadius: 12,
      height: 80,
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'row',
    },
    primaryButtonText: {
      color: 'white',
      fontSize: 20,
      fontWeight: '600',
      marginLeft: 8,
    },
    secondaryButtonsRow: {
      flexDirection: 'row',
      gap: 16,
    },
    secondaryButton: {
      flex: 1,
      height: 64,
      backgroundColor: theme.mutedBackground,
      borderRadius: 12,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 8,
    },
    secondaryButtonText: {
      color: theme.textColor,
      marginTop: 4,
      fontSize: 14,
    },
    tipsContainer: {
      backgroundColor: theme.mutedBackground,
      borderRadius: 12,
      padding: 16,
      marginTop: 'auto',
      marginBottom: 16,
    },
    tipsTitle: {
      fontWeight: '600',
      marginBottom: 8,
      color: theme.textColor,
    },
    tipsList: {
      gap: 8,
    },
    tipItem: {
      flexDirection: 'row',
      alignItems: 'flex-start',
    },
    tipText: {
      fontSize: 14,
      color: theme.textColor,
      flex: 1,
    },
    tipBullet: {
      marginRight: 8,
      color: theme.textColor,
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content} contentContainerStyle={{ flexGrow: 1 }}>
        <View style={styles.header}>
          <Text style={styles.title}>VoiceClarity</Text>
          <Text style={styles.subtitle}>AI-powered speech assistant</Text>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={styles.primaryButton}
            onPress={() => navigation.navigate('Speech')}
            activeOpacity={0.8}
          >
            <Feather name="mic" size={24} color="white" />
            <Text style={styles.primaryButtonText}>Start Speaking</Text>
          </TouchableOpacity>

          <View style={styles.secondaryButtonsRow}>
            <TouchableOpacity 
              style={styles.secondaryButton}
              onPress={() => navigation.navigate('History')}
              activeOpacity={0.8}
            >
              <Feather name="clock" size={24} color={theme.textColor} />
              <Text style={styles.secondaryButtonText}>History</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.secondaryButton}
              onPress={() => navigation.navigate('Profile', { screen: 'Settings' })}
              activeOpacity={0.8}
            >
              <Feather name="settings" size={24} color={theme.textColor} />
              <Text style={styles.secondaryButtonText}>Settings</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.tipsContainer}>
          <Text style={styles.tipsTitle}>Quick Tips</Text>
          <View style={styles.tipsList}>
            <View style={styles.tipItem}>
              <Text style={styles.tipBullet}>•</Text>
              <Text style={styles.tipText}>Tap the microphone button to start speaking</Text>
            </View>
            <View style={styles.tipItem}>
              <Text style={styles.tipBullet}>•</Text>
              <Text style={styles.tipText}>Speak at your natural pace</Text>
            </View>
            <View style={styles.tipItem}>
              <Text style={styles.tipBullet}>•</Text>
              <Text style={styles.tipText}>The AI will transcribe and clarify your speech</Text>
            </View>
            <View style={styles.tipItem}>
              <Text style={styles.tipBullet}>•</Text>
              <Text style={styles.tipText}>Adjust settings for your preferences</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}