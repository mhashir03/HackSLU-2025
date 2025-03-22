import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../context/ThemeContext';

const ProfileScreen = () => {
  const { theme } = useTheme();
  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.backgroundColor }]}>
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: theme.textColor }]}>
          Profile
        </Text>
        <Feather name="user" size={24} color={theme.textColor} />
      </View>
      
      <ScrollView style={styles.scrollView}>
        <View style={styles.profileContainer}>
          <View style={styles.avatarContainer}>
            <View style={[styles.avatar, { backgroundColor: theme.accentColor }]}>
              <Text style={styles.avatarText}>U</Text>
            </View>
          </View>
          
          <Text style={[styles.userName, { color: theme.textColor }]}>
            User Name
          </Text>
          
          <Text style={[styles.userEmail, { color: theme.textColor }]}>
            user@example.com
          </Text>
          
          <View style={styles.statsContainer}>
            <View style={[styles.statItem, { backgroundColor: theme.cardBackground }]}>
              <Text style={[styles.statNumber, { color: theme.textColor }]}>0</Text>
              <Text style={[styles.statLabel, { color: theme.secondaryTextColor }]}>Conversations</Text>
            </View>
            
            <View style={[styles.statItem, { backgroundColor: theme.cardBackground }]}>
              <Text style={[styles.statNumber, { color: theme.textColor }]}>0</Text>
              <Text style={[styles.statLabel, { color: theme.secondaryTextColor }]}>Minutes</Text>
            </View>
          </View>
        </View>
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
  profileContainer: {
    padding: 20,
    alignItems: 'center',
  },
  avatarContainer: {
    marginVertical: 20,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 40,
    fontWeight: 'bold',
    color: 'white',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  userEmail: {
    fontSize: 16,
    marginBottom: 20,
    opacity: 0.7,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 20,
  },
  statItem: {
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    width: '45%',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 14,
  },
});

export default ProfileScreen; 