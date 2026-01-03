import { apiService } from './api';
import {
  ApiResponse,
  StageDto,
  CreateStageRequest,
  ExerciseDto,
  CreateExerciseRequest,
  UpdateExerciseRequest,
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

export const stagesApi = new StagesApiService();
export const exercisesApi = new ExercisesApiService();
