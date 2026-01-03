namespace CurriculumConstructor.Application.DTOs.Responses;

/// <summary>
/// DTO стадии урока
/// </summary>
public class StageDto
{
    public string Id { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public List<ExerciseDto> Exercises { get; set; } = new();
}

