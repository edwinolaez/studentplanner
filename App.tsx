import { StatusBar } from "expo-status-bar";
import { useEffect, useRef, useState } from "react";
import {
  Alert,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { auth } from "./lib/firebase";
import BottomTabNavigator from "./source/navigation/BottomTabNavigator";
import AddTaskScreen from "./source/screens/AddTaskScreen";
import CalendarScreen from "./source/screens/CalendarScreen";
import SettingsScreen from "./source/screens/SettingsScreen";
import TaskListScreen from "./source/screens/TaskListScreen";
import { COLORS } from "./source/styles/colors";
import { FormData, Screen, Task } from "./source/types";
import { getTasksFromDB, saveTasksToDB } from "./source/utils/storage";
import { useAuth } from "./hooks/useAuth";
import LoginScreen from "./source/screens/LoginScreen";
import SignupScreen from "./source/screens/SignupScreen";

export default function App() {
  const [activeScreen, setActiveScreen] = useState<Screen>("tasks");
  const [tasks, setTasks] = useState<Task[]>([]);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const isInitialLoadRef = useRef(true);

  const [authScreen, setAuthScreen] = useState<"login" | "signup">("login");
  const [tasksLoading, setTasksLoading] = useState(true);

  // FORM DATA
  const [formData, setFormData] = useState<FormData>({
    title: "",
    description: "",
    dueDate: "",
    dueTime: "",
    priority: "",
    reminder: "",
  });

  const { user, loading } = useAuth();

  // Load tasks when user logs in
  useEffect(() => {
    if (user) {
      isInitialLoadRef.current = true;
      loadDataForCurrentUser();
    } else {
      setTasks([]);
      setHasUnsavedChanges(false);
      setTasksLoading(false);
      isInitialLoadRef.current = true;
    }
  }, [user]);

  const loadDataForCurrentUser = async () => {
    setTasksLoading(true);

    try {
      if (isInitialLoadRef.current) {
        const loadedTasks = await getTasksFromDB();

        setTasks(
          (loadedTasks || []).map((task) => ({
            ...task,
            completed: task.completed ?? false,
          }))
        );

        setHasUnsavedChanges(false);
        isInitialLoadRef.current = false;
      }
    } catch (err) {
      console.error("Error loading tasks:", err);
    } finally {
      setTasksLoading(false);
    }
  };

  const handleAddTask = (newTask: Omit<Task, "id">) => {
    if (!newTask.title || !newTask.dueDate || !newTask.dueTime || !newTask.priority) {
      console.error("Invalid task data");
      return;
    }

    const taskId = Date.now().toString() + Math.random().toString(36).substr(2, 9);

    const taskWithId: Task = {
      ...newTask,
      id: taskId,
      completed: false,
      createdAt: new Date().toISOString(),
    };

    setTasks((current) => [...current, taskWithId]);
    setHasUnsavedChanges(true);

    // Reset form
    setFormData({
      title: "",
      description: "",
      dueDate: "",
      dueTime: "",
      priority: "",
      reminder: "",
    });
  };

  const toggleTaskCompletion = (taskId: string) => {
    setTasks((currentTasks) =>
      currentTasks.map((t) =>
        t.id === taskId ? { ...t, completed: !t.completed } : t
      )
    );

    setHasUnsavedChanges(true);
  };

  const handleClearCompletedTasks = () => {
    setTasks((currentTasks) => currentTasks.filter((t) => !t.completed));
    setHasUnsavedChanges(true);
  };

  const handleSaveAllTasks = async () => {
    setIsSaving(true);

    try {
      await saveTasksToDB(tasks);
      setHasUnsavedChanges(false);
      Alert.alert("Success", "All tasks have been saved!");
    } catch (err) {
      console.error("Save error:", err);
      Alert.alert("Error", "Failed to save tasks");
    } finally {
      setIsSaving(false);
    }
  };

  const renderScreen = () => {
    switch (activeScreen) {
      case "tasks":
        return <TaskListScreen tasks={tasks} toggleTaskCompletion={toggleTaskCompletion} />;
      case "calendar":
        return <CalendarScreen tasks={tasks} />;
      case "add":
        return (
          <AddTaskScreen
            formData={formData}
            setFormData={setFormData}
            handleAddTask={handleAddTask}
            setActiveScreen={setActiveScreen}
          />
        );
      case "settings":
        return (
          <SettingsScreen
            handleClearCompletedTasks={handleClearCompletedTasks}
            handleSaveAllTasks={handleSaveAllTasks}
            hasUnsavedChanges={hasUnsavedChanges}
            isSaving={isSaving}
          />
        );
      default:
        return null;
    }
  };

  // AUTH LOADING
  if (loading) {
    return (
      <SafeAreaView style={styles.center}>
        <Text style={styles.loadingText}>Loading...</Text>
      </SafeAreaView>
    );
  }

  if (tasksLoading) {
    return (
      <SafeAreaView style={styles.center}>
        <Text style={styles.loadingText}>Loading tasks...</Text>
      </SafeAreaView>
    );
  }

  // LOGIN / SIGNUP FLOW
  if (!user) {
    return authScreen === "login" ? (
      <LoginScreen navigation={{ navigate: () => setAuthScreen("signup") }} />
    ) : (
      <SignupScreen navigation={{ goBack: () => setAuthScreen("login") }} />
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" backgroundColor={COLORS.primary} />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>🎓 Study Planner</Text>
        <Text style={styles.headerSubtitle}>Plan everything and get things done!</Text>
      </View>

      <View style={styles.content}>{renderScreen()}</View>

      <BottomTabNavigator activeScreen={activeScreen} setActiveScreen={setActiveScreen} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  loadingText: { fontSize: 18 },
  header: {
    backgroundColor: COLORS.primary,
    padding: 20,
    paddingTop: Platform.OS === "android" ? 40 : 20,
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "600",
    color: "#fff",
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#fff",
    opacity: 0.9,
    marginTop: 5,
  },
  content: { flex: 1 },
});