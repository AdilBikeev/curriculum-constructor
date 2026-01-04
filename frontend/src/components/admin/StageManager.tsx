import React, { useState } from 'react';
import styled from 'styled-components';
import { LessonStage, Exercise } from '../../types';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { Select } from '../common/Select';
import { formatDuration, minutesToSeconds, secondsToMinutes, TimeUnit } from '../../utils/timeFormat';

interface StageManagerProps {
  stages: LessonStage[];
  onAddStage: (name: string, description?: string) => Promise<void>;
  onDeleteStage: (stageId: string) => Promise<void>;
  onAddExercise: (stageId: string, name: string, duration: number, description?: string) => Promise<void>;
  onUpdateExercise: (stageId: string, exerciseId: string, name: string, duration: number, description?: string) => Promise<void>;
  onDeleteExercise: (stageId: string, exerciseId: string) => Promise<void>;
}

const ManagerContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const StageCard = styled(Card)`
  margin-bottom: ${({ theme }) => theme.spacing.xs};
  border-left: 3px solid ${({ theme }) => theme.colors.primary};
  padding: ${({ theme }) => theme.spacing.xs} !important;
`;

const StageHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  background-color: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray};
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
  gap: ${({ theme }) => theme.spacing.xs};
  flex: 1;
  min-width: 0;
`;

const StageIcon = styled.div<{ $isExpanded: boolean }>`
  font-size: 0.875rem;
  flex-shrink: 0;
  transition: transform ${({ theme }) => theme.transitions.normal};
  transform: ${({ $isExpanded }) => ($isExpanded ? 'rotate(90deg)' : 'rotate(0deg)')};
`;

const StageHeaderActions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.xs};
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
  font-size: 0.875rem;
  font-weight: 700;

  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    font-size: 0.9375rem;
  }
`;

const ExerciseList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
  margin-top: ${({ theme }) => theme.spacing.xs};
  padding-left: ${({ theme }) => theme.spacing.sm};
  padding-right: ${({ theme }) => theme.spacing.sm};
`;

const StageContent = styled.div<{ $isExpanded: boolean }>`
  display: ${({ $isExpanded }) => ($isExpanded ? 'block' : 'none')};
`;

const ExerciseItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  background-color: ${({ theme }) => theme.colors.lightGray};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  border: 1px solid ${({ theme }) => theme.colors.gray};
  transition: all ${({ theme }) => theme.transitions.normal};

  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
    gap: ${({ theme }) => theme.spacing.xs};
  }

  &:hover {
    background-color: ${({ theme }) => theme.colors.light};
    box-shadow: ${({ theme }) => theme.shadows.sm};
  }
`;

const ExerciseActionsWrapper = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.xs};
  justify-content: flex-end;
  padding-top: ${({ theme }) => theme.spacing.xs};
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
  gap: 2px;
`;

const ExerciseName = styled.span`
  font-weight: 500;
  color: ${({ theme }) => theme.colors.dark};
  font-size: 0.8125rem;

  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    font-size: 0.875rem;
  }
`;

const ExerciseDetails = styled.span`
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.secondary};
`;

const ExerciseActions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: ${({ theme }) => theme.spacing.xs};
  align-items: end;
  margin-top: ${({ theme }) => theme.spacing.xs};

  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    grid-template-columns: 1fr 1fr 1fr auto;
  }
`;

const FormRowEdit = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: ${({ theme }) => theme.spacing.xs};
  align-items: end;
  margin-top: 0;

  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    grid-template-columns: 2fr 1fr 1fr auto auto;
  }
`;

const AddStageCard = styled(Card)`
  background-color: ${({ theme }) => theme.colors.light};
  padding: ${({ theme }) => theme.spacing.sm} !important;
`;

export const StageManager: React.FC<StageManagerProps> = ({
  stages,
  onAddStage,
  onDeleteStage,
  onAddExercise,
  onUpdateExercise,
  onDeleteExercise,
}) => {
  const [editingExerciseId, setEditingExerciseId] = useState<string | null>(null);
  const [editingExerciseData, setEditingExerciseData] = useState<{
    name: string;
    duration: number;
    durationUnit: TimeUnit;
  } | null>(null);
  const [newStageName, setNewStageName] = useState('');
  const [newStageDescription, setNewStageDescription] = useState('');
  const [newExerciseInputs, setNewExerciseInputs] = useState<Record<string, { name: string; duration: string; durationUnit: TimeUnit }>>({});
  const [expandedStages, setExpandedStages] = useState<Set<string>>(new Set());
  const [isProcessing, setIsProcessing] = useState<Record<string, boolean>>({});

  const setProcessing = (key: string, value: boolean) => {
    setIsProcessing((prev) => ({ ...prev, [key]: value }));
  };

  const handleAddStage = async () => {
    if (!newStageName.trim()) return;

    const key = 'add-stage';
    try {
      setProcessing(key, true);
      await onAddStage(newStageName.trim(), newStageDescription.trim() || undefined);
      setNewStageName('');
      setNewStageDescription('');
    } catch (error) {
      console.error('Error adding stage:', error);
      alert('Ошибка при добавлении стадии. Попробуйте еще раз.');
    } finally {
      setProcessing(key, false);
    }
  };

  const handleDeleteStage = async (stageId: string) => {
    if (!confirm('Вы уверены, что хотите удалить эту стадию?')) return;

    const key = `delete-stage-${stageId}`;
    try {
      setProcessing(key, true);
      await onDeleteStage(stageId);
    } catch (error) {
      console.error('Error deleting stage:', error);
      alert('Ошибка при удалении стадии. Попробуйте еще раз.');
    } finally {
      setProcessing(key, false);
    }
  };

  const handleAddExercise = async (stageId: string) => {
    const inputs = newExerciseInputs[stageId];
    if (!inputs || !inputs.name.trim() || !inputs.duration) return;

    const durationValue = parseFloat(inputs.duration);
    if (isNaN(durationValue) || durationValue <= 0) {
      alert('Длительность должна быть положительным числом');
      return;
    }

    // Конвертируем в секунды в зависимости от выбранной единицы
    const durationInSeconds = inputs.durationUnit === 'minutes' 
      ? minutesToSeconds(durationValue)
      : Math.round(durationValue);

    const key = `add-exercise-${stageId}`;
    try {
      setProcessing(key, true);
      await onAddExercise(stageId, inputs.name.trim(), durationInSeconds);
      // Разворачиваем стадию при добавлении нового упражнения
      setExpandedStages((prev) => new Set(prev).add(stageId));
      // Очищаем поля ввода для этой стадии
      setNewExerciseInputs((prev) => ({
        ...prev,
        [stageId]: { name: '', duration: '', durationUnit: 'minutes' },
      }));
    } catch (error) {
      console.error('Error adding exercise:', error);
      alert('Ошибка при добавлении упражнения. Попробуйте еще раз.');
    } finally {
      setProcessing(key, false);
    }
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

  const handleDeleteExercise = async (stageId: string, exerciseId: string) => {
    if (!confirm('Вы уверены, что хотите удалить это упражнение?')) return;

    const key = `delete-exercise-${exerciseId}`;
    try {
      setProcessing(key, true);
      await onDeleteExercise(stageId, exerciseId);
    } catch (error) {
      console.error('Error deleting exercise:', error);
      alert('Ошибка при удалении упражнения. Попробуйте еще раз.');
    } finally {
      setProcessing(key, false);
    }
  };

  const handleStartEdit = (exercise: Exercise) => {
    setEditingExerciseId(exercise.id);
    // Если длительность не кратна 60 секундам, показываем в секундах, иначе в минутах
    const isWholeMinutes = exercise.duration % 60 === 0;
    const durationUnit: TimeUnit = isWholeMinutes ? 'minutes' : 'seconds';
    const duration = isWholeMinutes 
      ? secondsToMinutes(exercise.duration)
      : exercise.duration;
    setEditingExerciseData({ 
      name: exercise.name, 
      duration,
      durationUnit
    });
  };

  const handleCancelEdit = () => {
    setEditingExerciseId(null);
    setEditingExerciseData(null);
  };

  const handleSaveEdit = async (stageId: string, exerciseId: string) => {
    if (!editingExerciseData) return;

    // Validate exercise data before saving
    if (!editingExerciseData.name.trim()) {
      alert('Название упражнения не может быть пустым');
      return;
    }
    const durationValue = editingExerciseData.duration;
    if (isNaN(durationValue) || durationValue <= 0) {
      alert('Длительность должна быть положительным числом');
      return;
    }

    // Конвертируем в секунды в зависимости от выбранной единицы
    const durationInSeconds = editingExerciseData.durationUnit === 'minutes'
      ? minutesToSeconds(durationValue)
      : Math.round(durationValue);

    const key = `update-exercise-${exerciseId}`;
    try {
      setProcessing(key, true);
      await onUpdateExercise(stageId, exerciseId, editingExerciseData.name.trim(), durationInSeconds);
      handleCancelEdit();
    } catch (error) {
      console.error('Error updating exercise:', error);
      alert('Ошибка при обновлении упражнения. Попробуйте еще раз.');
    } finally {
      setProcessing(key, false);
    }
  };

  return (
    <ManagerContainer>
      <AddStageCard>
        <h3 style={{ marginBottom: '0.5rem', fontSize: '0.9375rem', fontWeight: 600 }}>Добавить новую стадию</h3>
        <FormRow>
          <Input
            label="Название стадии"
            value={newStageName}
            onChange={(e) => setNewStageName(e.target.value)}
            placeholder="Например: Разминка"
          />
          <Input
            label="Описание (необязательно)"
            value={newStageDescription}
            onChange={(e) => setNewStageDescription(e.target.value)}
            placeholder="Описание стадии"
          />
          <Button
            onClick={handleAddStage}
            disabled={!newStageName.trim() || isProcessing['add-stage']}
          >
            {isProcessing['add-stage'] ? 'Добавление...' : 'Добавить стадию'}
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
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleDeleteStage(stage.id)}
                  disabled={isProcessing[`delete-stage-${stage.id}`]}
                  title="Удалить стадию"
                  style={{ minWidth: '48px', padding: '8px 16px', fontSize: '1.1rem' }}
                >
                  {isProcessing[`delete-stage-${stage.id}`] ? '...' : '✕'}
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
                            step={editingExerciseData.durationUnit === 'minutes' ? '0.5' : '1'}
                            value={editingExerciseData.duration}
                            onChange={(e) =>
                              setEditingExerciseData({
                                ...editingExerciseData,
                                duration: parseFloat(e.target.value) || 0,
                              })
                            }
                          />
                          <Select
                            value={editingExerciseData.durationUnit}
                            options={[
                              { value: 'minutes', label: 'мин.' },
                              { value: 'seconds', label: 'сек.' },
                            ]}
                            onChange={(e) => {
                              const newUnit = e.target.value as TimeUnit;
                              const currentValue = editingExerciseData.duration;
                              const currentUnit = editingExerciseData.durationUnit;
                              // При смене единицы конвертируем значение
                              let newValue: number;
                              if (currentUnit === 'minutes' && newUnit === 'seconds') {
                                // Минуты -> Секунды
                                newValue = minutesToSeconds(currentValue);
                              } else if (currentUnit === 'seconds' && newUnit === 'minutes') {
                                // Секунды -> Минуты
                                newValue = secondsToMinutes(currentValue);
                              } else {
                                newValue = currentValue;
                              }
                              setEditingExerciseData({
                                ...editingExerciseData,
                                durationUnit: newUnit,
                                duration: newValue,
                              });
                            }}
                          />
                          <Button
                            size="sm"
                            onClick={() => handleSaveEdit(stage.id, exercise.id)}
                            variant="success"
                            disabled={isProcessing[`update-exercise-${exercise.id}`]}
                          >
                            {isProcessing[`update-exercise-${exercise.id}`] ? '...' : '✓'}
                          </Button>
                          <Button
                            size="sm"
                            onClick={handleCancelEdit}
                            variant="secondary"
                            disabled={isProcessing[`update-exercise-${exercise.id}`]}
                          >
                            ✕
                          </Button>
                        </FormRowEdit>
                      ) : (
                        <>
                          <ExerciseName>{exercise.name}</ExerciseName>
                          <ExerciseDetails>Длительность: {formatDuration(exercise.duration)}</ExerciseDetails>
                        </>
                      )}
                    </ExerciseInfo>
                    {editingExerciseId !== exercise.id && (
                      <ExerciseActionsWrapper>
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => handleStartEdit(exercise)}
                          disabled={isProcessing[`delete-exercise-${exercise.id}`]}
                          title="Редактировать"
                          style={{ minWidth: '48px', padding: '8px 16px', fontSize: '1.1rem' }}
                        >
                          ✏️
                        </Button>
                        <Button
                          size="sm"
                          variant="danger"
                          onClick={() => handleDeleteExercise(stage.id, exercise.id)}
                          disabled={isProcessing[`delete-exercise-${exercise.id}`]}
                          title="Удалить"
                          style={{ minWidth: '48px', padding: '8px 16px', fontSize: '1.1rem' }}
                        >
                          {isProcessing[`delete-exercise-${exercise.id}`] ? '...' : '✕'}
                        </Button>
                      </ExerciseActionsWrapper>
                    )}
                  </ExerciseItem>
                ))}
              </ExerciseList>

              <FormRow style={{ marginTop: '0.5rem', paddingLeft: '0.5rem', paddingRight: '0.5rem' }}>
                <Input
                  placeholder="Название упражнения"
                  value={newExerciseInputs[stage.id]?.name || ''}
                  onChange={(e) =>
                    setNewExerciseInputs((prev) => ({
                      ...prev,
                      [stage.id]: { ...(prev[stage.id] || { name: '', duration: '', durationUnit: 'minutes' }), name: e.target.value },
                    }))
                  }
                />
                <Input
                  type="number"
                  step={newExerciseInputs[stage.id]?.durationUnit === 'minutes' ? '0.5' : '1'}
                  placeholder="Длительность"
                  value={newExerciseInputs[stage.id]?.duration || ''}
                  onChange={(e) =>
                    setNewExerciseInputs((prev) => ({
                      ...prev,
                      [stage.id]: { ...(prev[stage.id] || { name: '', duration: '', durationUnit: 'minutes' }), duration: e.target.value },
                    }))
                  }
                />
                <Select
                  value={newExerciseInputs[stage.id]?.durationUnit || 'minutes'}
                  options={[
                    { value: 'minutes', label: 'мин.' },
                    { value: 'seconds', label: 'сек.' },
                  ]}
                  onChange={(e) => {
                    const newUnit = e.target.value as TimeUnit;
                    setNewExerciseInputs((prev) => ({
                      ...prev,
                      [stage.id]: { ...(prev[stage.id] || { name: '', duration: '', durationUnit: 'minutes' }), durationUnit: newUnit },
                    }));
                  }}
                />
                <Button
                  onClick={() => handleAddExercise(stage.id)}
                  disabled={
                    !newExerciseInputs[stage.id]?.name?.trim() ||
                    !newExerciseInputs[stage.id]?.duration ||
                    isProcessing[`add-exercise-${stage.id}`]
                  }
                >
                  {isProcessing[`add-exercise-${stage.id}`] ? 'Добавление...' : 'Добавить'}
                </Button>
              </FormRow>
            </StageContent>
          </StageCard>
        );
      })}
    </ManagerContainer>
  );
};

