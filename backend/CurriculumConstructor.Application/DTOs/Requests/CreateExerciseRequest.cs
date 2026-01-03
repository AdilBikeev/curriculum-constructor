namespace CurriculumConstructor.Application.DTOs.Requests;

/// <summary>
/// Запрос на создание упражнения
/// </summary>
public class CreateExerciseRequest
{
    public string StageId { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public int Duration { get; set; }
    public string? Description { get; set; }
}

