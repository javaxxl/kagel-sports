import type { Level, WorkoutSettings } from '../types';

const LEVEL_KEY = 'kegelTrainerLevel';

export const LEVEL_SETTINGS: Record<Level, WorkoutSettings> = {
  beginner: {
    reps: 10,
    contractTime: 3,
    relaxTime: 6,
  },
  intermediate: {
    reps: 15,
    contractTime: 5,
    relaxTime: 5,
  },
  advanced: {
    reps: 20,
    contractTime: 8,
    relaxTime: 4,
  },
};

export const getLevel = (): Level | null => {
  try {
    const level = localStorage.getItem(LEVEL_KEY);
    return level ? (level as Level) : null;
  } catch (error) {
    console.error('Error reading level from localStorage', error);
    return null;
  }
};

export const setLevel = (level: Level): void => {
  try {
    localStorage.setItem(LEVEL_KEY, level);
  } catch (error) {
    console.error('Error saving level to localStorage', error);
  }
};
