import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { Platform, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import BottomTabNavigator from './source/navigation/BottomTabNavigator';
import AddTaskScreen from './source/screens/AddTaskScreen';
import CalendarScreen from './source/screens/CalendarScreen';
import SettingsScreen from './source/screens/SettingsScreen';
import TaskListScreen from './source/screens/TaskListScreen';
import { COLORS } from './source/styles/colors';
import { FormData, Screen, Settings, Task } from './source/types';
import { loadSettings, loadTasks, savedTasks, saveSettings } from './source/utils/storage';

export default function App() {
  const [activeScreen, setActiveScreen] = useState<Screen>('tasks');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [settings, setSettings] = useState<Settings>({
    notificationsEnabled: true,
    soundEnabled: true,
    vibrationEnabled: true,
  });
  const [formData, setFormData] = useState<FormData> ({  
    title: '',
    description: '',
    dueDate: '',
    dueTime: '',
    priority: '',
    reminder: '',
  });

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (tasks.length > 0) {
      savedTasks(tasks);
    }
  }, [tasks]);

  useEffect(() => {
    saveSettings(settings);
  }, [settings]);

  const loadData = async () => {
    const loadedTasks = await loadTasks();
    const loadedSettings = await loadSettings();

    setTasks(loadedTasks);
    setSettings(loadedSettings);
  };

  const handleAddTask = (newTask: Task) => {
    setTasks([...tasks, newTask]);
    setFormData({
      title: '',
      description: '',
      dueDate: '',
      dueTime: '',
      priority: '',
      reminder: '',
    });
  };

  const toggleTaskCompletion = (taskId: string) => {
    setTasks (
      tasks.map((task) =>
        task.id === taskId ? {...task, completed: !task.completed} : task)
    );
  };

  const handleClearAllTasks = () => {
    setTasks([]);
  };

  const renderScreen = () => {
    switch (activeScreen) {
      case 'tasks':
        return <TaskListScreen tasks={tasks} toggleTaskCompletion={toggleTaskCompletion} />;
      case 'calendar':
        return <CalendarScreen tasks={tasks} />;
      case 'add':
        return (
          <AddTaskScreen
            formData={formData}
            setFormData={setFormData}
            handleAddTask={handleAddTask}
            setActiveScreen={setActiveScreen}/>
        );
      case 'settings':
        return (
          <SettingsScreen
            settings={settings}
            setSettings={setSettings}
            handleClearAllTasks={handleClearAllTasks}/>
      );
    default:
      return <TaskListScreen tasks={tasks} toggleTaskCompletion={toggleTaskCompletion} />;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style='light' backgroundColor={COLORS.primary} />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>🎓 Study Planner</Text>
        <Text style={styles.headerSubtitle}>Plan everything and get Things Done!!</Text>
      </View>

      <View style={styles.content}>{renderScreen()}</View>

      <BottomTabNavigator activeScreen={activeScreen} setActiveScreen={setActiveScreen} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex:1,
    borderBlockColor: COLORS.background,
  },
  header: {
    backgroundColor: COLORS.primary,
    padding:20,
    paddingTop: Platform.OS === 'android' ? 40:20,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#ffffff',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#ffffff',
    opacity: 0.9,
    marginTop: 5,
  },
  content: {
    flex: 1,
  },
});