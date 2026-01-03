import { StageDto, ExerciseDto } from '../types/api';
import { LessonStage, Exercise } from '../types';

/**
 * Преобразует ExerciseDto в Exercise (удаляет stageId, так как он уже в контексте стадии)
 */
export function transformExerciseDtoToExercise(dto: ExerciseDto): Exercise {
  return {
    id: dto.id,
    name: dto.name,
    duration: dto.duration,
    description: dto.description,
  };
}

/**
 * Преобразует StageDto в LessonStage
 */
export function transformStageDtoToLessonStage(dto: StageDto): LessonStage {
  return {
    id: dto.id,
    name: dto.name,
    description: dto.description,
    exercises: dto.exercises.map(transformExerciseDtoToExercise),
  };
}

/**
 * Преобразует массив StageDto в массив LessonStage
 */
export function transformStagesDtoToLessonStages(dtos: StageDto[]): LessonStage[] {
  return dtos.map(transformStageDtoToLessonStage);
}

