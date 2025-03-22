import React from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity, ScrollView } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../context/ThemeContext';

const SettingsScreen = () => {
  const { theme, isDark, toggleTheme } = useTheme();
  
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
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: theme.textColor }]}>
          Settings
        </Text>
        <Feather name="settings" size={24} color={theme.textColor} />
      </View>
      
      <ScrollView style={styles.scrollView}>
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.secondaryTextColor }]}>Appearance</Text>
          {renderSettingItem('moon', 'Dark Mode', true, isDark, toggleTheme)}
        </View>
        
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.secondaryTextColor }]}>General</Text>
          {renderSettingItem('volume-2', 'Voice Settings', false, false)}
          {renderSettingItem('bell', 'Notifications', false, false)}
          {renderSettingItem('lock', 'Privacy', false, false)}
        </View>
        
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.secondaryTextColor }]}>Support</Text>
          {renderSettingItem('help-circle', 'Help', false, false)}
          {renderSettingItem('info', 'About', false, false)}
        </View>
        
        <TouchableOpacity style={[styles.logoutButton, { backgroundColor: theme.dangerColor }]}>
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
        
        <Text style={[styles.versionText, { color: theme.secondaryTextColor }]}>
          Version 1.0.0
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
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
  settingIconContainer: {
    marginRight: 15,
  },
  settingTitle: {
    fontSize: 16,
  },
  logoutButton: {
    marginHorizontal: 20,
    marginVertical: 20,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  logoutText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  versionText: {
    textAlign: 'center',
    marginBottom: 30,
    fontSize: 14,
  },
});

export default SettingsScreen; 