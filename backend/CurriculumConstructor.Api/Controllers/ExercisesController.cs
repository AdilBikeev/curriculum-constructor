using CurriculumConstructor.Application.Common;
using CurriculumConstructor.Application.DTOs.Requests;
using CurriculumConstructor.Application.DTOs.Responses;
using CurriculumConstructor.Application.Services;
using Microsoft.AspNetCore.Mvc;

namespace CurriculumConstructor.Api.Controllers;

/// <summary>
/// Контроллер для работы с упражнениями
/// </summary>
[ApiController]
[ApiVersion("1.0")]
[Route("api/v{version:apiVersion}/exercises")]
public class ExercisesController : ControllerBase
{
    private readonly IExerciseService _exerciseService;
    private readonly ILogger<ExercisesController> _logger;

    public ExercisesController(IExerciseService exerciseService, ILogger<ExercisesController> logger)
    {
        _exerciseService = exerciseService;
        _logger = logger;
    }

    /// <summary>
    /// Получить все упражнения стадии
    /// </summary>
    [HttpGet("stage/{stageId}")]
    [ProducesResponseType(typeof(ApiResponse<IEnumerable<ExerciseDto>>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetByStageId(string stageId)
    {
        var exercises = await _exerciseService.GetByStageIdAsync(stageId);
        return Ok(ApiResponse<IEnumerable<ExerciseDto>>.SuccessResponse(exercises));
    }

    /// <summary>
    /// Получить упражнение по идентификатору
    /// </summary>
    [HttpGet("{id}")]
    [ProducesResponseType(typeof(ApiResponse<ExerciseDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetById(string id)
    {
        var exercise = await _exerciseService.GetByIdAsync(id);
        if (exercise == null)
        {
            return NotFound(ApiResponse<object>.ErrorResponse($"Exercise with id {id} not found"));
        }

        return Ok(ApiResponse<ExerciseDto>.SuccessResponse(exercise));
    }

    /// <summary>
    /// Создать новое упражнение
    /// </summary>
    [HttpPost]
    [ProducesResponseType(typeof(ApiResponse<ExerciseDto>), StatusCodes.Status201Created)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Create([FromBody] CreateExerciseRequest request)
    {
        var exercise = await _exerciseService.CreateAsync(request);
        return CreatedAtAction(nameof(GetById), new { id = exercise.Id }, 
            ApiResponse<ExerciseDto>.SuccessResponse(exercise));
    }

    /// <summary>
    /// Обновить упражнение
    /// </summary>
    [HttpPut("{id}")]
    [ProducesResponseType(typeof(ApiResponse<ExerciseDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Update(string id, [FromBody] UpdateExerciseRequest request)
    {
        var exercise = await _exerciseService.UpdateAsync(id, request);
        return Ok(ApiResponse<ExerciseDto>.SuccessResponse(exercise));
    }

    /// <summary>
    /// Удалить упражнение
    /// </summary>
    [HttpDelete("{id}")]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Delete(string id)
    {
        var deleted = await _exerciseService.DeleteAsync(id);
        if (!deleted)
        {
            return NotFound(ApiResponse<object>.ErrorResponse($"Exercise with id {id} not found"));
        }

        return Ok(ApiResponse.SuccessResponse("Exercise deleted successfully"));
    }
}

