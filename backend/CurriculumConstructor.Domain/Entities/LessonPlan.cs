namespace CurriculumConstructor.Domain.Entities;

/// <summary>
/// План занятия
/// </summary>
public sealed record LessonPlan
{
    public required string Id { get; init; }
    public required string Title { get; init; }
    public required int TotalDuration { get; init; } // в секундах
    public required DateTime CreatedAt { get; init; }
    public required DateTime UpdatedAt { get; init; }
}

