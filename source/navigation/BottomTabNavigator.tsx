import React from 'react';
import { Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { COLORS } from '../styles/colors';
import { Screen } from '../types';

interface Tab {
  id: Screen;
  icon: string;
  label: string;
}

interface BottomTabNavigatorProps {
  activeScreen: Screen;
  setActiveScreen: (screen: Screen) => void;
}

export default function BottomTabNavigator({
  activeScreen,
  setActiveScreen,
}: BottomTabNavigatorProps) {
  const tabs: Tab[] = [
    { id: 'tasks', icon: '✓', label: 'Tasks'},
    { id: 'calendar', icon: '📅', label: 'Calendar'},
    { id: 'add', icon: '➕', label: 'Add Task'},
    { id: 'settings', icon: '⚙️', label: 'Settings'},
  ];

  return (
    <View style={styles.bottomNav}>
      {tabs.map((tab) => (
        <TouchableOpacity
          key={tab.id}
          style={[styles.navItem, activeScreen === tab.id && styles.navIconActive]}
          onPress={() => setActiveScreen(tab.id)}
        >
          <Text style={[styles.navIcon, activeScreen === tab.id && styles.navIconActive]}>
            {tab.icon}
          </Text>
          <Text style={[styles.navLabel, activeScreen === tabs.id && styles.navLabelActive]}>
            {tab.label}
          </Text>
        </TouchableOpacity>
        ))}
    </View>
  );
}

const styles = StyleSheet.create({
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingVertical: 12,
    paddingBottom: Platform.OS === 'ios' ? 28 : 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2},
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 10,
  },
  navItem: {
    flex: 1, 
    alignItems: 'center',
    paddingVertical: 8,
    borderRadius: 12,
  },
  navItemActive: {
    backgroundColor: '#ede9fe',
  },
  navIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  navIconActive: {
    opacity: 1,
  },
  navLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: COLORS.textSecondary,
  },
  navLabelActive: {
    color: COLORS.primary,
  },
});