export interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  dueTime: string;
  priority: 'high'  | 'medium'  | 'low';
  completed?: boolean;
  createdAt?: string;
}

export interface Settings {
  // notificationsEnabled: boolean;
  // soundEnabled: boolean;
  // vibrationEnabled: boolean;

  //theme: 'light' | 'dark' | 'system';
  defaultReminder: 'none' | '1hour' | '1day';
}

export interface FormData {
  title: string;
  description: string;
  dueDate: string;
  dueTime: string;
  priority: string;
  reminder: string;
}

export type Screen = 'tasks'  | 'calendar'  | 'add'  | 'settings';