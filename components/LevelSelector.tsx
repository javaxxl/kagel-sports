import React from 'react';
import type { Level } from '../types';
import { LEVEL_SETTINGS } from '../services/levelService';
import { useTranslation } from 'react-i18next';

interface LevelSelectorProps {
  onSelectLevel: (level: Level) => void;
}

const LevelSelector: React.FC<LevelSelectorProps> = ({ onSelectLevel }) => {
  const { t } = useTranslation();

  const levels: Level[] = ['beginner', 'intermediate', 'advanced'];

  return (
    <div className="bg-gray-900 text-white min-h-screen flex flex-col items-center justify-center p-4">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold mb-2 text-indigo-400">{t('welcome')}</h1>
        <p className="text-gray-300 max-w-md">{t('levelPrompt')}</p>
      </div>
      <div className="space-y-4 w-full max-w-xs">
        {levels.map((level) => {
          const settings = LEVEL_SETTINGS[level];
          return (
            <button
              key={level}
              onClick={() => onSelectLevel(level)}
              className="w-full bg-gray-800 p-5 rounded-lg text-left hover:bg-gray-700 hover:ring-2 hover:ring-indigo-500 transition-all duration-200"
            >
              <h2 className="text-xl font-semibold capitalize">{t(level)}</h2>
              <p className="text-sm text-gray-400 mt-1">
                {t('levelDetails', {
                  reps: settings.reps,
                  contractTime: settings.contractTime,
                  relaxTime: settings.relaxTime
                })}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default LevelSelector;
