import { StyleSheet, Text, View } from 'react-native';
import { COLORS } from '../styles/colors';

interface PriorityBadgeProps {
  priority: 'high' | 'medium' | 'low';
}

export default function PriorityBadge({ priority }: PriorityBadgeProps) {
  const getStyle = () => {
    switch (priority) {
      case 'high':
        return styles.priorityHigh;
      case 'medium':
        return styles.priorityMedium;
      case 'low':
        return styles.priorityLow;
      default:
        return styles.priorityLow;
    }
  };

  return (
    <View style={[styles.priorityBadge, getStyle()]}>
      <Text style={styles.priorityText}>{priority.toUpperCase()}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  priorityHigh: {
    backgroundColor: '#fee2e2',
  },
  priorityMedium: {
    backgroundColor: '#fef3c7',
  },
  priorityLow: {
    backgroundColor: '#dbeafe',
  },
  priorityText: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
});