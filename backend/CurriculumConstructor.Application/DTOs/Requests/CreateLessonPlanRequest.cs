namespace CurriculumConstructor.Application.DTOs.Requests;

/// <summary>
/// Запрос на создание плана занятия
/// </summary>
public sealed record CreateLessonPlanRequest
{
    public required string Title { get; init; }
    public required IReadOnlyCollection<CreateLessonPlanItemRequest> Items { get; init; }
}

/// <summary>
/// Запрос на создание элемента плана занятия
/// </summary>
public sealed record CreateLessonPlanItemRequest
{
    public required string StageId { get; init; }
    public required string StageName { get; init; }
    public required string ExerciseId { get; init; }
    public required string ExerciseName { get; init; }
    public required int Duration { get; init; } // в секундах
    public required int Order { get; init; }
}

