using CurriculumConstructor.Application.DTOs.Requests;
using CurriculumConstructor.Application.DTOs.Responses;

namespace CurriculumConstructor.Application.Services;

/// <summary>
/// Сервис для работы со стадиями уроков
/// </summary>
public interface ILessonStageService
{
    Task<IEnumerable<StageDto>> GetAllAsync();
    Task<StageDto?> GetByIdAsync(string id);
    Task<StageDto> CreateAsync(CreateStageRequest request);
    Task<bool> DeleteAsync(string id);
}

