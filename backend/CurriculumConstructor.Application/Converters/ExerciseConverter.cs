using CurriculumConstructor.Application.DTOs.Responses;
using CurriculumConstructor.Domain.Entities;

namespace CurriculumConstructor.Application.Converters;

/// <summary>
/// Конвертер для упражнений
/// </summary>
internal static class ExerciseConverter
{
    /// <summary>
    /// Преобразует сущность упражнения в DTO
    /// </summary>
    public static ExerciseDto ToDto(Exercise entity)
    {
        if (entity == null)
        {
            return null!;
        }

        return new ExerciseDto
        {
            Id = entity.Id,
            StageId = entity.StageId,
            Name = entity.Name,
            Duration = entity.Duration,
            Description = entity.Description
        };
    }

    /// <summary>
    /// Преобразует коллекцию сущностей упражнений в коллекцию DTO
    /// </summary>
    public static IEnumerable<ExerciseDto> ToDtoCollection(IEnumerable<Exercise> entities)
    {
        return Converter.ConvertCollection(entities, ToDto);
    }
}

