using System;
using CurriculumConstructor.Application.DTOs.Responses;
using CurriculumConstructor.Domain.Entities;

namespace CurriculumConstructor.Application.Converters;

/// <summary>
/// Конвертер для планов занятий
/// </summary>
internal static class LessonPlanConverter
{
    /// <summary>
    /// Преобразует сущность плана в DTO
    /// </summary>
    public static LessonPlanDto ToDto(LessonPlan entity, IEnumerable<LessonPlanItem> items)
    {
        ArgumentNullException.ThrowIfNull(entity);

        return new LessonPlanDto
        {
            Id = entity.Id,
            Title = entity.Title,
            TotalDuration = entity.TotalDuration,
            Items = LessonPlanItemConverter.ToDtoCollection(items).ToArray(),
            CreatedAt = entity.CreatedAt,
            UpdatedAt = entity.UpdatedAt
        };
    }

    /// <summary>
    /// Преобразует коллекцию сущностей планов в коллекцию DTO
    /// </summary>
    public static IEnumerable<LessonPlanDto> ToDtoCollection(IEnumerable<LessonPlan> entities, Func<LessonPlan, IEnumerable<LessonPlanItem>> itemsGetter)
    {
        return entities.Select(plan => ToDto(plan, itemsGetter(plan)));
    }
}

/// <summary>
/// Конвертер для элементов планов занятий
/// </summary>
internal static class LessonPlanItemConverter
{
    /// <summary>
    /// Преобразует сущность элемента плана в DTO
    /// </summary>
    public static LessonPlanItemDto ToDto(LessonPlanItem entity)
    {
        ArgumentNullException.ThrowIfNull(entity);

        return new LessonPlanItemDto
        {
            Id = entity.Id,
            StageId = entity.StageId,
            StageName = entity.StageName,
            ExerciseId = entity.ExerciseId,
            ExerciseName = entity.ExerciseName,
            Duration = entity.Duration,
            Order = entity.Order
        };
    }

    /// <summary>
    /// Преобразует коллекцию сущностей элементов планов в коллекцию DTO
    /// </summary>
    public static IEnumerable<LessonPlanItemDto> ToDtoCollection(IEnumerable<LessonPlanItem> entities)
    {
        return Converter.ConvertCollection(entities, ToDto);
    }
}

