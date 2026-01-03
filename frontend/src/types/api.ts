// Типы для API ответов

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: string[];
}

export interface StageDto {
  id: string;
  name: string;
  description?: string;
  exercises: ExerciseDto[];
}

export interface ExerciseDto {
  id: string;
  stageId: string;
  name: string;
  duration: number;
  description?: string;
}

export interface CreateStageRequest {
  name: string;
  description?: string;
}

export interface CreateExerciseRequest {
  stageId: string;
  name: string;
  duration: number;
  description?: string;
}

export interface UpdateExerciseRequest {
  name: string;
  duration: number;
  description?: string;
}

