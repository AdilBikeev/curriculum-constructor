import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { lessonPlansApi } from '../../services/stagesApi';
import { LessonPlanDto } from '../../types/api';
import { LessonPlan } from '../../types';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { formatDuration } from '../../utils/timeFormat';

interface LessonPlansListProps {
  onPlanSelect: (plan: LessonPlan) => void;
  selectedPlanId?: string | null;
}

const PlansListContainer = styled(Card)`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.md} !important;
  max-height: 500px;
  overflow-y: auto;
  width: 100%;
  box-sizing: border-box;

  @media (min-width: ${({ theme }) => theme.breakpoints.desktop}) {
    padding: ${({ theme }) => theme.spacing.xl} !important;
    gap: ${({ theme }) => theme.spacing.lg};
    max-height: 700px;
    min-height: 400px;
  }
`;

const PlansListHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.sm};

  @media (min-width: ${({ theme }) => theme.breakpoints.desktop}) {
    margin-bottom: ${({ theme }) => theme.spacing.md};
  }
`;

const PlansListTitle = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.dark};
  margin: 0;
  flex: 1;

  @media (min-width: ${({ theme }) => theme.breakpoints.desktop}) {
    font-size: 1.25rem;
  }
`;

const PlanItem = styled.div<{ $isSelected: boolean }>`
  padding: ${({ theme }) => theme.spacing.md};
  border: 2px solid ${({ theme, $isSelected }) => ($isSelected ? theme.colors.primary : theme.colors.gray)};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background: ${({ theme, $isSelected }) => ($isSelected ? 'rgba(99, 102, 241, 0.05)' : theme.colors.white)};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.normal};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
  width: 100%;

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
    background: rgba(99, 102, 241, 0.05);
    transform: translateY(-1px);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.desktop}) {
    padding: ${({ theme }) => theme.spacing.lg} ${({ theme }) => theme.spacing.xl};
    margin-bottom: ${({ theme }) => theme.spacing.md};
    border-width: 2px;
  }
`;

const PlanItemTitle = styled.div`
  font-weight: 600;
  color: ${({ theme }) => theme.colors.dark};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
  font-size: 0.9375rem;
  line-height: 1.4;

  @media (min-width: ${({ theme }) => theme.breakpoints.desktop}) {
    font-size: 1rem;
    margin-bottom: ${({ theme }) => theme.spacing.sm};
    line-height: 1.5;
  }
`;

const PlanItemMeta = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.secondary};
  margin-top: ${({ theme }) => theme.spacing.xs};
  gap: ${({ theme }) => theme.spacing.sm};

  @media (min-width: ${({ theme }) => theme.breakpoints.desktop}) {
    font-size: 0.9375rem;
    margin-top: ${({ theme }) => theme.spacing.sm};
    gap: ${({ theme }) => theme.spacing.md};
  }
`;

const PlanItemDate = styled.div`
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.secondary};
  margin-top: ${({ theme }) => theme.spacing.xs};

  @media (min-width: ${({ theme }) => theme.breakpoints.desktop}) {
    font-size: 0.8125rem;
    margin-top: ${({ theme }) => theme.spacing.sm};
  }
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

const RefreshButton = styled(Button)`
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  font-size: 0.75rem;
  min-width: auto;

  @media (min-width: ${({ theme }) => theme.breakpoints.desktop}) {
    padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
    font-size: 0.875rem;
  }
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
      <PlansListHeader>
        <PlansListTitle>📚 Сохраненные планы</PlansListTitle>
        <RefreshButton variant="secondary" size="sm" onClick={loadPlans} disabled={isLoading}>
          🔄
        </RefreshButton>
      </PlansListHeader>

      {isLoading && <LoadingState>Загрузка...</LoadingState>}

      {error && (
        <ErrorState>
          {error}
          <br />
          <RefreshButton variant="secondary" size="sm" onClick={loadPlans} style={{ marginTop: '0.5rem' }}>
            Попробовать снова
          </RefreshButton>
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

