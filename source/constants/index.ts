export const APP_NAME = 'Study Planner';
export const APP_VERSION = '1.0.0';

export const PRIORITY_LEVELS = {
  HIGH: 'high' as const,
  MEDIUM: 'medium' as const,
  LOW: 'low' as const,
};

export const SCREENS = {
  TASKS: 'tasks' as const,
  CALENDAR: 'calendar' as const,
  ADD_TASK: 'add' as const,
  SETTINGS: 'settings' as const,
};

export const STORAGE_KEYS = {
  TASKS: 'studyPlannerTasks',
  SETTINGS: 'studyPlannerSettings',
};