import React, { useState, useEffect } from 'react';
import { getHistory, calculateStreak } from '../services/historyService';
import type { WorkoutSession } from '../types';
import { StarIcon } from './icons/StarIcon';
import { useTranslation } from 'react-i18next';

const ProgressTracker: React.FC = () => {
  const [history, setHistory] = useState<WorkoutSession[]>([]);
  const [streak, setStreak] = useState(0);
  const { t } = useTranslation();

  useEffect(() => {
    setHistory(getHistory().sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
    setStreak(calculateStreak());
  }, []);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins > 0 ? `${mins}${t('minutesShort')} ` : ''}${secs}${t('secondsShort')}`;
  };

  return (
    <div className="w-full max-w-md mx-auto bg-gray-800 rounded-3xl shadow-2xl p-6 md:p-8 flex flex-col">
      <h2 className="text-2xl font-bold text-center text-indigo-400 mb-6">{t('progress')}</h2>
      
      <div className="bg-gray-700 p-4 rounded-xl mb-6 flex items-center justify-center space-x-4">
        <StarIcon className="text-yellow-400 h-8 w-8" />
        <div>
          <p className="text-2xl font-bold">{streak}</p>
          <p className="text-gray-300 text-sm">{t('dayStreak')}</p>
        </div>
      </div>

      <h3 className="text-lg font-semibold mb-4">{t('sessionHistory')}</h3>
      <div className="flex-grow overflow-y-auto max-h-80 pr-2">
        {history.length === 0 ? (
          <p className="text-gray-400 text-center py-8">{t('noSessions')}</p>
        ) : (
          <ul className="space-y-3">
            {history.map((session, index) => (
              <li key={index} className="bg-gray-700 rounded-lg p-3 flex justify-between items-center">
                <div>
                  <p className="font-semibold">{new Date(session.date).toLocaleDateString()}</p>
                  <p className="text-sm text-gray-400">{session.level ? t(session.level) : 'Unknown'}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">{t('repsCounter', { repsCompleted: session.reps, totalReps: session.reps })}</p>
                  <p className="text-sm text-gray-400">{formatDuration(session.duration)}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default ProgressTracker;
