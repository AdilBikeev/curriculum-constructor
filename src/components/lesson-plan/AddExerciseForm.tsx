import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { LessonStage, Exercise } from '../../types';
import { Select } from '../common/Select';
import { Button } from '../common/Button';
import { Card } from '../common/Card';

interface AddExerciseFormProps {
  stages: LessonStage[];
  onAdd: (stageId: string, exerciseId: string) => void;
  disabled?: boolean;
}

const FormCard = styled(Card)`
  margin-bottom: ${({ theme }) => theme.spacing.md};
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.white} 0%, ${({ theme }) => theme.colors.lightGray} 100%);
  padding: ${({ theme }) => theme.spacing.md};

  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    padding: ${({ theme }) => theme.spacing.lg};
    margin-bottom: ${({ theme }) => theme.spacing.lg};
  }
`;

const FormTitle = styled.h3`
  margin-bottom: ${({ theme }) => theme.spacing.md};
  color: ${({ theme }) => theme.colors.dark};
  font-size: 1.125rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};

  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    font-size: 1.25rem;
    margin-bottom: ${({ theme }) => theme.spacing.lg};
  }
`;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr auto;
  gap: ${({ theme }) => theme.spacing.md};
  align-items: end;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    grid-template-columns: 1fr;
    gap: ${({ theme }) => theme.spacing.sm};
  }
`;

const ButtonWrapper = styled.div`
  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    width: 100%;
    
    button {
      width: 100%;
    }
  }
`;

const ExerciseInfoWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  margin-top: ${({ theme }) => theme.spacing.xs};
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  background-color: ${({ theme }) => theme.colors.light};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  border-left: 2px solid ${({ theme }) => theme.colors.primary};
`;

const ExerciseInfo = styled.div`
  font-size: 0.8125rem;
  color: ${({ theme }) => theme.colors.dark};
  font-weight: 500;
  
  span {
    color: ${({ theme }) => theme.colors.primary};
    font-weight: 600;
  }
`;

export const AddExerciseForm: React.FC<AddExerciseFormProps> = ({
  stages,
  onAdd,
  disabled = false,
}) => {
  const [selectedStageId, setSelectedStageId] = useState<string>('');
  const [selectedExerciseId, setSelectedExerciseId] = useState<string>('');

  const selectedStage = stages.find((s) => s.id === selectedStageId);
  const availableExercises = selectedStage?.exercises || [];
  const selectedExercise = availableExercises.find((e) => e.id === selectedExerciseId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedStageId && selectedExerciseId) {
      onAdd(selectedStageId, selectedExerciseId);
      setSelectedStageId('');
      setSelectedExerciseId('');
    }
  };

  useEffect(() => {
    if (selectedStageId && !availableExercises.find((e) => e.id === selectedExerciseId)) {
      setSelectedExerciseId('');
    }
  }, [selectedStageId, availableExercises, selectedExerciseId]);

  return (
    <FormCard>
      <FormTitle>➕ Добавить упражнение</FormTitle>
      <form onSubmit={handleSubmit}>
        <FormRow>
          <Select
            label="Стадия занятия"
            options={stages.map((stage) => ({
              value: stage.id,
              label: stage.name,
            }))}
            value={selectedStageId}
            onChange={(e) => {
              setSelectedStageId(e.target.value);
              setSelectedExerciseId('');
            }}
            disabled={disabled}
            required
          />
          <div>
            <Select
              label="Упражнение"
              options={availableExercises.map((exercise) => ({
                value: exercise.id,
                label: exercise.name,
              }))}
              value={selectedExerciseId}
              onChange={(e) => setSelectedExerciseId(e.target.value)}
              disabled={disabled || !selectedStageId}
              required
            />
            {selectedExercise && (
              <ExerciseInfoWrapper>
                <ExerciseInfo>
                  ⏱️ Длительность: <span>{selectedExercise.duration} мин</span>
                </ExerciseInfo>
              </ExerciseInfoWrapper>
            )}
          </div>
          <ButtonWrapper>
            <Button
              type="submit"
              disabled={disabled || !selectedStageId || !selectedExerciseId}
              style={{ alignSelf: 'flex-end' }}
            >
              ➕ Добавить
            </Button>
          </ButtonWrapper>
        </FormRow>
      </form>
    </FormCard>
  );
};

