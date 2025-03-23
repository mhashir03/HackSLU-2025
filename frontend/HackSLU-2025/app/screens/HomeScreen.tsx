import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, Dimensions, Platform } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../context/ThemeContext';
import { LinearGradient } from 'expo-linear-gradient';

// @ts-ignore - ignoring navigation type for now
export default function HomeScreen({ navigation }) {
  const { theme } = useTheme();
  const windowHeight = Dimensions.get('window').height;
  const isMobile = Platform.OS === 'ios' || Platform.OS === 'android';
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.backgroundColor,
    },
    scrollView: {
      flex: 1,
    },
    content: {
      flex: 1,
      padding: 20,
      maxWidth: 500,
      width: '100%',
      alignSelf: 'center',
    },
    initialScreenContainer: {
      height: windowHeight - 100, // Adjust this value as needed to fit your device
      justifyContent: 'space-between',
      paddingBottom: 40,
    },
    header: {
      alignItems: 'center',
      marginTop: 20,
    },
    logoContainer: {
      alignItems: 'center',
    },
    logo: {
      width: 300,
      height: 300,
      marginTop: 1,
      marginBottom: isMobile ? -120 : -80, // More negative margin on mobile
    },
    title: {
      fontSize: 32,
      fontWeight: 'bold',
      color: theme.textColor,
      letterSpacing: 1,
    },
    subtitle: {
      fontSize: 16,
      color: theme.secondaryTextColor,
      marginTop: 8,
      marginBottom: isMobile ? 20 : 0, // Add bottom margin on mobile only
      letterSpacing: 0.5,
    },
    buttonContainer: {
      marginTop: isMobile ? 30 : 'auto', // Remove auto margin on mobile
      width: '100%',
    },
    primaryButton: {
      borderRadius: 16,
      height: 90,
      overflow: 'hidden',
      shadowColor: theme.accentColor,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 6,
    },
    primaryButtonContent: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'row',
    },
    primaryButtonText: {
      color: 'white',
      fontSize: 22,
      fontWeight: '600',
      marginLeft: 12,
    },
    secondaryContent: {
      marginTop: 24,
    },
    secondaryButtonsRow: {
      flexDirection: 'row',
      gap: 16,
      marginBottom: 24,
    },
    secondaryButton: {
      flex: 1,
      height: 80,
      backgroundColor: theme.mutedBackground,
      borderRadius: 16,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 8,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    secondaryButtonText: {
      color: theme.textColor,
      marginTop: 8,
      fontSize: 16,
      fontWeight: '500',
    },
    tipsContainer: {
      backgroundColor: theme.mutedBackground,
      borderRadius: 20,
      padding: 24,
      marginBottom: 24,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    tipsHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 16,
    },
    tipsIcon: {
      marginRight: 10,
    },
    tipsTitle: {
      fontWeight: '700',
      fontSize: 18,
      color: theme.textColor,
    },
    tipsList: {
      gap: 12,
    },
    tipItem: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      paddingVertical: 4,
    },
    tipText: {
      fontSize: 15,
      color: theme.textColor,
      flex: 1,
      lineHeight: 22,
    },
    tipBullet: {
      marginRight: 10,
      color: theme.accentColor,
      fontSize: 18,
    },
    waveBackground: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      height: 200,
      opacity: 0.1,
      zIndex: -1,
    }
  });

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
        decelerationRate="normal"
        scrollEventThrottle={16}
      >
        <View style={styles.content}>
          {/* Initial Screen - Logo and Main Button */}
          <View style={[
            styles.initialScreenContainer,
            isMobile && { justifyContent: 'flex-start' } // Override justifyContent on mobile
          ]}>
            <View style={styles.header}>
              <View style={styles.logoContainer}>
                <Image 
                  source={require('../../assets/images/Ozzy.png')} 
                  style={styles.logo}
                  resizeMode="contain"
                />
                <Text style={styles.title}>Ozzy</Text>
                <Text style={styles.subtitle}>AI-powered speech assistant</Text>
              </View>
            </View>

            <View style={styles.buttonContainer}>
              <TouchableOpacity 
                style={styles.primaryButton}
                onPress={() => navigation.navigate('Speech')}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={[theme.accentColor, '#8A4FFF']} 
                  start={{ x: 0, y: 0 }} 
                  end={{ x: 1, y: 0 }} 
                  style={styles.primaryButtonContent}
                >
                  <Feather name="mic" size={28} color="white" />
                  <Text style={styles.primaryButtonText}>Start Speaking</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>

          {/* Secondary Content - Appears when scrolling */}
          <View style={styles.secondaryContent}>
            <View style={styles.secondaryButtonsRow}>
              <TouchableOpacity 
                style={styles.secondaryButton}
                onPress={() => navigation.navigate('Settings')}
                activeOpacity={0.8}
              >
                <Feather name="settings" size={28} color={theme.accentColor} />
                <Text style={styles.secondaryButtonText}>Settings</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.secondaryButton}
                onPress={() => navigation.navigate('History')}
                activeOpacity={0.8}
              >
                <Feather name="clock" size={28} color={theme.accentColor} />
                <Text style={styles.secondaryButtonText}>History</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.tipsContainer}>
              <View style={styles.tipsHeader}>
                <Feather name="info" size={20} color={theme.accentColor} style={styles.tipsIcon} />
                <Text style={styles.tipsTitle}>Quick Tips</Text>
              </View>
              <View style={styles.tipsList}>
                <View style={styles.tipItem}>
                  <Text style={styles.tipBullet}>•</Text>
                  <Text style={styles.tipText}>Tap the microphone button to start speaking</Text>
                </View>
                <View style={styles.tipItem}>
                  <Text style={styles.tipBullet}>•</Text>
                  <Text style={styles.tipText}>Speak at your natural pace for best recognition</Text>
                </View>
                <View style={styles.tipItem}>
                  <Text style={styles.tipBullet}>•</Text>
                  <Text style={styles.tipText}>The AI will transcribe and clarify your speech in real-time</Text>
                </View>
                <View style={styles.tipItem}>
                  <Text style={styles.tipBullet}>•</Text>
                  <Text style={styles.tipText}>Adjust settings for your voice preferences</Text>
                </View>
              </View>
            </View>
          </View>
          
          {/* Decorative wave background */}
          <Image
            source={require('../../assets/images/bg.png')}
            style={styles.waveBackground}
            resizeMode="cover"
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}