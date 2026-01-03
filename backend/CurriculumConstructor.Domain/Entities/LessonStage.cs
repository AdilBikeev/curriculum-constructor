namespace CurriculumConstructor.Domain.Entities;

/// <summary>
/// Стадия урока
/// </summary>
public sealed record LessonStage
{
    public required string Id { get; init; }
    public required string Name { get; init; }
    public string? Description { get; init; }
    public required DateTime CreatedAt { get; init; }
    public required DateTime UpdatedAt { get; init; }
}

