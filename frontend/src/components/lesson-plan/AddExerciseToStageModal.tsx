import React, { useState } from 'react';
import styled from 'styled-components';
import { LessonStage, Exercise, LESSON_DURATION } from '../../types';
import { Button } from '../common/Button';
import { Card } from '../common/Card';
import { formatDuration } from '../../utils/timeFormat';
import { canAddExercise } from '../../utils/lessonPlan';

interface AddExerciseToStageModalProps {
  stage: LessonStage;
  isOpen: boolean;
  onClose: () => void;
  onSelect: (exerciseId: string) => void;
  totalDuration: number;
}

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
`;

const ModalContent = styled(Card)`
  max-width: 500px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
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

const ModalBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
`;

const StageInfo = styled.div`
  padding: ${({ theme }) => theme.spacing.sm};
  background-color: ${({ theme }) => theme.colors.lightGray};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  border-left: 3px solid ${({ theme }) => theme.colors.primary};
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.dark};
  font-weight: 500;
`;

const Label = styled.label`
  font-size: 0.875rem;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.dark};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
  display: block;
`;

const ExerciseList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
  max-height: 300px;
  overflow-y: auto;
`;

const ExerciseItem = styled.button<{ $canAdd: boolean; $isSelected: boolean; $isLowTime: boolean }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border: 2px solid ${({ theme, $canAdd, $isSelected, $isLowTime }) => {
    if ($isSelected) return theme.colors.primary;
    if (!$canAdd) return theme.colors.danger;
    if ($isLowTime) return theme.colors.warning;
    return theme.colors.gray;
  }};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background-color: ${({ theme, $canAdd, $isSelected, $isLowTime }) => {
    if ($isSelected) return 'rgba(99, 102, 241, 0.1)';
    if (!$canAdd) return 'rgba(239, 68, 68, 0.05)';
    if ($isLowTime) return 'rgba(245, 158, 11, 0.05)';
    return theme.colors.white;
  }};
  color: ${({ theme, $canAdd }) => ($canAdd ? theme.colors.dark : theme.colors.secondary)};
  cursor: ${({ $canAdd }) => ($canAdd ? 'pointer' : 'not-allowed')};
  transition: all 0.2s ease;
  text-align: left;
  font-size: 0.875rem;
  font-weight: ${({ $isSelected }) => ($isSelected ? 600 : 500)};
  
  &:hover {
    background-color: ${({ theme, $canAdd, $isSelected }) => {
      if (!$canAdd) return 'rgba(239, 68, 68, 0.1)';
      if ($isSelected) return 'rgba(99, 102, 241, 0.15)';
      return theme.colors.lightGray;
    }};
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const ExerciseName = styled.span`
  flex: 1;
  margin-right: ${({ theme }) => theme.spacing.sm};
`;

const ExerciseDuration = styled.span<{ $canAdd: boolean; $isLowTime: boolean }>`
  font-size: 0.8125rem;
  color: ${({ theme, $canAdd, $isLowTime }) => {
    if (!$canAdd) return theme.colors.danger;
    if ($isLowTime) return theme.colors.warning;
    return theme.colors.primary;
  }};
  font-weight: 600;
  white-space: nowrap;
`;

const ExerciseStatusIcon = styled.span<{ $canAdd: boolean; $isLowTime: boolean }>`
  margin-left: ${({ theme }) => theme.spacing.xs};
  font-size: 0.875rem;
`;

const ModalActions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  justify-content: flex-end;
  margin-top: ${({ theme }) => theme.spacing.lg};
`;

export const AddExerciseToStageModal: React.FC<AddExerciseToStageModalProps> = ({
  stage,
  isOpen,
  onClose,
  onSelect,
  totalDuration,
}) => {
  const [selectedExerciseId, setSelectedExerciseId] = useState<string>('');

  const selectedExercise = stage.exercises.find((e) => e.id === selectedExerciseId);

  const canAddExerciseToPlan = (exercise: Exercise): boolean => {
    return canAddExercise(totalDuration, exercise.duration, LESSON_DURATION);
  };

  const isLowTime = (exercise: Exercise): boolean => {
    const remainingTime = LESSON_DURATION - totalDuration;
    const threshold = 600; // 10 минут
    return canAddExerciseToPlan(exercise) && (remainingTime - exercise.duration) < threshold;
  };

  const handleExerciseSelect = (exerciseId: string) => {
    const exercise = stage.exercises.find((e) => e.id === exerciseId);
    if (exercise && canAddExerciseToPlan(exercise)) {
      setSelectedExerciseId(exerciseId);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedExerciseId) {
      const exercise = stage.exercises.find((e) => e.id === selectedExerciseId);
      if (exercise && canAddExerciseToPlan(exercise)) {
        onSelect(selectedExerciseId);
        setSelectedExerciseId('');
        onClose();
      }
    }
  };

  const handleClose = () => {
    setSelectedExerciseId('');
    onClose();
  };

  return (
    <ModalOverlay $isOpen={isOpen} onClick={handleClose}>
      <ModalContent onClick={(e) => e?.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>Добавить упражнение</ModalTitle>
          <CloseButton onClick={handleClose} type="button">
            ×
          </CloseButton>
        </ModalHeader>
        <form onSubmit={handleSubmit}>
          <ModalBody>
            <StageInfo>
              Стадия: <strong>{stage.name}</strong>
            </StageInfo>
            <div>
              <Label>Упражнение</Label>
              <ExerciseList>
                {stage.exercises.map((exercise) => {
                  const canAdd = canAddExerciseToPlan(exercise);
                  const lowTime = isLowTime(exercise);
                  const isSelected = selectedExerciseId === exercise.id;
                  
                  return (
                    <ExerciseItem
                      key={exercise.id}
                      type="button"
                      $canAdd={canAdd}
                      $isSelected={isSelected}
                      $isLowTime={lowTime}
                      onClick={() => handleExerciseSelect(exercise.id)}
                      disabled={!canAdd}
                    >
                      <ExerciseName>{exercise.name}</ExerciseName>
                      <ExerciseDuration $canAdd={canAdd} $isLowTime={lowTime}>
                        {formatDuration(exercise.duration)}
                      </ExerciseDuration>
                      <ExerciseStatusIcon $canAdd={canAdd} $isLowTime={lowTime}>
                        {!canAdd ? '🚫' : lowTime ? '⚠️' : '✓'}
                      </ExerciseStatusIcon>
                    </ExerciseItem>
                  );
                })}
              </ExerciseList>
            </div>
          </ModalBody>
          <ModalActions>
            <Button type="button" variant="secondary" onClick={handleClose}>
              Отмена
            </Button>
            <Button type="submit" disabled={!selectedExerciseId || !selectedExercise || !canAddExerciseToPlan(selectedExercise)}>
              Добавить
            </Button>
          </ModalActions>
        </form>
      </ModalContent>
    </ModalOverlay>
  );
};

