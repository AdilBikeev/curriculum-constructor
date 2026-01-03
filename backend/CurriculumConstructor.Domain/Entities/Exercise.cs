namespace CurriculumConstructor.Domain.Entities;

/// <summary>
/// Упражнение
/// </summary>
public sealed record Exercise
{
    public required string Id { get; init; }
    public required string StageId { get; init; }
    public required string Name { get; init; }
    public required int Duration { get; init; } // в секундах
    public string? Description { get; init; }
    public required DateTime CreatedAt { get; init; }
    public required DateTime UpdatedAt { get; init; }
}

