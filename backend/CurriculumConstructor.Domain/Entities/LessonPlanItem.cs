namespace CurriculumConstructor.Domain.Entities;

/// <summary>
/// Элемент плана занятия
/// </summary>
public sealed record LessonPlanItem
{
    public required string Id { get; init; }
    public required string PlanId { get; init; }
    public required string StageId { get; init; }
    public required string StageName { get; init; }
    public required string ExerciseId { get; init; }
    public required string ExerciseName { get; init; }
    public required int Duration { get; init; } // в секундах
    public required int Order { get; init; }
}

