import { StyleSheet, Text, View } from 'react-native';
import { COLORS } from '../styles/colors';
import { Task } from '../types';
import CustomCheckbox from './CustomCheckbox';
import PriorityBadge from './PriorityBadge';

interface TaskCardProps {
  task: Task;
  onToggleComplete: (taskId: string) => void;
}

export default function TaskCard({ task, onToggleComplete }: TaskCardProps) {
  return (
    <View style={styles.taskCard}>
      <View style={styles.taskHeader}>
        <Text style={[styles.taskTitle, task.completed && styles.taskTitleCompleted]}>
          {task.title}
        </Text>
        <PriorityBadge priority={task.priority} />
      </View>

      {task.description ? (
        <Text style={styles.taskDescription}>{task.description}</Text>
      ) : null}

      <View style={styles.taskMeta}>
        <Text style={styles.taskDate}>📅 Due: {task.dueDate}</Text>
        <Text style={styles.taskTime}>🕐 {task.dueTime}</Text>
        <View style={styles.taskActions}>
        <CustomCheckbox
          checked={task.completed}
          onPress={() => onToggleComplete(task.id)}
        />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  taskCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  taskHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textPrimary,
    flex: 1,
    marginRight: 8,
  },
  taskTitleCompleted: {
    textDecorationLine: 'line-through',
    color: COLORS.textSecondary,
  },
  taskDescription: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 8,
  },
  taskMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  taskDate: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginRight: 16,
  },
  taskTime: {
    fontSize: 13,
    color: COLORS.textSecondary,
    flex: 1,
  },
  taskActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
});