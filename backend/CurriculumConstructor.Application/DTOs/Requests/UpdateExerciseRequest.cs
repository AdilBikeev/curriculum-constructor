namespace CurriculumConstructor.Application.DTOs.Requests;

/// <summary>
/// Запрос на обновление упражнения
/// </summary>
public sealed record UpdateExerciseRequest
{
    public required string Name { get; init; }
    public required int Duration { get; init; }
    public string? Description { get; init; }
}

