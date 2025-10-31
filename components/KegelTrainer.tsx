import React, { useEffect, useRef, useState } from 'react';
import useKegelTimer from '../hooks/useKegelTimer';
import type { WorkoutSettings, Level, AudioMode } from '../types';
import { PlayIcon } from './icons/PlayIcon';
import { PauseIcon } from './icons/PauseIcon';
import { ResetIcon } from './icons/ResetIcon';
import { KegelDiagram } from './KegelDiagram';
import { generateSpeech } from '../services/geminiService';
import { useTranslation } from 'react-i18next';

// Audio decoding functions from Gemini documentation
function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}


interface KegelTrainerProps {
  settings: WorkoutSettings;
  level: Level;
  audioMode: AudioMode;
}

const KegelTrainer: React.FC<KegelTrainerProps> = ({ settings, level, audioMode }) => {
  const { timerState, isActive, startTimer, pauseTimer, resumeTimer, resetTimer } = useKegelTimer(settings, level);
  const { repsCompleted, currentPhase, phaseTimeLeft } = timerState;
  const { t } = useTranslation();

  const audioContextRef = useRef<AudioContext | null>(null);
  const [isAudioLoading, setIsAudioLoading] = useState(false);

  const playSound = (type: 'contract' | 'relax' | 'finish') => {
    if (audioMode !== 'sound' || !audioContextRef.current) return;
    const oscillator = audioContextRef.current.createOscillator();
    const gainNode = audioContextRef.current.createGain();
    oscillator.connect(gainNode);
    gainNode.connect(audioContextRef.current.destination);

    if (type === 'contract') {
        oscillator.frequency.value = 440; // A4
    } else if (type === 'relax') {
        oscillator.frequency.value = 220; // A3
    } else { // finish
        oscillator.frequency.value = 660; // E5
    }
    
    gainNode.gain.setValueAtTime(0.3, audioContextRef.current.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.00001, audioContextRef.current.currentTime + 0.5);
    oscillator.start(audioContextRef.current.currentTime);
    oscillator.stop(audioContextRef.current.currentTime + 0.5);
  };

  const playVoice = async (text: string) => {
    if (audioMode !== 'voice' || !audioContextRef.current) return;
    setIsAudioLoading(true);
    const base64Audio = await generateSpeech(text);
    setIsAudioLoading(false);
    if (base64Audio && audioContextRef.current) {
       try {
        const audioBuffer = await decodeAudioData(
            decode(base64Audio),
            audioContextRef.current,
            24000,
            1,
        );
        const source = audioContextRef.current.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(audioContextRef.current.destination);
        source.start();
       } catch (error) {
           console.error("Error playing voice:", error);
       }
    }
  };


  useEffect(() => {
    // Initialize AudioContext on first user interaction (or component mount)
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
  }, []);

  useEffect(() => {
    if (isActive) {
      if (currentPhase === 'contract' && phaseTimeLeft === settings.contractTime) {
         playSound('contract');
         playVoice(t('contract'));
      } else if (currentPhase === 'relax' && phaseTimeLeft === settings.relaxTime) {
         playSound('relax');
         playVoice(t('relax'));
      } else if (currentPhase === 'finished') {
          playSound('finish');
          playVoice(t('workoutComplete'));
      }
    }
  }, [currentPhase, phaseTimeLeft, isActive, settings, audioMode, t]);

  const handlePrimaryClick = () => {
    if (currentPhase === 'idle' || currentPhase === 'finished') {
      startTimer();
    } else if (isActive) {
      pauseTimer();
    } else {
      resumeTimer();
    }
  };

  const getPhaseText = () => {
    switch (currentPhase) {
      case 'contract': return t('contract');
      case 'relax': return t('relax');
      case 'finished': return t('finished');
      case 'idle':
      default:
        return t('getReady');
    }
  };
  
  const totalReps = settings.reps;
  const progressPercentage = totalReps > 0 ? (repsCompleted / totalReps) * 100 : 0;

  return (
    <div className="w-full max-w-md mx-auto bg-gray-800 rounded-3xl shadow-2xl p-6 md:p-8 text-center flex flex-col items-center justify-between">
      <div className="w-full">
        <div className="flex justify-between items-center mb-4">
            <span className="text-sm font-medium text-gray-400">{t(level)}</span>
            <span className="text-sm font-medium text-gray-400">{t('repsCounter', { repsCompleted, totalReps })}</span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2.5 mb-6">
            <div className="bg-indigo-500 h-2.5 rounded-full" style={{ width: `${progressPercentage}%`, transition: 'width 0.5s ease-in-out' }}></div>
        </div>
      </div>

      <div className="relative my-6">
        <KegelDiagram phase={currentPhase === 'contract' ? 'contract' : 'relax'} />
        <div className="absolute inset-0 flex flex-col items-center justify-center">
            <p className="text-5xl md:text-6xl font-bold tracking-tighter">
              {currentPhase !== 'idle' && currentPhase !== 'finished' ? phaseTimeLeft : 'GO'}
            </p>
            <p className="text-lg md:text-xl font-semibold uppercase text-indigo-400 mt-2">
              {getPhaseText()}
            </p>
        </div>
      </div>
      
       <div className="flex items-center justify-center space-x-8 mt-6">
         <button onClick={resetTimer} disabled={currentPhase === 'idle'} className="text-gray-400 disabled:opacity-50 hover:text-white transition-colors" aria-label={t('reset')}>
          <ResetIcon />
        </button>
        <button
          onClick={handlePrimaryClick}
          className="w-20 h-20 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-lg transform hover:scale-105 transition-transform focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-indigo-500"
          aria-label={isActive ? t('pause') : t('play')}
        >
          {isActive ? <PauseIcon /> : <PlayIcon />}
        </button>
        <div className="w-6 h-6">
            {isAudioLoading && <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-400"></div>}
        </div>
      </div>
    </div>
  );
};

export default KegelTrainer;
