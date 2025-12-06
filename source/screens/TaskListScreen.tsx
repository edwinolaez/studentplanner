import { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import EmptyState from '../components/EmptyState';
import TaskCard from '../components/TaskCard';
import { COLORS } from '../styles/colors';
import { Task } from '../types';

interface TaskListScreenProps {
  tasks: Task[];
  toggleTaskCompletion: (taskId: string) => void;
}

export default function TaskListScreen({ tasks, toggleTaskCompletion }: TaskListScreenProps) {
  const [showCompleted, setShowCompleted] = useState(false);

  // Filter tasks based on completion status
  const activeTasks = tasks.filter(task => !task.completed);
  const completedTasks = tasks.filter(task => task.completed);
  
  const tasksToDisplay = showCompleted ? completedTasks : activeTasks;

  if (tasks.length === 0) {
    return (
      <EmptyState
        icon="📝"
        title="No Tasks Yet"
        message='Tap the "Add Task" button below to create your first task'
      />
    );
  }

  return (
    <View style={styles.container}>
      {/* Filter Buttons */}
      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[styles.filterButton, !showCompleted && styles.filterButtonActive]}
          onPress={() => setShowCompleted(false)}
        >
          <Text style={[styles.filterButtonText, !showCompleted && styles.filterButtonTextActive]}>
            Active ({activeTasks.length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.filterButton, showCompleted && styles.filterButtonActive]}
          onPress={() => setShowCompleted(true)}
        >
          <Text style={[styles.filterButtonText, showCompleted && styles.filterButtonTextActive]}>
            Completed ({completedTasks.length})
          </Text>
        </TouchableOpacity>
      </View>

      {/* Task List */}
      <ScrollView style={styles.scrollContainer}>
        {tasksToDisplay.length === 0 ? (
          <View style={styles.emptyFilterState}>
            <Text style={styles.emptyFilterText}>
              {showCompleted ? '🎉 No completed tasks yet' : '✨ All tasks completed!'}
            </Text>
          </View>
        ) : (
          tasksToDisplay.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onToggleComplete={toggleTaskCompletion}
            />
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  filterContainer: {
    flexDirection: 'row',
    padding: 20,
    paddingBottom: 10,
    gap: 10,
  },
  filterButton: {
    flex: 1,
    padding: 12,
    borderRadius: 10,
    backgroundColor: COLORS.surface,
    borderWidth: 2,
    borderColor: COLORS.border,
    alignItems: 'center',
  },
  filterButtonActive: {
    backgroundColor: '#ede9fe',
    borderColor: COLORS.primary,
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  filterButtonTextActive: {
    color: COLORS.primary,
  },
  scrollContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  emptyFilterState: {
    padding: 40,
    alignItems: 'center',
  },
  emptyFilterText: {
    fontSize: 16,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
});