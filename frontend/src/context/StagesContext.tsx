import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { LessonStage } from '../types';
import { mockStages } from '../data/mockData';
import { stagesApi, exercisesApi } from '../services/stagesApi';
import { transformStagesDtoToLessonStages, transformExerciseDtoToExercise } from '../utils/apiTransformers';

interface StagesContextType {
  stages: LessonStage[];
  updateStages: (stages: LessonStage[]) => void;
  resetToDefault: () => void;
  isLoading?: boolean;
  error?: string | null;
  refreshStages?: () => Promise<void>;
  refreshStageExercises?: (stageId: string) => Promise<void>;
}

const StagesContext = createContext<StagesContextType | undefined>(undefined);

const STORAGE_KEY = 'lesson-stages';

interface StagesProviderProps {
  children: ReactNode;
  useApi?: boolean; // Флаг для использования API вместо mock данных
}

export const StagesProvider: React.FC<StagesProviderProps> = ({ children, useApi = false }) => {
  const [stages, setStages] = useState<LessonStage[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Загрузка данных при монтировании только для режима без API
  useEffect(() => {
    if (!useApi) {
      // Загружаем из localStorage или используем мок-данные
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        try {
          setStages(JSON.parse(saved));
        } catch {
          setStages(mockStages);
        }
      } else {
        setStages(mockStages);
      }
    }
    // При useApi=true данные загружаются только по требованию (через refreshStages)
  }, [useApi]);

  const loadStagesFromApi = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const stagesDto = await stagesApi.getAll();
      const transformedStages = transformStagesDtoToLessonStages(stagesDto);
      setStages(transformedStages);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load stages';
      setError(errorMessage);
      console.error('Error loading stages from API:', err);
      // В случае ошибки используем mock данные как fallback
      setStages(mockStages);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Сохраняем в localStorage только если не используем API
    if (!useApi) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stages));
    }
  }, [stages, useApi]);

  const updateStages = (newStages: LessonStage[]) => {
    setStages(newStages);
  };

  const resetToDefault = () => {
    if (useApi) {
      // Для API режима просто перезагружаем данные
      loadStagesFromApi();
    } else {
      setStages(mockStages);
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  const refreshStageExercises = async (stageId: string) => {
    if (!useApi) return;
    
    try {
      setError(null);
      // Загружаем только упражнения для конкретной стадии
      const exercisesDto = await exercisesApi.getByStageId(stageId);
      const transformedExercises = exercisesDto.map(transformExerciseDtoToExercise);
      
      // Обновляем только упражнения для этой стадии
      setStages((prev) =>
        prev.map((stage) =>
          stage.id === stageId
            ? { ...stage, exercises: transformedExercises }
            : stage
        )
      );
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to refresh stage exercises';
      setError(errorMessage);
      console.error('Error refreshing stage exercises from API:', err);
    }
  };

  const contextValue: StagesContextType = {
    stages,
    updateStages,
    resetToDefault,
    ...(useApi && {
      isLoading,
      error,
      refreshStages: loadStagesFromApi,
      refreshStageExercises,
    }),
  };

  return (
    <StagesContext.Provider value={contextValue}>
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

