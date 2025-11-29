import AsyncStorage from '@react-native-async-storage/async-storage';
import { Task, Settings } from '../types';
import { STORAGE_KEYS } from '../constants';

const SAMPLE_TASKS[] = [
  {
    id: '1',
    title: 'Complete Mobile App Assignment',
    description: 'Finish Lab 5',
    dueDate: '2025-12-02',
    dueTime: '23:59',
    priority: 'high',
    completed: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    title: 'Complete Web Dev project',
    description: 'Finish Phase 2',
    dueDate: '2025-12-03',
    dueTime: '23:59',
    priority: 'high',
    completed: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: '3',
    title: 'Prepare for presentation for pre-Capstone',
    description: 'Finish Canva',
    dueDate: '2025-12-03',
    dueTime: '23:59',  
    priority: 'high',
    completed: false,
    createdAt: new Date().toISOString(),
  },
];

export const loadTasks = async (): Promise<Task[]> => {
  try {
    const savedTasks = await AsyncStorage.getItem(STORAGE_KEYS.TASKS)
    if (savedTasks) {
      return JSON.parse(savedTasks);
  }
  return SAMPLE_TASKS;
} catch (error) {
  console.error('Error loading tasks:',error);
  return SAMPLE_TASKS;
}
};

export const savedTasks = async (tasks: Task[]): Promise<void> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
  } catch (error) {
    console.error('Error saving tasks:', error);
  }
};

export const loadSettings = async (): Promise<Settings> => {
  try {
    const savedSettings = await AsyncStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (savedSettings) {
      return JSON.parse(savedSettings);
  }
  return {
    notificationsEnabled: true,
    soundEnabled: true,
    vibrationEnabled: true,
  };
} catch (error) {
  console.error('Error loading settings:', console.error);
  return { 
    notificationsEnabled: true,
    soundEnabled: true,
    vibrationEnabled: true,
    };
  }
};

export const saveSettings = async (settings: Settings): Promise<void> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
} catch (error) {
  console.error('Error saving settings:', error);
  }
};
