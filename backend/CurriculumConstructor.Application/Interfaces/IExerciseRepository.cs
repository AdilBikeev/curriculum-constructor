namespace CurriculumConstructor.Application.Interfaces;

/// <summary>
/// Репозиторий для работы с упражнениями
/// </summary>
public interface IExerciseRepository : IRepository<Domain.Entities.Exercise, string>
{
    Task<IEnumerable<Domain.Entities.Exercise>> GetByStageIdAsync(string stageId);
}

