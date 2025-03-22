import React, { useState, useCallback } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '../../../app/context/ThemeContext';

/**
 * Speech control button states
 */
type SpeechControlState = 'idle' | 'recording' | 'processing';

/**
 * Speech control component props
 */
interface SpeechControlProps {
  /**
   * Current state of the speech control
   * @default 'idle'
   */
  state?: SpeechControlState;
  
  /**
   * Callback when the start button is pressed
   */
  onStartRecording?: () => void;
  
  /**
   * Callback when the stop button is pressed
   */
  onStopRecording?: () => void;
  
  /**
   * Callback when the cancel button is pressed
   */
  onCancelRecording?: () => void;
  
  /**
   * Whether the control is disabled
   * @default false
   */
  isDisabled?: boolean;
}

/**
 * A component that provides controls for voice recording in the speech screen
 */
export function SpeechControl({
  state = 'idle',
  onStartRecording,
  onStopRecording,
  onCancelRecording,
  isDisabled = false,
}: SpeechControlProps) {
  const { theme } = useTheme();
  
  /**
   * Handles the main button press based on current state
   */
  const handleMainButtonPress = useCallback(() => {
    if (isDisabled) return;
    
    if (state === 'idle') {
      onStartRecording?.();
    } else if (state === 'recording') {
      onStopRecording?.();
    }
  }, [state, onStartRecording, onStopRecording, isDisabled]);
  
  /**
   * Handles the cancel button press
   */
  const handleCancelPress = useCallback(() => {
    if (isDisabled || state !== 'recording') return;
    onCancelRecording?.();
  }, [state, onCancelRecording, isDisabled]);
  
  // Create dynamic styles based on the current state and theme
  const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 20,
    },
    mainButtonContainer: {
      width: 64,
      height: 64,
      borderRadius: 32,
      backgroundColor: state === 'recording' ? '#EF4444' : theme.accentColor,
      alignItems: 'center',
      justifyContent: 'center',
      opacity: isDisabled ? 0.6 : 1,
    },
    recordingIndicator: {
      width: 24,
      height: 24,
      borderRadius: 4,
      backgroundColor: '#FFFFFF',
    },
    cancelButton: {
      marginLeft: 16,
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: theme.mutedBackground,
      alignItems: 'center',
      justifyContent: 'center',
      opacity: state !== 'recording' || isDisabled ? 0.6 : 1,
    },
  });
  
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.mainButtonContainer}
        onPress={handleMainButtonPress}
        disabled={isDisabled || state === 'processing'}
        activeOpacity={0.8}
      >
        {state === 'recording' ? (
          <View style={styles.recordingIndicator} />
        ) : (
          <Feather name="mic" size={28} color="white" />
        )}
      </TouchableOpacity>
      
      {state === 'recording' && (
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={handleCancelPress}
          disabled={isDisabled}
          activeOpacity={0.8}
        >
          <Feather name="x" size={20} color={theme.textColor} />
        </TouchableOpacity>
      )}
    </View>
  );
}

export default SpeechControl; 