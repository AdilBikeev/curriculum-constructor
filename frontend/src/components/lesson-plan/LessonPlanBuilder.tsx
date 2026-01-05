import React, { useState, useMemo, useEffect } from 'react';
import styled from 'styled-components';
import { LessonPlanItem, LessonStage, Exercise, LessonPlan, LESSON_DURATION } from '../../types';
import { StageSelectionModal } from './StageSelectionModal';
import { AddExerciseToStageModal } from './AddExerciseToStageModal';
import { AddStageButton } from './AddStageButton';
import { LessonPlanItemComponent } from './LessonPlanItem';
import { StageGroup } from './StageGroup';
import { TimeIndicator } from './TimeIndicator';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { TimeInput } from '../common/TimeInput';
import {
  calculateTotalDuration,
  createLessonPlanItem,
  canAddExercise,
  moveExerciseInStageUp,
  moveExerciseInStageDown,
  moveStageUp,
  moveStageDown,
  reorderItems,
} from '../../utils/lessonPlan';
import { addMinutesToTime } from '../../utils/timeCalculation';
import {
  createLessonPlanFromItems,
} from '../../utils/storage';
import { ImportExportPanel } from './ImportExportPanel';
import { LessonPlansList } from './LessonPlansList';
import { CollapsibleSection } from './CollapsibleSection';
import { lessonPlansApi } from '../../services/stagesApi';
import { CreateLessonPlanRequest, UpdateLessonPlanRequest } from '../../types/api';

const isDevelopment = process.env.NODE_ENV === 'development';

interface LessonPlanBuilderProps {
  stages: LessonStage[];
  onSave?: (items: LessonPlanItem[]) => void;
  onRefreshStages?: () => Promise<void>;
  onRefreshStageExercises?: (stageId: string) => Promise<void>;
}

const BuilderContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: ${({ theme }) => theme.spacing.lg};

  @media (min-width: ${({ theme }) => theme.breakpoints.desktop}) {
    grid-template-columns: 1fr 320px;
    gap: ${({ theme }) => theme.spacing.lg};
  }
`;

const MainContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
`;

const Sidebar = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
  position: sticky;
  top: calc(80px + ${({ theme }) => theme.spacing.lg});
  align-self: flex-start;
  max-height: calc(100vh - 80px - ${({ theme }) => theme.spacing.lg} * 2);
  overflow-y: auto;
  align-items: stretch;

  @media (max-width: ${({ theme }) => theme.breakpoints.desktop}) {
    position: static;
    max-height: none;
    overflow-y: visible;
    top: auto;
  }
`;

const PlanList = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100px;
  gap: 0;
`;

const EmptyState = styled(Card)`
  text-align: center;
  padding: ${({ theme }) => theme.spacing.xl} ${({ theme }) => theme.spacing.md} !important;
  color: ${({ theme }) => theme.colors.secondary};
  background: ${({ theme }) => theme.colors.lightGray};
  border: 2px dashed ${({ theme }) => theme.colors.gray};
`;

const EmptyIcon = styled.div`
  font-size: 3rem;
  margin-bottom: ${({ theme }) => theme.spacing.md};
  opacity: 0.5;
`;

const EmptyTitle = styled.p`
  font-size: 1.125rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.dark};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const EmptyDescription = styled.p`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.secondary};
`;


const AutoSaveIndicator = styled.div`
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.secondary};
  text-align: center;
  padding-top: ${({ theme }) => theme.spacing.sm};
  border-top: 1px solid ${({ theme }) => theme.colors.gray};
  margin-top: ${({ theme }) => theme.spacing.xs};
`;

const CompactCard = styled(Card)`
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md} !important;

  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    padding: ${({ theme }) => theme.spacing.md} !important;
  }
`;

const ReadOnlyCardWrapper = styled.div<{ $isReadOnly: boolean }>`
  position: relative;
  
  ${({ $isReadOnly }) => $isReadOnly && `
    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.02);
      pointer-events: none;
      z-index: 1;
      border-radius: ${({ theme }: any) => theme.borderRadius.lg};
    }
  `}
`;

const SectionTitle = styled.h2`
  font-size: 1.125rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.dark};
  margin-bottom: ${({ theme }) => theme.spacing.md};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  flex-wrap: wrap;

  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    font-size: 1.25rem;
    margin-bottom: ${({ theme }) => theme.spacing.lg};
  }
`;

const CompactSectionTitle = styled(SectionTitle)`
  font-size: 0.9375rem;
  margin-bottom: ${({ theme }) => theme.spacing.sm};
  font-weight: 600;
`;

const PlanTitleSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const PlanTitleRow = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
  align-items: flex-start;
  flex-wrap: wrap;
`;

const PlanTitleInput = styled.input<{ $isReadOnly?: boolean }>`
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border: 2px solid ${({ theme, $isReadOnly }) => ($isReadOnly ? '#d1d5db' : theme.colors.gray)};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: 0.9375rem;
  font-family: inherit;
  transition: all ${({ theme }) => theme.transitions.normal};
  background-color: ${({ theme, $isReadOnly }) => ($isReadOnly ? '#f3f4f6' : theme.colors.white)};
  color: ${({ theme, $isReadOnly }) => ($isReadOnly ? '#6b7280' : theme.colors.dark)};
  cursor: ${({ $isReadOnly }) => ($isReadOnly ? 'not-allowed' : 'text')};
  flex: 1;
  min-width: 200px;
  opacity: ${({ $isReadOnly }) => ($isReadOnly ? 0.8 : 1)};

  &:focus {
    outline: none;
    border-color: ${({ theme, $isReadOnly }) => ($isReadOnly ? '#d1d5db' : theme.colors.primary)};
    box-shadow: ${({ $isReadOnly }) => ($isReadOnly ? 'none' : '0 0 0 3px rgba(99, 102, 241, 0.1)')};
  }
`;

const PlanActionsRow = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
  align-items: center;
  flex-wrap: wrap;
`;

const WarningMessage = styled.div<{ $isError: boolean }>`
  padding: ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  background-color: ${({ theme, $isError }) =>
    $isError ? 'rgba(239, 68, 68, 0.1)' : 'rgba(245, 158, 11, 0.1)'};
  color: ${({ theme, $isError }) => ($isError ? theme.colors.danger : theme.colors.warning)};
  font-size: 0.875rem;
  border-left: 4px solid
    ${({ theme, $isError }) => ($isError ? theme.colors.danger : theme.colors.warning)};
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-top: ${({ theme }) => theme.spacing.sm};
`;


const ReadOnlyIndicator = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  background-color: rgba(99, 102, 241, 0.1);
  border: 1px solid rgba(99, 102, 241, 0.3);
  border-radius: ${({ theme }) => theme.borderRadius.md};
  color: ${({ theme }) => theme.colors.primary};
  font-size: 0.875rem;
  font-weight: 600;
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const FloatingActionButtons = styled.div`
  position: fixed;
  bottom: ${({ theme }) => theme.spacing.lg};
  right: ${({ theme }) => theme.spacing.lg};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
  z-index: 999;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.desktop}) {
    bottom: ${({ theme }) => theme.spacing.md};
    right: ${({ theme }) => theme.spacing.md};
  }
`;

const FloatingButton = styled.button<{ $variant: 'plans' | 'export' }>`
  width: 56px;
  height: 56px;
  border-radius: 50%;
  border: none;
  background: ${({ theme, $variant }) => 
    $variant === 'plans' 
      ? theme.colors.gradientPrimary 
      : theme.colors.success};
  color: ${({ theme }) => theme.colors.white};
  font-size: 1.5rem;
  cursor: pointer;
  box-shadow: ${({ theme }) => theme.shadows.lg};
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  
  &:hover {
    transform: scale(1.1);
    box-shadow: ${({ theme }) => theme.shadows.xl};
  }
  
  &:active {
    transform: scale(0.95);
  }
  
  &::after {
    content: attr(data-tooltip);
    position: absolute;
    right: calc(100% + ${({ theme }) => theme.spacing.sm});
    top: 50%;
    transform: translateY(-50%);
    background: ${({ theme }) => theme.colors.dark};
    color: ${({ theme }) => theme.colors.white};
    padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
    border-radius: ${({ theme }) => theme.borderRadius.md};
    font-size: 0.75rem;
    white-space: nowrap;
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.2s ease;
  }
  
  &:hover::after {
    opacity: 1;
  }
  
  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    width: 48px;
    height: 48px;
    font-size: 1.25rem;
  }
`;

const ModalOverlay = styled.div<{ $isOpen: boolean }>`
  display: ${({ $isOpen }) => ($isOpen ? 'flex' : 'none')};
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: ${({ theme }) => theme.spacing.md};
  overflow-y: auto;
`;

const ModalContent = styled(Card)`
  max-width: 600px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const ModalTitle = styled.h3`
  margin: 0;
  font-size: 1.25rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.dark};
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.secondary};
  padding: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  transition: background-color 0.2s ease;

  &:hover {
    background-color: ${({ theme }) => theme.colors.lightGray};
  }
`;


export const LessonPlanBuilder: React.FC<LessonPlanBuilderProps> = ({ stages, onSave, onRefreshStages, onRefreshStageExercises }) => {
  const [items, setItems] = useState<LessonPlanItem[]>([]);
  const [planTitle, setPlanTitle] = useState<string>('');
  const [currentPlanId, setCurrentPlanId] = useState<string | null>(null);
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
  const [selectedPlanForActions, setSelectedPlanForActions] = useState<LessonPlan | null>(null);
  const [planMode, setPlanMode] = useState<'read-only' | 'copy' | 'edit' | null>(null);
  const [titleError, setTitleError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [expandedStages, setExpandedStages] = useState<Set<string>>(new Set());
  const [planStageOrder, setPlanStageOrder] = useState<string[]>([]);
  const [lessonStartTime, setLessonStartTime] = useState<string>('14:00:00');
  const [isStageModalOpen, setIsStageModalOpen] = useState(false);
  const [isAddExerciseToStageModalOpen, setIsAddExerciseToStageModalOpen] = useState(false);
  const [stageModalPosition, setStageModalPosition] = useState<'top' | 'bottom'>('bottom');
  const [addExerciseToStageModalStageId, setAddExerciseToStageModalStageId] = useState<string | null>(null);
  const [isPlansModalOpen, setIsPlansModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  // Группируем элементы по стадиям
  const groupedByStage = useMemo(() => {
    const groups: { [stageId: string]: LessonPlanItem[] } = {};
    items.forEach((item) => {
      if (!groups[item.stageId]) {
        groups[item.stageId] = [];
      }
      groups[item.stageId].push(item);
    });
    // Сортируем элементы внутри каждой стадии по order
    Object.keys(groups).forEach((stageId) => {
      groups[stageId].sort((a, b) => a.order - b.order);
    });
    // Создаем новые массивы для каждой группы, чтобы React видел изменения
    const newGroups: { [stageId: string]: LessonPlanItem[] } = {};
    Object.keys(groups).forEach((stageId) => {
      newGroups[stageId] = [...groups[stageId]];
    });
    return newGroups;
  }, [items]);

  // Получаем порядок стадий (объединяем стадии из плана и из items)
  const stageOrder = useMemo(() => {
    const order: string[] = [];
    const seen = new Set<string>();
    
    // Сначала добавляем стадии из planStageOrder
    planStageOrder.forEach((stageId) => {
      if (!seen.has(stageId)) {
        order.push(stageId);
        seen.add(stageId);
      }
    });
    
    // Затем добавляем стадии из items, которых еще нет в порядке
    items.forEach((item) => {
      if (!seen.has(item.stageId)) {
        order.push(item.stageId);
        seen.add(item.stageId);
      }
    });
    
    return order;
  }, [items, planStageOrder]);

  const totalDuration = useMemo(() => calculateTotalDuration(items), [items]);
  const isOverTime = totalDuration > LESSON_DURATION;
  const isNearLimit = totalDuration > (LESSON_DURATION - 600) && totalDuration <= LESSON_DURATION; // 600 секунд = 10 минут

  // Вычисляем время начала для каждого элемента в правильном порядке
  const itemStartTimes = useMemo(() => {
    const times: { [itemId: string]: string } = {};
    let currentTime = lessonStartTime;
    
    // Создаем правильный порядок элементов: стадии в порядке stageOrder, внутри каждой - элементы по order
    stageOrder.forEach((stageId) => {
      const stageItems = groupedByStage[stageId] || [];
      stageItems.forEach((item) => {
        times[item.id] = currentTime;
        currentTime = addMinutesToTime(currentTime, item.duration);
      });
    });
    
    return times;
  }, [stageOrder, groupedByStage, lessonStartTime]);

  // Вычисляем время начала для каждой стадии (время начала первого упражнения стадии)
  const stageStartTimes = useMemo(() => {
    const times: { [stageId: string]: string } = {};
    
      stageOrder.forEach((stageId) => {
      const stageItems = groupedByStage[stageId] || [];
      const defaultTime = lessonStartTime.length === 5 ? `${lessonStartTime}:00` : lessonStartTime;
      if (stageItems.length > 0) {
        // Время начала стадии = время начала первого упражнения в стадии
        times[stageId] = itemStartTimes[stageItems[0].id] || defaultTime;
      } else {
        // Если стадия пустая, вычисляем время начала на основе предыдущих стадий
        let currentTime = defaultTime;
        let found = false;
        for (const prevStageId of stageOrder) {
          if (prevStageId === stageId) {
            times[stageId] = currentTime;
            found = true;
            break;
          }
          const prevStageItems = groupedByStage[prevStageId] || [];
          prevStageItems.forEach((item) => {
            currentTime = addMinutesToTime(currentTime, item.duration);
          });
        }
        if (!found) {
          times[stageId] = currentTime;
        }
      }
    });
    
    return times;
  }, [stageOrder, groupedByStage, itemStartTimes, lessonStartTime]);

  const handleAddStageClick = async (position: 'top' | 'bottom') => {
    // Обновляем список стадий перед открытием модального окна
    if (onRefreshStages) {
      await onRefreshStages();
    }
    setStageModalPosition(position);
    setIsStageModalOpen(true);
  };

  const handleStageSelected = (stageId: string) => {
    // Добавляем стадию в план (пустую)
    setPlanStageOrder((prev) => {
      const newOrder = [...prev];
      if (stageModalPosition === 'top') {
        newOrder.unshift(stageId);
      } else {
        newOrder.push(stageId);
      }
      return newOrder;
    });
    
    // Разворачиваем стадию при добавлении
    setExpandedStages((prev) => new Set(prev).add(stageId));
    
    setIsStageModalOpen(false);
  };


  const handleAddExerciseToExistingStage = async (stageId: string) => {
    // Обновляем только упражнения для конкретной стадии перед открытием модального окна
    if (onRefreshStageExercises) {
      await onRefreshStageExercises(stageId);
    }
    setAddExerciseToStageModalStageId(stageId);
    setIsAddExerciseToStageModalOpen(true);
  };

  const handleAddExerciseToStageFromModal = (exerciseId: string) => {
    if (!addExerciseToStageModalStageId) return;
    
    const stage = stages.find((s) => s.id === addExerciseToStageModalStageId);
    const exercise = stage?.exercises.find((e) => e.id === exerciseId);

    if (!stage || !exercise) return;

    if (!canAddExercise(totalDuration, exercise.duration)) {
      alert('Недостаточно времени для добавления этого упражнения!');
      return;
    }

    // Разворачиваем стадию при добавлении нового элемента
    setExpandedStages((prev) => new Set(prev).add(addExerciseToStageModalStageId));

    setItems((prev) => {
      // Находим последний элемент этой стадии в массиве
      let insertIndex = prev.length;
      for (let i = prev.length - 1; i >= 0; i--) {
        if (prev[i].stageId === addExerciseToStageModalStageId) {
          insertIndex = i + 1;
          break;
        }
      }
      
      const newItem = createLessonPlanItem(stage, exercise, insertIndex + 1);
      const newItems = [
        ...prev.slice(0, insertIndex),
        newItem,
        ...prev.slice(insertIndex),
      ];
      
      // Пересчитываем order для всех элементов
      return reorderItems(newItems);
    });

    setAddExerciseToStageModalStageId(null);
    setIsAddExerciseToStageModalOpen(false);
  };

  const handleRemoveStage = (stageId: string) => {
    // Удаляем все элементы этой стадии
    setItems((prev) => reorderItems(prev.filter((item) => item.stageId !== stageId)));
    // Удаляем стадию из порядка
    setPlanStageOrder((prev) => prev.filter((id) => id !== stageId));
  };

  const handleAddExercise = (stageId: string, exerciseId: string) => {
    const stage = stages.find((s) => s.id === stageId);
    const exercise = stage?.exercises.find((e) => e.id === exerciseId);

    if (!stage || !exercise) return;

    if (!canAddExercise(totalDuration, exercise.duration)) {
      alert('Недостаточно времени для добавления этого упражнения!');
      return;
    }

    // Разворачиваем стадию при добавлении нового элемента
    setExpandedStages((prev) => new Set(prev).add(stageId));

    setItems((prev) => {
      // Находим последний элемент этой стадии в массиве
      let insertIndex = prev.length;
      for (let i = prev.length - 1; i >= 0; i--) {
        if (prev[i].stageId === stageId) {
          insertIndex = i + 1;
          break;
        }
      }
      
      const newItem = createLessonPlanItem(stage, exercise, insertIndex + 1);
      const newItems = [
        ...prev.slice(0, insertIndex),
        newItem,
        ...prev.slice(insertIndex),
      ];
      
      // Пересчитываем order для всех элементов
      return reorderItems(newItems);
    });
  };

  const handleRemoveItem = (id: string) => {
    setItems((prev) => {
      const itemToRemove = prev.find((item) => item.id === id);
      const newItems = reorderItems(prev.filter((item) => item.id !== id));
      
      // Если это был последний элемент стадии, стадию не удаляем из порядка
      // (стадия остается пустой, что допустимо)
      
      return newItems;
    });
  };

  const handleMoveExerciseUp = React.useCallback((id: string) => {
    setItems((prev) => {
      const result = moveExerciseInStageUp(prev, id);
      // Убеждаемся, что возвращаем новый массив (для React)
      return result;
    });
  }, []);

  const handleMoveExerciseDown = React.useCallback((id: string) => {
    setItems((prev) => {
      const result = moveExerciseInStageDown(prev, id);
      // Убеждаемся, что возвращаем новый массив (для React)
      return result;
    });
  }, []);

  const handleMoveStageUp = React.useCallback((stageId: string) => {
    setItems((prev) => {
      const result = moveStageUp(prev, stageId);
      return result;
    });
    setPlanStageOrder((prev) => {
      const stageIndex = prev.indexOf(stageId);
      if (stageIndex <= 0) return prev;
      const newOrder = [...prev];
      [newOrder[stageIndex - 1], newOrder[stageIndex]] = [newOrder[stageIndex], newOrder[stageIndex - 1]];
      return newOrder;
    });
  }, []);

  const handleMoveStageDown = React.useCallback((stageId: string) => {
    setItems((prev) => {
      const result = moveStageDown(prev, stageId);
      return result;
    });
    setPlanStageOrder((prev) => {
      const stageIndex = prev.indexOf(stageId);
      if (stageIndex < 0 || stageIndex >= prev.length - 1) return prev;
      const newOrder = [...prev];
      [newOrder[stageIndex], newOrder[stageIndex + 1]] = [newOrder[stageIndex + 1], newOrder[stageIndex]];
      return newOrder;
    });
  }, []);

  const validateTitle = async (title: string, excludeId?: string | null): Promise<boolean> => {
    if (!title.trim()) {
      setTitleError('Название плана обязательно');
      return false;
    }

    try {
      const exists = await lessonPlansApi.checkTitle(title, excludeId || undefined);
      if (exists) {
        setTitleError('План с таким названием уже существует');
        return false;
      }
      setTitleError(null);
      return true;
    } catch (err) {
      console.error('Error checking title:', err);
      // В случае ошибки разрешаем сохранение, но предупреждаем
      setTitleError(null);
      return true;
    }
  };

  const handleTitleChange = (newTitle: string) => {
    setPlanTitle(newTitle);
    // Очищаем ошибку при изменении текста, проверка будет только при сохранении
    if (titleError) {
      setTitleError(null);
    }
  };

  const handleSave = async () => {
    if (items.length === 0) {
      alert('Нечего сохранять! Добавьте упражнения в план урока.');
      return;
    }

    if (isOverTime) {
      alert('Нельзя сохранить план урока с превышенным временем!');
      return;
    }

    if (!planTitle.trim()) {
      setTitleError('Название плана обязательно');
      return;
    }

    // Валидация уникальности названия
    const isValid = await validateTitle(planTitle, currentPlanId);
    if (!isValid) {
      return;
    }

    setIsSaving(true);
    try {
      const requestData = {
        title: planTitle.trim(),
        items: items.map((item) => ({
          stageId: item.stageId,
          stageName: item.stageName,
          exerciseId: item.exerciseId,
          exerciseName: item.exerciseName,
          duration: item.duration,
          order: item.order,
        })),
      };

      let savedPlan;
      if (currentPlanId && isDevelopment) {
        // Обновляем существующий план (только для Development)
        const updateRequest: UpdateLessonPlanRequest = requestData;
        savedPlan = await lessonPlansApi.update(currentPlanId, updateRequest);
        setCurrentPlanId(savedPlan.id);
        setSelectedPlanId(savedPlan.id);
        setSelectedPlanForActions(null);
        setPlanMode(null);
        alert(`✅ План "${savedPlan.title}" успешно обновлен!`);
      } else {
        // Создаем новый план
        const createRequest: CreateLessonPlanRequest = requestData;
        savedPlan = await lessonPlansApi.create(createRequest);
        
        // Очищаем форму и создаем новый план
        setItems([]);
        setPlanTitle('');
        setCurrentPlanId(null);
        setSelectedPlanId(null);
        setSelectedPlanForActions(null);
        setPlanMode(null);
        setPlanStageOrder([]);
        setExpandedStages(new Set());
        setTitleError(null);
        
        alert(`✅ План "${savedPlan.title}" успешно сохранен!`);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Не удалось сохранить план';
      alert(`Ошибка при сохранении: ${errorMessage}`);
      console.error('Error saving lesson plan:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleClear = () => {
    if (confirm('Вы уверены, что хотите очистить план урока? Все несохраненные изменения будут потеряны.')) {
      setItems([]);
      setPlanTitle('');
      setCurrentPlanId(null);
      setSelectedPlanId(null);
      setSelectedPlanForActions(null);
      setPlanMode(null);
      setPlanStageOrder([]);
      setExpandedStages(new Set());
      setTitleError(null);
    }
  };

  const handleDelete = () => {
    if (confirm('Вы уверены, что хотите удалить план? Все несохраненные изменения будут потеряны.')) {
      setItems([]);
      setPlanTitle('');
      setCurrentPlanId(null);
      setSelectedPlanId(null);
      setSelectedPlanForActions(null);
      setPlanMode(null);
      setPlanStageOrder([]);
      setExpandedStages(new Set());
      setTitleError(null);
    }
  };

  const generateCopyTitle = async (originalTitle: string): Promise<string> => {
    // Проверяем, есть ли уже планы с таким названием
    let copyNumber = 1;
    let newTitle = `${originalTitle} (копия ${copyNumber})`;
    
    while (true) {
      try {
        const exists = await lessonPlansApi.checkTitle(newTitle);
        if (!exists) {
          break;
        }
        copyNumber++;
        newTitle = `${originalTitle} (копия ${copyNumber})`;
      } catch (err) {
        // В случае ошибки просто используем текущее название
        break;
      }
    }
    
    return newTitle;
  };

  const handlePlanSelect = async (plan: LessonPlan, isCopy: boolean = false) => {
    const reorderedItems = reorderItems(plan.items);
    
    if (isCopy) {
      // Режим копирования - создаем новый план
      const copyTitle = await generateCopyTitle(plan.title);
      setItems(reorderedItems);
      setPlanTitle(copyTitle);
      setCurrentPlanId(null); // Новый план, без ID
      setSelectedPlanId(null);
      setSelectedPlanForActions(null);
      setPlanMode('copy');
    } else {
      // Режим read-only - показываем план только для просмотра
      setItems(reorderedItems);
      setPlanTitle(plan.title);
      setCurrentPlanId(null);
      setSelectedPlanId(plan.id); // Сохраняем ID исходного плана для подсветки в списке
      setSelectedPlanForActions(plan); // Сохраняем план для кнопок действий
      setPlanMode('read-only');
    }
    
    setTitleError(null);
    
    // Восстанавливаем порядок стадий из плана
    const stageOrderFromPlan = Array.from(
      new Set(reorderedItems.map((item) => item.stageId))
    );
    setPlanStageOrder(stageOrderFromPlan);
    
    // Разворачиваем все стадии
    setExpandedStages(new Set(stageOrderFromPlan));
  };

  const handlePlanEdit = async (plan: LessonPlan) => {
    // Загружаем план для редактирования (только для Development)
    const reorderedItems = reorderItems(plan.items);
    
    setItems(reorderedItems);
    setPlanTitle(plan.title);
    setCurrentPlanId(plan.id); // Сохраняем ID плана для обновления
    setSelectedPlanId(plan.id); // Сохраняем ID плана для подсветки в списке
    setSelectedPlanForActions(null); // Убираем план для кнопок действий в режиме редактирования
    setPlanMode('edit');
    setTitleError(null);
    
    // Восстанавливаем порядок стадий из плана
    const stageOrderFromPlan = Array.from(
      new Set(reorderedItems.map((item) => item.stageId))
    );
    setPlanStageOrder(stageOrderFromPlan);
    
    // Разворачиваем все стадии для редактирования
    setExpandedStages(new Set(stageOrderFromPlan));
  };

  const handlePlanImported = (plan: LessonPlan) => {
    // Пересчитываем order согласно порядку элементов в массиве
    const reorderedItems = reorderItems(plan.items);
    setItems(reorderedItems);
    setPlanTitle(plan.title);
    setCurrentPlanId(plan.id);
  };

  const getCurrentPlan = (): LessonPlan | null => {
    if (items.length === 0 && stageOrder.length === 0) return null;
    const plan = createLessonPlanFromItems(items, planTitle || undefined);
    if (currentPlanId) {
      plan.id = currentPlanId;
    }
    return plan;
  };

  const getExerciseById = (stageId: string, exerciseId: string): Exercise | undefined => {
    const stage = stages.find((s) => s.id === stageId);
    return stage?.exercises.find((e) => e.id === exerciseId);
  };

  const handleToggleStage = (stageId: string) => {
    setExpandedStages((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(stageId)) {
        newSet.delete(stageId);
      } else {
        newSet.add(stageId);
      }
      return newSet;
    });
  };

  const getStageCanMoveUp = (stageId: string): boolean => {
    const stageIndex = stageOrder.indexOf(stageId);
    return stageIndex > 0;
  };

  const getStageCanMoveDown = (stageId: string): boolean => {
    const stageIndex = stageOrder.indexOf(stageId);
    return stageIndex >= 0 && stageIndex < stageOrder.length - 1;
  };

  return (
    <BuilderContainer>
      <MainContent>
        <ReadOnlyCardWrapper $isReadOnly={planMode === 'read-only'}>
          <CompactCard>
            <SectionTitle>📋 План урока</SectionTitle>
          {items.length > 0 && (
            <PlanTitleSection>
              {planMode === 'read-only' && (
                <ReadOnlyIndicator>
                  👁️ Режим просмотра
                </ReadOnlyIndicator>
              )}
              <PlanTitleRow>
                <PlanTitleInput
                  type="text"
                  placeholder="Название плана урока..."
                  value={planTitle}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  readOnly={planMode === 'read-only'}
                  $isReadOnly={planMode === 'read-only'}
                />
                <PlanActionsRow>
                  {planMode === 'read-only' && selectedPlanForActions && (
                    <>
                      {isDevelopment && (
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => selectedPlanForActions && handlePlanEdit(selectedPlanForActions)}
                          title="Редактировать план"
                          style={{ 
                            padding: '0.5rem',
                            minWidth: 'auto',
                            width: 'auto',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                        >
                          ✏️
                        </Button>
                      )}
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => selectedPlanForActions && handlePlanSelect(selectedPlanForActions, true)}
                        title="Скопировать план"
                        style={{ 
                          padding: '0.5rem',
                          minWidth: 'auto',
                          width: 'auto',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        📋
                      </Button>
                    </>
                  )}
                  {(planMode === 'copy' || planMode === 'edit') && (
                    <>
                      <Button 
                        onClick={handleSave} 
                        disabled={stageOrder.length === 0 || isOverTime || !!titleError || isSaving} 
                        size="sm"
                        title={isSaving ? 'Сохранение...' : 'Сохранить план'}
                        style={{ 
                          padding: '0.5rem',
                          minWidth: 'auto',
                          width: 'auto',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        {isSaving ? '⏳' : '💾'}
                      </Button>
                      {planMode === 'copy' && (
                        <Button 
                          variant="secondary" 
                          onClick={handleDelete} 
                          disabled={stageOrder.length === 0} 
                          size="sm"
                          title="Удалить план"
                          style={{ 
                            padding: '0.5rem',
                            minWidth: 'auto',
                            width: 'auto',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                        >
                          🗑️
                        </Button>
                      )}
                    </>
                  )}
                </PlanActionsRow>
              </PlanTitleRow>
              {titleError && (
                <WarningMessage $isError={true}>
                  {titleError}
                </WarningMessage>
              )}
            </PlanTitleSection>
          )}
          {stageOrder.length === 0 ? (
            <EmptyState>
              <EmptyIcon>📝</EmptyIcon>
              <EmptyTitle>План урока пуст</EmptyTitle>
              <EmptyDescription>
                Нажмите кнопку "Добавить стадию" ниже, чтобы начать формировать план, или выберите сохраненный план из списка справа
              </EmptyDescription>
              <AddStageButton onClick={() => handleAddStageClick('bottom')} disabled={isOverTime} />
            </EmptyState>
          ) : (
            <PlanList>
              {planMode !== 'read-only' && (
                <AddStageButton onClick={() => handleAddStageClick('top')} disabled={isOverTime} />
              )}
              {stageOrder.map((stageId) => {
                const stageItems = groupedByStage[stageId] || [];
                const stage = stages.find((s) => s.id === stageId);
                const stageName = stage?.name || (stageItems.length > 0 ? stageItems[0].stageName : 'Неизвестная стадия');

                return (
                  <StageGroup
                    key={stageId}
                    stageId={stageId}
                    stageName={stageName}
                    items={stageItems}
                    stageStartTime={stageStartTimes[stageId] || lessonStartTime}
                    itemStartTimes={itemStartTimes}
                    onRemoveItem={handleRemoveItem}
                    onMoveExerciseUp={handleMoveExerciseUp}
                    onMoveExerciseDown={handleMoveExerciseDown}
                    onMoveStageUp={handleMoveStageUp}
                    onMoveStageDown={handleMoveStageDown}
                    canMoveStageUp={getStageCanMoveUp(stageId)}
                    canMoveStageDown={getStageCanMoveDown(stageId)}
                    isExpanded={expandedStages.has(stageId)}
                    onToggleExpand={handleToggleStage}
                    onAddExercise={handleAddExerciseToExistingStage}
                    isReadOnly={planMode === 'read-only'}
                  />
                );
              })}
              {planMode !== 'read-only' && (
                <AddStageButton onClick={() => handleAddStageClick('bottom')} disabled={isOverTime} />
              )}
            </PlanList>
          )}
        </CompactCard>
        </ReadOnlyCardWrapper>
      </MainContent>

      <Sidebar>
        <CollapsibleSection title="Время занятия" icon="⏱️" defaultExpanded={true}>
          <div style={{ marginBottom: '0.5rem' }}>
            <TimeInput
              label="Начало"
              value={lessonStartTime.length === 5 ? lessonStartTime : lessonStartTime.substring(0, 5)}
              onChange={(value) => setLessonStartTime(value.length === 5 ? `${value}:00` : value)}
            />
          </div>
          <TimeIndicator usedTime={totalDuration} />
          {isOverTime && (
            <WarningMessage $isError={true} style={{ marginTop: '0.5rem', fontSize: '0.75rem', padding: '0.375rem 0.5rem' }}>
              ⚠️ Превышено
            </WarningMessage>
          )}
          {isNearLimit && !isOverTime && (
            <WarningMessage $isError={false} style={{ marginTop: '0.5rem', fontSize: '0.75rem', padding: '0.375rem 0.5rem' }}>
              ⚡ Мало времени
            </WarningMessage>
          )}
        </CollapsibleSection>
      </Sidebar>

      <StageSelectionModal
        stages={stages}
        isOpen={isStageModalOpen}
        onClose={() => setIsStageModalOpen(false)}
        onSelect={handleStageSelected}
      />

      {addExerciseToStageModalStageId && (
        <AddExerciseToStageModal
          stage={stages.find((s) => s.id === addExerciseToStageModalStageId)!}
          isOpen={isAddExerciseToStageModalOpen}
          onClose={() => {
            setIsAddExerciseToStageModalOpen(false);
            setAddExerciseToStageModalStageId(null);
          }}
          onSelect={handleAddExerciseToStageFromModal}
          totalDuration={totalDuration}
        />
      )}

      {/* Floating Action Buttons */}
      <FloatingActionButtons>
        <FloatingButton
          $variant="plans"
          onClick={() => setIsPlansModalOpen(true)}
          data-tooltip="Сохраненные планы"
          aria-label="Сохраненные планы"
        >
          📚
        </FloatingButton>
        <FloatingButton
          $variant="export"
          onClick={() => setIsExportModalOpen(true)}
          data-tooltip="Выгрузка плана"
          aria-label="Выгрузка плана"
        >
          📥
        </FloatingButton>
      </FloatingActionButtons>

      {/* Plans Modal */}
      <ModalOverlay $isOpen={isPlansModalOpen} onClick={() => setIsPlansModalOpen(false)}>
        <ModalContent onClick={(e) => e?.stopPropagation()}>
          <ModalHeader>
            <ModalTitle>📚 Сохраненные планы</ModalTitle>
            <CloseButton onClick={() => setIsPlansModalOpen(false)} type="button">
              ×
            </CloseButton>
          </ModalHeader>
          <div style={{ padding: '0 0 1rem 0' }}>
            <LessonPlansList 
              onPlanSelect={(plan) => {
                handlePlanSelect(plan, false);
                setIsPlansModalOpen(false);
              }} 
              selectedPlanId={selectedPlanId} 
            />
          </div>
        </ModalContent>
      </ModalOverlay>

      {/* Export Modal */}
      <ModalOverlay $isOpen={isExportModalOpen} onClick={() => setIsExportModalOpen(false)}>
        <ModalContent onClick={(e) => e?.stopPropagation()}>
          <ModalHeader>
            <ModalTitle>📥 Выгрузка плана</ModalTitle>
            <CloseButton onClick={() => setIsExportModalOpen(false)} type="button">
              ×
            </CloseButton>
          </ModalHeader>
          <div style={{ padding: '0 0 1rem 0' }}>
            <ImportExportPanel
              items={items}
              stageOrder={stageOrder}
              lessonStartTime={lessonStartTime}
            />
          </div>
        </ModalContent>
      </ModalOverlay>
    </BuilderContainer>
  );
};

