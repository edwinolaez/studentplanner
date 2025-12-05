import React, { useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import SuccessMessage from '../components/SuccessMessage';
import { COLORS } from '../styles/colors';
import { FormData, Screen, Task } from '../types';

interface AddTaskScreenProps {
  formData: FormData;
  setFormData: (data: FormData) => void;
  handleAddTask: (task: Task) => void;
  setActiveScreen: (screen: Screen) => void;
}

export default function AddTaskScreen({
  formData,
  setFormData,
  handleAddTask,
  setActiveScreen,
}: AddTaskScreenProps) {
  const [showSuccess, setShowSuccess] = useState(false);

  const onSubmit = () => {
    if (!formData.title || !formData.dueDate || !formData.dueTime || !formData.priority) {
      Alert.alert('Missing Fields', 'Please fill in all required fields');
      return;
    }

    const newTask: Task = {
      id: Date.now().toString(),
      title: formData.title,
      description: formData.description,
      dueDate: formData.dueDate,
      dueTime: formData.dueTime,
      priority: formData.priority as 'high' | 'medium' | 'low',
      completed: false,
      createdAt: new Date().toISOString(),
    };

    handleAddTask(newTask);
    setShowSuccess(true);

    setTimeout(() => {
      setShowSuccess(false);
      setActiveScreen('tasks');
    }, 2000);
  };

  const clearForm = () => {
    setFormData({
      title: '',
      description: '',
      dueDate: '',
      dueTime: '',
      priority: '',
      reminder: '',
    });
  };

  return (
    <ScrollView style={styles.screenContainer}>
      {showSuccess && <SuccessMessage message="Task added successfully!" />}

      <View style={styles.formGroup}>
        <Text style={styles.label}>Task Title *</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter task title"
          value={formData.title}
          onChangeText={(text) => setFormData({ ...formData, title: text })}
          placeholderTextColor="#94a3b8"
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Description</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Add details about your task"
          value={formData.description}
          onChangeText={(text) => setFormData({ ...formData, description: text })}
          multiline
          numberOfLines={4}
          placeholderTextColor="#94a3b8"
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Due Date * (YYYY-MM-DD)</Text>
        <TextInput
          style={styles.input}
          placeholder="2025-11-30"
          value={formData.dueDate}
          onChangeText={(text) => setFormData({ ...formData, dueDate: text })}
          placeholderTextColor="#94a3b8"
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Due Time * (HH:MM)</Text>
        <TextInput
          style={styles.input}
          placeholder="14:00"
          value={formData.dueTime}
          onChangeText={(text) => setFormData({ ...formData, dueTime: text })}
          placeholderTextColor="#94a3b8"
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Priority *</Text>
        <View style={styles.priorityButtons}>
          {(['high', 'medium', 'low'] as const).map((priority) => (
            <TouchableOpacity
              key={priority}
              style={[
                styles.priorityButton,
                formData.priority === priority && styles.priorityButtonActive,
              ]}
              onPress={() => setFormData({ ...formData, priority })}
            >
              <Text
                style={[
                  styles.priorityButtonText,
                  formData.priority === priority && styles.priorityButtonTextActive,
                ]}
              >
                {priority.charAt(0).toUpperCase() + priority.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <TouchableOpacity style={styles.primaryButton} onPress={onSubmit}>
        <Text style={styles.primaryButtonText}>➕ Add Task</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.secondaryButton} onPress={clearForm}>
        <Text style={styles.secondaryButtonText}>🔄 Clear Form</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    padding: 20,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: 8,
  },
  input: {
    backgroundColor: COLORS.surface,
    borderWidth: 2,
    borderColor: COLORS.border,
    borderRadius: 10,
    padding: 14,
    fontSize: 16,
    color: COLORS.textPrimary,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  priorityButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  priorityButton: {
    flex: 1,
    padding: 12,
    borderWidth: 2,
    borderColor: COLORS.border,
    borderRadius: 10,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  priorityButtonActive: {
    borderColor: COLORS.primary,
    backgroundColor: '#ede9fe',
  },
  priorityButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  priorityButtonTextActive: {
    color: COLORS.primary,
  },
  primaryButton: {
    backgroundColor: COLORS.primary,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  primaryButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    backgroundColor: COLORS.surface,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  secondaryButtonText: {
    color: COLORS.primary,
    fontSize: 16,
    fontWeight: '600',
  },
});