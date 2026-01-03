// Типы для конструктора планов уроков

export interface Exercise {
  id: string;
  name: string;
  duration: number; // в секундах
  description?: string;
}

export interface LessonStage {
  id: string;
  name: string;
  description?: string;
  exercises: Exercise[];
}

export interface LessonPlanItem {
  id: string;
  stageId: string;
  stageName: string;
  exerciseId: string;
  exerciseName: string;
  duration: number; // в секундах
  order: number;
}

export interface LessonPlan {
  id: string;
  title: string;
  items: LessonPlanItem[];
  totalDuration: number; // в секундах
  createdAt: string;
  updatedAt: string;
}

export const LESSON_DURATION = 5400; // 1.5 часа в секундах (90 минут)


