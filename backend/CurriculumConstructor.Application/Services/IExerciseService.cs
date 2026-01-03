using CurriculumConstructor.Application.DTOs.Requests;
using CurriculumConstructor.Application.DTOs.Responses;

namespace CurriculumConstructor.Application.Services;

/// <summary>
/// Сервис для работы с упражнениями
/// </summary>
public interface IExerciseService
{
    Task<IEnumerable<ExerciseDto>> GetByStageIdAsync(string stageId);
    Task<ExerciseDto?> GetByIdAsync(string id);
    Task<ExerciseDto> CreateAsync(CreateExerciseRequest request);
    Task<ExerciseDto> UpdateAsync(string id, UpdateExerciseRequest request);
    Task<bool> DeleteAsync(string id);
}

