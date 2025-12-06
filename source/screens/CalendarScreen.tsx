import { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { COLORS } from '../styles/colors';
import { Task } from '../types';

interface CalendarScreenProps {
  tasks: Task[];
}

export default function CalendarScreen({ tasks }: CalendarScreenProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth()); // 0-11
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const getDaysInMonth = (month: number, year: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (month: number, year: number) => {
    return new Date(year, month, 1).getDay();
  };

  const goToPreviousMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const goToNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const daysInMonth = getDaysInMonth(currentMonth, currentYear);
  const startDay = getFirstDayOfMonth(currentMonth, currentYear);
  const tasksWithDates = tasks.filter((task) => task.dueDate && !task.completed);

  const getPriorityStyle = (priority: string) => {
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
  
  const today = new Date();
  const isToday = (day: number) => {
    return (
      day === today.getDate() &&
      currentMonth === today.getMonth() &&
      currentYear === today.getFullYear()
    );
  };

  return (
    <ScrollView style={styles.screenContainer}>
      <View style={styles.calendarHeader}>
        <TouchableOpacity onPress={goToPreviousMonth} style={styles.monthButton}>
          <Text style={styles.monthButtonText}>◀</Text>
        </TouchableOpacity>
        
        <Text style={styles.calendarTitle}>
          {monthNames[currentMonth]} {currentYear}
        </Text>
        
        <TouchableOpacity onPress={goToNextMonth} style={styles.monthButton}>
          <Text style={styles.monthButtonText}>▶</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.calendarGrid}>
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, index) => (
          <View key={`day-label-${index}`} style={styles.calendarDayLabel}>
            <Text style={styles.calendarDayLabelText}>{day}</Text>
          </View>
        ))}

        {Array(startDay)
          .fill(null)
          .map((_, index) => (
            <View key={`empty-${index}`} style={styles.calendarDay} />
          ))}

        {Array(daysInMonth)
          .fill(null)
          .map((_, index) => {
            const day = index + 1;
            const dateStr = `${currentYear}-${(currentMonth + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
            const hasTask = tasksWithDates.some((task) => task.dueDate === dateStr);
            const isTodayDate = isToday(day);

            return (
              <View
                key={`day-${day}`}
                style={[
                  styles.calendarDay,
                  hasTask && styles.calendarDayWithTask,
                  isTodayDate && styles.calendarDayToday,
                ]}
              >
                <Text
                  style={[
                    styles.calendarDayText,
                    (hasTask || isTodayDate) && styles.calendarDayTextHighlight,
                  ]}
                >
                  {day}
                </Text>
              </View>
            );
          })}
      </View>

      <View style={styles.upcomingTasks}>
        <Text style={styles.upcomingTitle}>📅 Upcoming Tasks</Text>
        {tasksWithDates.length === 0 ? (
          <View style={styles.noTasksContainer}>
            <Text style={styles.noTasksText}>No upcoming tasks</Text>
          </View>
        ) : (
          tasksWithDates.slice(0, 5).map((task) => (
            <View key={task.id} style={styles.upcomingTaskCard}>
              <View style={styles.taskHeaderRow}>
                <Text style={styles.taskTitle}>{task.title}</Text>
                <View style={[styles.priorityDot, getPriorityStyle(task.priority)]} />
              </View>
              <Text style={styles.taskDate}>
                📅 {task.dueDate} • {task.dueTime}
              </Text>
            </View>
          ))
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    padding: 20,
  },
  calendarHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  monthButton: {
    padding: 10,
    borderRadius: 8,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  monthButtonText: {
    fontSize: 20,
    color: COLORS.primary,
    fontWeight: 'bold',
  },
  calendarTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
    width: '100%',
    paddingHorizontal: 0,
  },
  calendarDayLabel: {
    width: '14.28%',
    alignItems: 'center',
    paddingVertical: 8,
  },
  calendarDayLabelText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  calendarDay: {
    width: '14.28%',
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginVertical: 1,
  },
  calendarDayWithTask: {
    backgroundColor: '#ede9fe',
    borderColor: COLORS.primary,
  },
  calendarDayToday: {
    backgroundColor: COLORS.primary,
  },
  calendarDayText: {
    fontSize: 22,
    color: COLORS.textPrimary,
  },
  calendarDayTextHighlight: {
    color: '#ffffff',
    fontWeight: '600',
  },
  upcomingTasks: {
    marginTop: 20,
  },
  upcomingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: 12,
  },
  upcomingTaskCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  taskHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textPrimary,
    flex: 1,
  },
  priorityDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginLeft: 8,
  },
  priorityHigh: {
    backgroundColor: '#ef4444',
  },
  priorityMedium: {
    backgroundColor: '#f59e0b',
  },
  priorityLow: {
    backgroundColor: '#3b82f6',
  },
  taskDate: {
    fontSize: 13,
    color: COLORS.textSecondary,
  },
  noTasksContainer: {
    padding: 40,
    alignItems: 'center',
  },
  noTasksText: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
});