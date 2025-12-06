import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { COLORS } from '../styles/colors';
import { Settings } from '../types';

interface SettingsScreenProps {
  settings: Settings;
  setSettings: (settings: Settings) => void;
  handleClearCompletedTasks: () => void;
  handleSaveAllTasks: () => void;
  hasUnsavedChanges: boolean;
  isSaving: boolean;
}

export default function SettingsScreen({
  settings,
  setSettings,
  handleClearCompletedTasks,
  handleSaveAllTasks,
  hasUnsavedChanges,
  isSaving,
}: SettingsScreenProps) {
  const confirmClearCompletedTasks = () => {
    Alert.alert(
      'Clear Completed Tasks',
      'Are you sure you want to delete all completed tasks? This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Clear Completed', style: 'destructive', onPress: handleClearCompletedTasks },
      ]
    );
  };

  return (
    <ScrollView style={styles.screenContainer}>
      <View style={styles.settingsGroup}>
        <View style={styles.settingsItem}>
          <View style={styles.settingsItemText}>
            <Text style={styles.settingsLabel}>Enable Notifications</Text>
            <Text style={styles.settingsDescription}>Receive reminders for your tasks</Text>
          </View>
          <Switch
            value={settings.notificationsEnabled}
            onValueChange={(value) => setSettings({ ...settings, notificationsEnabled: value })}
            trackColor={{ false: '#cbd5e1', true: COLORS.primary }}
            thumbColor="#ffffff"
          />
        </View>

        <View style={styles.settingsItem}>
          <View style={styles.settingsItemText}>
            <Text style={styles.settingsLabel}>Notification Sound</Text>
            <Text style={styles.settingsDescription}>Play sound for reminders</Text>
          </View>
          <Switch
            value={settings.soundEnabled}
            onValueChange={(value) => setSettings({ ...settings, soundEnabled: value })}
            trackColor={{ false: '#cbd5e1', true: COLORS.primary }}
            thumbColor="#ffffff"
          />
        </View>

        <View style={styles.settingsItem}>
          <View style={styles.settingsItemText}>
            <Text style={styles.settingsLabel}>Vibration</Text>
            <Text style={styles.settingsDescription}>Vibrate for reminders</Text>
          </View>
          <Switch
            value={settings.vibrationEnabled}
            onValueChange={(value) => setSettings({ ...settings, vibrationEnabled: value })}
            trackColor={{ false: '#cbd5e1', true: COLORS.primary }}
            thumbColor="#ffffff"
          />
        </View>
      </View>

      <View style={styles.settingsGroup}>
        <TouchableOpacity style={styles.settingsItem}>
          <View style={styles.settingsItemText}>
            <Text style={styles.settingsLabel}>Default Reminder Time</Text>
            <Text style={styles.settingsDescription}>1 day before due date</Text>
          </View>
          <Text style={styles.chevron}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.settingsItem}>
          <View style={styles.settingsItemText}>
            <Text style={styles.settingsLabel}>Theme</Text>
            <Text style={styles.settingsDescription}>Light mode</Text>
          </View>
          <Text style={styles.chevron}>›</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.settingsGroup}>
        <TouchableOpacity style={styles.settingsItem}>
          <View style={styles.settingsItemText}>
            <Text style={styles.settingsLabel}>About Study Planner</Text>
            <Text style={styles.settingsDescription}>Version 1.0</Text>
          </View>
          <Text style={styles.chevron}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.settingsItem}>
          <View style={styles.settingsItemText}>
            <Text style={styles.settingsLabel}>Help & Support</Text>
            <Text style={styles.settingsDescription}>Get help using the app</Text>
          </View>
          <Text style={styles.chevron}>›</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.saveButtonContainer}>
        <TouchableOpacity
          style={[
            styles.saveButton, 
            hasUnsavedChanges && styles.saveButtonActive,
            isSaving && styles.saveButtonSaving
          ]}
          onPress={handleSaveAllTasks}
          disabled={!hasUnsavedChanges || isSaving}
        >
          {isSaving ? (
            <View style={styles.savingContainer}>
              <ActivityIndicator size="small" color="#ffffff" style={styles.loadingSpinner} />
              <Text style={styles.saveButtonTextSaving}>Saving to Database...</Text>
            </View>
          ) : (
            <Text style={[styles.saveButtonText, !hasUnsavedChanges && styles.saveButtonTextDisabled]}>
              💾 {hasUnsavedChanges ? 'Save All Tasks to Database' : 'All Tasks Saved'}
            </Text>
          )}
        </TouchableOpacity>
        {hasUnsavedChanges && !isSaving && (
          <Text style={styles.unsavedIndicator}>You have unsaved changes</Text>
        )}
      </View>

      <View style={styles.dangerButtonsContainer}>
        <TouchableOpacity style={styles.dangerButton} onPress={confirmClearCompletedTasks}>
          <Text style={styles.dangerButtonText}>✅ Clear All Completed Tasks</Text>
      </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    padding: 20,
  },
  settingsGroup: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: 'hidden',
  },
  settingsItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  settingsItemText: {
    flex: 1,
  },
  settingsLabel: {
    fontSize: 15,
    fontWeight: '500',
    color: COLORS.textPrimary,
  },
  settingsDescription: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  chevron: {
    fontSize: 24,
    color: COLORS.textSecondary,
  },
  saveButtonContainer: {
    marginTop: 20,
    marginBottom: 20,
  },
  saveButton: {
    backgroundColor: COLORS.surface,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.border,
  },
  saveButtonActive: {
    borderColor: COLORS.success,
    backgroundColor: '#f0fdf4',
  },
  saveButtonSaving: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primary,
    opacity: 0.8,
  },
  savingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  loadingSpinner: {
    marginRight: 4,
  },
  saveButtonText: {
    color: COLORS.success,
    fontSize: 16,
    fontWeight: '600',
  },
  saveButtonTextSaving: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  saveButtonTextDisabled: {
    color: COLORS.textSecondary,
  },
  unsavedIndicator: {
    fontSize: 12,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: 8,
    fontStyle: 'italic',
  },
  dangerButtonsContainer: {
    gap: 12,
  },
  dangerButton: {
    backgroundColor: COLORS.surface,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.danger,
  },
  dangerButtonAll: {
    marginTop: 0,
  },
  dangerButtonText: {
    color: COLORS.danger,
    fontSize: 16,
    fontWeight: '600',
  },
});