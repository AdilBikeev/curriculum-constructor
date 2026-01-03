using System;
using CurriculumConstructor.Application.DTOs.Responses;
using CurriculumConstructor.Domain.Entities;

namespace CurriculumConstructor.Application.Converters;

/// <summary>
/// Конвертер для стадий уроков
/// </summary>
internal static class StageConverter
{
    /// <summary>
    /// Преобразует сущность стадии в DTO
    /// </summary>
    public static StageDto ToDto(LessonStage entity)
    {
        ArgumentNullException.ThrowIfNull(entity);

        return new StageDto
        {
            Id = entity.Id,
            Name = entity.Name,
            Description = entity.Description,
            Exercises = new List<ExerciseDto>()
        };
    }

    /// <summary>
    /// Преобразует коллекцию сущностей стадий в коллекцию DTO
    /// </summary>
    public static IEnumerable<StageDto> ToDtoCollection(IEnumerable<LessonStage> entities)
    {
        return Converter.ConvertCollection(entities, ToDto);
    }
}

