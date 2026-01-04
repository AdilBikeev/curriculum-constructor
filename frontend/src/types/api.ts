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
  duration: number; // в секундах
  description?: string;
}

export interface CreateStageRequest {
  name: string;
  description?: string;
}

export interface CreateExerciseRequest {
  stageId: string;
  name: string;
  duration: number; // в секундах
  description?: string;
}

export interface UpdateExerciseRequest {
  name: string;
  duration: number; // в секундах
  description?: string;
}

export interface LessonPlanDto {
  id: string;
  title: string;
  totalDuration: number; // в секундах
  items: LessonPlanItemDto[];
  createdAt: string;
  updatedAt: string;
}

export interface LessonPlanItemDto {
  id: string;
  stageId: string;
  stageName: string;
  exerciseId: string;
  exerciseName: string;
  duration: number; // в секундах
  order: number;
}

export interface CreateLessonPlanRequest {
  title: string;
  items: CreateLessonPlanItemRequest[];
}

export interface CreateLessonPlanItemRequest {
  stageId: string;
  stageName: string;
  exerciseId: string;
  exerciseName: string;
  duration: number; // в секундах
  order: number;
}

export interface UpdateLessonPlanRequest {
  title: string;
  items: CreateLessonPlanItemRequest[];
}

