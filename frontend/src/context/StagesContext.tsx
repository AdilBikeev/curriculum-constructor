import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { LessonStage } from '../types';
import { mockStages } from '../data/mockData';

interface StagesContextType {
  stages: LessonStage[];
  updateStages: (stages: LessonStage[]) => void;
  resetToDefault: () => void;
}

const StagesContext = createContext<StagesContextType | undefined>(undefined);

const STORAGE_KEY = 'lesson-stages';

export const StagesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [stages, setStages] = useState<LessonStage[]>(() => {
    // Загружаем из localStorage или используем мок-данные
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return mockStages;
      }
    }
    return mockStages;
  });

  useEffect(() => {
    // Сохраняем в localStorage при изменении
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stages));
  }, [stages]);

  const updateStages = (newStages: LessonStage[]) => {
    setStages(newStages);
  };

  const resetToDefault = () => {
    setStages(mockStages);
    localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <StagesContext.Provider value={{ stages, updateStages, resetToDefault }}>
      {children}
    </StagesContext.Provider>
  );
};

export const useStages = (): StagesContextType => {
  const context = useContext(StagesContext);
  if (!context) {
    throw new Error('useStages must be used within StagesProvider');
  }
  return context;
};

