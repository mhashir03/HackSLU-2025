import React, {useState} from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity, ScrollView, Modal, Image } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../context/ThemeContext';


const LANGUAGES = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Spanish' },
    { code: 'fr', name: 'French' },
    { code: 'de', name: 'German' },
    { code: 'zh', name: 'Chinese' },
    // Add more languages as needed
  ];

const SettingsScreen = () => {
    
  const { theme, isDark, toggleTheme } = useTheme();
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [showAboutModal, setShowAboutModal] = useState(false);
  
  
  const renderSettingItem = (icon, title, hasSwitch = false, switchValue = false, onToggle = () => {}) => (
    <View style={[styles.settingItem, { borderBottomColor: theme.borderColor }]}>
      <View style={styles.settingLeft}>
        <View style={styles.settingIconContainer}>
          <Feather name={icon} size={22} color={theme.textColor} />
        </View>
        <Text style={[styles.settingTitle, { color: theme.textColor }]}>{title}</Text>
      </View>
      
      {hasSwitch ? (
        <Switch
          value={switchValue}
          onValueChange={onToggle}
          trackColor={{ false: theme.borderColor, true: theme.accentColor }}
          thumbColor={theme.cardBackground}
        />
      ) : (
        <Feather name="chevron-right" size={20} color={theme.secondaryTextColor} />
      )}
    </View>
  );
  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.backgroundColor }]}>
      <ScrollView style={styles.scrollView}>
        {/* Ozzy title and logo */}
        <View style={styles.titleContainer}>
          <Text style={[styles.title, { color: theme.textColor }]}>Ozzy</Text>
          <Image 
            source={require('../../assets/images/Ozzy.png')} 
            style={styles.logo}
            resizeMode="contain"
          />
        </View>
        
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.secondaryTextColor }]}>Appearance</Text>
          {renderSettingItem('moon', 'Dark Mode', true, isDark, toggleTheme)}
        </View>
        
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.secondaryTextColor }]}>Speech Settings</Text>
          <TouchableOpacity 
            style={[styles.settingItem, { borderBottomColor: theme.borderColor }]}
            onPress={() => setShowLanguageModal(true)}
          >
            <View style={styles.settingLeft}>
              <View style={styles.settingIconContainer}>
                <Feather name="globe" size={22} color={theme.textColor} />
              </View>
              <Text style={[styles.settingTitle, { color: theme.textColor }]}>Output Language</Text>
            </View>
            <View style={styles.settingRight}>
              <Text style={{ color: theme.secondaryTextColor }}>
                {LANGUAGES.find(lang => lang.code === selectedLanguage)?.name || 'English'}
              </Text>
              <Feather name="chevron-right" size={20} color={theme.secondaryTextColor} />
            </View>
          </TouchableOpacity>
        </View>
        
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.secondaryTextColor }]}>Support</Text>
          <TouchableOpacity 
            style={[styles.settingItem, { borderBottomColor: theme.borderColor }]}
            onPress={() => setShowHelpModal(true)}
          >
            <View style={styles.settingLeft}>
              <View style={styles.settingIconContainer}>
                <Feather name="help-circle" size={22} color={theme.textColor} />
              </View>
              <Text style={[styles.settingTitle, { color: theme.textColor }]}>Help</Text>
            </View>
            <Feather name="chevron-right" size={20} color={theme.secondaryTextColor} />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.settingItem, { borderBottomColor: theme.borderColor }]}
            onPress={() => setShowAboutModal(true)}
          >
            <View style={styles.settingLeft}>
              <View style={styles.settingIconContainer}>
                <Feather name="info" size={22} color={theme.textColor} />
              </View>
              <Text style={[styles.settingTitle, { color: theme.textColor }]}>About</Text>
            </View>
            <Feather name="chevron-right" size={20} color={theme.secondaryTextColor} />
          </TouchableOpacity>
        </View>
        
        <Text style={[styles.versionText, { color: theme.secondaryTextColor }]}>
          Version 1.0.0
        </Text>
      </ScrollView>

      {/* Language Modal */}
      <Modal
        visible={showLanguageModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowLanguageModal(false)}
      >
        <View style={[styles.modalContainer, { backgroundColor: 'rgba(0,0,0,0.5)' }]}>
          <View style={[styles.modalContent, { backgroundColor: theme.cardBackground }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: theme.textColor }]}>Select Language</Text>
              <TouchableOpacity onPress={() => setShowLanguageModal(false)}>
                <Feather name="x" size={24} color={theme.textColor} />
              </TouchableOpacity>
            </View>
            
            <ScrollView>
              {LANGUAGES.map(language => (
                <TouchableOpacity
                  key={language.code}
                  style={[
                    styles.languageItem,
                    { 
                      borderBottomColor: theme.borderColor,
                      backgroundColor: selectedLanguage === language.code ? theme.accentLight : 'transparent' 
                    }
                  ]}
                  onPress={() => {
                    setSelectedLanguage(language.code);
                    setShowLanguageModal(false);
                  }}
                >
                  <Text style={{ color: theme.textColor }}>{language.name}</Text>
                  {selectedLanguage === language.code && (
                    <Feather name="check" size={20} color={theme.accentColor} />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Help Modal */}
      <Modal
        visible={showHelpModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowHelpModal(false)}
      >
        <View style={[styles.modalContainer, { backgroundColor: 'rgba(0,0,0,0.5)' }]}>
          <View style={[styles.modalContent, { backgroundColor: theme.cardBackground }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: theme.textColor }]}>Need Help?</Text>
              <TouchableOpacity onPress={() => setShowHelpModal(false)}>
                <Feather name="x" size={24} color={theme.textColor} />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.modalScroll}>
              <Text style={[styles.modalSubtitle, { color: theme.textColor }]}>Contact Our Team</Text>
              
              <View style={styles.contactItem}>
                <Feather name="user" size={18} color={theme.textColor} style={styles.contactIcon} />
                <View>
                  <Text style={[styles.contactName, { color: theme.textColor }]}>Muhammad Hashir</Text>
                  <Text style={[styles.contactEmail, { color: theme.secondaryTextColor }]}>mhashir0318@gmail.com</Text>
                </View>
              </View>
              
              <View style={styles.contactItem}>
                <Feather name="user" size={18} color={theme.textColor} style={styles.contactIcon} />
                <View>
                  <Text style={[styles.contactName, { color: theme.textColor }]}>Mustafa Hashmi</Text>
                  <Text style={[styles.contactEmail, { color: theme.secondaryTextColor }]}>mustafahashmi2014@gmail.com</Text>
                </View>
              </View>
              
              <View style={styles.contactItem}>
                <Feather name="user" size={18} color={theme.textColor} style={styles.contactIcon} />
                <View>
                  <Text style={[styles.contactName, { color: theme.textColor }]}>Nilesh Gupta</Text>
                  <Text style={[styles.contactEmail, { color: theme.secondaryTextColor }]}>guptan1491@gmail.com</Text>
                </View>
              </View>
              
              <Text style={[styles.helpText, { color: theme.textColor }]}>
                Have questions, feedback, or want to contribute to Ozzy? Feel free to reach out to any founding engineer above. We're always looking for ways to improve!
              </Text>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* About Modal */}
      <Modal
        visible={showAboutModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowAboutModal(false)}
      >
        <View style={[styles.modalContainer, { backgroundColor: 'rgba(0,0,0,0.5)' }]}>
          <View style={[styles.modalContent, { backgroundColor: theme.cardBackground }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: theme.textColor }]}>About Ozzy</Text>
              <TouchableOpacity onPress={() => setShowAboutModal(false)}>
                <Feather name="x" size={24} color={theme.textColor} />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.modalScroll}>
              <View style={styles.aboutLogoContainer}>
                <Image 
                  source={require('../../assets/images/Ozzy.png')} 
                  style={styles.aboutLogo}
                  resizeMode="contain"
                />
              </View>
              
              <Text style={[styles.aboutText, { color: theme.textColor }]}>
                Ozzy is an AI-powered speech assistant designed to enhance communication through advanced speech recognition and intelligent responses. 
              </Text>
              
              <Text style={[styles.aboutText, { color: theme.textColor, marginTop: 10 }]}>
                Created at HackSLU 2025, Ozzy aims to bridge communication gaps by providing realtime transcription and clarification of speech. Our mission is to make voice technology more accessible and useful for everyone.
              </Text>
              
              <Text style={[styles.aboutText, { color: theme.textColor, marginTop: 10 }]}>
                The app features multiple language support, intuitive voice controls, and a beautiful interface designed with accessibility in mind.
              </Text>
              
              <Text style={[styles.aboutVersion, { color: theme.secondaryTextColor }]}>
                Version 1.0.0
              </Text>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    textTransform: 'uppercase',
    marginLeft: 20,
    marginBottom: 10,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingRight: {
    flexDirection: 'row',
    alignItems: 'center', 
    justifyContent: 'flex-end',
  },
  settingIconContainer: {
    marginRight: 15,
  },
  settingTitle: {
    fontSize: 16,
  },
  versionText: {
    textAlign: 'center',
    marginBottom: 30,
    fontSize: 14,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 30,
    marginTop: 20,
  },
  title: {
    fontSize: 34,
    fontWeight: 'bold',
  },
  logo: {
    width: 50,
    height: 50,
    marginLeft: 12,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    padding: 20,
    borderRadius: 10,
    width: '85%',
    maxHeight: '70%',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  modalScroll: {
    marginBottom: 10,
  },
  languageItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
    borderBottomWidth: 1,
  },
  modalSubtitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  contactIcon: {
    marginRight: 12,
  },
  contactName: {
    fontSize: 16,
    fontWeight: '500',
  },
  contactEmail: {
    fontSize: 14,
  },
  helpText: {
    marginTop: 20,
    lineHeight: 22,
    fontSize: 15,
  },
  aboutLogoContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  aboutLogo: {
    width: 100,
    height: 100,
  },
  aboutText: {
    fontSize: 15,
    lineHeight: 22,
  },
  aboutVersion: {
    marginTop: 20,
    textAlign: 'center',
    fontSize: 14,
  },
});

export default SettingsScreen; 