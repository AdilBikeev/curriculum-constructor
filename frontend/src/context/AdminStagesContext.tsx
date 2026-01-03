import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { LessonStage, Exercise } from '../types';
import { stagesApi, exercisesApi } from '../services/stagesApi';
import { transformStagesDtoToLessonStages, transformExerciseDtoToExercise } from '../utils/apiTransformers';

interface AdminStagesContextType {
  stages: LessonStage[];
  isLoading: boolean;
  error: string | null;
  refreshStages: () => Promise<void>;
  addStage: (name: string, description?: string) => Promise<void>;
  deleteStage: (stageId: string) => Promise<void>;
  addExercise: (stageId: string, name: string, duration: number, description?: string) => Promise<void>;
  updateExercise: (stageId: string, exerciseId: string, name: string, duration: number, description?: string) => Promise<void>;
  deleteExercise: (stageId: string, exerciseId: string) => Promise<void>;
}

const AdminStagesContext = createContext<AdminStagesContextType | undefined>(undefined);

export const AdminStagesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [stages, setStages] = useState<LessonStage[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadStages = useCallback(async () => {
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
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadStages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // loadStages стабильна благодаря useCallback, поэтому можно использовать пустой массив

  const addStage = async (name: string, description?: string) => {
    try {
      setError(null);
      const newStageDto = await stagesApi.create({ name, description });
      const newStage: LessonStage = {
        id: newStageDto.id,
        name: newStageDto.name,
        description: newStageDto.description,
        exercises: newStageDto.exercises.map(transformExerciseDtoToExercise),
      };
      setStages((prev) => [...prev, newStage]);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create stage';
      setError(errorMessage);
      throw err;
    }
  };

  const deleteStage = async (stageId: string) => {
    try {
      setError(null);
      await stagesApi.delete(stageId);
      setStages((prev) => prev.filter((s) => s.id !== stageId));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete stage';
      setError(errorMessage);
      throw err;
    }
  };

  const addExercise = async (stageId: string, name: string, duration: number, description?: string) => {
    try {
      setError(null);
      const newExerciseDto = await exercisesApi.create({ stageId, name, duration, description });
      const newExercise = transformExerciseDtoToExercise(newExerciseDto);
      setStages((prev) =>
        prev.map((stage) =>
          stage.id === stageId
            ? { ...stage, exercises: [...stage.exercises, newExercise] }
            : stage
        )
      );
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create exercise';
      setError(errorMessage);
      throw err;
    }
  };

  const updateExercise = async (
    stageId: string,
    exerciseId: string,
    name: string,
    duration: number,
    description?: string
  ) => {
    try {
      setError(null);
      const updatedExerciseDto = await exercisesApi.update(exerciseId, { name, duration, description });
      const updatedExercise = transformExerciseDtoToExercise(updatedExerciseDto);
      setStages((prev) =>
        prev.map((stage) =>
          stage.id === stageId
            ? {
                ...stage,
                exercises: stage.exercises.map((ex) => (ex.id === exerciseId ? updatedExercise : ex)),
              }
            : stage
        )
      );
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update exercise';
      setError(errorMessage);
      throw err;
    }
  };

  const deleteExercise = async (stageId: string, exerciseId: string) => {
    try {
      setError(null);
      await exercisesApi.delete(exerciseId);
      setStages((prev) =>
        prev.map((stage) =>
          stage.id === stageId
            ? { ...stage, exercises: stage.exercises.filter((e) => e.id !== exerciseId) }
            : stage
        )
      );
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete exercise';
      setError(errorMessage);
      throw err;
    }
  };

  return (
    <AdminStagesContext.Provider
      value={{
        stages,
        isLoading,
        error,
        refreshStages: loadStages,
        addStage,
        deleteStage,
        addExercise,
        updateExercise,
        deleteExercise,
      }}
    >
      {children}
    </AdminStagesContext.Provider>
  );
};

export const useAdminStages = (): AdminStagesContextType => {
  const context = useContext(AdminStagesContext);
  if (!context) {
    throw new Error('useAdminStages must be used within AdminStagesProvider');
  }
  return context;
};

