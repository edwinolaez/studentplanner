import { useState } from 'react';
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
  handleAddTask: (task: Omit<Task, 'id'>) => void;
  setActiveScreen: (screen: Screen) => void;
}

export default function AddTaskScreen({
  formData,
  setFormData,
  handleAddTask,
  setActiveScreen,
}: AddTaskScreenProps) {
  const [showSuccess, setShowSuccess] = useState(false);
  const [errors, setErrors] = useState<{
    title?: string;
    dueDate?: string;
    dueTime?: string;
    priority?: string;
  }>({});

  const validateTitle = (title: string): string | undefined => {
    if (!title || title.trim().length === 0) {
      return 'Task title is required';
    }
    if (title.trim().length < 3) {
      return 'Task title must be at least 3 characters';
    }
    if (title.length > 100) {
      return 'Task title must be less than 100 characters';
    }
    return undefined;
  };

  const validateDate = (date: string): string | undefined => {
    if (!date || date.trim().length === 0) {
      return 'Due date is required';
    }
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(date)) {
      return 'Date must be in YYYY-MM-DD format (e.g., 2025-12-31)';
    }
    const [year, month, day] = date.split('-').map(Number);
    const inputDate = new Date(year, month - 1, day);
    if (
      inputDate.getFullYear() !== year ||
      inputDate.getMonth() !== month - 1 ||
      inputDate.getDate() !== day
    ) {
      return 'Invalid date. Please enter a valid date';
    }
    return undefined;
  };

  const validateTime = (time: string): string | undefined => {
    if (!time || time.trim().length === 0) {
      return 'Due time is required';
    }
    const timeRegex = /^([0-1][0-9]|2[0-3]):[0-5][0-9]$/;
    if (!timeRegex.test(time)) {
      return 'Time must be in HH:MM format (e.g., 14:30)';
    }
    return undefined;
  };

  const validatePriority = (priority: string): string | undefined => {
    if (!priority) {
      return 'Priority is required';
    }
    if (!['high', 'medium', 'low'].includes(priority)) {
      return 'Invalid priority selected';
    }
    return undefined;
  };

  const onSubmit = () => {
    const newErrors: {
      title?: string;
      dueDate?: string;
      dueTime?: string;
      priority?: string;
    } = {};

    let checkValid = true;

    // Validate all fields
    const titleError = validateTitle(formData.title);
    if (titleError) {
      newErrors.title = titleError;
      checkValid = false;
    }

    const dateError = validateDate(formData.dueDate);
    if (dateError) {
      newErrors.dueDate = dateError;
      checkValid = false;
    }

    const timeError = validateTime(formData.dueTime);
    if (timeError) {
      newErrors.dueTime = timeError;
      checkValid = false;
    }

    const priorityError = validatePriority(formData.priority);
    if (priorityError) {
      newErrors.priority = priorityError;
      checkValid = false;
    }

    // If there are errors, show them and don't submit
    if (!checkValid) {
      setErrors(newErrors);
      const errorMessages = Object.values(newErrors).join('\n');
      Alert.alert('Validation Error', errorMessages);
      return;
    }else{
      // Clear errors if validation passes
      setErrors({});
      const newTask: Omit<Task, 'id'> = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        dueDate: formData.dueDate,
        dueTime: formData.dueTime,
        priority: formData.priority as 'high' | 'medium' | 'low',
        completed: false,
        createdAt: new Date().toISOString(),
      };
  
      try {
        handleAddTask(newTask);
        setShowSuccess(true);
  
        setTimeout(() => {
          setShowSuccess(false);
          clearForm();
          // setActiveScreen('tasks');
        }, 2000);
      } catch (error) {
        Alert.alert('Error', 'Failed to add task. Please try again.');
        console.error('Error adding task:', error);
      }
    }

    
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
          style={[styles.input, errors.title && styles.inputError]}
          placeholder="Enter task title"
          value={formData.title}
          onChangeText={(text) => {
            setFormData({ ...formData, title: text });
            if (errors.title) {
              setErrors({ ...errors, title: undefined });
            }
          }}
          placeholderTextColor="#94a3b8"
        />
        {errors.title && <Text style={styles.errorText}>{errors.title}</Text>}
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
          style={[styles.input, errors.dueDate && styles.inputError]}
          placeholder="2025-11-30"
          value={formData.dueDate}
          onChangeText={(text) => {
            setFormData({ ...formData, dueDate: text });
            if (errors.dueDate) {
              setErrors({ ...errors, dueDate: undefined });
            }
          }}
          placeholderTextColor="#94a3b8"
        />
        {errors.dueDate && <Text style={styles.errorText}>{errors.dueDate}</Text>}
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Due Time * (HH:MM)</Text>
        <TextInput
          style={[styles.input, errors.dueTime && styles.inputError]}
          placeholder="14:00"
          value={formData.dueTime}
          onChangeText={(text) => {
            setFormData({ ...formData, dueTime: text });
            if (errors.dueTime) {
              setErrors({ ...errors, dueTime: undefined });
            }
          }}
          placeholderTextColor="#94a3b8"
        />
        {errors.dueTime && <Text style={styles.errorText}>{errors.dueTime}</Text>}
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
              onPress={() => {
                setFormData({ ...formData, priority });
                if (errors.priority) {
                  setErrors({ ...errors, priority: undefined });
                }
              }}
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
        {errors.priority && <Text style={styles.errorText}>{errors.priority}</Text>}
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
  inputError: {
    borderColor: COLORS.danger,
    borderWidth: 2,
  },
  errorText: {
    color: COLORS.danger,
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
});