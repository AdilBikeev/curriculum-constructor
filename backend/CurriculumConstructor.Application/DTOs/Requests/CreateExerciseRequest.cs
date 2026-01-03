namespace CurriculumConstructor.Application.DTOs.Requests;

/// <summary>
/// Запрос на создание упражнения
/// </summary>
public sealed record CreateExerciseRequest
{
    public required string StageId { get; init; }
    public required string Name { get; init; }
    public required int Duration { get; init; }
    public string? Description { get; init; }
}

