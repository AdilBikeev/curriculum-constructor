namespace CurriculumConstructor.Application.DTOs.Responses;

/// <summary>
/// DTO упражнения
/// </summary>
public class ExerciseDto
{
    public string Id { get; set; } = string.Empty;
    public string StageId { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public int Duration { get; set; }
    public string? Description { get; set; }
}

