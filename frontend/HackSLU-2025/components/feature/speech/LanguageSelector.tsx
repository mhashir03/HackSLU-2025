import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  FlatList,
  Pressable,
  Animated,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '../../../app/context/ThemeContext';
import { Language, SUPPORTED_LANGUAGES } from '../../../lib/constants/languages';

interface LanguageSelectorProps {
  /**
   * Currently selected language
   */
  selectedLanguage: Language;

  /**
   * Callback when a language is selected
   */
  onSelectLanguage: (language: Language) => void;

  /**
   * Optional custom style for the selector button
   */
  style?: any;
}

/**
 * A component that allows users to select a language from a dropdown
 */
export function LanguageSelector({
  selectedLanguage,
  onSelectLanguage,
  style,
}: LanguageSelectorProps) {
  const { theme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const scaleAnim = useRef(new Animated.Value(0)).current;

  const openModal = () => {
    setIsOpen(true);
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      tension: 80,
      friction: 8,
    }).start();
  };

  const closeModal = () => {
    Animated.timing(scaleAnim, {
      toValue: 0,
      duration: 150,
      useNativeDriver: true,
    }).start(() => {
      setIsOpen(false);
    });
  };

  const handleSelectLanguage = (language: Language) => {
    onSelectLanguage(language);
    closeModal();
  };

  const renderLanguageItem = ({ item }: { item: Language }) => {
    const isSelected = item.code === selectedLanguage.code;

    return (
      <Pressable
        style={({ pressed }) => [
          styles.languageItem,
          pressed && { backgroundColor: theme.mutedBackground },
          isSelected && { backgroundColor: `${theme.accentColor}20` },
        ]}
        onPress={() => handleSelectLanguage(item)}
      >
        <View style={styles.languageRow}>
          <Text style={styles.languageFlag}>{item.flag}</Text>
          <Text style={[styles.languageText, { color: theme.textColor }]}>
            {item.name}
          </Text>
        </View>
        {isSelected && (
          <Feather name="check" size={18} color={theme.accentColor} />
        )}
      </Pressable>
    );
  };

  const styles = StyleSheet.create({
    container: {
      position: 'relative',
    },
    button: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 16,
      paddingHorizontal: 20,
      borderRadius: 12,
      backgroundColor: theme.mutedBackground,
      borderWidth: 2,
      borderColor: theme.accentColor,
      elevation: 3,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.2,
      shadowRadius: 4,
    },
    selectedLanguage: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    flag: {
      fontSize: 22,
      marginRight: 10,
    },
    languageCode: {
      fontSize: 18,
      color: theme.textColor,
      fontWeight: '700',
    },
    icon: {
      marginLeft: 10,
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.6)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalContent: {
      backgroundColor: theme.backgroundColor,
      borderRadius: 16,
      width: '85%',
      maxWidth: 320,
      maxHeight: '75%',
      overflow: 'hidden',
      borderWidth: 1,
      borderColor: theme.divider,
    },
    modalHeader: {
      padding: 18,
      borderBottomWidth: 1,
      borderBottomColor: theme.divider,
      backgroundColor: `${theme.accentColor}15`,
    },
    modalTitle: {
      fontSize: 20,
      fontWeight: '700',
      color: theme.textColor,
      textAlign: 'center',
    },
    languageList: {
      paddingVertical: 8,
    },
    languageItem: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: 18,
    },
    languageRow: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
    },
    languageFlag: {
      fontSize: 24,
      marginRight: 14,
    },
    languageText: {
      fontSize: 18,
      fontWeight: '500',
    },
  });

  return (
    <View style={[styles.container, style]}>
      <TouchableOpacity 
        style={styles.button} 
        onPress={openModal} 
        activeOpacity={0.7}
        accessibilityLabel={`Select language. Current language: ${selectedLanguage.name}`}
        accessibilityHint="Opens language selection menu"
        accessibilityRole="button"
      >
        <View style={styles.selectedLanguage}>
          <Text style={styles.flag}>{selectedLanguage.flag}</Text>
          <Text style={styles.languageCode}>{selectedLanguage.code.split('-')[0]}</Text>
        </View>
        <Feather name="chevron-down" size={20} color={theme.accentColor} style={styles.icon} />
      </TouchableOpacity>

      <Modal 
        transparent 
        visible={isOpen} 
        animationType="fade" 
        onRequestClose={closeModal}
        statusBarTranslucent={true}
      >
        <Pressable style={styles.modalOverlay} onPress={closeModal}>
          <Animated.View
            style={[
              styles.modalContent,
              {
                transform: [{ scale: scaleAnim }],
              },
            ]}
          >
            <Pressable onPress={(e) => e.stopPropagation()}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Select Language</Text>
              </View>
              <FlatList
                data={SUPPORTED_LANGUAGES}
                renderItem={renderLanguageItem}
                keyExtractor={(item) => item.code}
                style={styles.languageList}
                initialNumToRender={10}
                showsVerticalScrollIndicator={true}
              />
            </Pressable>
          </Animated.View>
        </Pressable>
      </Modal>
    </View>
  );
}

export default LanguageSelector; 