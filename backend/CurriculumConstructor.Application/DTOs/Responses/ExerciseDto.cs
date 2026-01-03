namespace CurriculumConstructor.Application.DTOs.Responses;

/// <summary>
/// DTO упражнения
/// </summary>
public sealed record ExerciseDto
{
    public required string Id { get; init; }
    public required string StageId { get; init; }
    public required string Name { get; init; }
    public required int Duration { get; init; }
    public string? Description { get; init; }
}

