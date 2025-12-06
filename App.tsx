import { StatusBar } from 'expo-status-bar';
import { useEffect, useRef, useState } from 'react';
import { Alert, Platform, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import BottomTabNavigator from './source/navigation/BottomTabNavigator';
import AddTaskScreen from './source/screens/AddTaskScreen';
import CalendarScreen from './source/screens/CalendarScreen';
import SettingsScreen from './source/screens/SettingsScreen';
import TaskListScreen from './source/screens/TaskListScreen';
import { COLORS } from './source/styles/colors';
import { FormData, Screen, Settings, Task } from './source/types';
import {
  getTasksFromDB,
  saveTasksToDB,
} from './source/utils/storage';

export default function App() {
  const [activeScreen, setActiveScreen] = useState<Screen>('tasks');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const isInitialLoadRef = useRef(true);
  const loadDataCalledRef = useRef(false);
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
    // Only call loadData once on initial mount
    if (!loadDataCalledRef.current) {
      loadDataCalledRef.current = true;
      loadData();
    }
  }, []);

  const loadData = async () => {
    try {
      const loadedTasks = await getTasksFromDB();

      // Only load tasks on initial load - never refresh/reload after that until save
      setTasks((currentTasks) => {

        if (isInitialLoadRef.current) {
          isInitialLoadRef.current = false;
          setHasUnsavedChanges(false); 
          return loadedTasks;
        }

        return currentTasks.length > 0 ? currentTasks : loadedTasks;
      });
      
    } catch (error) {
      console.error('Error loading data:', error);
      // On error, preserve existing tasks - never clear them
      setTasks((currentTasks) => currentTasks);
    }
  };
  
  const handleAddTask = (newTask: Omit<Task, 'id'>) => {

    if (!newTask.title || !newTask.dueDate || !newTask.dueTime || !newTask.priority) {
      console.error('Invalid task data - missing required fields');
      return;
    }

    const taskId = Date.now().toString() + Math.random().toString(36).substr(2, 9);
    const taskWithId: Task = { ...newTask, id: taskId };
    
    setTasks((currentTasks) => {

      const updatedTasks = [...(currentTasks || []), taskWithId];
      return updatedTasks;
    });
    
    setHasUnsavedChanges(true);
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

    
    // Update local state only
    setTasks((currentTasks) => {
      const task = currentTasks.find((t) => t.id === taskId);
      if (task) {
        const newCompletedStatus = !task.completed;
        setHasUnsavedChanges(true);
        return currentTasks.map((t) =>
          t.id === taskId ? { ...t, completed: newCompletedStatus } : t
        );
      }
      return currentTasks;
    });
  };

  const handleClearAllTasks = () => {

    setTasks([]);
    setHasUnsavedChanges(true);
  };

  const handleClearCompletedTasks = () => {

    
    setTasks((currentTasks) => {
      const hasCompleted = currentTasks.some((t) => t.completed);
      if (hasCompleted) {
        setHasUnsavedChanges(true);
      }
      return currentTasks.filter((t) => !t.completed);
    });
  };

  const handleSaveAllTasks = async () => {
    setIsSaving(true);
    try {
      console.log(`Starting save: ${tasks.length} tasks to save`);
      await saveTasksToDB(tasks);
      console.log('Tasks saved successfully');
      setHasUnsavedChanges(false);
      Alert.alert('Success', 'All tasks have been saved to the database!');
      
    } catch (error) {
      console.error('Error saving to database:', error);
      Alert.alert('Error', `Failed to save to database: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsSaving(false);
    }
  };

  const renderScreen = () => {
    switch (activeScreen) {
      case 'tasks':
        return (
          <TaskListScreen
            tasks={tasks}
            toggleTaskCompletion={toggleTaskCompletion}
          />
        );
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
            handleClearCompletedTasks={handleClearCompletedTasks}
            handleSaveAllTasks={handleSaveAllTasks}
            hasUnsavedChanges={hasUnsavedChanges}
            isSaving={isSaving}
          />
        );
    default:
      return (
        <TaskListScreen
          tasks={tasks}
          toggleTaskCompletion={toggleTaskCompletion}
        />
      );
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