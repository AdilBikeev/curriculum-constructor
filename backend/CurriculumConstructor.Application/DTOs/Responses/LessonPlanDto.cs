namespace CurriculumConstructor.Application.DTOs.Responses;

/// <summary>
/// DTO плана занятия
/// </summary>
public sealed record LessonPlanDto
{
    public required string Id { get; init; }
    public required string Title { get; init; }
    public required int TotalDuration { get; init; } // в секундах
    public required IReadOnlyCollection<LessonPlanItemDto> Items { get; init; } = Array.Empty<LessonPlanItemDto>();
    public required DateTime CreatedAt { get; init; }
    public required DateTime UpdatedAt { get; init; }
}

/// <summary>
/// DTO элемента плана занятия
/// </summary>
public sealed record LessonPlanItemDto
{
    public required string Id { get; init; }
    public required string StageId { get; init; }
    public required string StageName { get; init; }
    public required string ExerciseId { get; init; }
    public required string ExerciseName { get; init; }
    public required int Duration { get; init; } // в секундах
    public required int Order { get; init; }
}

