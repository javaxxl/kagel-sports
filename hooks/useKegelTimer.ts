import { useState, useEffect, useRef, useCallback } from 'react';
import type { KegelTimerState, WorkoutSettings, Level } from '../types';
import { addSession } from '../services/historyService';

const useKegelTimer = (settings: WorkoutSettings, level: Level) => {
  const [timerState, setTimerState] = useState<KegelTimerState>({
    repsCompleted: 0,
    currentPhase: 'idle',
    phaseTimeLeft: 0,
    totalTime: 0,
  });
  const [isActive, setIsActive] = useState(false);
  const intervalRef = useRef<number | null>(null);

  const stopTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsActive(false);
  }, []);
  
  const startTimer = () => {
    stopTimer();
    setTimerState({
      repsCompleted: 0,
      currentPhase: 'contract',
      phaseTimeLeft: settings.contractTime,
      totalTime: 0,
    });
    setIsActive(true);
  };
  
  const resetTimer = useCallback(() => {
    stopTimer();
     setTimerState({
      repsCompleted: 0,
      currentPhase: 'idle',
      phaseTimeLeft: 0,
      totalTime: 0,
    });
  }, [stopTimer]);

  const pauseTimer = () => {
    stopTimer();
  };

  const resumeTimer = () => {
    if (timerState.currentPhase !== 'idle' && timerState.currentPhase !== 'finished') {
      setIsActive(true);
    }
  };


  useEffect(() => {
    if (!isActive) {
      return;
    }

    intervalRef.current = window.setInterval(() => {
      setTimerState(prev => {
        const newTotalTime = prev.totalTime + 1;
        let newPhase = prev.currentPhase;
        let newPhaseTimeLeft = prev.phaseTimeLeft - 1;
        let newRepsCompleted = prev.repsCompleted;

        if (newPhaseTimeLeft <= 0) {
          if (newPhase === 'contract') {
            newPhase = 'relax';
            newPhaseTimeLeft = settings.relaxTime;
          } else if (newPhase === 'relax') {
            newRepsCompleted += 1;
            if (newRepsCompleted >= settings.reps) {
              newPhase = 'finished';
              newPhaseTimeLeft = 0;
            } else {
              newPhase = 'contract';
              newPhaseTimeLeft = settings.contractTime;
            }
          }
        }
        
        if (newPhase === 'finished') {
          stopTimer();
          addSession({
            date: new Date().toISOString(),
            reps: settings.reps,
            duration: newTotalTime,
            level: level,
          });
        }
        
        return {
          repsCompleted: newRepsCompleted,
          currentPhase: newPhase,
          phaseTimeLeft: newPhaseTimeLeft,
          totalTime: newTotalTime,
        };
      });
    }, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isActive, settings, stopTimer, level]);

  return { timerState, isActive, startTimer, pauseTimer, resumeTimer, resetTimer };
};

export default useKegelTimer;
