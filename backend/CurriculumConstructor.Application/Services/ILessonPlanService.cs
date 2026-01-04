using CurriculumConstructor.Application.DTOs.Requests;
using CurriculumConstructor.Application.DTOs.Responses;

namespace CurriculumConstructor.Application.Services;

/// <summary>
/// Сервис для работы с планами занятий
/// </summary>
public interface ILessonPlanService
{
    Task<IEnumerable<LessonPlanDto>> GetAllAsync();
    Task<LessonPlanDto?> GetByIdAsync(string id);
    Task<LessonPlanDto> CreateAsync(CreateLessonPlanRequest request);
    Task<LessonPlanDto> UpdateAsync(string id, UpdateLessonPlanRequest request);
    Task<bool> DeleteAsync(string id);
    Task<bool> ExistsByTitleAsync(string title, string? excludeId = null);
}

