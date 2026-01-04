using System.Collections.Generic;

namespace CurriculumConstructor.Application.DTOs.Requests;

/// <summary>
/// Запрос на обновление плана занятия
/// </summary>
public sealed record UpdateLessonPlanRequest
{
    public required string Title { get; init; }
    public required IReadOnlyCollection<CreateLessonPlanItemRequest> Items { get; init; } = Array.Empty<CreateLessonPlanItemRequest>();
}

