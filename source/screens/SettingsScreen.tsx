import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { COLORS } from "../styles/colors";
import { auth } from "../../lib/firebase";

interface SettingsScreenProps {
  handleClearCompletedTasks: () => void;
  handleSaveAllTasks: () => void;
  hasUnsavedChanges: boolean;
  isSaving: boolean;
}

export default function SettingsScreen({
  handleClearCompletedTasks,
  handleSaveAllTasks,
  hasUnsavedChanges,
  isSaving,
}: SettingsScreenProps) {
  const userEmail = auth.currentUser?.email || "Unknown User";
  const userInitial = userEmail.charAt(0).toUpperCase();

  const confirmClearCompletedTasks = () => {
    Alert.alert(
      "Clear Completed Tasks",
      "Are you sure you want to delete all completed tasks?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Clear",
          style: "destructive",
          onPress: handleClearCompletedTasks,
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.screenContainer}>
      {/* PROFILE CARD */}
      <View style={styles.profileCard}>
        <View style={styles.avatarCircle}>
          <Text style={styles.avatarText}>{userInitial}</Text>
        </View>

        <View style={{ flex: 1 }}>
          <Text style={styles.profileLabel}>Logged in as</Text>
          <Text style={styles.profileEmail}>{userEmail}</Text>
        </View>

        {/* Logout Button */}
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={() => auth.signOut()}
        >
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      </View>

      {/* SAVE ALL TASKS */}
      <View style={styles.section}>
        <TouchableOpacity
          style={[
            styles.primaryButton,
            hasUnsavedChanges && styles.primaryButtonActive,
            isSaving && styles.primaryButtonSaving,
          ]}
          onPress={handleSaveAllTasks}
          disabled={!hasUnsavedChanges || isSaving}
        >
          {isSaving ? (
            <View style={styles.savingContainer}>
              <ActivityIndicator size="small" color="#fff" />
              <Text style={styles.primaryButtonTextSaving}>Saving...</Text>
            </View>
          ) : (
            <Text
              style={[
                styles.primaryButtonText,
                !hasUnsavedChanges && styles.primaryButtonTextDisabled,
              ]}
            >
              💾 {hasUnsavedChanges ? "Save All Tasks" : "All Tasks Saved"}
            </Text>
          )}
        </TouchableOpacity>

        {hasUnsavedChanges && !isSaving && (
          <Text style={styles.unsavedIndicator}>Unsaved changes</Text>
        )}
      </View>

      {/* CLEAR COMPLETED */}
      <View style={styles.section}>
        <Pressable
          onPress={confirmClearCompletedTasks}
          style={({ pressed }) => [
            styles.dangerButton,
            pressed && { opacity: 0.7 },
          ]}
        >
          <Text selectable={false} style={styles.dangerButtonText}>
            ❌ Clear All Completed Tasks
          </Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    padding: 20,
  },

  /* PROFILE CARD */
  profileCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 14,
    padding: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    marginBottom: 25,
  },

  avatarCircle: {
    width: 55,
    height: 55,
    borderRadius: 28,
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
  },

  avatarText: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "700",
  },

  profileLabel: {
    color: COLORS.textSecondary,
    fontSize: 13,
  },

  profileEmail: {
    color: COLORS.textPrimary,
    fontSize: 16,
    fontWeight: "600",
    marginTop: 3,
  },

  logoutButton: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    backgroundColor: COLORS.danger,
    borderRadius: 10,
  },

  logoutButtonText: {
    color: "#fff",
    fontWeight: "600",
  },

  /* SECTIONS */
  section: {
    marginBottom: 25,
  },

  /* SAVE BUTTON */
  primaryButton: {
    backgroundColor: COLORS.surface,
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    borderWidth: 2,
    borderColor: COLORS.border,
  },
  primaryButtonActive: {
    borderColor: COLORS.success,
    backgroundColor: "#eefdf3",
  },
  primaryButtonSaving: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primary,
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.success,
  },
  primaryButtonTextSaving: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
  primaryButtonTextDisabled: {
    color: COLORS.textSecondary,
  },
  savingContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  unsavedIndicator: {
    marginTop: 8,
    textAlign: "center",
    fontSize: 12,
    color: COLORS.textSecondary,
  },

  /* DANGER BUTTON */
  dangerButton: {
    backgroundColor: COLORS.surface,
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    borderWidth: 2,
    borderColor: COLORS.danger,
  },
  dangerButtonText: {
    color: COLORS.danger,
    fontSize: 16,
    fontWeight: "600",
  },
});
