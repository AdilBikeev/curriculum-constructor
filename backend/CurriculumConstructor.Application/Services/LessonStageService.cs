using System;
using CurriculumConstructor.Application.Converters;
using CurriculumConstructor.Application.DTOs.Requests;
using CurriculumConstructor.Application.DTOs.Responses;
using CurriculumConstructor.Application.Interfaces;
using CurriculumConstructor.Domain.Exceptions;

namespace CurriculumConstructor.Application.Services;

/// <summary>
/// Сервис для работы со стадиями уроков
/// </summary>
internal class LessonStageService : ILessonStageService
{
    private readonly ILessonStageRepository _stageRepository;
    private readonly IExerciseRepository _exerciseRepository;

    public LessonStageService(ILessonStageRepository stageRepository, IExerciseRepository exerciseRepository)
    {
        ArgumentNullException.ThrowIfNull(stageRepository);
        ArgumentNullException.ThrowIfNull(exerciseRepository);

        _stageRepository = stageRepository;
        _exerciseRepository = exerciseRepository;
    }

    public async Task<IEnumerable<StageDto>> GetAllAsync()
    {
        var stages = await _stageRepository.GetAllAsync();
        var stagesList = stages.ToList();
        
        var stagesDto = new List<StageDto>();
        
        foreach (var stage in stagesList)
        {
            var exercises = await _exerciseRepository.GetByStageIdAsync(stage.Id);
            var stageDto = StageConverter.ToDto(stage) with
            {
                Exercises = ExerciseConverter.ToDtoCollection(exercises).ToList()
            };
            stagesDto.Add(stageDto);
        }

        return stagesDto;
    }

    public async Task<StageDto?> GetByIdAsync(string id)
    {
        ArgumentNullException.ThrowIfNull(id);

        var stage = await _stageRepository.GetByIdAsync(id);
        if (stage == null)
        {
            return null;
        }

        var exercises = await _exerciseRepository.GetByStageIdAsync(id);
        var stageDto = StageConverter.ToDto(stage) with
        {
            Exercises = ExerciseConverter.ToDtoCollection(exercises).ToList()
        };
        
        return stageDto;
    }

    public async Task<StageDto> CreateAsync(CreateStageRequest request)
    {
        ArgumentNullException.ThrowIfNull(request);

        var stage = new Domain.Entities.LessonStage
        {
            Id = Guid.NewGuid().ToString(),
            Name = request.Name,
            Description = request.Description,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        await _stageRepository.CreateAsync(stage);
        
        var stageDto = StageConverter.ToDto(stage) with
        {
            Exercises = new List<ExerciseDto>()
        };
        
        return stageDto;
    }

    public async Task<bool> DeleteAsync(string id)
    {
        ArgumentNullException.ThrowIfNull(id);

        var exists = await _stageRepository.ExistsAsync(id);
        if (!exists)
        {
            throw new NotFoundException($"Stage with id {id} not found");
        }

        return await _stageRepository.DeleteAsync(id);
    }
}

