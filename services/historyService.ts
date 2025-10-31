
import type { WorkoutSession } from '../types';

const HISTORY_KEY = 'kegelTrainerHistory';

export const getHistory = (): WorkoutSession[] => {
  try {
    const historyJson = localStorage.getItem(HISTORY_KEY);
    return historyJson ? JSON.parse(historyJson) : [];
  } catch (error) {
    console.error('Error reading history from localStorage', error);
    return [];
  }
};

export const addSession = (session: WorkoutSession): void => {
  try {
    const history = getHistory();
    history.push(session);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  } catch (error) {
    console.error('Error saving session to localStorage', error);
  }
};

export const calculateStreak = (): number => {
  const history = getHistory();
  if (history.length === 0) return 0;

  const uniqueDays = [
    ...new Set(
      history.map((session) => new Date(session.date).toISOString().split('T')[0])
    ),
  ].sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

  if (uniqueDays.length === 0) return 0;
  
  let streak = 0;
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  const todayStr = today.toISOString().split('T')[0];
  const yesterdayStr = yesterday.toISOString().split('T')[0];
  
  // Check if latest workout was today or yesterday
  if (uniqueDays[0] === todayStr || uniqueDays[0] === yesterdayStr) {
    streak = 1;
    let lastDate = new Date(uniqueDays[0]);

    for (let i = 1; i < uniqueDays.length; i++) {
      const currentDate = new Date(uniqueDays[i]);
      const diffTime = lastDate.getTime() - currentDate.getTime();
      const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays === 1) {
        streak++;
        lastDate = currentDate;
      } else {
        break;
      }
    }
  }
  
  return streak;
};
