import { LessonPlanItem, Exercise, LessonStage, LESSON_DURATION } from '../types';

export const calculateTotalDuration = (items: LessonPlanItem[]): number => {
  return items.reduce((total, item) => total + item.duration, 0);
};

export const createLessonPlanItem = (
  stage: LessonStage,
  exercise: Exercise,
  order: number
): LessonPlanItem => {
  return {
    id: `item-${Date.now()}-${Math.random()}`,
    stageId: stage.id,
    stageName: stage.name,
    exerciseId: exercise.id,
    exerciseName: exercise.name,
    duration: exercise.duration,
    order,
  };
};

export const canAddExercise = (
  currentDuration: number,
  exerciseDuration: number,
  maxDuration: number = LESSON_DURATION
): boolean => {
  return currentDuration + exerciseDuration <= maxDuration;
};

export const reorderItems = (items: LessonPlanItem[]): LessonPlanItem[] => {
  return items
    .sort((a, b) => a.order - b.order)
    .map((item, index) => ({
      ...item,
      order: index + 1,
    }));
};

export const moveItemUp = (items: LessonPlanItem[], itemId: string): LessonPlanItem[] => {
  // Сначала сортируем по order, чтобы убедиться, что порядок правильный
  const sortedItems = [...items].sort((a, b) => a.order - b.order);
  const index = sortedItems.findIndex((item) => item.id === itemId);
  
  if (index <= 0) {
    // Возвращаем новый массив даже если ничего не изменилось
    return sortedItems.map(item => ({ ...item }));
  }

  // Меняем местами элементы
  const newItems = [...sortedItems];
  const temp = newItems[index - 1];
  newItems[index - 1] = newItems[index];
  newItems[index] = temp;
  
  // Пересчитываем порядок
  return reorderItems(newItems);
};

export const moveItemDown = (items: LessonPlanItem[], itemId: string): LessonPlanItem[] => {
  // Сначала сортируем по order, чтобы убедиться, что порядок правильный
  const sortedItems = [...items].sort((a, b) => a.order - b.order);
  const index = sortedItems.findIndex((item) => item.id === itemId);
  
  if (index < 0 || index >= sortedItems.length - 1) {
    // Возвращаем новый массив даже если ничего не изменилось
    return sortedItems.map(item => ({ ...item }));
  }

  // Меняем местами элементы
  const newItems = [...sortedItems];
  const temp = newItems[index];
  newItems[index] = newItems[index + 1];
  newItems[index + 1] = temp;
  
  // Пересчитываем порядок
  return reorderItems(newItems);
};

