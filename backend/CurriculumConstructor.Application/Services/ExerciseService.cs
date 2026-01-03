using CurriculumConstructor.Application.Converters;
using CurriculumConstructor.Application.DTOs.Requests;
using CurriculumConstructor.Application.DTOs.Responses;
using CurriculumConstructor.Application.Interfaces;
using CurriculumConstructor.Domain.Exceptions;

namespace CurriculumConstructor.Application.Services;

/// <summary>
/// Сервис для работы с упражнениями
/// </summary>
internal class ExerciseService : IExerciseService
{
    private readonly IExerciseRepository _exerciseRepository;
    private readonly ILessonStageRepository _stageRepository;

    public ExerciseService(IExerciseRepository exerciseRepository, ILessonStageRepository stageRepository)
    {
        _exerciseRepository = exerciseRepository;
        _stageRepository = stageRepository;
    }

    public async Task<IEnumerable<ExerciseDto>> GetByStageIdAsync(string stageId)
    {
        var exists = await _stageRepository.ExistsAsync(stageId);
        if (!exists)
        {
            throw new NotFoundException($"Stage with id {stageId} not found");
        }

        var exercises = await _exerciseRepository.GetByStageIdAsync(stageId);
        return ExerciseConverter.ToDtoCollection(exercises);
    }

    public async Task<ExerciseDto?> GetByIdAsync(string id)
    {
        var exercise = await _exerciseRepository.GetByIdAsync(id);
        return exercise == null ? null : ExerciseConverter.ToDto(exercise);
    }

    public async Task<ExerciseDto> CreateAsync(CreateExerciseRequest request)
    {
        var stageExists = await _stageRepository.ExistsAsync(request.StageId);
        if (!stageExists)
        {
            throw new NotFoundException($"Stage with id {request.StageId} not found");
        }

        var exercise = new Domain.Entities.Exercise
        {
            Id = Guid.NewGuid().ToString(),
            StageId = request.StageId,
            Name = request.Name,
            Duration = request.Duration,
            Description = request.Description,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        await _exerciseRepository.CreateAsync(exercise);
        return ExerciseConverter.ToDto(exercise);
    }

    public async Task<ExerciseDto> UpdateAsync(string id, UpdateExerciseRequest request)
    {
        var exercise = await _exerciseRepository.GetByIdAsync(id);
        if (exercise == null)
        {
            throw new NotFoundException($"Exercise with id {id} not found");
        }

        var updatedExercise = exercise with
        {
            Name = request.Name,
            Duration = request.Duration,
            Description = request.Description,
            UpdatedAt = DateTime.UtcNow
        };

        await _exerciseRepository.UpdateAsync(updatedExercise);
        return ExerciseConverter.ToDto(updatedExercise);
    }

    public async Task<bool> DeleteAsync(string id)
    {
        var exists = await _exerciseRepository.ExistsAsync(id);
        if (!exists)
        {
            throw new NotFoundException($"Exercise with id {id} not found");
        }

        return await _exerciseRepository.DeleteAsync(id);
    }
}

