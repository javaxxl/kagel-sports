import React, { useState, useEffect, useRef } from 'react';
import KegelTrainer from './components/KegelTrainer';
import ProgressTracker from './components/ProgressTracker';
import InstructionsModal from './components/InstructionsModal';
import LevelSelector from './components/LevelSelector';
import { getLevel, setLevel as saveLevel, LEVEL_SETTINGS } from './services/levelService';
import type { Level, AudioMode } from './types';
import { HomeIcon } from './components/icons/HomeIcon';
import { ChartIcon } from './components/icons/ChartIcon';
import { InfoIcon } from './components/icons/InfoIcon';
import { SoundOnIcon } from './components/icons/SoundOnIcon';
import { SoundOffIcon } from './components/icons/SoundOffIcon';
import { VoiceIcon } from './components/icons/VoiceIcon';
import { LanguageIcon } from './components/icons/LanguageIcon';
import { useTranslation } from 'react-i18next';
import i18n from './i18n';

const App: React.FC = () => {
  const [level, setLevel] = useState<Level | null>(null);
  const [view, setView] = useState<'trainer' | 'progress'>('trainer');
  const [isInstructionsOpen, setIsInstructionsOpen] = useState(false);
  const [audioMode, setAudioMode] = useState<AudioMode>('silent');
  const { t } = useTranslation();
  const [isLanguageSelectorOpen, setIsLanguageSelectorOpen] = useState(false);
  const languageSelectorRef = useRef<HTMLDivElement>(null);


  useEffect(() => {
    const initialLevel = getLevel();
    if (initialLevel) {
      setLevel(initialLevel);
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (languageSelectorRef.current && !languageSelectorRef.current.contains(event.target as Node)) {
        setIsLanguageSelectorOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLevelSelect = (selectedLevel: Level) => {
    saveLevel(selectedLevel);
    setLevel(selectedLevel);
  };
  
  const toggleAudioMode = () => {
    const modes: AudioMode[] = ['silent', 'sound', 'voice'];
    const currentIndex = modes.indexOf(audioMode);
    const nextIndex = (currentIndex + 1) % modes.length;
    setAudioMode(modes[nextIndex]);
  };

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    setIsLanguageSelectorOpen(false);
  };


  if (!level) {
    return <LevelSelector onSelectLevel={handleLevelSelect} />;
  }

  const workoutSettings = LEVEL_SETTINGS[level];

  const getAudioIcon = () => {
    switch (audioMode) {
      case 'sound':
        return <SoundOnIcon />;
      case 'voice':
        return <VoiceIcon />;
      case 'silent':
      default:
        return <SoundOffIcon />;
    }
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen flex flex-col font-sans">
      <header className="flex justify-between items-center p-4 shadow-lg bg-gray-800">
        <h1 className="text-xl font-bold text-indigo-400">{t('appTitle')}</h1>
        <div className="flex items-center space-x-4">
           <div className="relative" ref={languageSelectorRef}>
             <button 
                onClick={() => setIsLanguageSelectorOpen(!isLanguageSelectorOpen)} 
                className="focus:outline-none p-1 rounded-full hover:bg-gray-700 transition-colors"
                title={t('changeLanguage')}
              >
              <LanguageIcon />
            </button>
            {isLanguageSelectorOpen && (
              <div className="absolute right-0 mt-2 py-2 w-28 bg-gray-700 rounded-md shadow-xl z-20">
                <a href="#" onClick={(e) => { e.preventDefault(); changeLanguage('en'); }} className="block px-4 py-2 text-sm text-white hover:bg-indigo-500">English</a>
                <a href="#" onClick={(e) => { e.preventDefault(); changeLanguage('zh'); }} className="block px-4 py-2 text-sm text-white hover:bg-indigo-500">中文</a>
                <a href="#" onClick={(e) => { e.preventDefault(); changeLanguage('ja'); }} className="block px-4 py-2 text-sm text-white hover:bg-indigo-500">日本語</a>
              </div>
            )}
          </div>
          <button onClick={toggleAudioMode} title={t('toggleAudio')} className="focus:outline-none">
            {getAudioIcon()}
          </button>
          <button onClick={() => setIsInstructionsOpen(true)} title={t('instructions')} className="focus:outline-none">
            <InfoIcon />
          </button>
        </div>
      </header>

      <main className="flex-grow p-4 md:p-6 lg:p-8 flex items-center justify-center">
        {view === 'trainer' && (
          <KegelTrainer settings={workoutSettings} level={level} audioMode={audioMode} />
        )}
        {view === 'progress' && <ProgressTracker />}
      </main>

      <nav className="flex justify-around p-4 bg-gray-800 shadow-inner">
        <button
          onClick={() => setView('trainer')}
          className={`flex flex-col items-center ${view === 'trainer' ? 'text-indigo-400' : 'text-gray-400'}`}
          aria-label={t('trainer')}
        >
          <HomeIcon />
          <span className="text-xs mt-1">{t('trainer')}</span>
        </button>
        <button
          onClick={() => setView('progress')}
          className={`flex flex-col items-center ${view === 'progress' ? 'text-indigo-400' : 'text-gray-400'}`}
          aria-label={t('progress')}
        >
          <ChartIcon />
          <span className="text-xs mt-1">{t('progress')}</span>
        </button>
      </nav>

      {isInstructionsOpen && <InstructionsModal onClose={() => setIsInstructionsOpen(false)} />}
    </div>
  );
};

export default App;