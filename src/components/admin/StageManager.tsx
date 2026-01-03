import React, { useState } from 'react';
import styled from 'styled-components';
import { LessonStage, Exercise } from '../../types';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Input } from '../common/Input';

interface StageManagerProps {
  stages: LessonStage[];
  onUpdate: (stages: LessonStage[]) => void;
}

const ManagerContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
`;

const StageCard = styled(Card)`
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  border-left: 4px solid ${({ theme }) => theme.colors.primary};
`;

const StageHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.md};
  background-color: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  border-bottom: 2px solid ${({ theme }) => theme.colors.gray};
  cursor: pointer;
  user-select: none;
  transition: background-color ${({ theme }) => theme.transitions.normal};

  &:hover {
    background-color: ${({ theme }) => theme.colors.lightGray};
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
`;

const StageHeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  flex: 1;
  min-width: 0;
`;

const StageIcon = styled.div<{ $isExpanded: boolean }>`
  font-size: 1.25rem;
  flex-shrink: 0;
  transition: transform ${({ theme }) => theme.transitions.normal};
  transform: ${({ $isExpanded }) => ($isExpanded ? 'rotate(90deg)' : 'rotate(0deg)')};
`;

const StageHeaderActions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
  align-items: center;
  flex-shrink: 0;
  position: relative;
  z-index: 10;
  
  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    flex-direction: row;
  }
`;

const StageTitle = styled.h3`
  color: ${({ theme }) => theme.colors.dark};
  margin: 0;
  font-size: 1.125rem;
  font-weight: 700;

  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    font-size: 1.375rem;
  }
`;

const ExerciseList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
  margin-top: ${({ theme }) => theme.spacing.md};
  padding-left: ${({ theme }) => theme.spacing.md};
  padding-right: ${({ theme }) => theme.spacing.md};
`;

const StageContent = styled.div<{ $isExpanded: boolean }>`
  display: ${({ $isExpanded }) => ($isExpanded ? 'block' : 'none')};
`;

const ExerciseItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.md};
  background-color: ${({ theme }) => theme.colors.lightGray};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  border: 1px solid ${({ theme }) => theme.colors.gray};
  transition: all ${({ theme }) => theme.transitions.normal};

  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.lg};
    gap: ${({ theme }) => theme.spacing.sm};
  }

  &:hover {
    background-color: ${({ theme }) => theme.colors.light};
    box-shadow: ${({ theme }) => theme.shadows.sm};
  }
`;

const ExerciseActionsWrapper = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
  justify-content: flex-end;
  padding-top: ${({ theme }) => theme.spacing.sm};
  border-top: 1px solid ${({ theme }) => theme.colors.gray};

  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    padding-top: 0;
    border-top: none;
  }
`;

const ExerciseInfo = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const ExerciseName = styled.span`
  font-weight: 500;
  color: ${({ theme }) => theme.colors.dark};
`;

const ExerciseDetails = styled.span`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.secondary};
`;

const ExerciseActions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: ${({ theme }) => theme.spacing.md};
  align-items: end;
  margin-top: ${({ theme }) => theme.spacing.md};

  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    grid-template-columns: 1fr 1fr auto;
  }
`;

const FormRowEdit = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: ${({ theme }) => theme.spacing.sm};
  align-items: end;
  margin-top: 0;

  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    grid-template-columns: 2fr 1fr auto auto;
  }
`;

const AddStageCard = styled(Card)`
  background-color: ${({ theme }) => theme.colors.light};
`;

export const StageManager: React.FC<StageManagerProps> = ({ stages, onUpdate }) => {
  const [editingExerciseId, setEditingExerciseId] = useState<string | null>(null);
  const [editingExerciseData, setEditingExerciseData] = useState<{
    name: string;
    duration: number;
  } | null>(null);
  const [newStageName, setNewStageName] = useState('');
  const [newExerciseName, setNewExerciseName] = useState('');
  const [newExerciseDuration, setNewExerciseDuration] = useState('');
  const [expandedStages, setExpandedStages] = useState<Set<string>>(new Set());

  const handleAddStage = () => {
    if (!newStageName.trim()) return;

    const newStage: LessonStage = {
      id: `stage-${Date.now()}`,
      name: newStageName.trim(),
      exercises: [],
    };

    onUpdate([...stages, newStage]);
    setNewStageName('');
  };

  const handleDeleteStage = (stageId: string) => {
    if (confirm('Вы уверены, что хотите удалить эту стадию?')) {
      onUpdate(stages.filter((s) => s.id !== stageId));
    }
  };

  const handleAddExercise = (stageId: string) => {
    if (!newExerciseName.trim() || !newExerciseDuration) return;

    const duration = parseInt(newExerciseDuration);
    if (isNaN(duration) || duration <= 0) return;

    const newExercise: Exercise = {
      id: `ex-${Date.now()}`,
      name: newExerciseName.trim(),
      duration,
    };

    onUpdate(
      stages.map((stage) =>
        stage.id === stageId
          ? { ...stage, exercises: [...stage.exercises, newExercise] }
          : stage
      )
    );

    // Разворачиваем стадию при добавлении нового упражнения
    setExpandedStages((prev) => new Set(prev).add(stageId));

    setNewExerciseName('');
    setNewExerciseDuration('');
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

  const handleDeleteExercise = (stageId: string, exerciseId: string) => {
    onUpdate(
      stages.map((stage) =>
        stage.id === stageId
          ? { ...stage, exercises: stage.exercises.filter((e) => e.id !== exerciseId) }
          : stage
      )
    );
  };

  const handleStartEdit = (exercise: Exercise) => {
    setEditingExerciseId(exercise.id);
    setEditingExerciseData({ name: exercise.name, duration: exercise.duration });
  };

  const handleCancelEdit = () => {
    setEditingExerciseId(null);
    setEditingExerciseData(null);
  };

  const handleSaveEdit = (stageId: string, exerciseId: string) => {
    if (!editingExerciseData) return;

    onUpdate(
      stages.map((stage) =>
        stage.id === stageId
          ? {
              ...stage,
              exercises: stage.exercises.map((ex) =>
                ex.id === exerciseId
                  ? {
                      ...ex,
                      name: editingExerciseData.name,
                      duration: editingExerciseData.duration,
                    }
                  : ex
              ),
            }
          : stage
      )
    );
    handleCancelEdit();
  };

  return (
    <ManagerContainer>
      <AddStageCard>
        <h3 style={{ marginBottom: '1rem' }}>Добавить новую стадию</h3>
        <FormRow>
          <Input
            label="Название стадии"
            value={newStageName}
            onChange={(e) => setNewStageName(e.target.value)}
            placeholder="Например: Разминка"
          />
          <div style={{ display: 'none' }}></div>
          <Button onClick={handleAddStage} disabled={!newStageName.trim()}>
            Добавить стадию
          </Button>
        </FormRow>
      </AddStageCard>

      {stages.map((stage) => {
        const isExpanded = expandedStages.has(stage.id);
        return (
          <StageCard key={stage.id}>
            <StageHeader
              onClick={() => handleToggleStage(stage.id)}
            >
              <StageHeaderLeft>
                <StageIcon $isExpanded={isExpanded}>▶</StageIcon>
                <StageTitle>{stage.name}</StageTitle>
              </StageHeaderLeft>
              <StageHeaderActions
                onClick={(e: React.MouseEvent<HTMLDivElement>) => {
                  e.stopPropagation();
                }}
              >
                <Button variant="danger" size="sm" onClick={() => handleDeleteStage(stage.id)}>
                  Удалить стадию
                </Button>
              </StageHeaderActions>
            </StageHeader>

            <StageContent $isExpanded={isExpanded}>
              <ExerciseList>
                {stage.exercises.map((exercise) => (
                  <ExerciseItem key={exercise.id}>
                    <ExerciseInfo>
                      {editingExerciseId === exercise.id && editingExerciseData ? (
                        <FormRowEdit>
                          <Input
                            value={editingExerciseData.name}
                            onChange={(e) =>
                              setEditingExerciseData({
                                ...editingExerciseData,
                                name: e.target.value,
                              })
                            }
                            autoFocus
                          />
                          <Input
                            type="number"
                            value={editingExerciseData.duration}
                            onChange={(e) =>
                              setEditingExerciseData({
                                ...editingExerciseData,
                                duration: parseInt(e.target.value) || 0,
                              })
                            }
                          />
                          <Button
                            size="sm"
                            onClick={() => handleSaveEdit(stage.id, exercise.id)}
                            variant="success"
                          >
                            ✓
                          </Button>
                          <Button size="sm" onClick={handleCancelEdit} variant="secondary">
                            ✕
                          </Button>
                        </FormRowEdit>
                      ) : (
                        <>
                          <ExerciseName>{exercise.name}</ExerciseName>
                          <ExerciseDetails>Длительность: {exercise.duration} мин</ExerciseDetails>
                        </>
                      )}
                    </ExerciseInfo>
                    {editingExerciseId !== exercise.id && (
                      <ExerciseActionsWrapper>
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => handleStartEdit(exercise)}
                        >
                          Редактировать
                        </Button>
                        <Button
                          size="sm"
                          variant="danger"
                          onClick={() => handleDeleteExercise(stage.id, exercise.id)}
                        >
                          Удалить
                        </Button>
                      </ExerciseActionsWrapper>
                    )}
                  </ExerciseItem>
                ))}
              </ExerciseList>

              <FormRow style={{ marginTop: '1rem', paddingLeft: '1rem', paddingRight: '1rem' }}>
                <Input
                  placeholder="Название упражнения"
                  value={newExerciseName}
                  onChange={(e) => setNewExerciseName(e.target.value)}
                />
                <Input
                  type="number"
                  placeholder="Длительность (мин)"
                  value={newExerciseDuration}
                  onChange={(e) => setNewExerciseDuration(e.target.value)}
                />
                <Button
                  onClick={() => handleAddExercise(stage.id)}
                  disabled={!newExerciseName.trim() || !newExerciseDuration}
                >
                  Добавить
                </Button>
              </FormRow>
            </StageContent>
          </StageCard>
        );
      })}
    </ManagerContainer>
  );
};

