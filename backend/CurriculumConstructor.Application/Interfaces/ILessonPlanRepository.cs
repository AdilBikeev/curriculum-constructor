namespace CurriculumConstructor.Application.Interfaces;

/// <summary>
/// Репозиторий для работы с планами занятий
/// </summary>
public interface ILessonPlanRepository : IRepository<Domain.Entities.LessonPlan, string>
{
    Task<bool> ExistsByTitleAsync(string title, string? excludeId = null);
    Task<IEnumerable<Domain.Entities.LessonPlanItem>> GetItemsByPlanIdAsync(string planId);
    Task<bool> DeleteItemsByPlanIdAsync(string planId);
}

