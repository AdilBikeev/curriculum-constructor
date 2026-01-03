namespace CurriculumConstructor.Application.DTOs.Requests;

/// <summary>
/// Запрос на обновление упражнения
/// </summary>
public class UpdateExerciseRequest
{
    public string Name { get; set; } = string.Empty;
    public int Duration { get; set; }
    public string? Description { get; set; }
}

