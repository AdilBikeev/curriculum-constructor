// Типы для конструктора планов уроков

export interface Exercise {
  id: string;
  name: string;
  duration: number; // в минутах
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
  duration: number;
  order: number;
}

export interface LessonPlan {
  id: string;
  title: string;
  items: LessonPlanItem[];
  totalDuration: number;
  createdAt: string;
  updatedAt: string;
}

export const LESSON_DURATION = 90; // 1.5 часа в минутах


