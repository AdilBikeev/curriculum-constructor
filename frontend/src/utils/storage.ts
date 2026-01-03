import { LessonPlan, LessonPlanItem } from '../types';

const STORAGE_KEY_PLANS = 'lesson-plans';
const STORAGE_KEY_CURRENT_PLAN = 'current-lesson-plan';

export interface SavedLessonPlan extends LessonPlan {
  savedAt: string;
}

/**
 * Сохранить план урока в localStorage
 */
export const saveLessonPlan = (plan: LessonPlan): void => {
  try {
    const savedPlan: SavedLessonPlan = {
      ...plan,
      savedAt: new Date().toISOString(),
    };
    
    // Сохраняем текущий план
    localStorage.setItem(STORAGE_KEY_CURRENT_PLAN, JSON.stringify(savedPlan));
    
    // Также добавляем в список всех планов
    const allPlans = getAllLessonPlans();
    const existingIndex = allPlans.findIndex((p) => p.id === plan.id);
    
    if (existingIndex >= 0) {
      allPlans[existingIndex] = savedPlan;
    } else {
      allPlans.push(savedPlan);
    }
    
    // Сортируем по дате сохранения (новые сверху)
    allPlans.sort((a, b) => new Date(b.savedAt).getTime() - new Date(a.savedAt).getTime());
    
    // Храним только последние 50 планов
    const plansToSave = allPlans.slice(0, 50);
    localStorage.setItem(STORAGE_KEY_PLANS, JSON.stringify(plansToSave));
  } catch (error) {
    // Ошибка при сохранении плана урока
  }
};

/**
 * Загрузить текущий план урока из localStorage
 */
export const loadCurrentLessonPlan = (): SavedLessonPlan | null => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY_CURRENT_PLAN);
    if (saved) {
      return JSON.parse(saved) as SavedLessonPlan;
    }
  } catch (error) {
    // Ошибка при загрузке текущего плана урока
  }
  return null;
};

/**
 * Загрузить все сохраненные планы уроков
 */
export const getAllLessonPlans = (): SavedLessonPlan[] => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY_PLANS);
    if (saved) {
      return JSON.parse(saved) as SavedLessonPlan[];
    }
  } catch (error) {
    // Ошибка при загрузке всех планов уроков
  }
  return [];
};

/**
 * Загрузить конкретный план по ID
 */
export const loadLessonPlanById = (id: string): SavedLessonPlan | null => {
  const allPlans = getAllLessonPlans();
  return allPlans.find((plan) => plan.id === id) || null;
};

/**
 * Удалить план урока
 */
export const deleteLessonPlan = (id: string): void => {
  try {
    const allPlans = getAllLessonPlans();
    const filteredPlans = allPlans.filter((plan) => plan.id !== id);
    localStorage.setItem(STORAGE_KEY_PLANS, JSON.stringify(filteredPlans));
    
    // Если удаляем текущий план, очищаем его тоже
    const current = loadCurrentLessonPlan();
    if (current && current.id === id) {
      localStorage.removeItem(STORAGE_KEY_CURRENT_PLAN);
    }
  } catch (error) {
    // Ошибка при удалении плана урока
  }
};

/**
 * Очистить текущий план урока
 */
export const clearCurrentLessonPlan = (): void => {
  localStorage.removeItem(STORAGE_KEY_CURRENT_PLAN);
};

/**
 * Создать новый план урока из списка элементов
 */
export const createLessonPlanFromItems = (items: LessonPlanItem[], title?: string): LessonPlan => {
  const totalDuration = items.reduce((sum, item) => sum + item.duration, 0);
  
  return {
    id: `plan-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`,
    title: title || `План урока от ${new Date().toLocaleDateString('ru-RU')}`,
    items: items.map((item) => ({ ...item })),
    totalDuration,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
};

/**
 * Экспортировать план урока в JSON строку
 */
export const exportLessonPlanToString = (plan: LessonPlan): string => {
  try {
    return JSON.stringify(plan, null, 2);
  } catch (error) {
    throw error;
  }
};

/**
 * Импортировать план урока из JSON строки
 */
export const importLessonPlanFromString = (jsonString: string): LessonPlan | null => {
  try {
    const plan = JSON.parse(jsonString) as LessonPlan;
    
    // Валидация структуры
    if (!plan.id || !plan.items || !Array.isArray(plan.items)) {
      throw new Error('Неверный формат плана урока');
    }
    
    // Пересчитываем totalDuration на всякий случай
    plan.totalDuration = plan.items.reduce((sum, item) => sum + item.duration, 0);
    plan.updatedAt = new Date().toISOString();
    
    return plan;
  } catch (error) {
    return null;
  }
};

/**
 * Экспортировать план урока в файл
 */
export const exportLessonPlanToFile = (plan: LessonPlan, filename?: string): void => {
  try {
    const jsonString = exportLessonPlanToString(plan);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename || `plan-${plan.id}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch (error) {
    alert('Ошибка при экспорте плана урока');
  }
};

/**
 * Импортировать план урока из файла
 */
export const importLessonPlanFromFile = (file: File): Promise<LessonPlan | null> => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const plan = importLessonPlanFromString(content);
        resolve(plan);
      } catch (error) {
        resolve(null);
      }
    };
    
    reader.onerror = () => {
      resolve(null);
    };
    
    reader.readAsText(file);
  });
};

/**
 * Экспортировать все планы уроков в JSON строку
 */
export const exportAllLessonPlansToString = (): string => {
  try {
    const allPlans = getAllLessonPlans();
    return JSON.stringify(allPlans, null, 2);
  } catch (error) {
    throw error;
  }
};

/**
 * Импортировать планы уроков из JSON строки (массив планов)
 */
export const importLessonPlansFromString = (jsonString: string): SavedLessonPlan[] => {
  try {
    const plans = JSON.parse(jsonString) as SavedLessonPlan[];
    
    if (!Array.isArray(plans)) {
      throw new Error('Ожидается массив планов уроков');
    }
    
    // Валидация и нормализация каждого плана
    return plans.map((plan) => {
      if (!plan.id || !plan.items || !Array.isArray(plan.items)) {
        throw new Error('Неверный формат плана урока');
      }
      
      return {
        ...plan,
        totalDuration: plan.items.reduce((sum, item) => sum + item.duration, 0),
        updatedAt: new Date().toISOString(),
        savedAt: plan.savedAt || new Date().toISOString(),
      };
    });
  } catch (error) {
    throw error;
  }
};

