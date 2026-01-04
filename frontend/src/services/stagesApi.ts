import { apiService } from './api';
import {
  ApiResponse,
  StageDto,
  CreateStageRequest,
  ExerciseDto,
  CreateExerciseRequest,
  UpdateExerciseRequest,
  LessonPlanDto,
  CreateLessonPlanRequest,
  UpdateLessonPlanRequest,
} from '../types/api';

const API_VERSION = 'v1';

/**
 * Сервис для работы со стадиями через REST API
 */
export class StagesApiService {
  private readonly baseUrl = `/api/${API_VERSION}/stages`;

  /**
   * Получить все стадии
   */
  async getAll(): Promise<StageDto[]> {
    const response = await apiService.get<ApiResponse<StageDto[]>>(this.baseUrl);
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message || 'Failed to fetch stages');
    }
    return response.data.data;
  }

  /**
   * Получить стадию по ID
   */
  async getById(id: string): Promise<StageDto> {
    const response = await apiService.get<ApiResponse<StageDto>>(`${this.baseUrl}/${id}`);
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message || `Failed to fetch stage with id ${id}`);
    }
    return response.data.data;
  }

  /**
   * Создать новую стадию
   */
  async create(request: CreateStageRequest): Promise<StageDto> {
    const response = await apiService.post<ApiResponse<StageDto>>(this.baseUrl, request);
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message || 'Failed to create stage');
    }
    return response.data.data;
  }

  /**
   * Удалить стадию
   */
  async delete(id: string): Promise<void> {
    const response = await apiService.delete<ApiResponse<object>>(`${this.baseUrl}/${id}`);
    if (!response.data.success) {
      throw new Error(response.data.message || `Failed to delete stage with id ${id}`);
    }
  }
}

/**
 * Сервис для работы с упражнениями через REST API
 */
export class ExercisesApiService {
  private readonly baseUrl = `/api/${API_VERSION}/exercises`;

  /**
   * Получить все упражнения стадии
   */
  async getByStageId(stageId: string): Promise<ExerciseDto[]> {
    const response = await apiService.get<ApiResponse<ExerciseDto[]>>(
      `${this.baseUrl}/stage/${stageId}`
    );
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message || `Failed to fetch exercises for stage ${stageId}`);
    }
    return response.data.data;
  }

  /**
   * Получить упражнение по ID
   */
  async getById(id: string): Promise<ExerciseDto> {
    const response = await apiService.get<ApiResponse<ExerciseDto>>(`${this.baseUrl}/${id}`);
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message || `Failed to fetch exercise with id ${id}`);
    }
    return response.data.data;
  }

  /**
   * Создать новое упражнение
   */
  async create(request: CreateExerciseRequest): Promise<ExerciseDto> {
    const response = await apiService.post<ApiResponse<ExerciseDto>>(this.baseUrl, request);
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message || 'Failed to create exercise');
    }
    return response.data.data;
  }

  /**
   * Обновить упражнение
   */
  async update(id: string, request: UpdateExerciseRequest): Promise<ExerciseDto> {
    const response = await apiService.put<ApiResponse<ExerciseDto>>(
      `${this.baseUrl}/${id}`,
      request
    );
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message || `Failed to update exercise with id ${id}`);
    }
    return response.data.data;
  }

  /**
   * Удалить упражнение
   */
  async delete(id: string): Promise<void> {
    const response = await apiService.delete<ApiResponse<object>>(`${this.baseUrl}/${id}`);
    if (!response.data.success) {
      throw new Error(response.data.message || `Failed to delete exercise with id ${id}`);
    }
  }
}

/**
 * Сервис для работы с планами занятий через REST API
 */
export class LessonPlansApiService {
  private readonly baseUrl = `/api/${API_VERSION}/lesson-plans`;

  /**
   * Получить все планы занятий
   */
  async getAll(): Promise<LessonPlanDto[]> {
    const response = await apiService.get<ApiResponse<LessonPlanDto[]>>(this.baseUrl);
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message || 'Failed to fetch lesson plans');
    }
    return response.data.data;
  }

  /**
   * Получить план по ID
   */
  async getById(id: string): Promise<LessonPlanDto> {
    const response = await apiService.get<ApiResponse<LessonPlanDto>>(`${this.baseUrl}/${id}`);
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message || `Failed to fetch lesson plan with id ${id}`);
    }
    return response.data.data;
  }

  /**
   * Проверить существование плана с указанным названием
   */
  async checkTitle(title: string, excludeId?: string): Promise<boolean> {
    const params = new URLSearchParams({ title });
    if (excludeId) {
      params.append('excludeId', excludeId);
    }
    const response = await apiService.get<ApiResponse<{ exists: boolean }>>(
      `${this.baseUrl}/check-title?${params.toString()}`
    );
    if (!response.data.success || response.data.data === undefined) {
      throw new Error(response.data.message || 'Failed to check title');
    }
    return response.data.data.exists;
  }

  /**
   * Создать новый план
   */
  async create(request: CreateLessonPlanRequest): Promise<LessonPlanDto> {
    const response = await apiService.post<ApiResponse<LessonPlanDto>>(this.baseUrl, request);
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message || 'Failed to create lesson plan');
    }
    return response.data.data;
  }

  /**
   * Обновить план (только для Development)
   */
  async update(id: string, request: UpdateLessonPlanRequest): Promise<LessonPlanDto> {
    const response = await apiService.put<ApiResponse<LessonPlanDto>>(`${this.baseUrl}/${id}`, request);
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message || 'Failed to update lesson plan');
    }
    return response.data.data;
  }

  /**
   * Удалить план
   */
  async delete(id: string): Promise<void> {
    const response = await apiService.delete<ApiResponse<object>>(`${this.baseUrl}/${id}`);
    if (!response.data.success) {
      throw new Error(response.data.message || `Failed to delete lesson plan with id ${id}`);
    }
  }
}

export const stagesApi = new StagesApiService();
export const exercisesApi = new ExercisesApiService();
export const lessonPlansApi = new LessonPlansApiService();
