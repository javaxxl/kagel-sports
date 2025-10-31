export type Level = 'beginner' | 'intermediate' | 'advanced';

export interface WorkoutSettings {
  reps: number;
  contractTime: number;
  relaxTime: number;
}

export interface WorkoutSession {
  date: string; // ISO string format
  reps: number;
  duration: number; // in seconds
  level?: Level;
}

export interface KegelTimerState {
  repsCompleted: number;
  currentPhase: 'idle' | 'contract' | 'relax' | 'finished';
  phaseTimeLeft: number;
  totalTime: number;
}

export type AudioMode = 'silent' | 'sound' | 'voice';
