namespace CurriculumConstructor.Application.DTOs.Responses;

/// <summary>
/// DTO стадии урока
/// </summary>
public sealed record StageDto
{
    public required string Id { get; init; }
    public required string Name { get; init; }
    public string? Description { get; init; }
    public required List<ExerciseDto> Exercises { get; init; } = new();
}

