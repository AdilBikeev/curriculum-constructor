using System;
using CurriculumConstructor.Application.Converters;
using CurriculumConstructor.Application.DTOs.Requests;
using CurriculumConstructor.Application.DTOs.Responses;
using CurriculumConstructor.Application.Interfaces;
using CurriculumConstructor.Domain.Entities;
using CurriculumConstructor.Domain.Exceptions;

namespace CurriculumConstructor.Application.Services;

/// <summary>
/// Сервис для работы с планами занятий
/// </summary>
internal class LessonPlanService : ILessonPlanService
{
    private readonly ILessonPlanRepository _planRepository;
    private readonly IRepository<LessonPlanItem, string> _itemRepository;

    public LessonPlanService(ILessonPlanRepository planRepository, IRepository<LessonPlanItem, string> itemRepository)
    {
        ArgumentNullException.ThrowIfNull(planRepository);
        ArgumentNullException.ThrowIfNull(itemRepository);

        _planRepository = planRepository;
        _itemRepository = itemRepository;
    }

    public async Task<IEnumerable<LessonPlanDto>> GetAllAsync()
    {
        var plans = await _planRepository.GetAllAsync();
        var plansList = plans.ToList();

        var plansDto = new List<LessonPlanDto>();

        foreach (var plan in plansList)
        {
            var items = await _planRepository.GetItemsByPlanIdAsync(plan.Id);
            var planDto = LessonPlanConverter.ToDto(plan, items);
            plansDto.Add(planDto);
        }

        return plansDto.OrderByDescending(p => p.CreatedAt);
    }

    public async Task<LessonPlanDto?> GetByIdAsync(string id)
    {
        ArgumentNullException.ThrowIfNull(id);

        var plan = await _planRepository.GetByIdAsync(id);
        if (plan == null)
        {
            return null;
        }

        var items = await _planRepository.GetItemsByPlanIdAsync(id);
        return LessonPlanConverter.ToDto(plan, items);
    }

    public async Task<LessonPlanDto> CreateAsync(CreateLessonPlanRequest request)
    {
        ArgumentNullException.ThrowIfNull(request);

        // Проверяем уникальность названия
        var exists = await _planRepository.ExistsByTitleAsync(request.Title);
        if (exists)
        {
            throw new ValidationException($"План с названием '{request.Title}' уже существует", (IReadOnlyDictionary<string, IReadOnlyCollection<string>>?)null);
        }

        // Вычисляем общую длительность
        var totalDuration = request.Items.Sum(item => item.Duration);

        var plan = new LessonPlan
        {
            Id = Guid.NewGuid().ToString(),
            Title = request.Title,
            TotalDuration = totalDuration,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        await _planRepository.CreateAsync(plan);

        // Создаем элементы плана
        foreach (var itemRequest in request.Items)
        {
            var item = new LessonPlanItem
            {
                Id = Guid.NewGuid().ToString(),
                PlanId = plan.Id,
                StageId = itemRequest.StageId,
                StageName = itemRequest.StageName,
                ExerciseId = itemRequest.ExerciseId,
                ExerciseName = itemRequest.ExerciseName,
                Duration = itemRequest.Duration,
                Order = itemRequest.Order
            };

            await _itemRepository.CreateAsync(item);
        }

        var items = await _planRepository.GetItemsByPlanIdAsync(plan.Id);
        return LessonPlanConverter.ToDto(plan, items);
    }

    public async Task<LessonPlanDto> UpdateAsync(string id, UpdateLessonPlanRequest request)
    {
        ArgumentNullException.ThrowIfNull(id);
        ArgumentNullException.ThrowIfNull(request);

        var plan = await _planRepository.GetByIdAsync(id);
        if (plan == null)
        {
            throw new NotFoundException($"Plan with id {id} not found");
        }

        // Проверяем уникальность названия (исключая текущий план)
        var exists = await _planRepository.ExistsByTitleAsync(request.Title, id);
        if (exists)
        {
            throw new ValidationException($"План с названием '{request.Title}' уже существует", (IReadOnlyDictionary<string, IReadOnlyCollection<string>>?)null);
        }

        // Вычисляем общую длительность
        var totalDuration = request.Items.Sum(item => item.Duration);

        var updatedPlan = plan with
        {
            Title = request.Title,
            TotalDuration = totalDuration,
            UpdatedAt = DateTime.UtcNow
        };

        await _planRepository.UpdateAsync(updatedPlan);

        // Удаляем старые элементы
        await _planRepository.DeleteItemsByPlanIdAsync(id);

        // Создаем новые элементы
        foreach (var itemRequest in request.Items)
        {
            var item = new LessonPlanItem
            {
                Id = Guid.NewGuid().ToString(),
                PlanId = id,
                StageId = itemRequest.StageId,
                StageName = itemRequest.StageName,
                ExerciseId = itemRequest.ExerciseId,
                ExerciseName = itemRequest.ExerciseName,
                Duration = itemRequest.Duration,
                Order = itemRequest.Order
            };

            await _itemRepository.CreateAsync(item);
        }

        var items = await _planRepository.GetItemsByPlanIdAsync(id);
        return LessonPlanConverter.ToDto(updatedPlan, items);
    }

    public async Task<bool> DeleteAsync(string id)
    {
        ArgumentNullException.ThrowIfNull(id);

        var exists = await _planRepository.ExistsAsync(id);
        if (!exists)
        {
            throw new NotFoundException($"Plan with id {id} not found");
        }

        // Удаляем элементы плана
        await _planRepository.DeleteItemsByPlanIdAsync(id);

        // Удаляем план
        return await _planRepository.DeleteAsync(id);
    }

    public async Task<bool> ExistsByTitleAsync(string title, string? excludeId = null)
    {
        ArgumentNullException.ThrowIfNull(title);

        return await _planRepository.ExistsByTitleAsync(title, excludeId);
    }
}

