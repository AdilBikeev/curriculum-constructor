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
  // Просто пересчитываем order согласно текущему порядку элементов в массиве
  return items.map((item, index) => ({
    ...item,
    order: index + 1,
  }));
};

export const moveItemUp = (items: LessonPlanItem[], itemId: string): LessonPlanItem[] => {
  const itemIndex = items.findIndex((item) => item.id === itemId);
  
  if (itemIndex <= 0) {
    return reorderItems([...items]);
  }

  const item = items[itemIndex];
  const prevItem = items[itemIndex - 1];

  // Создаем новый массив с переставленными элементами
  const newItems = [
    ...items.slice(0, itemIndex - 1),
    item,
    prevItem,
    ...items.slice(itemIndex + 1),
  ];
  
  // Пересчитываем порядок
  return reorderItems(newItems);
};

export const moveItemDown = (items: LessonPlanItem[], itemId: string): LessonPlanItem[] => {
  const itemIndex = items.findIndex((item) => item.id === itemId);
  
  if (itemIndex < 0 || itemIndex >= items.length - 1) {
    return reorderItems([...items]);
  }

  const item = items[itemIndex];
  const nextItem = items[itemIndex + 1];

  // Создаем новый массив с переставленными элементами
  const newItems = [
    ...items.slice(0, itemIndex),
    nextItem,
    item,
    ...items.slice(itemIndex + 2),
  ];
  
  // Пересчитываем порядок
  return reorderItems(newItems);
};

/**
 * Переместить упражнение вверх внутри стадии
 */
export const moveExerciseInStageUp = (items: LessonPlanItem[], itemId: string): LessonPlanItem[] => {
  const newItems = [...items];
  const itemIndex = newItems.findIndex((item) => item.id === itemId);
  
  if (itemIndex <= 0) {
    return reorderItems(newItems);
  }

  const item = newItems[itemIndex];
  const prevItem = newItems[itemIndex - 1];

  // Если предыдущий элемент из другой стадии, не перемещаем
  if (prevItem.stageId !== item.stageId) {
    return reorderItems(newItems);
  }

  // Меняем местами элементы через splice (как в moveStageUp)
  const temp = newItems[itemIndex - 1];
  newItems[itemIndex - 1] = newItems[itemIndex];
  newItems[itemIndex] = temp;
  
  // Пересчитываем порядок
  return reorderItems(newItems);
};

/**
 * Переместить упражнение вниз внутри стадии
 */
export const moveExerciseInStageDown = (items: LessonPlanItem[], itemId: string): LessonPlanItem[] => {
  const newItems = [...items];
  const itemIndex = newItems.findIndex((item) => item.id === itemId);
  
  if (itemIndex < 0 || itemIndex >= newItems.length - 1) {
    return reorderItems(newItems);
  }

  const item = newItems[itemIndex];
  const nextItem = newItems[itemIndex + 1];

  // Если следующий элемент из другой стадии, не перемещаем
  if (nextItem.stageId !== item.stageId) {
    return reorderItems(newItems);
  }

  // Меняем местами элементы через splice (как в moveStageDown)
  const temp = newItems[itemIndex];
  newItems[itemIndex] = newItems[itemIndex + 1];
  newItems[itemIndex + 1] = temp;
  
  // Пересчитываем порядок
  return reorderItems(newItems);
};

/**
 * Переместить всю стадию вверх
 */
export const moveStageUp = (items: LessonPlanItem[], stageId: string): LessonPlanItem[] => {
  const newItems = [...items];
  const stageItems = newItems.filter((item) => item.stageId === stageId);
  
  if (stageItems.length === 0) {
    return reorderItems(newItems);
  }

  const firstStageItemIndex = newItems.findIndex((item) => item.id === stageItems[0].id);
  
  if (firstStageItemIndex <= 0) {
    return reorderItems(newItems);
  }

  // Находим предыдущую стадию (группу элементов с другим stageId)
  let prevStageEndIndex = firstStageItemIndex - 1;
  const prevStageId = newItems[prevStageEndIndex].stageId;
  
  // Находим начало предыдущей стадии
  let prevStageStartIndex = prevStageEndIndex;
  while (prevStageStartIndex > 0 && newItems[prevStageStartIndex - 1].stageId === prevStageId) {
    prevStageStartIndex--;
  }

  // Перемещаем всю стадию: меняем местами блоки элементов
  const prevStageItems = newItems.slice(prevStageStartIndex, firstStageItemIndex);
  const currentStageItems = newItems.slice(firstStageItemIndex, firstStageItemIndex + stageItems.length);
  
  // Вставляем текущую стадию перед предыдущей
  newItems.splice(prevStageStartIndex, stageItems.length + prevStageItems.length, ...currentStageItems, ...prevStageItems);
  
  // Пересчитываем порядок
  return reorderItems(newItems);
};

/**
 * Переместить всю стадию вниз
 */
export const moveStageDown = (items: LessonPlanItem[], stageId: string): LessonPlanItem[] => {
  const newItems = [...items];
  const stageItems = newItems.filter((item) => item.stageId === stageId);
  
  if (stageItems.length === 0) {
    return reorderItems(newItems);
  }

  const firstStageItemIndex = newItems.findIndex((item) => item.id === stageItems[0].id);
  const lastStageItemIndex = firstStageItemIndex + stageItems.length - 1;
  
  if (lastStageItemIndex >= newItems.length - 1) {
    return reorderItems(newItems);
  }

  // Находим следующую стадию (группу элементов с другим stageId)
  const nextStageStartIndex = lastStageItemIndex + 1;
  const nextStageId = newItems[nextStageStartIndex].stageId;
  
  // Находим конец следующей стадии
  let nextStageEndIndex = nextStageStartIndex;
  while (nextStageEndIndex < newItems.length - 1 && newItems[nextStageEndIndex + 1].stageId === nextStageId) {
    nextStageEndIndex++;
  }
  nextStageEndIndex++; // Индекс после последнего элемента следующей стадии

  // Перемещаем всю стадию: меняем местами блоки элементов
  const currentStageItems = newItems.slice(firstStageItemIndex, firstStageItemIndex + stageItems.length);
  const nextStageItems = newItems.slice(nextStageStartIndex, nextStageEndIndex);
  
  // Вставляем текущую стадию после следующей
  newItems.splice(firstStageItemIndex, stageItems.length + nextStageItems.length, ...nextStageItems, ...currentStageItems);
  
  // Пересчитываем порядок
  return reorderItems(newItems);
};

