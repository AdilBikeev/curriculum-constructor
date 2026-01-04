import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { lessonPlansApi } from '../../services/stagesApi';
import { LessonPlanDto } from '../../types/api';
import { LessonPlan } from '../../types';
import { formatDuration } from '../../utils/timeFormat';

interface LessonPlansListProps {
  onPlanSelect: (plan: LessonPlan) => void;
  selectedPlanId?: string | null;
}

const PlansListContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
  width: 100%;
  box-sizing: border-box;
`;


const PlanItem = styled.div<{ $isSelected: boolean }>`
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ theme, $isSelected }) => ($isSelected ? theme.colors.primary : theme.colors.gray)};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background: ${({ theme, $isSelected }) => ($isSelected ? 'rgba(99, 102, 241, 0.05)' : theme.colors.white)};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.normal};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
  width: 100%;

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
    background: rgba(99, 102, 241, 0.05);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
`;

const PlanItemTitle = styled.div`
  font-weight: 600;
  color: ${({ theme }) => theme.colors.dark};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
  font-size: 0.8125rem;
  line-height: 1.3;
`;

const PlanItemMeta = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.secondary};
  margin-top: ${({ theme }) => theme.spacing.xs};
  gap: ${({ theme }) => theme.spacing.xs};
`;

const PlanItemDate = styled.div`
  font-size: 0.6875rem;
  color: ${({ theme }) => theme.colors.secondary};
  margin-top: ${({ theme }) => theme.spacing.xs};
`;

const EmptyState = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.spacing.xl};
  color: ${({ theme }) => theme.colors.secondary};
`;

const LoadingState = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.spacing.xl};
  color: ${({ theme }) => theme.colors.secondary};
`;

const ErrorState = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.spacing.md};
  color: ${({ theme }) => theme.colors.danger};
  font-size: 0.875rem;
`;

const PlansListContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0;
  width: 100%;
`;


/**
 * Преобразует LessonPlanDto в LessonPlan
 */
function transformDtoToLessonPlan(dto: LessonPlanDto): LessonPlan {
  return {
    id: dto.id,
    title: dto.title,
    items: dto.items.map((item) => ({
      id: item.id,
      stageId: item.stageId,
      stageName: item.stageName,
      exerciseId: item.exerciseId,
      exerciseName: item.exerciseName,
      duration: item.duration,
      order: item.order,
    })),
    totalDuration: dto.totalDuration,
    createdAt: dto.createdAt,
    updatedAt: dto.updatedAt,
  };
}

export const LessonPlansList: React.FC<LessonPlansListProps> = ({ onPlanSelect, selectedPlanId }) => {
  const [plans, setPlans] = useState<LessonPlanDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadPlans = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const loadedPlans = await lessonPlansApi.getAll();
      setPlans(loadedPlans);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Не удалось загрузить планы';
      setError(errorMessage);
      console.error('Error loading lesson plans:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadPlans();
  }, []);

  const handlePlanClick = (planDto: LessonPlanDto) => {
    const plan = transformDtoToLessonPlan(planDto);
    onPlanSelect(plan);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <PlansListContainer>

      {isLoading && <LoadingState>Загрузка...</LoadingState>}

      {error && (
        <ErrorState>
          {error}
        </ErrorState>
      )}

      {!isLoading && !error && plans.length === 0 && (
        <EmptyState>Нет сохраненных планов</EmptyState>
      )}

      {!isLoading && !error && plans.length > 0 && (
        <PlansListContent>
          {plans.map((plan) => (
            <PlanItem
              key={plan.id}
              $isSelected={selectedPlanId === plan.id}
              onClick={() => handlePlanClick(plan)}
            >
              <PlanItemTitle>{plan.title}</PlanItemTitle>
              <PlanItemMeta>
                <span>⏱️ {formatDuration(plan.totalDuration)}</span>
                <span>📋 {plan.items.length} упражнений</span>
              </PlanItemMeta>
              <PlanItemDate>{formatDate(plan.createdAt)}</PlanItemDate>
            </PlanItem>
          ))}
        </PlansListContent>
      )}
    </PlansListContainer>
  );
};

